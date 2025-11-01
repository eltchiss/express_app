// Fichier : routes/users.js

const express = require('express');
const router = express.Router();

const service = require('../services/users');
const private = require('../middlewares/private');


// A. ROUTES CRUD UTILISATEURS (Capitainerie)


// POST /users/ : Créer un utilisateur (Capitainerie)
router.post ('/', service.add);

// GET /users/ : Lister l'ensemble des utilisateurs (Capitainerie)
router.get('/', private.checkJWT, service.getAllUsers); 

// GET /users/:email : Récupérer les détails d'un utilisateur (Capitainerie)
router.get('/:email', private.checkJWT, service.getByEmail);

// PUT /users/:email : Modifier les détails d'un utilisateur (Capitainerie)
router.put('/:email', private.checkJWT, service.update); 

// DELETE /users/:email : Supprimer un utilisateur (Capitainerie)
router.delete('/:email', private.checkJWT, service.delete);


module.exports = router;