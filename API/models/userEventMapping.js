const mongoose = require('mongoose');

const userEventsMappingSchema = mongoose.Schema({
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
    additional_note: {
        type: String,
    },
    status: {
        type: Number,
        required: true,
        default: 1
    }
}, {
    timestamps: true
});

const UserEventsMapping = mongoose.model('UserEventsMapping', userEventsMappingSchema);

module.exports = UserEventsMapping;