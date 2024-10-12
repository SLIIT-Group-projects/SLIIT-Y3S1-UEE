const express = require('express');
const eventController = require('../controllers/eventPostController');
const upload = require('../middlewares/uploadConfig');

const router = express.Router();

// POST: Create event
router.post('/events', upload.single('image'), eventController.createEvent);

// GET: List all events
router.get('/events', eventController.getEvents);

// GET: Get event by ID
router.get('/events/:id', eventController.getEventById);

module.exports = router;
