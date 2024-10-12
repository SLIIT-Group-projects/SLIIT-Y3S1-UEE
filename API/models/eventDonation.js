const mongoose = require('mongoose');

const EventDonationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    name: {
        type: String,
        required: true,
    },
    bank: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    ref: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: true,
        default: 1
    }
}, {
    timestamps: true
});

const EventDonation = mongoose.model('EventDonation', EventDonationSchema);

module.exports = EventDonation;