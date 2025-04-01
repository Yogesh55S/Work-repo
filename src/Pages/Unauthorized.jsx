import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <Link to='/'>Go to Home</Link>
    </div>
  );
};

export default Unauthorized;
