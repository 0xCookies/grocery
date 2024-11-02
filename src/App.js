import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Plus, X, Check, Edit2, Save, Filter } from 'lucide-react';

const GroceryApp = () => {
  // Initialize state from localStorage or default values
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('groceryProducts');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Milk', category: 'Dairy' },
      { id: 2, name: 'Bread', category: 'Bakery' },
      { id: 3, name: 'Apples', category: 'Produce' },
    ];
  });
  
  const [shoppingList, setShoppingList] = useState(() => {
    const saved = localStorage.getItem('groceryShoppingList');
    return saved ? JSON.parse(saved) : [];
  });

  const [newProduct, setNewProduct] = useState({ name: '', category: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name' or 'category'

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('groceryProducts', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('groceryShoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  // Get unique categories for filter dropdown
  const categories = [...new Set(products.map(p => p.category))];

  // Add new product to database
  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category) {
      setProducts([
        ...products,
        {
          id: Date.now(), // Use timestamp as ID
          name: newProduct.name,
          category: newProduct.category
        }
      ]);
      setNewProduct({ name: '', category: '' });
      setShowAddForm(false);
    }
  };

  // Update existing product
  const handleUpdateProduct = (id, updatedFields) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, ...updatedFields } : product
    ));
    setEditingProduct(null);
  };

  // Add/remove product from shopping list with quantity
  const toggleInShoppingList = (product) => {
    const existingItem = shoppingList.find(item => item.id === product.id);
    if (existingItem) {
      setShoppingList(shoppingList.filter(item => item.id !== product.id));
    } else {
      setShoppingList([...shoppingList, { ...product, quantity: 1 }]);
    }
  };

  // Update quantity in shopping list
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setShoppingList(shoppingList.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => !filterCategory || product.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.category.localeCompare(b.category);
    });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Products Database Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products Database</CardTitle>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Plus className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent>
          {/* Add Product Form */}
          {showAddForm && (
            <div className="mb-4 space-y-2">
              <input
                type="text"
                placeholder="Product name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Product
              </button>
            </div>
          )}

          {/* Filter and Sort Controls */}
          <div className="mb-4 flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="name">Sort by Name</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                {editingProduct?.id === product.id ? (
                  <div className="flex-1 mr-2">
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        name: e.target.value
                      })}
                      className="w-full p-1 border rounded mb-1"
                    />
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        category: e.target.value
                      })}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </div>
                )}
                <div className="flex gap-2">
                  {editingProduct?.id === product.id ? (
                    <button
                      onClick={() => handleUpdateProduct(product.id, {
                        name: editingProduct.name,
                        category: editingProduct.category
                      })}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Save className="h-5 w-5 text-green-500" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Edit2 className="h-5 w-5 text-blue-500" />
                    </button>
                  )}
                  <button
                    onClick={() => toggleInShoppingList(product)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    {shoppingList.find(item => item.id === product.id) ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shopping List Section */}
      <Card>
        <CardHeader>
          <CardTitle>Shopping List ({shoppingList.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          {shoppingList.length === 0 ? (
            <p className="text-gray-500">Your shopping list is empty</p>
          ) : (
            <div className="space-y-2">
              {shoppingList.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.category}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 border rounded"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => toggleInShoppingList(item)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <X className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GroceryApp;