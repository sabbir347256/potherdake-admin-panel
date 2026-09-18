import { LayoutDashboard, Plane, Hotel, Car, Map, Star, Users, Shield, Tag, LogOut } from 'lucide-react';
import SidebarItem from './SidebarItem';
const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold text-emerald-600 flex items-center gap-2">
          Pura <span className="text-amber-500">VidaX</span>
        </h1>
      </div>

      <div className="flex-1 px-4 space-y-6">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">
            Overview
          </p>
          <ul className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
            <SidebarItem icon={Shield} label="Analytics" />
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">
            Bookings
          </p>
          <ul className="space-y-1">
            <SidebarItem
              icon={LayoutDashboard}
              label="All Bookings"
              badge="12"
            />
            <SidebarItem icon={Plane} label="Flights" />
            <SidebarItem icon={Hotel} label="Hotels" />
            <SidebarItem icon={Car} label="Car Rentals" />
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">
            Catalog
          </p>
          <ul className="space-y-1">
            <SidebarItem icon={Map} label="Experiences" />
            <SidebarItem icon={Star} label="Reviews" badge="5" />
          </ul>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 text-red-600 hover:bg-red-50 w-full px-4 py-2.5 rounded-lg transition-colors text-sm font-medium">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
