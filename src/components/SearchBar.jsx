export const SearchBar = ({ value, onChange }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Search products..."
    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 
               dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
); 