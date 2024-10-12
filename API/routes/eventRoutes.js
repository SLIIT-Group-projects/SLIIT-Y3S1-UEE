const express = require('express');
const { createEvent, getEventsByUserId, getAllEvents, joinEvent, getEventsForUserInCurrentMonth, unRegisterEvent, donateEvent, getDonationsByUserId } = require('../controllers/eventController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, createEvent);
router.get('/:userId', protect, getEventsByUserId);
router.get('/', protect, getAllEvents);
router.post('/join', protect, joinEvent);
router.get('/:userId/current-month', protect, getEventsForUserInCurrentMonth);
router.put('/unregister', protect, unRegisterEvent);
router.post('/donate', protect, donateEvent);
router.get('/donations/:userId', protect, getDonationsByUserId);

module.exports = router;