import React, { useState } from 'react';
import { Transaction } from '../types';

interface FinanceControlProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
}

const FinanceControl: React.FC<FinanceControlProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    amount: 0,
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = totalIncome - totalExpenses;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction(formData);
    setFormData({
      type: 'income',
      amount: 0,
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-allura text-4xl">Control Financiero</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-midnight-blue-dark text-white px-4 py-2 font-medium hover:bg-midnight-blue transition-colors"
        >
          {showForm ? 'Cancelar' : 'Nueva Transacción'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-midnight-blue-light p-6 shadow-sm">
          <h3 className="text-gray-100 text-sm font-medium mb-2">Ingresos Totales</h3>
          <p className="text-white text-3xl font-bold">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-midnight-blue-light p-6 shadow-sm">
          <h3 className="text-gray-100 text-sm font-medium mb-2">Gastos Totales</h3>
          <p className="text-white text-3xl font-bold">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-midnight-blue-light p-6 shadow-sm">
          <h3 className="text-gray-100 text-sm font-medium mb-2">Ganancia</h3>
          <p className={`text-3xl font-bold ${profit >= 0 ? 'text-white' : 'text-gray-100'}`}>
            ${profit.toLocaleString()}
          </p>
        </div>
      </div>

      {showForm && (
        <div className="bg-midnight-blue-light p-6 shadow-sm">
          <h3 className="text-white text-xl font-medium mb-4">Nueva Transacción</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white"
                required
              >
                <option value="income">Ingreso</option>
                <option value="expense">Gasto</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Monto
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-gray-100 text-sm font-medium mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
                placeholder="Descripción de la transacción"
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
                className="w-full p-2 border border-midnight-blue bg-midnight-blue text-white placeholder-midnight-blue-light"
                placeholder="Categoría"
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

      {/* Transactions List */}
      <div className="bg-midnight-blue-light shadow-sm overflow-hidden">
        <h3 className="text-white text-xl font-medium p-4 border-b border-gray-400">
          Transacciones Recientes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-midnight-blue-dark">
              <tr>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Fecha</th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Tipo</th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Descripción</th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Categoría</th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Monto</th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice().reverse().map((transaction, index) => (
                <tr key={transaction.id} className={index % 2 === 0 ? 'bg-midnight-blue-light' : 'bg-midnight-blue'}>
                  <td className="px-4 py-3 text-white">{transaction.date}</td>
                  <td className="px-4 py-3">
                    <span className={`text-white font-medium ${
                      transaction.type === 'income' ? 'text-white' : 'text-gray-100'
                    }`}>
                      {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white">{transaction.description}</td>
                  <td className="px-4 py-3 text-white">{transaction.category}</td>
                  <td className="px-4 py-3 text-white font-bold">
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onDeleteTransaction(transaction.id)}
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

export default FinanceControl;