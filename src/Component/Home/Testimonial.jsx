import React, { useState } from 'react';
import bigrose from '../../assets/svg/bigrose.svg'; // Update with your actual path
import drop from '../../assets/Image/drop.png'; // Update with your actual path
import arrow from '../../assets/svg/arrow.svg'; // Update with your actual path
import smallrose from '../../assets/svg/smallrose.svg'; // Update with your actual path
import user1 from '../../assets/Image/user6.jpg'; // Update with your actual path

const testimonials = [
  {
    title: "Great Service",
    text: "This company provided outstanding service, and the quality of work was exceptional!",
    image: user1,
    name: "John Doe",
  },
  {
    title: "Very Professional",
    text: "The team was very professional, and the communication was excellent. Highly recommend!",
    image: user1,
    name: "Jane Smith",
  },
  {
    title: "Highly Recommend",
    text: "I am extremely satisfied with the work done. I would definitely recommend them to anyone.",
    image: user1,
    name: "Alice Johnson",
  }
];

const Testimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleArrowClick = (direction) => {
    if (direction === 'up') {
      setActiveIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
    } else {
      setActiveIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
    }
  };

  return (
    <section className="testimonial-section" style={styles.section}>
      <div className="testimonial-left" style={styles.left}>
        <img src={bigrose} alt="Big Rose" style={styles.bigrose} />
        <img src={drop} alt="Drop" style={styles.drop} />
      </div>

      <div className="testimonial-center" style={styles.center}>
        <img
          src={arrow}
          alt="Up Arrow"
          onClick={() => handleArrowClick('up')}
          style={styles.arrow}
        />
        <div style={styles.dots}>
          {testimonials.map((_, index) => (
            <span
              key={index}
              style={{
                ...styles.dot,
                backgroundColor: activeIndex === index ? '#000' : '#ccc',
              }}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <img
          src={arrow}
          alt="Down Arrow"
          onClick={() => handleArrowClick('down')}
          style={styles.arrow}
        />
      </div>

      <div className="testimonial-right" style={styles.right}>
        <div style={styles.heading}>
          <img src={arrow} alt="Left Arrow" style={styles.arrowLeft} />
          <h3>Testimonials</h3>
        </div>
        <h4>{testimonials[activeIndex].title}</h4>
        <div style={styles.textBox}>
          <p style={styles.text}>{`"${testimonials[activeIndex].text}"`}</p>
        </div>
        <div style={styles.userContainer}>
          <img src={testimonials[activeIndex].image} alt="User" style={styles.userImage} />
          <img src={smallrose} alt="Small Rose" style={styles.smallrose} />
        </div>
        <p>{testimonials[activeIndex].name}</p>
      </div>
    </section>
  );
};

const styles = {
  section: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: '#f8f8f8',
    width: '1240px', // Set width to 1240px
    margin: '0 auto', // Center align the section horizontally
    position: 'relative', // Needed to position images relative to the section
  },
  left: {
    position: 'relative',
    maxWidth: '300px', // Control the max width of the left side images
  },
  bigrose: {
    position: 'absolute',
    top: '-40px', // Adjust for better positioning
    left: '-200px', // Adjust for better visibility
    maxWidth: '150%', // Ensure the image is visible
    zIndex: 10, // Ensure it is visible over other content
  },
  drop: {
    position: 'absolute',
    top: '20px', // Adjust the position for better alignment
    left: '-80px', // Adjust for better visibility
    maxWidth: '100%',
    zIndex: 5, // Ensure it's visible under the bigrose
  },
  center: {
    textAlign: 'center',
    position: 'relative',
  },
  arrow: {
    cursor: 'pointer',
    margin: '10px',
    width: '30px',
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    margin: '0 5px',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
  },
  right: {
    textAlign: 'left',
    maxWidth: '500px',
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
  },
  arrowLeft: {
    width: '20px',
    transform: 'rotate(180deg)',
  },
  textBox: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    margin: '20px 0',
  },
  text: {
    fontStyle: 'italic',
  },
  userContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  },
  userImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  smallrose: {
    position: 'absolute',
    top: '15px', // Adjust for better alignment
    left: '35px', // Adjust to position it relative to the user image
    width: '20px',
    zIndex: 20, // Ensure the smallrose is visible over the text box
  },
};

export default Testimonial;
