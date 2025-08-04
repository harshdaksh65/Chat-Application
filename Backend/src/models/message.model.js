const mongoose = require('mongoose');


const messageSchema = mongoose.Schema({
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: String,
    media: String,
},{
    timestamps: true
})

module.exports = mongoose.model('Message', messageSchema);