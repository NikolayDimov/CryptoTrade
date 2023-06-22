const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const catalogController = require('../controllers/catalogController');

module.exports = (app) => {
    app.use(authController);
    app.use(homeController);
    app.use(catalogController);

    // 404 page
    app.get('*', (req, res) => {
        res.render('404', { title: 'Page Not Found' });
    });
};

   // Global error handler
    
    // app.get('/error', (req, res, next) => {
    //     //next(new Error('propagating error'));
    //     throw new Error('propagating error');
    // });

    // app.use((err, req, res, next) => {
    //     console.log('Global error handling');
    //     console.log(err.message);
    //     res.redirect('/');
    // });