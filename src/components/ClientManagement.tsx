import React, { useState } from 'react';
import { Client } from '../types';

interface ClientManagementProps {
  clients: Client[];
  onAddClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  onUpdateClient: (id: string, client: Partial<Client>) => void;
  onDeleteClient: (id: string) => void;
}

const ClientManagement: React.FC<ClientManagementProps> = ({
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    totalPaid: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      onUpdateClient(editingClient.id, formData);
      setEditingClient(null);
    } else {
      onAddClient(formData);
    }
    setFormData({ name: '', email: '', phone: '', totalPaid: 0 });
    setShowForm(false);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      totalPaid: client.totalPaid
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-allura text-4xl">Gestión de Clientes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-forest-green-light text-white px-4 py-2 font-medium hover:bg-forest-green transition-colors"
        >
          {showForm ? 'Cancelar' : 'Nuevo Cliente'}
        </button>
      </div>

      {showForm && (
        <div className="bg-forest-green-light p-6 shadow-sm">
          <h3 className="text-white text-xl font-medium mb-4">
            {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
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
                placeholder="Nombre completo"
                required
              />
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border border-forest-green bg-forest-green text-white placeholder-gray-300"
                placeholder="email@ejemplo.com"
                required
              />
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border border-forest-green bg-forest-green text-white placeholder-gray-300"
                placeholder="+1234567890"
                required
              />
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Total Pagado
              </label>
              <input
                type="number"
                value={formData.totalPaid}
                onChange={(e) => setFormData({ ...formData, totalPaid: Number(e.target.value) })}
                className="w-full p-2 border border-forest-green bg-forest-green text-white placeholder-gray-300"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-forest-green-dark text-white px-4 py-2 font-medium hover:bg-forest-green transition-colors"
              >
                {editingClient ? 'Actualizar' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingClient(null);
                  setFormData({ name: '', email: '', phone: '', totalPaid: 0 });
                }}
                className="bg-forest-green text-white px-4 py-2 font-medium hover:bg-forest-green-dark transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-forest-green-light shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-forest-green-dark">
              <tr>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Nombre</th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Teléfono</th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Total Pagado</th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={client.id} className={index % 2 === 0 ? 'bg-forest-green-light' : 'bg-forest-green'}>
                  <td className="px-4 py-3 text-white">{client.name}</td>
                  <td className="px-4 py-3 text-white">{client.email}</td>
                  <td className="px-4 py-3 text-white">{client.phone}</td>
                  <td className="px-4 py-3 text-white font-bold">${client.totalPaid}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-white hover:text-gray-100 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDeleteClient(client.id)}
                        className="text-gray-100 hover:text-white text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;