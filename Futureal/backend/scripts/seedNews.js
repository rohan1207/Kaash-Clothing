const mongoose = require('mongoose');
const News = require('../models/News');

const newsData = [
    {
        title: "Nurses Day Celebrations, 12th May 2025",
        date: "12th May 2025",
        content: `The heart behind every healing touch – our nurses. We honor your care, strength, and compassion. Happy Nurses Day! 🩺👩‍⚕️

        At Sai Sneh Hospital, we celebrated International Nurses Day with great enthusiasm and appreciation for our dedicated nursing staff. The day was filled with special events, recognition ceremonies, and heartfelt moments that highlighted the crucial role our nurses play in patient care.

        Key Highlights of the Celebration:
        • Special recognition ceremony for long-serving nurses
        • Professional development workshops
        • Team-building activities
        • Patient testimonials sharing
        • Cultural performances by staff members

        Our nursing staff demonstrated their commitment to excellence through various presentations on patient care innovations and best practices. The celebration reinforced our hospital's commitment to maintaining the highest standards of nursing care while fostering a supportive and collaborative environment.`,
        image: "/news1.jpg",
        category: "function",
        excerpt: "Join us in celebrating our amazing nurses on International Nurses Day! A day filled with recognition, learning, and appreciation for their dedication to patient care."
    },
    {
        title: "Dialysis Centre in Pune: Expert Care at Sai Sneh Hospital",
        date: "May 02, 2025",
        content: `For those in need of dialysis services, Sai Sneh Hospital in Pune offers a state-of-the-art dialysis center with the latest equipment and highly skilled medical staff. Our center provides dialysis treatments in a comfortable, caring environment, focusing on the needs of each patient.

        Our Dialysis Center Features:
        • Modern dialysis machines with advanced monitoring systems
        • Experienced nephrologists and specialized nursing staff
        • Comfortable treatment areas with individual entertainment systems
        • Strict adherence to hygiene and safety protocols
        • Flexible scheduling options for patient convenience

        We are committed to providing the highest quality of care while ensuring patient comfort and safety throughout their treatment journey.`,
        image: "/news2.webp",
        category: "Services",
        excerpt: "State-of-the-art dialysis center now open at Sai Sneh Hospital, offering expert care and comfortable treatment options for patients."
    },
    {
        title: "Best Maternity Home in Pune: Sai Sneh Hospital's Expert Care",
        date: "Apr 28, 2025",
        content: `When it comes to welcoming a new life into the world, choosing the best maternity home is crucial. At Sai Sneh Hospital, we specialize in providing comprehensive maternity care in Pune. Our state-of-the-art facilities and experienced team of doctors ensure that both mother and baby receive the best care possible.

        Our Maternity Services Include:
        • Prenatal care and consultations
        • Modern labor and delivery rooms
        • Expert obstetrics team
        • Advanced NICU facilities
        • Postnatal care and support
        • Lactation consulting

        We take pride in creating a warm, supportive environment for new mothers and their families during this special time.`,
        image: "/news3.avif",
        category: "Services",
        excerpt: "Experience exceptional maternity care at Sai Sneh Hospital, where we prioritize the health and comfort of both mother and baby."
    },
    // Add the rest of your news items here...
];

const seedNews = async () => {
    let connection;
    try {
        // Connect to MongoDB
        connection = await mongoose.connect('mongodb+srv://kkassociates1207:bPvTTDpOslCL5M8h@cluster0.tivtk5n.mongodb.net/saisneh_hospital', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Delete existing news
        const deleteResult = await News.deleteMany({});
        console.log('Existing news deleted:', deleteResult);

        // Insert new news data
        const insertResult = await News.insertMany(newsData);
        console.log('News data seeded successfully. Documents inserted:', insertResult.length);

    } catch (error) {
        console.error('Error seeding news data:', error);
        process.exit(1);
    } finally {
        if (connection) {
            try {
                await mongoose.connection.close();
                console.log('MongoDB connection closed');
            } catch (err) {
                console.error('Error closing MongoDB connection:', err);
            }
        }
        process.exit(0);
    }
};

seedNews();
