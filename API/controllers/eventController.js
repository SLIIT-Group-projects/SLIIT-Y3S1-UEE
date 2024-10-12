const EventDonation = require('../models/eventDonation');
const Event = require('../models/eventModel');
const UserEventsMapping = require('../models/userEventMapping');

//Event Create
const createEvent = async (req, res) => {
    try {
        const { organization, eventName, category, description, latitude, longitude, date, fromTime, toTime, financialContribution, toolsSupply, images, status, totalDonation } = req.body;

        const event = new Event({
            organization,
            eventName,
            category,
            description,
            latitude,
            longitude,
            date,
            fromTime,
            toTime,
            financialContribution,
            toolsSupply,
            images,
            status,
            totalDonation
        });

        const createdEvent = await event.save();

        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(400).json({ message: 'Event creation failed', error: error.message });
    }
};

//Get All Events
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });

        if (events.length === 0) {
            return res.status(404).json({ message: 'No events found' });
        }

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

//Get Events for the User
const getEventsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { status } = req.query;
        
        const userEvents = await UserEventsMapping.find({ user: userId, status: status }).select('event');

        if (userEvents.length === 0) {
            return res.status(404).json({ message: 'No events found for this user' });
        }

        const eventIds = userEvents.map(mapping => mapping.event);
        const events = await Event.find({ _id: { $in: eventIds } });

        res.status(200).json(events);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

const joinEvent = async (req, res) => {
    try {
        const { eventId, userId, additional_note } = req.body;

        const existingActiveMapping = await UserEventsMapping.findOne({ user: userId, event: eventId, status: 1 });

        if (existingActiveMapping) {
            return res.status(400).json({ message: 'User already joined this event' });
        }

        const existingZeroMapping = await UserEventsMapping.findOne({ user: userId, event: eventId, status: 0 });

        if (existingZeroMapping) {
            existingZeroMapping.status = 1;
            await existingZeroMapping.save();
            return res.status(201).json(existingZeroMapping);
        }else{
            // Create a new user-event mapping
            const userEvent = new UserEventsMapping({
                user: userId,
                event: eventId,
                additional_note: additional_note,
                status: 1 
            });

            const createdUserEvent = await userEvent.save();
            return res.status(201).json(createdUserEvent);
        }

    } catch (error) {
        res.status(500).json({ message: 'Error joining event', error: error.message });
    }
};

const getEventsForUserInCurrentMonth = async (req, res) => {
    try {
        const userId = req.params.userId;

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const userEvents = await UserEventsMapping.find({
            user: userId,
            status: 1
        }).select('event');

        if (userEvents.length === 0) {
            return res.status(404).json({ message: 'No events found for this user' });
        }

        const eventIds = userEvents.map(mapping => mapping.event);

        const events = await Event.find({
            _id: { $in: eventIds },
            date: { $gte: startOfMonth, $lte: endOfMonth }
        }).sort({ date: 1 }); 

        if (events.length === 0) {
            return res.status(404).json({ message: 'No events found for this user in the current month' });
        }

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

const unRegisterEvent = async (req, res) => {
    try {
        const { userId, eventId} = req.body;

        const userEvent = await UserEventsMapping.findOne({ user: userId, event: eventId });

        if (!userEvent) {
            return res.status(404).json({ message: 'User is not registered for this event' });
        }

        userEvent.status = 0;
        await userEvent.save();

        return res.status(200).json({ message: 'Successfully unregistered from the event' });
    } catch (error) {
        res.status(500).json({ message: 'Error un-registering event', error: error.message });
    }
};

const donateEvent = async (req, res) => {
    try {
        const { eventId, userId, name, bank_name, amount, ref_code } = req.body;

        const existingMapping = await EventDonation.findOne({ user: userId, event: eventId, ref: ref_code });

        if (existingMapping) {
            return res.status(400).json({ message: 'Donation already have for this Reference' });
        }

        // Create a new user-event mapping
        const newDonation = new EventDonation({
            user: userId,
            event: eventId,
            name: name,
            bank: bank_name,
            amount: amount,
            ref: ref_code,
            status: 1 
        });

        const createdDonation = await newDonation.save();

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId, 
            { $inc: { totalDonation: amount } },
            { new: true }
        );

        res.status(201).json({
            donation: createdDonation,
            updatedEvent
        });
    } catch (error) {
        res.status(500).json({ message: 'Error donating event', error: error.message });
    }
};

const getDonationsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const userDonations = await EventDonation.find({ user: userId, status: 1 })
            .populate('event', 'eventName description date fromTime toTime totalDonation')
            .select('event name bank amount ref createdAt');

        if (userDonations.length === 0) {
            return res.status(404).json({ message: 'No donations found for this user' });
        }

        res.status(200).json(userDonations);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

module.exports = {
    createEvent,
    getEventsByUserId,
    getAllEvents,
    joinEvent,
    getEventsForUserInCurrentMonth,
    unRegisterEvent,
    donateEvent,
    getDonationsByUserId
};