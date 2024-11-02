export const CategoryFilter = ({ categories, selected, onChange }) => (
  <select
    value={selected}
    onChange={(e) => onChange(e.target.value)}
    className="w-full p-2 border rounded mt-2"
  >
    <option value="">All Categories</option>
    {categories.map(category => (
      <option key={category} value={category}>{category}</option>
    ))}
  </select>
); 