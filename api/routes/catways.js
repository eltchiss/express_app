const express = require('express');
const router = express.Router();

// Importation des services (logique métier)
const catwaysService = require('../services/catways'); 
const reservationsService = require('../services/reservations'); // Nouveau service à implémenter

// Importation du middleware d'authentification
const private = require('../middlewares/private');

// ====================================================
// A. ROUTES PRINCIPALES (CRUD Catways)
// Ces routes gèrent la ressource Catway elle-même (création, modification d'état, etc.)
// ====================================================

// 1. POST /catways : Créer un catway (Réservé à la capitainerie)
router.post('/', private.checkJWT, catwaysService.addCatway);

// 2. GET /catways : Lister l'ensemble des catways
router.get('/', private.checkJWT, catwaysService.getAllCatways);

// 3. GET /catways/:id : Récupérer les détails d'un catway (id = catwayNumber)
router.get('/:id', private.checkJWT, catwaysService.getCatwayById);

// 4. PUT /catways/:id : Modifier l'état d'un catway (id = catwayNumber). Seul l'état est modifiable.
router.put('/:id', private.checkJWT, catwaysService.updateCatwayState);

// 5. DELETE /catways/:id : Supprimer un catway
router.delete('/:id', private.checkJWT, catwaysService.deleteCatway);

// B. ROUTES DE SOUS-RESSOURCE (Réservations)


// 6. POST /catways/:id/reservations : Créer une réservation pour le catway :id
router.post('/:id/reservations', private.checkJWT, reservationsService.addReservation);

// 7. GET /catways/:id/reservations : Lister toutes les réservations d'un catway
router.get('/:id/reservations', private.checkJWT, reservationsService.getAllReservationsForCatway);

// 8. GET /catway/:id/reservations/:idReservation : Détails d'une réservation spécifique
router.get('/:id/reservations/:idReservation', private.checkJWT, reservationsService.getReservationDetail);

// 9. PUT /catways/:id/reservations : Modifier une réservation (ID de la réservation dans le corps de la requête)
router.put('/:id/reservations', private.checkJWT, reservationsService.updateReservation); 

// 10. DELETE /catway/:id/reservations/:idReservation : Supprimer une réservation
router.delete('/:id/reservations/:idReservation', private.checkJWT, reservationsService.deleteReservation);

module.exports = router;