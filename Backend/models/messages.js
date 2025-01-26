const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    receiver: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        default: "Annonyomous",
    },
    time: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Product', productSchema);
