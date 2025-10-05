import React, { useState } from 'react';
import { Appointment, Client } from '../types';

interface AppointmentSchedulerProps {
  appointments: Appointment[];
  clients: Client[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onUpdateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  onDeleteAppointment: (id: string) => void;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  appointments,
  clients,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    service: '',
    price: 0,
    notes: '',
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find(c => c.id === formData.clientId);
    if (selectedClient) {
      onAddAppointment({
        ...formData,
        clientName: selectedClient.name
      });
    }
    setFormData({
      clientId: '',
      clientName: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      service: '',
      price: 0,
      notes: '',
      status: 'scheduled'
    });
    setShowForm(false);
  };

  const updateStatus = (id: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    onUpdateAppointment(id, { status });
  };

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-allura text-4xl">Agenda y Calendario</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-midnight-blue-dark text-white px-4 py-2 font-medium hover:bg-midnight-blue transition-colors"
        >
          {showForm ? 'Cancelar' : 'Nueva Cita'}
        </button>
      </div>

      {showForm && (
        <div className="bg-midnight-blue-light p-6 shadow-sm">
          <h3 className="text-white text-xl font-medium mb-4">Nueva Cita</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Cliente
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white"
                required
              >
                <option value="">Seleccionar cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Servicio
              </label>
              <input
                type="text"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
                placeholder="Corte de cabello, afeitado, etc."
                required
              />
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Hora
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white"
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
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Notas
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
                placeholder="Notas adicionales..."
                rows={3}
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-midnight-blue-dark text-white px-4 py-2 font-medium hover:bg-midnight-blue transition-colors"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-midnight-blue text-white px-4 py-2 font-medium hover:bg-midnight-blue-dark transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Today's Appointments */}
      <div className="bg-forest-green-light p-6 shadow-sm">
        <h3 className="text-white text-xl font-medium mb-4">Citas de Hoy</h3>
        {todayAppointments.length === 0 ? (
          <p className="text-gray-100">No hay citas programadas para hoy.</p>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map(appointment => (
              <div key={appointment.id} className="border border-forest-green p-4 bg-forest-green">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-medium">{appointment.clientName}</h4>
                    <p className="text-gray-100">{appointment.service}</p>
                    <p className="text-gray-100 text-sm">{appointment.time}</p>
                    <p className="text-white font-bold">${appointment.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={appointment.status}
                      onChange={(e) => updateStatus(appointment.id, e.target.value as any)}
                      className="px-2 py-1 text-xs bg-midnight-blue-light text-white border border-midnight-blue"
                    >
                      <option value="scheduled">Programada</option>
                      <option value="completed">Completada</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Appointments */}
      <div className="bg-midnight-blue-light shadow-sm overflow-hidden">
        <h3 className="text-white text-xl font-medium p-4 border-b border-gray-400">
          Todas las Citas
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-midnight-blue-dark">
              <tr>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Cliente</th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Servicio</th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Fecha</th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Hora</th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Precio</th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Estado</th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice().reverse().map((appointment, index) => (
                <tr key={appointment.id} className={index % 2 === 0 ? 'bg-midnight-blue-light' : 'bg-midnight-blue'}>
                  <td className="px-4 py-3 text-white">{appointment.clientName}</td>
                  <td className="px-4 py-3 text-white">{appointment.service}</td>
                  <td className="px-4 py-3 text-white">{appointment.date}</td>
                  <td className="px-4 py-3 text-white">{appointment.time}</td>
                  <td className="px-4 py-3 text-white font-bold">${appointment.price}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 font-medium ${
                      appointment.status === 'completed' ? 'bg-midnight-blue-dark text-white' :
                      appointment.status === 'cancelled' ? 'bg-midnight-blue text-white' :
                      'bg-midnight-blue-light text-white'
                    }`}>
                      {appointment.status === 'scheduled' ? 'Programada' :
                       appointment.status === 'completed' ? 'Completada' : 'Cancelada'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onDeleteAppointment(appointment.id)}
                      className="text-gray-100 hover:text-white text-sm"
                    >
                      Eliminar
                    </button>
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

export default AppointmentScheduler;