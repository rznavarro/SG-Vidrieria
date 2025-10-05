import React from 'react';
import { Client, Transaction, Appointment, Activity } from '../types';

interface DashboardProps {
  clients: Client[];
  transactions: Transaction[];
  appointments: Appointment[];
  inventory: any[];
  activities: Activity[];
}

const Dashboard: React.FC<DashboardProps> = ({ clients, transactions, appointments, inventory, activities }) => {
  const totalClients = clients.length;
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalProfit = totalIncome - totalExpenses;

  // Count total sales (number of income transactions)
  const totalSalesCount = transactions.filter(t => t.type === 'income').length;

  // Monthly calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyIncome = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'income' &&
             transactionDate.getMonth() === currentMonth &&
             transactionDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'expense' &&
             transactionDate.getMonth() === currentMonth &&
             transactionDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Low stock count (assuming stock level < 10 is low)
  const lowStockCount = inventory.filter(item => item.stock < 10).length;

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today && apt.status === 'scheduled';
  }).length;

  const metrics = [
    { label: 'Ganancias Totales', value: `$${totalProfit.toLocaleString()}` },
    { label: 'Gastos Totales', value: `$${totalExpenses.toLocaleString()}` },
    { label: 'Ventas Totales', value: totalSalesCount }
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
          <div key={index} className="bg-midnight-blue-light p-6 shadow-sm">
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
      <div className="bg-midnight-blue-light p-6 shadow-sm">
        <h3 className="text-white text-xl font-medium mb-4">
          Actividad Reciente
        </h3>
        <div className="space-y-3">
          {activities.slice(0, 3).map((activity) => (
            <div key={activity.id} className="flex justify-between items-center py-2 border-b border-midnight-blue">
              <div>
                <p className="text-white font-medium">{activity.description}</p>
                <p className="text-gray-100 text-sm">
                  {activity.section} • {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                activity.type === 'client' ? 'bg-green-600' :
                activity.type === 'transaction' ? 'bg-blue-600' :
                activity.type === 'appointment' ? 'bg-purple-600' :
                activity.type === 'inventory' ? 'bg-orange-600' :
                'bg-gray-600'
              } text-white`}>
                {activity.action}
              </span>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-gray-100 text-center py-4">No hay actividad reciente</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;