const mongoose = require('mongoose');

const clientOptions = {
    useNewUrlParser: true,
    dbName: 'apinode'
};

exports.initClientDbConnection = async () => {
    try {
        /* ATTENTION
        On essaie de se connecté à mongoDB en utilisant la variable d'environnement URL_MONGO
        Il faut donc ne pas oublier de l'ajouter au fichier .env
        URL_MONGO prends pour valeur la chaine de connexion de votre cluster mongoDB
        */
        await mongoose.connect(process.env.URL_MONGO, clientOptions)
        console.log('Connected');
    } catch (error) {
        console.log(error);
        throw error;
    }
}