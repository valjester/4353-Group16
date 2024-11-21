const asyncHandler = require('express-async-handler');
const PDFDocument = require('pdfkit');
const User = require('../models/User');
const Event = require('../models/Event');

const generateVolunteerReportPDF = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({});
        const events = await Event.find({});

        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Volunteer_Report.pdf');

        doc.pipe(res);

        doc.fontSize(20).text('Volunteer and Event Report', { align: 'center' });
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

        doc.addPage();
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
        console.error('Error generating PDF report:', error);
        res.status(500).json({ error: 'Failed to generate the report.' });
    }
});

module.exports = { generateVolunteerReportPDF };
