import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const SearchInput = ({
    onSearch,
    placeholder = "Search...",
    debounceTime = 500,
}) => {
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(searchTerm);
        }, debounceTime);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    return (
        <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            />
        </div>
    );
};

export default SearchInput;