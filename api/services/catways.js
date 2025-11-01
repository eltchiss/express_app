const Catway = require('../models/catway'); // Assurez-vous d'avoir ce modèle

// 1. POST /catways : Créer un catway
exports.addCatway = async (req, res, next) => {
    const catwayData = {
        catwayNumber: req.body.catwayNumber,
        catwayType: req.body.catwayType,
        catwayState: req.body.catwayState
    };

    try {
        let catway = await Catway.create(catwayData);
        // Retourne le document créé (statut 201 Created)
        return res.status(201).json(catway);
    } catch (error) {
        // Gestion des erreurs d'unicité (catwayNumber déjà utilisé)
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Ce numéro de catway est déjà utilisé.' });
        }
        // Gestion des erreurs de validation (required, enum, minlength)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Erreur de validation des données du catway.', details: error.errors });
        }
        // Erreur serveur imprévue
        return res.status(500).json(error);
    }
};

// 2. GET /catways : Lister l'ensemble des catways
exports.getAllCatways = async (req, res, next) => {
    try {
        // Récupère tous les catways et les trie par numéro
        let catways = await Catway.find({}).sort({ catwayNumber: 1 });

        return res.status(200).json(catways);
    } catch (error) {
        return res.status(500).json(error);
    }
};

// 3. GET /catways/:id : Récupérer les détails d'un catway
exports.getCatwayById = async (req, res, next) => {
    // L'ID est le catwayNumber, selon la consigne
    const id = req.params.id; 

    try {
        let catway = await Catway.findOne({ catwayNumber: id });

        if (catway) {
            return res.status(200).json(catway);
        }

        return res.status(404).json('catway_not_found');
    } catch (error) {
         // Erreur si l'ID est mal formé (pas un nombre)
         return res.status(400).json({ message: 'Numéro de catway invalide.', error });
    }
};

// 4. PUT /catways/:id : Modifier la description de l'état (seul catwayState modifiable)
exports.updateCatwayState = async (req, res, next) => {
    const id = req.params.id; 
    const newState = req.body.catwayState; // Seul ce champ est autorisé à être modifié

    // Vérification initiale pour s'assurer que l'état est fourni
    if (!newState) {
        return res.status(400).json({ message: 'Le champ catwayState est requis pour la modification.' });
    }

    try {
        // Mise à jour de l'état en utilisant findOneAndUpdate pour plus d'efficacité
        let catway = await Catway.findOneAndUpdate(
            { catwayNumber: id }, // Filtre : recherche par numéro
            { catwayState: newState }, // Mise à jour : uniquement le champ catwayState
            { new: true, runValidators: true } // new: retourne le document mis à jour ; runValidators: applique les règles du modèle
        );

        if (catway) {
            return res.status(200).json(catway); // 200 OK pour une modification réussie
        }

        return res.status(404).json('catway_not_found');
    } catch (error) {
        // Gestion des erreurs de validation (ex: si le nouvel état est trop court)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Erreur de validation de l\'état.', details: error.errors });
        }
        return res.status(500).json(error);
    }
};

// 5. DELETE /catways/:id : Supprimer un catway
exports.deleteCatway = async (req, res, next) => {
    const id = req.params.id;

    try {
        const result = await Catway.deleteOne({ catwayNumber: id });

        if (result.deletedCount === 0) {
            return res.status(404).json('catway_not_found');
        }
        
        // 204 No Content pour une suppression réussie
        return res.status(204).json('delete_ok'); 
    } catch (error) {
        return res.status(500).json(error);
    }
};