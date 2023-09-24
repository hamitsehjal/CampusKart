// /src/server.js

const stoppable = require('stoppable');
const app = require('./app');
const db = require('./config/database');


const PORT = parseInt(process.env.PORT, 10) || 8080;

const server = stoppable(
    app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`);
        db().then(() => {
            console.log('EVERYTHING OK - YOU CAN PROCEED');
        }).catch((err) => {
            console.log(`STOP!!! - ERROR: ${err}`);
        });
    }))


module.exports = server;