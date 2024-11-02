import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ProductItem = ({ product, index, onDelete, onMove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'PRODUCT',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'PRODUCT',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        onMove(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`p-3 border rounded mb-2 ${
        isDragging ? 'opacity-50' : ''
      } hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center`}
    >
      <div>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Category: {product.category}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Quantity: {product.quantity}
        </p>
      </div>
      <button
        onClick={() => onDelete(product.id)}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
};

export const ProductList = ({ products, onDelete, onMove }) => {
  return (
    <div className="mt-4">
      {products.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No products found</p>
      ) : (
        products.map((product, index) => (
          <ProductItem
            key={product.id}
            product={product}
            index={index}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))
      )}
    </div>
  );
}; 