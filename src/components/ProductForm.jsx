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
      <div>
        <label htmlFor="productName" className="block mb-1 text-sm font-medium">
          Product Name
        </label>
        <input
          id="productName"
          type="text"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          placeholder="Enter product name"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          required
        />
      </div>

      <div>
        <label htmlFor="productCategory" className="block mb-1 text-sm font-medium">
          Category
        </label>
        <select
          id="productCategory"
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
      </div>

      <div>
        <label htmlFor="productQuantity" className="block mb-1 text-sm font-medium">
          Quantity
        </label>
        <input
          id="productQuantity"
          type="number"
          min="1"
          value={product.quantity}
          onChange={(e) => setProduct({ ...product, quantity: parseInt(e.target.value) })}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          required
        />
      </div>

      <button 
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
      >
        Add Product
      </button>
    </form>
  );
}; 