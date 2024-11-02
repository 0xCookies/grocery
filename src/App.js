import React, { useMemo, useEffect, useState } from 'react';
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
import { CategoryManager } from './components/CategoryManager';
import { ErrorBoundary } from 'react-error-boundary';
import { debounce } from 'lodash';

const App = () => {
  // State management
  const [products, setProducts] = useLocalStorage('products', []);
  const [productState, setProductState, undo, redo] = useUndoRedo(products);
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
  const [filterCategory, setFilterCategory] = useLocalStorage('filterCategory', '');
  const [sortBy, setSortBy] = useLocalStorage('sortBy', 'name');
  const { isDarkMode, toggleTheme } = useTheme();
  const [categories, setCategories] = useLocalStorage('categories', ['Fruits', 'Vegetables', 'Dairy']);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSetSearchTerm = useMemo(
    () => debounce(setSearchTerm, 300),
    [setSearchTerm]
  );

  // Sync products with undo/redo state
  useEffect(() => {
    setProducts(productState);
  }, [productState, setProducts]);

  // Memoized values
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

  const handleAddProduct = async (newProduct) => {
    setIsLoading(true);
    try {
      setProductState([
        ...products,
        {
          ...newProduct,
          id: Date.now(),
          dateAdded: new Date().toISOString(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
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

  const handleAddCategory = (newCategory) => {
    if (!categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  const handleEditCategory = (oldCategory, newCategory) => {
    if (!categories.includes(newCategory)) {
      setCategories(categories.map(cat => 
        cat === oldCategory ? newCategory : cat
      ));
      
      // Update all products with the old category
      setProducts(products.map(product => 
        product.category === oldCategory 
          ? { ...product, category: newCategory }
          : product
      ));
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    if (window.confirm(`Are you sure you want to delete "${categoryToDelete}"?`)) {
      // Batch state updates
      const newCategories = categories.filter(cat => cat !== categoryToDelete);
      const newProducts = products.map(product => 
        product.category === categoryToDelete 
          ? { ...product, category: '' }
          : product
      );
      
      setCategories(newCategories);
      setProductState(newProducts);
    }
  };

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen">
          <main className={`max-w-4xl mx-auto p-4 ${
            isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white'
          }`}>
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Grocery App</h1>
              <ThemeToggle />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section>
                <ProductForm onAdd={handleAddProduct} categories={categories} />
                <CategoryManager
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  onEditCategory={handleEditCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              </section>

              <section>
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
                <CategoryFilter
                  categories={categories}
                  selected={filterCategory}
                  onChange={setFilterCategory}
                />
                <ProductList
                  products={filteredProducts}
                  onDelete={handleDeleteProduct}
                  onMove={handleMoveProduct}
                />
              </section>
            </div>
          </main>
        </div>
      </DndProvider>
    </ErrorBoundary>
  );
};

export default App;