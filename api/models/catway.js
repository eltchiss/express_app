const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définition des valeurs autorisées pour le type de catway
const VALID_CATWAY_TYPES = ['long', 'short'];

const CatwaySchema = new Schema({
    catwayNumber: {
        type: Number,
        required: [true, 'Le numéro de catway est requis'],
        unique: true, // Numéro de Catway unique
        min: [1, 'Le numéro de catway doit être supérieur ou égal à 1'] // doit être positif
    },
    
    catwayType: {
        type: String,
        required: [true, 'Le type de catway est requis'],
        enum: { // force la valeur à être 'long' ou 'short'
            values: VALID_CATWAY_TYPES,
            message: 'Le type de catway doit être "long" ou "short"'
        }
    },
    
    catwayState: {
        type: String,
        trim: true,
        required: [true, 'L\'état du catway est requis'],
        minlength: [3, 'La description de l\'état est trop courte.'] //  taille minimale de la description
    }
}, {
    timestamps: true // Ajoute createdAt et updatedAt
});

module.exports = mongoose.model('Catway', CatwaySchema);