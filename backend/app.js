const express = require('express');
const app = express();
const router = require('./router/router.js');
const databaseconnect = require('./config/databaseconfig.js');
const cookieParser = require('cookie-parser');
databaseconnect();

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth/', router);
app.use('/', (req, res) => {
    res.status(200).json({ data: "Hello There" });
});

module.exports = app;