import React, { useMemo, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ErrorBoundary } from 'react-error-boundary';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { ThemeToggle } from './components/ThemeToggle';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useUndoRedo } from './hooks/useUndoRedo';
import { useTheme } from './context/ThemeContext';
import { CategoryManager } from './components/CategoryManager';
import { debounce } from 'lodash';
import { Toast } from './components/Toast';

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
  const [toasts, setToasts] = useState([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

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

  // Toast handling
  const showToast = (message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Confirmation dialog
  const showConfirmDialog = (action) => {
    setConfirmAction(() => action);
    setIsConfirmDialogOpen(true);
  };

  // Enhanced product handling
  const handleAddProduct = async (newProduct) => {
    setIsLoading(true);
    try {
      const product = {
        ...newProduct,
        id: Date.now(),
        dateAdded: new Date().toISOString(),
      };
      setProductState(prev => [...prev, product]);
      showToast('Product added successfully', 'success');
    } catch (error) {
      console.error('Failed to add product:', error);
      showToast('Failed to add product', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = (id) => {
    showConfirmDialog(() => {
      setProductState(prev => prev.filter(p => p.id !== id));
      showToast('Product deleted successfully', 'success');
    });
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

  // Enhanced category handling
  const handleDeleteCategory = (categoryToDelete) => {
    showConfirmDialog(() => {
      const newCategories = categories.filter(cat => cat !== categoryToDelete);
      const newProducts = products.map(product => 
        product.category === categoryToDelete 
          ? { ...product, category: '' }
          : product
      );
      
      setCategories(newCategories);
      setProductState(newProducts);
      showToast('Category deleted successfully', 'success');
    });
  };

  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <div className="text-red-500 p-4">
          <h2>Something went wrong:</h2>
          <pre>{error.message}</pre>
        </div>
      )}
    >
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
                <SearchBar 
                  value={searchTerm} 
                  onChange={setSearchTerm}
                  aria-label="Search products"
                />
                <CategoryFilter
                  categories={categories}
                  selected={filterCategory}
                  onChange={setFilterCategory}
                  aria-label="Filter by category"
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

        {/* Toast Container */}
        <div className="fixed bottom-4 right-4 space-y-2">
          {toasts.map(toast => (
            <Toast key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </div>

        {/* Confirmation Dialog */}
        {isConfirmDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-lg">
              <h2>Are you sure?</h2>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    confirmAction?.();
                    setIsConfirmDialogOpen(false);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsConfirmDialogOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </DndProvider>
    </ErrorBoundary>
  );
};

export default App;