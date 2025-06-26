import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // In a real app, you'd handle form submission here (e.g., send to an API)
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <div className="bg-stone-50 font-serif pt-24 md:pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-16 md:mb-24"
        >
          <h1 className="text-4xl md:text-6xl text-stone-800 font-thin tracking-wide mb-4">Get In Touch</h1>
          <p className="text-stone-500 max-w-2xl mx-auto font-sans">
            We're here to help with any questions you may have. Reach out to us, and we'll respond as soon as we can.
          </p>
        </motion.header>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
          {/* Contact Information */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:col-span-1 space-y-8 font-sans"
          >
            <InfoCard
              icon={<FiMapPin size={22} />}
              title="Our Boutique"
              lines={['Dubai Design District (d3)', 'Building 7, Unit 45', 'Dubai, UAE']}
            />
            <InfoCard
              icon={<FiPhone size={22} />}
              title="Call Us"
              lines={['+971 58 527 4493', 'Mon-Fri, 10am - 7pm']}
            />
            <InfoCard
              icon={<FiMail size={22} />}
              title="Email Us"
              lines={['sales@kaashandco.com', 'Replies within 24 hours']}
            />
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:col-span-2 bg-white p-8 md:p-12 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6 font-sans">
              <h2 className="text-2xl text-stone-800 font-serif mb-6">Send a Message</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField name="name" label="Your Name" value={formData.name} onChange={handleChange} required />
                <InputField name="email" type="email" label="Your Email" value={formData.email} onChange={handleChange} required />
              </div>
              <InputField name="subject" label="Subject" value={formData.subject} onChange={handleChange} required />
              <TextAreaField name="message" label="Your Message" value={formData.message} onChange={handleChange} required />
              
              <button
                type="submit"
                className="w-full bg-stone-800 text-white py-4 px-6 font-sans tracking-wider hover:bg-stone-700 transition-colors duration-300 disabled:bg-stone-400"
                disabled={submitted}
              >
                {submitted ? 'Message Sent!' : 'Send Message'}
              </button>
              {submitted && <p className='text-center text-green-600 mt-4'>Thank you! We've received your message.</p>}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, lines }) => (
  <div className="flex items-start gap-4">
    <div className="text-sky-600 mt-1">{icon}</div>
    <div>
      <h3 className="text-lg text-stone-800 font-semibold mb-1">{title}</h3>
      {lines.map((line, i) => (
        <p key={i} className="text-stone-500 leading-relaxed">{line}</p>
      ))}
    </div>
  </div>
);

const InputField = ({ name, label, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-stone-600 mb-2">{label}</label>
    <input
      id={name}
      name={name}
      className="w-full p-3 border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300"
      {...props}
    />
  </div>
);

const TextAreaField = ({ name, label, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-stone-600 mb-2">{label}</label>
    <textarea
      id={name}
      name={name}
      rows="5"
      className="w-full p-3 border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300 resize-none"
      {...props}
    />
  </div>
);

export default ContactUs;
