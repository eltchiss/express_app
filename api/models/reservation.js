const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
    //Lien vers la place réservée (Catway)
    catwayNumber: { // Utilisation du champ 'catwayNumber' pour la relation
        type: Number, 
        ref: 'Catway', // Référence au modèle Catway
        required: [true, 'Le numéro de catway est requis pour la réservation.']
    },
    
    //Lien vers l'utilisateur qui fait la réservation
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Référence au modèle User
        required: [true, 'L\'ID de l\'utilisateur (propriétaire) est requis.']
    },
    
    //Dates de la réservation
    startDate: {
        type: Date,
        required: [true, 'La date de début de la réservation est requise.']
    },
    
    endDate: {
        type: Date,
        required: [true, 'La date de fin de la réservation est requise.']
    }

}, {
    timestamps: true // Ajoute createdAt et updatedAt
});

module.exports = mongoose.model('Reservation', ReservationSchema);