import Banner from '../Component/Home/Banner';
import AboutUs from '../Component/Home/AboutUs';
import Winter from '../Component/Home/Winter';
import Care from '../Component/Home/Care';
import OurProducts from '../Component/Home/OurProducts';
import Testimonial from '../Component/Home/Testimonial';

const Home = () => {
  return (
    <div>
      <Banner />
      <AboutUs />
      <Winter />
      <Care />
      {/* Only show 8 products and display the "View All" button */}
      <OurProducts showAll={false} hideViewAllButton={false} />
      <Testimonial className='pt-40' />
    </div>
  );
};

export default Home;
