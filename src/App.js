import React, { useMemo, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { ThemeToggle } from './components/ThemeToggle';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useUndoRedo } from './hooks/useUndoRedo';
import { useTheme } from './context/ThemeContext';

const App = () => {
  // State management
  const [products, setProducts] = useLocalStorage('products', []);
  const [productState, setProductState, undo, redo] = useUndoRedo(products);
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
  const [filterCategory, setFilterCategory] = useLocalStorage('filterCategory', '');
  const [sortBy, setSortBy] = useLocalStorage('sortBy', 'name');
  const { isDarkMode, toggleTheme } = useTheme();

  // Sync products with undo/redo state
  useEffect(() => {
    setProducts(productState);
  }, [productState, setProducts]);

  // Memoized values
  const categories = useMemo(() => 
    [...new Set(products.map(p => p.category))],
    [products]
  );

  const filteredProducts = useMemo(() => 
    products
      .filter(product => (
        (!filterCategory || product.category === filterCategory) &&
        (!searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      ))
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'category') return a.category.localeCompare(b.category);
        return b.dateAdded - a.dateAdded;
      }),
    [products, filterCategory, searchTerm, sortBy]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [undo, redo]);

  const handleAddProduct = (newProduct) => {
    setProductState([
      ...products,
      {
        ...newProduct,
        id: Date.now(),
        dateAdded: new Date().toISOString(),
      }
    ]);
  };

  const handleDeleteProduct = (id) => {
    setProductState(products.filter(p => p.id !== id));
  };

  const handleMoveProduct = (dragIndex, hoverIndex) => {
    const newProducts = [...products];
    const dragItem = newProducts[dragIndex];
    newProducts.splice(dragIndex, 1);
    newProducts.splice(hoverIndex, 0, dragItem);
    setProductState(newProducts);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`min-h-screen p-4 ${isDarkMode ? 'dark bg-gray-800 text-white' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Grocery App</h1>
            <ThemeToggle />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ProductForm onAdd={handleAddProduct} categories={categories} />
              <div className="mt-4 space-x-2">
                <button onClick={undo} disabled={!products.length}>Undo</button>
                <button onClick={redo}>Redo</button>
              </div>
            </div>

            <div>
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              <CategoryFilter
                categories={categories}
                selected={filterCategory}
                onChange={setFilterCategory}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-2 p-2 border rounded"
              >
                <option value="name">Sort by Name</option>
                <option value="category">Sort by Category</option>
                <option value="date">Sort by Date Added</option>
              </select>
              
              <ProductList
                products={filteredProducts}
                onDelete={handleDeleteProduct}
                onMove={handleMoveProduct}
              />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;