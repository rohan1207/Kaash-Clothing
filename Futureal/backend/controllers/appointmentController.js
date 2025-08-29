const Appointment = require('../models/Appointment');

// Get all appointments
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .sort({ appointmentDate: 1, appointmentTime: 1 });
        
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
};

// Create new appointment
exports.createAppointment = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            department,
            doctor,
            appointmentDate,
            appointmentTime,
            message
        } = req.body;

        const appointment = new Appointment({
            name,
            email,
            phone,
            department,
            doctor,
            appointmentDate,
            appointmentTime,
            message,
            status: 'pending'
        });

        await appointment.save();

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            data: appointment
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Error booking appointment',
            error: error.message
        });
    }
};
