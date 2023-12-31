const express = require('express');
const expressConfig = require('./config/express');
const databaseConfig = require('./config/database');
const routesConfig = require('./config/routes');


start();

async function start() {
    const app = express();

    expressConfig(app);
    await databaseConfig(app);
    routesConfig(app);
    

    // for TESTING purposes
    // app.get('/', (req, res) => {
    //     console.log(req.session);
    //     res.render('home', { layout: false });
    // });


    app.listen(3000, () => console.log('Server listening on port 3000'));

    //.. execute config
}