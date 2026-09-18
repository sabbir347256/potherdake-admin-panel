import { Search, Bell, Settings, User } from 'lucide-react';
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          placeholder="Search bookings, users, experiences..."
        />
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-emerald-600">
          <Bell size={20} />
        </button>
        <button className="text-gray-500 hover:text-emerald-600">
          <Settings size={20} />
        </button>
        <div className="flex items-center border-l pl-4 ml-2">
          <div className="text-right mr-3">
            <p className="text-sm font-semibold text-gray-800 leading-none">Admin User</p>
            <p className="text-xs text-gray-500 mt-1">Super Admin</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <User size={24} className="text-gray-400" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;