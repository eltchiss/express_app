const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// On importe le module bcrypt qui permet de hacher des expressions
const bcrypt = require('bcrypt');

const User = new Schema({
    username: {
        type: String,
        trim: true,
        required: [true, `Le nom d'utilisateur est requis`],
        unique: true
    },
    
    email: {
        type: String,
        trim: true,
        required: [true, 'L\'email est requis'],
        unique: true, // index unique
        lowercase: true
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Le mot de passe est requis'],
        minlength:[4]
    },
}, {
    // ajoute 2 champs au document createdAt et updatedAt
    timestamps: true
});

// Hash le mot de passe quand il est modifié
User.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = bcrypt.hashSync(this.password, 10);

    next();
});

module.exports = mongoose.model('User', User);