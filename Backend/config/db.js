const mongoose = require('mongoose');

const dbConnect = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL , {
            useNewUrlParser : true,
            useUnifiedTopology : true,
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch(error){
    console.error(`Error connecting to database: ${error.message}`)
    process.exit(1);
    }
}

module.exports = dbConnect;