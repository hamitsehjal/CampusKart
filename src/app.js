const express = require('express');
const db = require('./config/database');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 8080;

db()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`);
        });

    }).catch((error) => {
        console.log(error);
    })