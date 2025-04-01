import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi'; // Icons for contact details

const ContactDetails = () => {
  return (
    <div className='bg-gray-50 py-10 px-4 sm:px-6'>
      <div className='max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Section - Contact Details */}
        <div className='bg-[#F9F4F2] p-6 shadow-md col-span-1'>
          <h2 className='text-2xl text-black mb-4'>Our Contact Information</h2>
          <p className='text-[#909F8C] mb-6'>
            Have an inquiry or some feedback for us? Contact us using the
            details below.
          </p>

          <div className='space-y-6'>
            {/* Address */}
            <div className='flex items-start p-4 bg-white shadow-md'>
              <div className='bg-[#c28565] p-3  mr-4 flex-shrink-0'>
                <FiMapPin className='text-white text-xl' />
              </div>
              <div>
                <h3 className='text-lg text-black mb-1'>Our Address</h3>
                <p className='text-[#909F8C] text-sm sm:text-base'>
                  2690 Hiltona Street Victoria Road, New York, Canada
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className='flex items-start p-4 bg-white shadow-md'>
              <div className='bg-[#c28565]  p-3  mr-4 flex-shrink-0'>
                <FiPhone className='text-white text-xl' />
              </div>
              <div>
                <h3 className='text-lg text-black mb-1'>Phone Number</h3>
                <p className='text-[#909F8C] text-sm sm:text-base'>
                  Mobile: +256 214 203 215
                </p>
              </div>
            </div>

            {/* Email Address */}
            <div className='flex items-start p-4 bg-white shadow-md'>
              <div className='bg-[#c28565]  p-3  mr-4 flex-shrink-0'>
                <FiMail className='text-white text-xl' />
              </div>
              <div>
                <h3 className='text-lg  text-black mb-1'>Email Address</h3>
                <p className='text-[#909F8C] text-sm sm:text-base'>
                  info@rasm.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Map */}
        <div className='rounded-lg overflow-hidden shadow-md col-span-1 lg:col-span-2'>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.3871900217127!2d76.88530957500747!3d29.968300722175417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e472468789a5f%3A0xb9958771a2d1c161!2sIndiefluence!5e0!3m2!1sen!2sin!4v1732516394887!5m2!1sen!2sin'
            width='100%'
            height='450'
            style={{ border: '0' }}
            allowFullScreen=''
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
