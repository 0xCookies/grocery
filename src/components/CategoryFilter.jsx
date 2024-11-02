export const CategoryFilter = ({ categories, selected, onChange }) => (
  <select
    value={selected}
    onChange={(e) => onChange(e.target.value)}
    className="w-full p-2 border rounded mt-2 dark:bg-gray-800 dark:border-gray-700 
               dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">All Categories</option>
    {categories.map(category => (
      <option key={category} value={category}>{category}</option>
    ))}
  </select>
); 