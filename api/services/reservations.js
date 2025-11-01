const Reservation = require('../models/reservation');


// 1. POST /catways/:id/reservations : Créer une réservation

exports.addReservation = async (req, res, next) => {
    const catwayNumber = parseInt(req.params.id); 
    const userId = req.userId; // ID de l'utilisateur (propriétaire)
    const { startDate, endDate } = req.body;

    try {
        const newReservation = await Reservation.create({
            catwayNumber: catwayNumber,
            user: userId,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });

        // 201 Created
        return res.status(201).json(newReservation);

    } catch (error) {
        // Gère les erreurs de validation de base (ex: si une date est manquante)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Erreur de validation des données.', details: error.errors });
        }
        return res.status(500).json(error);
    }
};


// 2. GET /catways/:id/reservations : Lister les réservations d'un catway

exports.getAllReservationsForCatway = async (req, res, next) => {
    const catwayNumber = req.params.id;
    try {
        // Liste toutes les réservations pour ce catway
        const reservations = await Reservation.find({ catwayNumber: catwayNumber }).sort({ startDate: 1 });
        return res.status(200).json(reservations);
    } catch (error) {
        return res.status(500).json(error);
    }
};


// 3. GET /catway/:id/reservations/:idReservation : Détails

exports.getReservationDetail = async (req, res, next) => {
    const catwayNumber = req.params.id;
    const reservationId = req.params.idReservation;
    try {
        // Recherche par ID de réservation et s'assure qu'elle correspond au catwayNumber
        const reservation = await Reservation.findOne({ 
            _id: reservationId, 
            catwayNumber: catwayNumber 
        });

        if (reservation) {
            return res.status(200).json(reservation);
        }
        return res.status(404).json('reservation_not_found');
    } catch (error) {
        // Peut être une erreur de format d'ID (ObjectId invalide)
        return res.status(500).json(error); 
    }
};


// 4. PUT /catways/:id/reservations : Modifier une réservation

exports.updateReservation = async (req, res, next) => {
    const catwayNumber = parseInt(req.params.id);
    const { _id: reservationId, startDate, endDate } = req.body; 

    try {
        const updatedReservation = await Reservation.findOneAndUpdate(
            { _id: reservationId, catwayNumber: catwayNumber }, // Filtre
            { startDate: new Date(startDate), endDate: new Date(endDate) }, // Mise à jour
            { new: true, runValidators: true } // Renvoie le nouveau document et applique les validations du modèle
        );
        
        if (!updatedReservation) {
            return res.status(404).json('reservation_not_found');
        }

        return res.status(200).json(updatedReservation); 

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Erreur de validation des dates.', details: error.errors });
        }
        return res.status(500).json(error);
    }
};


// 5. DELETE /catway/:id/reservations/:idReservation : Supprimer une réservation

exports.deleteReservation = async (req, res, next) => {
    const reservationId = req.params.idReservation;
    try {
        // Supprime la réservation trouvée par son ID
        const result = await Reservation.deleteOne({ _id: reservationId });

        if (result.deletedCount === 0) {
            return res.status(404).json('reservation_not_found');
        }
        
        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(500).json(error);
    }
};