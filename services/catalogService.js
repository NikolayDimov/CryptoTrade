const Crypto = require('../models/CryptoCatalog');


async function getAllCrypto() {
    return Crypto.find({}).lean();
}

async function getCryptoByUser(userId) {
    return Crypto.find({ owner: userId }).lean();
}

async function getCryptoById(cryptoId) {
    return await Crypto.findById(cryptoId).lean();
}

// async function getCryptoAndUsers(id) {
//     return Crypto.findById(id).populate('owner').lean();
// }

async function createCrypto(ownerId, cryptoData) {
    const result = await Crypto.create({ ...cryptoData, owner: ownerId });
    //await result.save();
}

async function editCrypto(cryptoId, cryptoData) {
    // const existing = await Crypto.findById(cryptoId);

    // existing.cryptoName = cryptoData.cryptoName;
    // existing.cryptoImage = cryptoData.cryptoImage;
    // existing.price = cryptoData.price;
    // existing.description = cryptoData.description;
    // existing.paymentMethod = cryptoData.paymentMethod;

    // await existing.save();

    // same as above
    await Crypto.findByIdAndUpdate(cryptoId, cryptoData);
}

async function deleteById(id) {
    await Crypto.findByIdAndDelete(id);
}

async function buyCrypto(userId, cryptoId) {
    const crypto = await Crypto.findById(cryptoId);
    crypto.buyers.push(userId);
    return crypto.save();

    // same as
    // Crypto.findByIdAndUpdate(cryptoId, { $push: { buyers: userId } });
}


async function search(cryptoName, paymentMethod) {
    let crypto = await Crypto.find({}).lean();
   
    if(cryptoName) {
        crypto = crypto.filter(x => x.cryptoName.toLowerCase() == cryptoName.toLowerCase())
    }

    if(paymentMethod) {
        crypto = crypto.filter(x => x.paymentMethod == paymentMethod)
    }

    return crypto;
}

// async function search(cryptoText, cryptoPay) {
//     if (cryptoText) {
//         return (Crypto.find({ name: {$regex: cryptoText, $options: 'i'} }).lean());
//     }

//     if (!cryptoText && cryptoPay) {
//         return (Crypto.find({ paymentMethod: cryptoPay }).lean());
//     }

// }



module.exports = {
    getAllCrypto,
    createCrypto,
    getCryptoById,
    getCryptoByUser,
    buyCrypto,
    editCrypto,
    deleteById,
    search
};