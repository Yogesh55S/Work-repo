import ContactBanner from '../Component/Contact/ContactBanner';
import ContactDetails from '../Component/Contact/ContactDetails';
import ContactForm from '../Component/Contact/ContactForm';

const Contact = () => {
  return (
    <div className='pt-20'>
      <ContactBanner />
      <ContactDetails />
      <ContactForm />
    </div>
  );
};

export default Contact;
