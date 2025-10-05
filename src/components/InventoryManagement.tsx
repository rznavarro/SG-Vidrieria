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
    price: '',
    quantity: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      quantity: parseInt(formData.quantity) || 0
    };

    if (editingItem) {
      onUpdateItem(editingItem.id, submitData);
      setEditingItem(null);
    } else {
      onAddItem(submitData);
    }
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: ''
    });
    setShowForm(false);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      quantity: item.quantity.toString()
    });
    setShowForm(true);
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-allura text-4xl">Inventario</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-midnight-blue-dark text-white px-4 py-2 font-medium hover:bg-midnight-blue transition-colors"
        >
          {showForm ? 'Cancelar' : 'Nuevo Producto'}
        </button>
      </div>

      {showForm && (
        <div className="bg-midnight-blue-light p-6 shadow-sm">
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
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
                placeholder="Nombre del producto"
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
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
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
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
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
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
                placeholder="Descripción del producto..."
                rows={3}
                required
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-midnight-blue-dark text-white px-4 py-2 font-medium hover:bg-midnight-blue transition-colors"
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
                    price: '',
                    quantity: ''
                  });
                }}
                className="bg-midnight-blue text-white px-4 py-2 font-medium hover:bg-midnight-blue-dark transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}


      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map(item => (
          <div key={item.id} className="bg-midnight-blue-light shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="mb-2">
                <h3 className="text-white font-medium text-lg">{item.name}</h3>
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