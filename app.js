'use strict';

require('dotenv').load();
const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const port = process.env.PORT || 3000;
const socketOrigin = process.env.webServer || "127.0.0.1";

const app = express();

app.use(helmet());

app.use(bodyParser.json({ limit: '50gb' }));
app.use(bodyParser.urlencoded({ limit: '50gb', extended: true }));
app.use(express.static(__dirname));

app.use(function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({ "message": err.name + ": " + err.message });
    }
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, socketOrigin, () => console.log('Server running at ' + socketOrigin + ':' + port))