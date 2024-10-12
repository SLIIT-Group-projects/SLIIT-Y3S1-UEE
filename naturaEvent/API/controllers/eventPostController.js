const Event = require('../models/postEventModel');

exports.createEvent = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.file);
    const {
      organization,
      eventName,
      category,
      description,
      location,
      date,
      fromTime,
      toTime,
      financialContribution,
      totalDonation,
      toolsSupplies
    } = req.body;

    // Extract image paths
    const imagePath = req.file ? req.file.path : null;
    const event = new Event({
      organization,
      eventName,
      category,
      description,
      location,
      date: new Date(date),
      fromTime,
      toTime,
      financialContribution,
      totalDonation,
      toolsSupplies,
      images: imagePath ? [imagePath] : [],
    });

    await event.save();
    res.status(201).json({ message: 'Event created successfully!', event });
  } catch (err) {
    console.error("Error creating event:", err);  // Log the detailed error
    res.status(400).json({ message: 'Error creating event', error: err });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event', error: err });
  }
};
