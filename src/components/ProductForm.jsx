import React, { useState } from 'react';

export const ProductForm = ({ onAdd, categories }) => {
  const [product, setProduct] = useState({ name: '', category: '', quantity: 1 });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!product.name.trim() || !product.category) {
      setError('Name and category are required');
      return;
    }

    onAdd(product);
    setProduct({ name: '', category: '', quantity: 1 });
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <input
        type="text"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        placeholder="Product name"
        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 
                   dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={product.category}
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
        required
      >
        <option value="">Select category</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <input
        type="number"
        value={product.quantity}
        onChange={(e) => setProduct({ ...product, quantity: parseInt(e.target.value) })}
        min="1"
        className="w-full p-2 border rounded"
      />
      <button 
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
      >
        Add Product
      </button>
    </form>
  );
}; 