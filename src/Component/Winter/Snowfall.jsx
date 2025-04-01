import '../css/Snowfall.css'; // Import the CSS file for styling

const Snowfall = () => {
  return (
    <div className='snow-container'>
      {/* Increase the number of small, medium, and large snowflakes */}
      {Array.from({ length: 20 }).map((_, index) => (
        <div key={`small-${index}`} className='snow small'>
          <span>❄</span>
        </div>
      ))}
      {Array.from({ length: 20 }).map((_, index) => (
        <div key={`medium-${index}`} className='snow medium'>
          <span>❄</span>
        </div>
      ))}
      {Array.from({ length: 20 }).map((_, index) => (
        <div key={`large-${index}`} className='snow large'>
          <span>❄</span>
        </div>
      ))}
    </div>
  );
};

export default Snowfall;
