import React from 'react';
import { Client, Transaction, Appointment } from '../types';

interface DashboardProps {
  clients: Client[];
  transactions: Transaction[];
  appointments: Appointment[];
}

const Dashboard: React.FC<DashboardProps> = ({ clients, transactions, appointments }) => {
  const totalClients = clients.length;
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalProfit = totalIncome - totalExpenses;

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today && apt.status === 'scheduled';
  }).length;

  const metrics = [
    { label: 'Total Clientes', value: totalClients },
    { label: 'Ingresos Totales', value: `$${totalIncome.toLocaleString()}` },
    { label: 'Gastos Totales', value: `$${totalExpenses.toLocaleString()}` },
    { label: 'Ganancia Total', value: `$${totalProfit.toLocaleString()}` },
    { label: 'Citas Hoy', value: todayAppointments }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-white font-allura text-4xl md:text-5xl mb-2">
          Dashboard Principal
        </h2>
        <p className="text-gray-300 text-lg">Vista general de tu negocio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-forest-green-light p-6 shadow-sm">
            <h3 className="text-gray-100 text-sm font-medium mb-2">
              {metric.label}
            </h3>
            <p className="text-white text-3xl font-bold">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-forest-green-light p-6 shadow-sm">
        <h3 className="text-white text-xl font-medium mb-4">
          Actividad Reciente
        </h3>
        <div className="space-y-3">
          {transactions.slice(-5).reverse().map((transaction) => (
            <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-forest-green">
              <div>
                <p className="text-white font-medium">{transaction.description}</p>
                <p className="text-gray-100 text-sm">{transaction.date}</p>
              </div>
              <p className={`text-white font-bold ${
                transaction.type === 'income' ? 'text-white' : 'text-gray-100'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;