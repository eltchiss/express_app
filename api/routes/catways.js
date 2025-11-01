const express = require('express');
const router = express.Router();

// Importation du service qui contient la logique métier
const service = require('../services/catways');

// Importation du middleware d'authentification
const private = require('../middlewares/private');

// ----------------------------------------------------
// Routes RESTful pour la ressource /catways
// ----------------------------------------------------

// 1. POST /catways : Créer un catway (Réservé à la capitainerie)
// Cible : Créer un catway
router.post('/', private.checkJWT, service.addCatway);

// 2. GET /catways : Lister l'ensemble des catways (Réservé à la capitainerie)
// Cible : Récupérer tous les catways
router.get('/', private.checkJWT, service.getAllCatways);

// 3. GET /catways/:id : Récupérer les détails d'un catway
// Cible : Récupérer les détails d'un catway spécifique
router.get('/:id', private.checkJWT, service.getCatwayById);

// 4. PUT /catways/:id : Modifier l'état d'un catway (id = catwayNumber)
// Note : Le PUT est utilisé ici, mais le PATCH pourrait être plus précis pour ne modifier qu'un champ (l'état).
// Nous suivons cependant la consigne "PUT /catways/:id".
router.put('/:id', private.checkJWT, service.updateCatwayState);

// 5. DELETE /catways/:id : Supprimer un catway
// Cible : Supprimer un catway spécifique
router.delete('/:id', private.checkJWT, service.deleteCatway);

module.exports = router;