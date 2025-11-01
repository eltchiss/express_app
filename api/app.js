require('dotenv').config({ path: './env/.env' });

const express = require('express');
const path = require('path'); // Nécessaire pour les chemins de vues
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Importation des routeurs
const mongodb = require('./db/mongo');
// API Routes (JSON)
const usersApiRouter = require('./api/routes/users');
const catwaysApiRouter = require('./api/routes/catways');
const authApiRouter = require('./routes/auth'); // Ex: /login, /logout

// Pages Routes (HTML/EJS)
const pageRouter = require('./routes/pages'); // Routeur qui gère /, /dashboard, /catways, etc.


mongodb.initClientDbConnection();

const app = express();

// --- 1. Configuration du moteur de vue EJS ---
app.set('view engine', 'ejs'); 
// Indique que le dossier 'views' est à la racine du projet
app.set('views', path.join(__dirname, 'views')); 


// --- 2. Middlewares globaux et Sécurité ---
app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*' // Accepte toutes les origines
}));

app.use(logger('dev'));
app.use(express.json()); // Traite les requêtes JSON (pour l'API)
app.use(express.urlencoded({ extended: false })); // Traite les données de formulaire
app.use(cookieParser());
// Pour servir les fichiers statiques (CSS, images, JS Front-end)
app.use(express.static(path.join(__dirname, 'public'))); 


// --- 3. Déclaration des routes ---

// Routes de l'API (JSON)
app.use('/api/users', usersApiRouter); // Optionnel: utilisez /api/users pour différencier de la page /users
app.use('/auth', authApiRouter); // POST /auth/login, GET /auth/logout
app.use('/catways', catwaysApiRouter); 


// Routes des PAGES (HTML/EJS)
// Le routeur de pages doit gérer la route "/"
app.use('/', pageRouter); 


// --- 4. Gestion des erreurs 404 ---

// Si toutes les routes ci-dessus ont été essayées sans succès, c'est un 404.
// On renvoie un message JSON pour rester cohérent avec l'API, ou on rend une page 404.

app.use(function(req, res, next) {
    // Si la requête accepte du JSON, renvoyer la réponse JSON
    if (req.accepts('json')) {
        return res.status(404).json({
            name: 'API',
            version: '1.0',
            status: 404,
            message: 'not_found'
        });
    }
    
    // Sinon, tenter de rendre une page 404 EJS si elle existe
    // Pour simplifier l'exercice, nous gardons ici la réponse JSON comme fallback
    res.status(404).json({
        name: 'API',
        version: '1.0',
        status: 404,
        message: 'not_found'
    });
});

module.exports = app;