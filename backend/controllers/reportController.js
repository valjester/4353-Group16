const asyncHandler = require('express-async-handler');
const PDFDocument = require('pdfkit');
const User = require('../models/User');
const Event = require('../models/Event');

const generateVolunteerPDF = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({ role: 'volunteer' });
        const events = await Event.find({});

        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Volunteer_Report.pdf');

        doc.pipe(res);

        doc.fontSize(20).text('Volunteer Report', { align: 'center' });
        doc.moveDown();

        doc.fontSize(16).text('Volunteers', { underline: true });
        doc.moveDown();

        users.forEach(user => {
            const userEvents = events.filter(event => user.history.includes(event._id.toString()));
            
            doc.fontSize(14).text(`${user.role}: ${user.fullName}`);
            doc.fontSize(12).text(`Email: ${user.email}`);
            if (userEvents.length > 0) {
                doc.text('Events Participated:', { underline: true });
                userEvents.forEach(event => {
                    const parsedDate = new Date(event.eventDate);
                    console.log('Original Date:', event.eventDate, 'Parsed Date:', parsedDate);
                    doc.text(`- ${event.eventName} (${new Date(event.eventDate).toLocaleDateString()})`);
                });
            } else {
                doc.text('No events participated.');
            }
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error('Error generating PDF report:', error);
        res.status(500).json({ error: 'Failed to generate the report.' });
    }
});

const generateEventPDF = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({ role: 'volunteer' });
        const events = await Event.find({});
        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Event_Report.pdf');

        doc.pipe(res);

        doc.fontSize(20).text('Event Report', { align: 'center' });
        doc.moveDown();

        doc.fontSize(16).text('Events', { underline: true });
        doc.moveDown();

        events.forEach(event => {
            const assignedVolunteers = users.filter(user => user.history.includes(event._id.toString()));
        
            doc.fontSize(14).text(`Event: ${event.eventName}`);
            doc.fontSize(12).text(`Date: ${new Date(event.eventDate).toLocaleDateString()}`);
            doc.text(`Location: ${event.location}`);
            doc.text(`Description: ${event.description}`);
            if (assignedVolunteers.length > 0) {
                doc.text('Assigned Volunteers:', { underline: true });
                assignedVolunteers.forEach(volunteer => {
                    doc.text(`- ${volunteer.fullName} (${volunteer.email})`);
                });
            } else {
                doc.text('No volunteers assigned.');
            }
            doc.moveDown();
        });
        doc.end();
    } catch (error) {
        console.error('Error generating event PDF report:', error);
        res.status(500).json({ error: 'Failed to generate the event PDF report.' });
    }
});

const generateVolunteerCSV = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({ role: 'volunteer' });
        const events = await Event.find({});

        let csvContent = 'Volunteer Name, Email, Events Participated\n';

        users.forEach(user => {
            const userEvents = events.filter(event => user.history.includes(event._id.toString()));
            const eventNames = userEvents.map(event => `${event.eventName} (${new Date(event.eventDate).toLocaleDateString()})`).join('; ') || 'No events participated';
            csvContent += `"${user.fullName}", "${user.email}", "${eventNames}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=Volunteer_Report.csv');
        res.send(csvContent);
    } catch (error) {
        console.error('Error generating volunteer CSV report:', error);
        res.status(500).json({ error: 'Failed to generate the volunteer CSV report.' });
    }
});

const generateEventCSV = asyncHandler(async (req, res) => {
    try {
        //const users = await User.find({ role: 'volunteer' });
        //const events = await Event.find({});
        const events = await Event.find({}).populate('volunteersAssigned');

        const escapeCSV = (str) => {
            if (str.includes(',') || str.includes('\n') || str.includes('"')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        let csvContent = 'Event Name, Date, Location, Description, Assigned Volunteers\n';

        events.forEach(event => {
            const volunteerNames = event.volunteersAssigned
                .map(volunteer => `${volunteer.fullName} (${volunteer.email})`)
                .join('; ') || 'No volunteers assigned';

            // Append each event's data to the CSV content
            csvContent += `${escapeCSV(event.eventName)}, ${escapeCSV(new Date(event.eventDate).toISOString().split('T')[0])}, ${escapeCSV(event.location)}, ${escapeCSV(event.description)}, ${escapeCSV(volunteerNames)}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=Event_Report.csv');
        res.send(csvContent);
    } catch (error) {
        console.error('Error generating event CSV report:', error);
        res.status(500).json({ error: 'Failed to generate the event CSV report.' });
    }
});


module.exports = { generateVolunteerPDF, generateEventPDF, generateEventCSV, generateVolunteerCSV };




