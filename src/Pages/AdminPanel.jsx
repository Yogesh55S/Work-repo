import { Link, Outlet } from 'react-router-dom'; // Use Outlet to render nested routes
import { FiShoppingCart, FiPlusCircle, FiEye, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../Component/providers/AuthContext'; // Assuming you have a context to manage authentication
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Assuming a logout function in AuthContext

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <div className='flex pt-20 min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <div className='bg-primary w-64 p-6 pt-20 text-white space-y-6 fixed top-0 left-0 h-full'>
        <div className='text-2xl font-bold'>
          <Link to='/admin-panel'>Admin Panel</Link>
        </div>
        <ul className='space-y-4'>
          <li>
            <Link
              to='add-product'
              className='flex items-center space-x-2 hover:text-[#D7C9C1]'
            >
              <FiPlusCircle />
              <span>Add Product</span>
            </Link>
          </li>
          <li>
            <Link
              to='products'
              className='flex items-center space-x-2 hover:text-[#D7C9C1]'
            >
              <FiEye />
              <span>View Products</span>
            </Link>
          </li>
          <li>
            <Link
              to='orders'
              className='flex items-center space-x-2 hover:text-[#D7C9C1]'
            >
              <FiShoppingCart />
              <span>View Orders</span>
            </Link>
          </li>
        </ul>
        <div className='absolute bottom-6 left-6'>
          <button
            onClick={handleLogout}
            className='flex items-center space-x-2 hover:text-[#D7C9C1]'
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 p-8 pl-72 overflow-y-auto max-h-screen'>
        {/* Outlet will render nested routes here */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
