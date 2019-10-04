/*
play this: https://www.youtube.com/watch?v=d-diB65scQU

Sing along:

here's a little code I wrote, you might want to read it really slow, don't worry be happy
in every line there may be trouble, but if you worry you make it double, don't worry, be happy
ain't got no sense of what is REST? just concentrate on learning Express, don't worry, be happy
your file is getting way too big, bring a Router and make it thin, don't worry, be crafty
there is no data on that route, just write some code, you'll sort it out… don't worry, just API…
I need this code, just don't know where, perhaps should make some middleware, don't worry, be happy

Go code!
*/
require('dotenv').config('./config/default')

const express = require('express')
const path = require('path')

const defaults = require('./config/default')
const server = require('./server')

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    server.use(express.static(path.join(__dirname, 'client/build')));
    
    // Handle React routing, return all requests to React app
    server.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

const port = defaults.port
server.listen(port, () => {
    console.log(`*** Running on http://localhost:${port} ***`)
})