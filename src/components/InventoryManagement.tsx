import React, { useState } from 'react';
import { InventoryItem } from '../types';

interface InventoryManagementProps {
  inventory: InventoryItem[];
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdateItem: (id: string, item: Partial<InventoryItem>) => void;
  onDeleteItem: (id: string) => void;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({
  inventory,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category: '',
    imageUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdateItem(editingItem.id, formData);
      setEditingItem(null);
    } else {
      onAddItem(formData);
    }
    setFormData({
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      category: '',
      imageUrl: ''
    });
    setShowForm(false);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
      category: item.category,
      imageUrl: item.imageUrl || ''
    });
    setShowForm(true);
  };

  const categories = [...new Set(inventory.map(item => item.category))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-allura text-4xl">Inventario</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-forest-green-light text-white px-4 py-2 font-medium hover:bg-forest-green transition-colors"
        >
          {showForm ? 'Cancelar' : 'Nuevo Producto'}
        </button>
      </div>

      {showForm && (
        <div className="bg-forest-green-light p-6 shadow-sm">
          <h3 className="text-white text-xl font-medium mb-4">
            {editingItem ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-forest-green bg-forest-green text-white placeholder-gray-300"
                placeholder="Nombre del producto"
                required
              />
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Categoría
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border border-forest-green bg-forest-green text-white placeholder-gray-300"
                placeholder="Herramientas, Productos, etc."
                required
              />
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Precio
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full p-2 border border-forest-green bg-forest-green text-white placeholder-gray-300"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Cantidad
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full p-2 border border-forest-green bg-forest-green text-white placeholder-gray-300"
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-forest-green bg-forest-green text-white placeholder-gray-300"
                placeholder="Descripción del producto..."
                rows={3}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-100 text-sm font-medium mb-1">
                URL de Imagen (Opcional)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full p-2 border border-forest-green bg-forest-green text-white placeholder-gray-300"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-forest-green-dark text-white px-4 py-2 font-medium hover:bg-forest-green transition-colors"
              >
                {editingItem ? 'Actualizar' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  setFormData({
                    name: '',
                    description: '',
                    price: 0,
                    quantity: 0,
                    category: '',
                    imageUrl: ''
                  });
                }}
                className="bg-forest-green text-white px-4 py-2 font-medium hover:bg-forest-green-dark transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Summary by Category */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => {
            const categoryItems = inventory.filter(item => item.category === category);
            const totalValue = categoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            return (
              <div key={category} className="bg-forest-green-light p-4 shadow-sm">
                <h3 className="text-white font-medium text-lg">{category}</h3>
                <p className="text-gray-100 text-sm">{categoryItems.length} productos</p>
                <p className="text-white font-bold">${totalValue.toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map(item => (
          <div key={item.id} className="bg-forest-green-light shadow-sm overflow-hidden">
            {item.imageUrl && (
              <div className="h-48 bg-forest-green flex items-center justify-center">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-medium text-lg">{item.name}</h3>
                <span className="text-gray-100 text-sm bg-forest-green px-2 py-1">
                  {item.category}
                </span>
              </div>
              <p className="text-gray-100 text-sm mb-3">{item.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-bold text-xl">${item.price}</span>
                <span className="text-gray-100">Cantidad: {item.quantity}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-forest-green-dark text-white py-2 px-3 text-sm font-medium hover:bg-forest-green transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="flex-1 bg-forest-green text-white py-2 px-3 text-sm font-medium hover:bg-forest-green-dark transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {inventory.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-100 text-lg">No hay productos en el inventario.</p>
          <p className="text-gray-100">Comienza agregando tus herramientas y productos.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;