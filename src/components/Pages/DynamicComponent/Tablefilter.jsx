import { Search } from "lucide-react";
import { useForm } from "react-hook-form";

const Tablefilter = ({ onFilterChange, filters = [] }) => {
  const { register, handleSubmit } = useForm();

  console.log(filters)

  const onSubmit = (data) => {
    onFilterChange(data);
  };
  return (
    <form
      onChange={handleSubmit(onSubmit)}
      className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-t-xl  border-x-gray-300 border shadow-sm"
    >
      <div className="relative w-full">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          {...register("search")}
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
      </div>

      <div className="flex gap-3 w-full md:w-auto">
        {filters.map((filter, index) => (
          <select
            key={index}
            {...register(filter.name)}
            className="flex-1 md:w-40 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none shadow-sm cursor-pointer hover:bg-gray-50"
          >
            {filter.options.map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>
    </form>
  );
};

export default Tablefilter;
