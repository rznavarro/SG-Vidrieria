import React, { useState } from 'react';
import { Client, Activity } from '../types';

interface CalculationRecord {
  id: string;
  name: string;
  cliente: string;
  ancho: number;
  alto: number;
  precioPorM2: number;
  manoDeObraAdicional: number;
  gananciaDeseada: number;
  fechaEntrega: string;
  resultado: {
    area: number;
    costoMateriales: number;
    manoDeObraAdicional: number;
    costoCompra: number;
    gananciaDeseada: number;
    ganancia: number;
    costoVenta: number;
  };
  fechaCreacion: string;
}

interface CalculatorProps {
  onAddClient?: (clientData: Omit<Client, 'id' | 'createdAt'>) => void;
  onAddActivity?: (type: Activity['type'], action: string, description: string, section: string) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onAddClient, onAddActivity }) => {
  const [formData, setFormData] = useState({
    cliente: 'juan',
    ancho: '1.2',
    alto: '1.8',
    precioPorM2: '12000',
    fechaEntrega: {
      year: '',
      month: '',
      day: '',
      time: ''
    },
    manoDeObraAdicional: '0',
    gananciaDeseada: '30'
  });

  const [resultado, setResultado] = useState<{
    area: number;
    costoMateriales: number;
    manoDeObraAdicional: number;
    costoCompra: number;
    gananciaDeseada: number;
    ganancia: number;
    costoVenta: number;
  } | null>(null);

  const [showGallery, setShowGallery] = useState(false);
  const [calculations, setCalculations] = useState<CalculationRecord[]>(() => {
    const saved = localStorage.getItem('barbershop_calculations');
    return saved ? JSON.parse(saved) : [];
  });

  // Generate year options (current year + next 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => (currentYear + i).toString());

  // Generate day options based on selected month and year
  const getDayOptions = (month: string, year: string) => {
    if (!month) return [];

    const monthNum = parseInt(month);
    const yearNum = parseInt(year) || currentYear;

    let daysInMonth = 31;

    if (monthNum === 2) { // February
      const isLeapYear = (yearNum % 4 === 0 && yearNum % 100 !== 0) || (yearNum % 400 === 0);
      daysInMonth = isLeapYear ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(monthNum)) { // April, June, September, November
      daysInMonth = 30;
    }

    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
  };

  const dayOptions = getDayOptions(formData.fechaEntrega.month, formData.fechaEntrega.year);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('fechaEntrega.')) {
      const field = name.split('.')[1];
      setFormData(prev => {
        const newFechaEntrega = {
          ...prev.fechaEntrega,
          [field]: value
        };

        // Reset day if month or year changes to avoid invalid dates
        if (field === 'month' || field === 'year') {
          newFechaEntrega.day = '';
        }

        return {
          ...prev,
          fechaEntrega: newFechaEntrega
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const saveCalculation = (resultadoCalculado: any) => {
    const newCalculation: CalculationRecord = {
      id: Date.now().toString(),
      name: `Cálculo ${calculations.length + 1}`,
      cliente: formData.cliente,
      ancho: parseFloat(formData.ancho),
      alto: parseFloat(formData.alto),
      precioPorM2: parseFloat(formData.precioPorM2),
      manoDeObraAdicional: parseFloat(formData.manoDeObraAdicional) || 0,
      gananciaDeseada: parseFloat(formData.gananciaDeseada) || 0,
      fechaEntrega: `${formData.fechaEntrega.year}-${formData.fechaEntrega.month}-${formData.fechaEntrega.day}`,
      resultado: resultadoCalculado,
      fechaCreacion: new Date().toISOString()
    };

    const updatedCalculations = [...calculations, newCalculation];
    setCalculations(updatedCalculations);
    localStorage.setItem('barbershop_calculations', JSON.stringify(updatedCalculations));
  };

  const deleteCalculation = (id: string) => {
    const updatedCalculations = calculations.filter(calc => calc.id !== id);
    setCalculations(updatedCalculations);
    localStorage.setItem('barbershop_calculations', JSON.stringify(updatedCalculations));
  };

  const updateCalculationName = (id: string, newName: string) => {
    const updatedCalculations = calculations.map(calc =>
      calc.id === id ? { ...calc, name: newName } : calc
    );
    setCalculations(updatedCalculations);
    localStorage.setItem('barbershop_calculations', JSON.stringify(updatedCalculations));
  };

  const downloadAsPDF = (calculation: CalculationRecord) => {
    // Simple text-based PDF generation (in a real app, you'd use a proper PDF library)
    const content = `
CÁLCULO DE VENTANAL
===================

Nombre: ${calculation.name}
Cliente: ${calculation.cliente}
Fecha: ${new Date(calculation.fechaCreacion).toLocaleDateString()}

ESPECIFICACIONES:
- Ancho: ${calculation.ancho} m
- Alto: ${calculation.alto} m
- Área: ${calculation.resultado.area} m²
- Precio por m²: $${calculation.precioPorM2.toLocaleString()}
- Mano de obra adicional: $${calculation.manoDeObraAdicional.toLocaleString()}

RESULTADOS:
- Coste de compra: $${calculation.resultado.costoCompra.toLocaleString()}
- Ganancia deseada (${calculation.gananciaDeseada}%): $${calculation.resultado.ganancia.toLocaleString()}
- Coste de venta: $${calculation.resultado.costoVenta.toLocaleString()}

Generado por Vortexia
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${calculation.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    if (calculations.length === 0) {
      alert('No hay cálculos para exportar.');
      return;
    }

    // Create CSV headers
    const headers = [
      'Nombre',
      'Cliente',
      'Metros Cuadrados',
      'Coste de Compra',
      'Coste de Venta',
      'Ganancia Deseada (%)',
      'Ganancia Deseada ($)',
      'Fecha de Creación'
    ];

    // Create CSV rows
    const rows = calculations.map(calc => [
      calc.name,
      calc.cliente,
      calc.resultado.area,
      calc.resultado.costoCompra,
      calc.resultado.costoVenta,
      calc.resultado.gananciaDeseada,
      calc.resultado.ganancia,
      new Date(calc.fechaCreacion).toLocaleDateString()
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculos_ventanales_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Log activity
    if (onAddActivity) {
      onAddActivity('calculation', 'exportado', `Exportados ${calculations.length} cálculos a CSV`, 'Calcular');
    }
  };

  const calcularTotal = () => {
    const ancho = parseFloat(formData.ancho);
    const alto = parseFloat(formData.alto);
    const precioM2 = parseFloat(formData.precioPorM2);
    const manoDeObraAdicional = parseFloat(formData.manoDeObraAdicional) || 0;
    const gananciaDeseada = parseFloat(formData.gananciaDeseada) || 0;

    if (ancho && alto && precioM2) {
      const area = ancho * alto;
      const costoMateriales = area * precioM2;
      const costoCompra = costoMateriales + manoDeObraAdicional;
      const ganancia = (costoCompra * gananciaDeseada) / 100;
      const costoVenta = costoCompra + ganancia;

      const resultadoCalculado = {
        area,
        costoMateriales,
        manoDeObraAdicional,
        costoCompra,
        gananciaDeseada,
        ganancia,
        costoVenta
      };

      setResultado(resultadoCalculado);
      saveCalculation(resultadoCalculado); // Save every calculation

      // Log activity
      if (onAddActivity) {
        onAddActivity('calculation', 'calculado', `Cálculo de ventanal para ${formData.cliente} - $${resultadoCalculado.costoVenta.toLocaleString()}`, 'Calcular');
      }

      return resultadoCalculado;
    }
    return null;
  };

  const calcularTotalYCrearCliente = () => {
    // First calculate and get result
    const resultadoCalculado = calcularTotal();

    if (resultadoCalculado) {
      // Save the calculation
      saveCalculation(resultadoCalculado);

      // Then create client if cliente name is valid
      if (onAddClient && formData.cliente.trim() !== '') {
        const nuevoCliente: Omit<Client, 'id' | 'createdAt'> = {
          name: formData.cliente.trim(),
          email: '',
          phone: '',
          totalPaid: resultadoCalculado.costoVenta, // Coste de venta como total pagado (cliente potencial)
          lastVisit: new Date().toISOString().split('T')[0]
        };

        onAddClient(nuevoCliente);
        alert(`Cliente potencial "${formData.cliente.trim()}" creado exitosamente con presupuesto de $${resultadoCalculado.costoVenta.toLocaleString()}.\n\nEl cliente ahora aparece en la sección de Clientes.`);
      } else {
        alert('Error: Debe ingresar un nombre de cliente válido.');
      }
    } else {
      alert('Error: Complete todos los campos requeridos para el cálculo.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-white font-allura text-4xl">Especificaciones del Ventanal</h2>

      <div className="bg-midnight-blue-light p-6 shadow-sm">
        <form className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Cliente
            </label>
            <input
              type="text"
              name="cliente"
              value={formData.cliente}
              onChange={handleInputChange}
              className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
              placeholder="Nombre del cliente"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-1">
                Ancho (metros) *
              </label>
              <input
                type="number"
                name="ancho"
                value={formData.ancho}
                onChange={handleInputChange}
                step="0.1"
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-1">
                Alto (metros) *
              </label>
              <input
                type="number"
                name="alto"
                value={formData.alto}
                onChange={handleInputChange}
                step="0.1"
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Precio por m² ($) *
            </label>
            <input
              type="number"
              name="precioPorM2"
              value={formData.precioPorM2}
              onChange={handleInputChange}
              className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-3">
              Fecha de Entrega
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-white text-xs mb-1">Año</label>
                <select
                  name="fechaEntrega.year"
                  value={formData.fechaEntrega.year}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white text-sm"
                >
                  <option value="">Seleccionar</option>
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white text-xs mb-1">Mes</label>
                <select
                  name="fechaEntrega.month"
                  value={formData.fechaEntrega.month}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white text-sm"
                >
                  <option value="">Seleccionar</option>
                  <option value="01">Enero</option>
                  <option value="02">Febrero</option>
                  <option value="03">Marzo</option>
                  <option value="04">Abril</option>
                  <option value="05">Mayo</option>
                  <option value="06">Junio</option>
                  <option value="07">Julio</option>
                  <option value="08">Agosto</option>
                  <option value="09">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
              </div>
              <div>
                <label className="block text-white text-xs mb-1">Día</label>
                <select
                  name="fechaEntrega.day"
                  value={formData.fechaEntrega.day}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white text-sm"
                  disabled={!formData.fechaEntrega.month}
                >
                  <option value="">Seleccionar</option>
                  {dayOptions.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white text-xs mb-1">Hora</label>
                <input
                  type="time"
                  name="fechaEntrega.time"
                  value={formData.fechaEntrega.time}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Mano de Obra Adicional ($)
            </label>
            <input
              type="number"
              name="manoDeObraAdicional"
              value={formData.manoDeObraAdicional}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
            />
            <p className="text-midnight-blue-light text-xs mt-1">Opcional: costo adicional de instalación</p>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Ganancia Deseada (%)
            </label>
            <input
              type="number"
              name="gananciaDeseada"
              value={formData.gananciaDeseada}
              onChange={handleInputChange}
              placeholder="30"
              min="0"
              max="500"
              className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
            />
            <p className="text-midnight-blue-light text-xs mt-1">Porcentaje de ganancia deseada sobre el costo</p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              type="button"
              onClick={calcularTotal}
              className="bg-midnight-blue-dark text-white px-6 py-3 font-medium hover:bg-midnight-blue transition-colors"
            >
              Calcular Total
            </button>
            <button
              type="button"
              onClick={calcularTotalYCrearCliente}
              className="bg-midnight-blue-dark text-white px-6 py-3 font-medium hover:bg-midnight-blue transition-colors"
            >
              Calcular Total + Crear Cliente
            </button>
            <button
              type="button"
              onClick={() => setShowGallery(true)}
              className="bg-midnight-blue-dark text-white px-6 py-3 font-medium hover:bg-midnight-blue transition-colors"
            >
              Ver Cálculos
            </button>
          </div>
        </form>

        {resultado !== null && (
          <div className="mt-6 p-4 bg-midnight-blue border border-midnight-blue-light">
            <h3 className="text-white text-lg font-medium mb-4">Resultado del Cálculo</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white">Coste de compra:</span>
                <span className="text-white font-semibold">${resultado.costoCompra.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Ganancia deseada ({resultado.gananciaDeseada}%):</span>
                <span className="text-white font-semibold">${resultado.ganancia.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span className="text-white">Coste de venta:</span>
                <span className="text-white">${resultado.costoVenta.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calculations Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-midnight-blue-light max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-xl">
            <div className="p-6 border-b border-midnight-blue">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h2 className="text-white text-2xl font-allura">Galería de Cálculos</h2>
                  {calculations.length > 0 && (
                    <button
                      onClick={exportToCSV}
                      className="bg-midnight-blue-dark text-white px-4 py-2 font-medium hover:bg-midnight-blue transition-colors flex items-center gap-2 text-sm"
                    >
                      📊 Exportar a CSV
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setShowGallery(false)}
                  className="text-white hover:text-midnight-blue-light text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {calculations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white text-lg">No hay cálculos guardados aún.</p>
                  <p className="text-midnight-blue-light">Realiza tu primer cálculo para verlo aquí.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-midnight-blue-dark">
                      <tr>
                        <th className="px-4 py-3 text-left text-white text-sm font-medium">Nombre</th>
                        <th className="px-4 py-3 text-left text-white text-sm font-medium">Metros Cuadrados</th>
                        <th className="px-4 py-3 text-left text-white text-sm font-medium">Coste de Compra</th>
                        <th className="px-4 py-3 text-left text-white text-sm font-medium">Coste de Venta</th>
                        <th className="px-4 py-3 text-left text-white text-sm font-medium">Ganancia Deseada (%)</th>
                        <th className="px-4 py-3 text-left text-white text-sm font-medium">Ganancia Deseada ($)</th>
                        <th className="px-4 py-3 text-left text-white text-sm font-medium">Fecha de Creación</th>
                        <th className="px-4 py-3 text-left text-white text-sm font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculations.map((calc, index) => (
                        <tr key={calc.id} className={index % 2 === 0 ? 'bg-midnight-blue-light' : 'bg-midnight-blue'}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={calc.name}
                              onChange={(e) => updateCalculationName(calc.id, e.target.value)}
                              className="w-full bg-transparent text-white px-2 py-1 text-sm border border-midnight-blue focus:border-white"
                            />
                          </td>
                          <td className="px-4 py-3 text-white">{calc.resultado.area} m²</td>
                          <td className="px-4 py-3 text-white">${calc.resultado.costoCompra.toLocaleString()}</td>
                          <td className="px-4 py-3 text-white font-bold">${calc.resultado.costoVenta.toLocaleString()}</td>
                          <td className="px-4 py-3 text-white">{calc.resultado.gananciaDeseada}%</td>
                          <td className="px-4 py-3 text-white">${calc.resultado.ganancia.toLocaleString()}</td>
                          <td className="px-4 py-3 text-white text-sm">
                            {new Date(calc.fechaCreacion).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => downloadAsPDF(calc)}
                                className="bg-midnight-blue-dark text-white py-1 px-2 text-xs font-medium hover:bg-midnight-blue transition-colors"
                              >
                                📄 PDF
                              </button>
                              <button
                                onClick={() => deleteCalculation(calc.id)}
                                className="bg-midnight-blue text-white py-1 px-2 text-xs font-medium hover:bg-midnight-blue-dark transition-colors"
                              >
                                🗑️ Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;