// Fichier : services/users.js

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Clé secrète JWT 
const JWT_SECRET = process.env.SECRET_KEY || 'GTGh6rdP54GT77'; 



// A. CRUD Utilisateurs (Capitainerie)


// POST /users/ : Créer un utilisateur
exports.add = async (req, res, next) => {
    const temp = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    try {
        let user = await User.create(temp);
        user = await User.findById(user._id).select('-password'); 
        return res.status(201).json(user);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Cet email ou nom d\'utilisateur est déjà utilisé.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Erreur de validation des données.', details: error.errors });
        }
        return res.status(500).json(error);
    } 
};

// GET /users/ : Lister l'ensemble des utilisateurs
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password'); // Exclure le mot de passe
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error);
    }
};

// GET /users/:email : Récupérer les détails d'un utilisateur
exports.getByEmail = async (req, res, next) => { // Renommée pour la clarté
    const email = req.params.email;
    try {
        let user = await User.findOne({ email: email }).select('-password');

        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(500).json(error);
    }
};

// PUT /users/:email : Modifier les détails d'un utilisateur
exports.update = async (req, res, next) => {
    const emailToUpdate = req.params.email;
    const updateData = req.body;

    try {
        let user = await User.findOne({ email: emailToUpdate });
        if (!user) {
            return res.status(404).json('user_not_found');
        }

        // Hachage du mot de passe si fourni
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        // Utilisation de findOneAndUpdate pour une mise à jour efficace
        const updatedUser = await User.findOneAndUpdate(
            { email: emailToUpdate },
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        return res.status(200).json(updatedUser);

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Cet email ou nom d\'utilisateur est déjà utilisé.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Erreur de validation des données.', details: error.errors });
        }
        return res.status(500).json(error);
    }
};

// DELETE /users/:email : Supprimer un utilisateur
exports.delete = async (req, res, next) => {
    const email = req.params.email;
    try {
        const result = await User.deleteOne({ email: email });
        
        if (result.deletedCount === 0) {
             return res.status(404).json('user_not_found');
        }
        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(500).json(error);
    }
};


// B. AUTHENTIFICATION (Login / Logout)


// POST /login 
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // La méthode findOne renvoie l'utilisateur AVEC le mot de passe (nécessaire pour la comparaison bcrypt)
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json('invalid_credentials');
        }

        // Utiliser la version Promise de bcrypt.compare (plus propre)
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json('invalid_credentials');
        }

        // Génération du JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Méthode simple: Renvoyer le token dans la réponse (comme votre code initial)
        res.header('Authorization', 'Bearer ' + token);
        
        // Retirer le mot de passe avant de renvoyer l'objet utilisateur
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        
        return res.status(200).json({ 
            message: 'login_succeed', 
            token: token, 
            user: userWithoutPassword 
        });

    } catch (error) {
        // Erreurs inattendues
        return res.status(500).json(error);
    }
};

// GET /logout
exports.logout = (req, res, next) => {
   
    return res.status(200).json('logout_successful');
};