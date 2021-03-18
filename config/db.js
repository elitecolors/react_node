const mongose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongose.connect(db,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Mongo connected ');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;