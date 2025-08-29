const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Get all appointments
router.get('/', appointmentController.getAllAppointments);

// Create new appointment
router.post('/', appointmentController.createAppointment);

module.exports = router;
