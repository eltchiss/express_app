const mongoose = require('mongoose');

const clientOptions = {
    useNewUrlParser: true,
    dbName: 'apinode'
};

exports.initClientDbConnection = async () => {
    try {
        /* ATTENTION
        Connexion à mongoDB en utilisant la variable d'environnement URL_MONGO
        */
        await mongoose.connect(process.env.URL_MONGO, clientOptions)
        console.log('Connected');
    } catch (error) {
        console.log(error);
        throw error;
    }
}