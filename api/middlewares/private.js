const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = async (req, res, next) => {
    // Tente de récupérer le token depuis les headers 'x-access-token' ou 'authorization'
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    // Si le token existe et commence par 'Bearer ', enlève 'Bearer ' pour n'avoir que le token
    if (!!token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        // Vérifie la validité du token
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                // Token invalide ou expiré
                return res.status(401).json('token_not_valid');
            } else {
                // Stocke les données décodées de l'utilisateur dans la requête pour un usage ultérieur
                req.decoded = decoded;

                // Attacher l'objet utilisateur à la requête pour un accès facile
                req.user = decoded.user;
                
                // Attacher l'ID de l'utilisateur à la requête (très pratique pour les opérations)
                req.userId = decoded.user._id;

                // Calcule le temps d'expiration (24 heures)
                const expiresIn = 24 * 60 * 60;

                // Crée un nouveau token (renouvellement)
                const newToken = jwt.sign({
                    user: decoded.user
                },
                SECRET_KEY, 
                {
                    expiresIn: expiresIn
                });

                // Envoie le nouveau token dans le header de la réponse
                res.header('Authorization', 'Bearer ' + newToken);
                
                // Passe au middleware ou à la fonction de contrôleur suivante
                next();
            }
        });
    } else {
        // Aucun token trouvé
        return res.status(401).json('token_required');
    }
}