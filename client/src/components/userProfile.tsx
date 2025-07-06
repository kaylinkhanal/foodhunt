import { useSelector } from 'react-redux';

function UserProfile({ isOpen, onClose }) {
  // Retrieve user details from Redux store
  const user = useSelector((state) => state.user); // Adjust based on your Redux slice

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[1200] flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">User Details</h2>
        <div className="space-y-4">
          <p>
            <strong>Email:</strong> {user?.email || 'not recongnize'}
          </p>
          <p>
            <strong>Role:</strong> {user?.role || 'not recongnize'}
          </p>
          {/* Add more user details as needed */}
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default UserProfile;