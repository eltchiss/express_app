// Fichier : routes/reservations.js

const express = require('express');
const router = express.Router();

// Importation du service et des middlewares
const service = require('../services/reservations');
const private = require('../middlewares/private');

// La route sera /catways/:id/reservations...
// (où :id est le catwayNumber)

// 1. POST /catways/:id/reservations : Créer une réservation
router.post('/:id/reservations', private.checkJWT, service.addReservation);

// 2. GET /catways/:id/reservations : Lister toutes les réservations d'un catway
router.get('/:id/reservations', private.checkJWT, service.getAllReservationsForCatway);

// 3. GET /catway/:id/reservations/:idReservation : Récupérer les détails d'une réservation
router.get('/:id/reservations/:idReservation', private.checkJWT, service.getReservationDetail);

// 4. PUT /catways/:id/reservations : Modifier une réservation
router.put('/:id/reservations', private.checkJWT, service.updateReservation); 

// 5. DELETE /catway/:id/reservations/:idReservation : Supprimer une réservation
router.delete('/:id/reservations/:idReservation', private.checkJWT, service.deleteReservation);


module.exports = router;