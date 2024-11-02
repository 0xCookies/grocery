export const CategoryFilter = ({ categories, selected, onChange }) => (
  <div>
    <label htmlFor="categoryFilter" className="block mb-1 text-sm font-medium">
      Filter by Category
    </label>
    <select
      id="categoryFilter"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border rounded mt-2 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Filter products by category"
    >
      <option value="">All Categories</option>
      {categories.map(category => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>
  </div>
); 