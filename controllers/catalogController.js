const router = require('express').Router();

// SESSION
// const { isUser, isOwner } = require('../middleware/guards');
// const preload = require('../middleware/preload');

const { isAuth } = require('../middleware/userSession');
const { getAllCrypto, getCryptoById, createCrypto, buyCrypto, editCrypto, deleteById, search } = require('../services/catalogService');
const mapErrors = require('../util/mapError');





router.get('/create', isAuth, (req, res) => {
    res.render('create', { title: 'Create Crypto', data: {} });
});

router.post('/create', isAuth, async (req, res) => {
    const cryptoData = {
        cryptoName: req.body.cryptoName,
        cryptoImage: req.body.cryptoImage,
        price: Number(req.body.price),
        description: req.body.description,
        paymentMethod: req.body.paymentMethod,
        owner: req.user._id,
    };

    try {
        await createCrypto(req.user._id, cryptoData);
        res.redirect('/catalog');

    } catch (err) {
        // re-render create page
        console.error(err);
        const errors = mapErrors(err);
        return res.status(400).render('create', { title: 'Create Crypto', data: cryptoData, errors });
    }
});



// router.get('/catalog') -->> /catalog -> вземаме от main.hbs // browser address bar 
router.get('/catalog', async (req, res) => {
    const crypto = await getAllCrypto();
    // рендерираме res.render('catalog') -->> вземамe от views -> catalog.hbs
    res.render('catalog', { title: 'Crypto Catalog', crypto });

    // test with empty array
    // res.render('catalog', { title: 'Shared Trips', trips: [] });
});




router.get('/catalog/:id/details', async (req, res) => {
    const currCrypto = await getCryptoById(req.params.id);
    // console.log(currCrypto);    // see below

    // if(currCrypto.owner == req.user._id) {
    //     currCrypto.isOwner = true;
    // }
    // or
    const isOwner = currCrypto.owner == req.user?._id;
    // req.user?._id -->> въпросителната е - ако има user вземи user, ако няма user върни undefined
    // currCrypto.owner e създателя/owner-a на Криптото
    // req.user?._id e owner-a на профила 
    // req.params.cryptoId -->> e _id на криптото

    // проверка дали вече сме купили крипто
    const isBuyer = currCrypto.buyers?.some(id => id == req.user?._id);
    // ако нямаме buyers ще даде undefined  и грешка -->> TypeError: Cannot read properties of undefined (reading 'some')
    // затова на buyers поставяме ?
    // same as above
    // const isBuyer = currCrypto.buyers?.includes(req.user?._id);

    res.render('details', { title: 'Crypto Details', currCrypto, isOwner, isBuyer });
});



router.get('/catalog/:id/buy', isAuth, async (req, res) => {
    await buyCrypto(req.user._id, req.params.id);


    res.redirect(`/catalog/${req.params.id}/details`);
});




router.get('/catalog/:id/edit', isAuth, async (req, res) => {
    const crypto = await getCryptoById(req.params.id);

    const paymentMethodsMap = {
        "crypto-wallet": 'Crypto Wallet',
        "credit-card": 'Credit Card',
        "debit-card": 'Debit Card',
        "paypal": 'PayPal',
    };

    const paymentMethods = Object.keys(paymentMethodsMap).map(key => ({
        value: key, 
        label: paymentMethodsMap[key] ,
        isSelected: crypto.paymentMethod == key
    }));

    res.render('edit', { title: 'Edit Crypto', crypto, paymentMethods });
});


router.post('/catalog/:id/edit', isAuth, async (req, res) => {
    // const cryptoId = req.params.id;

    // const cryptoData = {
    //     cryptoName: req.body.cryptoName,
    //     cryptoImage: req.body.cryptoImage,
    //     price: Number(req.body.price),
    //     description: req.body.description,
    //     paymentMethod: req.body.paymentMethod,
    // };

    // try {
    //     await editCrypto(cryptoId, cryptoData);
    //     res.redirect(`/catalog/${req.params.id}/details`);

    // } catch (err) {
    //     console.error(err);
    //     const errors = mapErrors(err);
    //     // cryptoData._id = cryptoId;  -->> служи да подадем id в edit.hs, но там диретно трием action=""
    //     res.render('edit', { title: 'Edit Crypto', cryptoData, errors });
    // }

    // same as above
    const cryptoData = req.body;
    const cryptoId = req.params.id;
    await editCrypto(cryptoId, cryptoData);
    res.redirect(`/catalog/${req.params.id}/details`);
});



router.get('/catalog/:id/delete', isAuth, async (req, res) => {
    await deleteById(req.params.id);
    res.redirect('/catalog');
});


router.get('/search', isAuth, async (req, res) => {
    const { cryptoName, paymentMethod } = req.query;
    const crypto = await search(cryptoName, paymentMethod);

    const paymentMethodsMap = {
        "crypto-wallet": 'Crypto Wallet',
        "credit-card": 'Credit Card',
        "debit-card": 'Debit Card',
        "paypal": 'PayPal',
    };

    const paymentMethods = Object.keys(paymentMethodsMap).map(key => ({
        value: key, 
        label: paymentMethodsMap[key] ,
        isSelected: crypto.paymentMethod == key
    }));


    res.render('search', { crypto, paymentMethods });
});



// router.get('/search', async (req, res) => {
//     let cryptoText = req.query.cryptoName;
//     let cryptoPay = req.query.paymentMethod;

//     let crypto = await search(cryptoText, cryptoPay);

//     if(crypto == undefined) {
//         crypto = await getAllCrypto();
//     }

//     res.render('search', { title: 'Search Crypto', crypto})
// })




module.exports = router;






// console.log(currCrypto);;
// {
//     _id: new ObjectId("646cbbf1450582407a8bfa23"),
//     cryptoName: 'Bitcoin',
//     cryptoImage: 'http://localhost:3000/static/images/bitcoin.png',
//     price: 31500,
//     description: 'Bitcoin (BTC) is a cryptocurrency, a virtual currency designed to act as money and a form of payment outside the control of any one person, group, or entity, thus removing the need for third-party involvement in financial transactions.',
//     owner: new ObjectId("646bda61952fb424ceda3bd7"),
//     paymentMethod: 'crypto-wallet',
//     __v: 2,
//     buyers: [
//       new ObjectId("646ca90b25fecd1c046821bf"),
//       new ObjectId("646e216cbd519e14abbd1cfd")
//     ]
// }


//----------------------------------------------------------------

// router.post('/edit/:id'...
// console.log(req.body);
// {
//     start: 'Sofia',
//     end: 'Pamporovo',
//     date: '21.05.2023',
//     time: '18:00',
//     carImage: 'https://mobistatic3.focus.bg/mobile/photosmob/711/1/big1/11684336382439711_41.jpg',
//     carBrand: 'Infinity',
//     seats: '3',
//     price: '35',
//     description: 'Ski trip for the weekend.'
// }