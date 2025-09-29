import React, { useState } from 'react';
import { BusinessSettings } from '../types';

interface SettingsProps {
  settings: BusinessSettings;
  onUpdateSettings: (settings: BusinessSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-white font-allura text-4xl">Configuración</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <div className="bg-forest-green-light p-6 shadow-sm">
          <h3 className="text-white text-xl font-medium mb-4">Información del Negocio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Nombre del Negocio
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full p-2 border border-forest-green bg-forest-green text-white placeholder-gray-300"
                placeholder="Benjamin Castro Barbershop"
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
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border border-forest-green bg-forest-green text-white placeholder-gray-300"
                placeholder="contact@benjamincastro.com"
                required
              />
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 border border-forest-green bg-forest-green text-white placeholder-gray-300"
                placeholder="123 Main Street, Ciudad"
                required
              />
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-forest-green-light p-6 shadow-sm">
          <h3 className="text-white text-xl font-medium mb-4">Horarios de Trabajo</h3>
          <div className="space-y-4">
            {daysOfWeek.map(day => (
              <div key={day.key} className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="md:w-32">
                  <span className="text-gray-100 font-medium">{day.label}</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.workingHours[day.key as keyof typeof formData.workingHours].closed}
                      onChange={(e) => setFormData({
                        ...formData,
                        workingHours: {
                          ...formData.workingHours,
                          [day.key]: {
                            ...formData.workingHours[day.key as keyof typeof formData.workingHours],
                            closed: e.target.checked
                          }
                        }
                      })}
                      className="mr-2 bg-forest-green border-gray-300"
                    />
                    <span className="text-gray-100 text-sm">Cerrado</span>
                  </label>
                  {!formData.workingHours[day.key as keyof typeof formData.workingHours].closed && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={formData.workingHours[day.key as keyof typeof formData.workingHours].start}
                        onChange={(e) => setFormData({
                          ...formData,
                          workingHours: {
                            ...formData.workingHours,
                            [day.key]: {
                              ...formData.workingHours[day.key as keyof typeof formData.workingHours],
                              start: e.target.value
                            }
                          }
                        })}
                        className="p-1 border border-forest-green bg-forest-green text-white text-sm"
                      />
                      <span className="text-gray-100">a</span>
                      <input
                        type="time"
                        value={formData.workingHours[day.key as keyof typeof formData.workingHours].end}
                        onChange={(e) => setFormData({
                          ...formData,
                          workingHours: {
                            ...formData.workingHours,
                            [day.key]: {
                              ...formData.workingHours[day.key as keyof typeof formData.workingHours],
                              end: e.target.value
                            }
                          }
                        })}
                        className="p-1 border border-forest-green bg-forest-green text-white text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-forest-green-dark text-white px-6 py-3 font-medium hover:bg-forest-green transition-colors"
        >
          Guardar Configuración
        </button>
      </form>
    </div>
  );
};

export default Settings;