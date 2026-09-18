const SidebarItem = ({icon: Icon,  label, active, badge, onClick }) => {
  return (
  <li 
    onClick={onClick}
    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all ${
      active ? 'bg-emerald-100 text-emerald-700 font-semibold' : 'hover:bg-[#f0f4f3]'
    }`} 
  >
    <div className="flex items-center gap-3">
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </div>
    {badge && <span className={`${active ? 'bg-emerald-600' : 'bg-emerald-500'} text-white text-[10px] px-1.5 py-0.5 rounded-full`}>{badge}</span>}
  </li>
  );
};

export default SidebarItem;
