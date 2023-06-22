const { Schema, model, Types: { ObjectId } } = require('mongoose');

const URL_PATTERN = /^https?:\/\/(.+)/;


// TODO add validation
const cryptoSchema = new Schema({
    cryptoName: { type: String, required: true, minlength: [2, 'Name must be at least 2 characters long'] },
    cryptoImage: {
        type: String, required: true, validate: {
            validator(value) {
                return URL_PATTERN.test(value);
            },
            message: 'Image must be a valid URL'
        }
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, minlength: [10, 'Name must be at least 10 characters long'] },
    paymentMethod: {
        type: String, required: true,
        enum: {
            values: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal'],
            message: 'Invalid payment method'
        }
    },
    owner: { type: ObjectId, ref: 'User' },
    buyers: { type: [ObjectId], ref: 'User', default: [] }
});


const Crypto = model('Crypto', cryptoSchema);

module.exports = Crypto;