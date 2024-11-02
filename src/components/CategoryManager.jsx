import React, { useState } from 'react';

export const CategoryManager = ({ categories, onAddCategory, onEditCategory, onDeleteCategory }) => {
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category);
    setEditValue(category);
  };

  const handleSaveEdit = (oldCategory) => {
    if (editValue.trim() && editValue !== oldCategory) {
      onEditCategory(oldCategory, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div className="mt-4 p-4 border rounded dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Manage Categories</h2>
      
      {/* Add new category */}
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Add
        </button>
      </form>

      {/* Category list */}
      <div className="space-y-2">
        {categories.map(category => (
          <div key={category} className="flex items-center gap-2">
            {editingId === category ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveEdit(category)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">{category}</span>
                <button
                  onClick={() => handleEdit(category)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteCategory(category)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 