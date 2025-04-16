import { useState, useRef, useEffect } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiChevronDown,
} from 'react-icons/fi';
import emailjs from '@emailjs/browser'; // Import EmailJS SDK

const ContactForm = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState(''); // For dropdown selection
  const [status, setStatus] = useState(''); // For success or error message

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name || !email || !phone || !message || !subject) {
      setStatus('All fields are required!');
      return;
    }

    // Set the parameters that will be passed to the template
    const templateParams = {
      name,
      email,
      phone,
      message,
      subject,
    };

    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const userID = import.meta.env.VITE_EMAILJS_USER_ID;

    if (!serviceID || !templateID || !userID) {
      setStatus('Missing environment variables for EmailJS.');
      return;
    }

    try {
      // Send email using EmailJS
      await emailjs.send(serviceID, templateID, templateParams, userID);
      setStatus('Message sent successfully!');
      setName(''); // Reset name field
      setEmail(''); // Reset email field
      setPhone(''); // Reset phone field
      setMessage(''); // Reset message field
      setSubject(''); // Reset subject field
    } catch (error) {
      setStatus('Failed to send message.');
      console.error('Error sending message:', error); // Log error for debugging
    }
  };

  return (
    <div className='py-10 px-4 sm:px-6'>
      <div className='max-w-[1200px] mx-auto bg-white p-8 shadow-md'>
        {/* Heading */}
        <h2 className='text-4xl text-center text-black mb-8'>Get In Touch</h2>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* First Row */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {/* Name Field */}
            <div className='relative flex items-center'>
              <input
                type='text'
                placeholder='Your Name'
                className='w-full bg-[#F9F4F2] text-[#5C3822] border-none py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#B09383]'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FiUser className='absolute right-4 text-[#B09383] text-xl' />
            </div>

            {/* Email Field */}
            <div className='relative flex items-center'>
              <input
                type='email'
                placeholder='Email Address'
                className='w-full bg-[#F9F4F2] text-[#5C3822] border-none py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#B09383]'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FiMail className='absolute right-4 text-[#B09383] text-xl' />
            </div>
          </div>

          {/* Second Row */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {/* Phone Field */}
            <div className='relative flex items-center'>
              <input
                type='text'
                placeholder='Phone Number'
                className='w-full bg-[#F9F4F2] text-[#5C3822] border-none py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#B09383]'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <FiPhone className='absolute right-4 text-[#B09383] text-xl' />
            </div>

            {/* Select Field */}
            <div className='relative' ref={dropdownRef}>
              <div
                className='w-full bg-[#F9F4F2] text-[#5C3822] border-none py-3 px-4 flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B09383]'
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {/* Display the selected subject in the dropdown toggle */}
                <span
                  className={`text-[#5C3822] ${!subject && 'text-gray-400'}`}
                >
                  {subject || 'Select'}
                </span>
                <FiChevronDown
                  className={`text-[#B09383] text-xl transition-transform duration-300 ${
                    dropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </div>
              {dropdownOpen && (
                <div className='absolute left-0 right-0 bg-white shadow-md rounded-md mt-2 z-10'>
                  {/* List of selectable options */}
                  {['Feedback', 'Inquiry', 'Support'].map((item) => (
                    <div
                      key={item}
                      className={`py-2 px-4 cursor-pointer ${
                        subject === item ? 'bg-gray-100' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setSubject(subject === item ? '' : item); // Deselect if clicked again
                        setDropdownOpen(false); // Close dropdown after selection
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Field */}
          <div className='relative flex items-center'>
            <textarea
              placeholder='Message'
              rows='5'
              className='w-full bg-[#F9F4F2] text-[#5C3822] border-none py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#B09383]'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <FiMessageSquare className='absolute top-4 right-4 text-[#B09383] text-xl' />
          </div>

          {/* Submit Button */}
          <div className='text-center'>
            <button
              type='submit'
              className='w-full bg-[#c28565] text-white text-[16px] py-3 px-12 shadow hover:bg-[#5C3822] transition duration-300'
            >
              SEND MESSAGE →
            </button>
          </div>

          {/* Status Message */}
          {status && <div className='text-center mt-4 text-lg'>{status}</div>}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
