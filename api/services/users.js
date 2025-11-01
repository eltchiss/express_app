// On importe le modèle de données
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// On exporte le callback afin d'y accéder dans notre gestionnaire de routes
// Ici c'est le callback qui servira à ajouter un user avec son id
exports.getById = async (req, res, next) => {
    const id = req.params.id

    try {
        let user = await User.findById(id).select('-password'); //ne pas renvoyer le mot de passe

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

// Ici c'est le callback qui servira à ajouter un user
exports.add = async (req, res, next) => {

    const temp = ({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    // ... dans exports.add
try {
    let user = await User.create(temp);
    // Assurez-vous d'exclure le mot de passe ici aussi !
    user = await User.findById(user._id).select('-password'); 

    return res.status(201).json(user);
} catch (error) {
    // Gestion des erreurs d'unicité (Email ou Username)
    if (error.code === 11000) {
        return res.status(409).json({ message: 'Cet email ou nom d\'utilisateur est déjà utilisé.' });
    }
    // Gestion des erreurs de validation (required, minlength)
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Erreur de validation des données.', details: error.errors });
    }
    // Erreur serveur imprévue
    return res.status(500).json(error); // Utiliser 500 pour les erreurs serveur
} 

}

// services/users.js

// Ici c'est le callback qui servira à modifier un user
exports.update = async (req, res, next) => {
    // Utiliser l'ID extrait du token par le middleware
    const id = req.userId; 

    const temp = ({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    try {
        let user = await User.findOne({
            _id: id //Rechercher par l'ID du token
        }).select('-password');
        
        

        if (user) {
            //AJOUT : Appliquer les modifications reçues
             Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    user[key] = temp[key];
                }
             });
            await user.save();
            //Utiliser le statut 200 OK pour une modification
            return res.status(200).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        // Ajouter la gestion des erreurs 409 et 400 
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Cet email ou nom d\'utilisateur est déjà utilisé.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Erreur de validation des données.', details: error.errors });
        }
        return res.status(500).json(error);
    }
}

// Ici c'est le callback qui servira à supprimer un user
exports.delete = async (req, res, next) => {
    const id = req.params.id

    try {
        await User.deleteOne({
            _id: id
        });
        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(501).json(error);
    }
}

//fonction authenticate
exports.authenticate = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Recherche l'utilisateur par email et exclut les champs __v, createdAt et updatedAt
        let user = await User.findOne({ email: email }, '-__v -createdAt -updatedAt');

        if (user) {
            // Compare le mot de passe reçu avec le mot de passe haché dans la BDD
            bcrypt.compare(password, user.password, function(err, response) {
                if (err) {
                    throw new Error(err);
                }

                if (response) {
                    // Supprime le mot de passe du document avant de créer le JWT
                    delete user._doc.password;
                    
                    // Définit le temps d'expiration du token (ici 24 heures)
                    const expireIn = 24 * 60 * 60; 
                    
                    // Crée le token JWT
                    const token = jwt.sign({
                        user: user
                    },
                    process.env.SECRET_KEY, 
                    {
                        expiresIn: expireIn
                    });
                    
                    // Ajoute le token dans le header de la réponse
                    res.header('Authorization', 'Bearer ' + token);
                    
                    return res.status(200).json('authenticate_succeed');
                }
                
                // Si la comparaison bcrypt échoue (mauvais mot de passe)
                return res.status(403).json('wrong_credentials');
            });
        } else {
            // Si l'utilisateur n'est pas trouvé
            return res.status(404).json('user_not_found');
        }
    } catch (error) {
        return res.status(501).json(error);
    }
}