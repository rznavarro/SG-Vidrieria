import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Calculator from './components/Calculator';
import ClientManagement from './components/ClientManagement';
import FinanceControl from './components/FinanceControl';
import AppointmentScheduler from './components/AppointmentScheduler';
import InventoryManagement from './components/InventoryManagement';
import Settings from './components/Settings';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Client, Transaction, Appointment, InventoryItem, BusinessSettings, Activity } from './types';

function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');
  
  const [clients, setClients] = useLocalStorage<Client[]>('barbershop_clients', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('barbershop_transactions', []);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('barbershop_appointments', []);
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('barbershop_inventory', []);
  const [settings, setSettings] = useLocalStorage<BusinessSettings>('barbershop_settings', {
    businessName: 'Benjamin Castro Barbershop',
    address: '',
    phone: '',
    email: '',
    workingHours: {
      monday: { start: '09:00', end: '18:00', closed: false },
      tuesday: { start: '09:00', end: '18:00', closed: false },
      wednesday: { start: '09:00', end: '18:00', closed: false },
      thursday: { start: '09:00', end: '18:00', closed: false },
      friday: { start: '09:00', end: '18:00', closed: false },
      saturday: { start: '09:00', end: '16:00', closed: false },
      sunday: { start: '10:00', end: '15:00', closed: true }
    }
  });
  const [activities, setActivities] = useLocalStorage<Activity[]>('barbershop_activities', []);

  // Client Management
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      id: Date.now().toString(),
      ...clientData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClients([...clients, newClient]);
    addActivity('client', 'creado', `Cliente ${clientData.name} agregado`, 'Clientes');
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients(clients.map(client => 
      client.id === id ? { ...client, ...clientData } : client
    ));
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
  };

  // Transaction Management
  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...transactionData
    };
    setTransactions([...transactions, newTransaction]);
    addActivity('transaction', transactionData.type === 'income' ? 'ingreso' : 'gasto',
               `${transactionData.description} - $${transactionData.amount}`, 'Finanzas');

    // If it's an income from a service, update client's total paid
    if (transactionData.type === 'income' && transactionData.category === 'service') {
      // This would typically be linked to a specific client
      // For now, we'll handle this in the appointment completion
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  // Appointment Management
  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...appointmentData
    };
    setAppointments([...appointments, newAppointment]);
    addActivity('appointment', 'creada', `Cita para ${appointmentData.clientName} - ${appointmentData.service}`, 'Agenda');
  };

  const updateAppointment = (id: string, appointmentData: Partial<Appointment>) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, ...appointmentData } : appointment
    ));

    // If appointment is being completed, add income and update client
    const appointment = appointments.find(a => a.id === id);
    if (appointment && appointmentData.status === 'completed') {
      addTransaction({
        type: 'income',
        amount: appointment.price,
        description: `${appointment.service} - ${appointment.clientName}`,
        category: 'service',
        date: new Date().toISOString().split('T')[0]
      });

      // Update client's total paid
      const client = clients.find(c => c.id === appointment.clientId);
      if (client) {
        updateClient(client.id, {
          totalPaid: client.totalPaid + appointment.price,
          lastVisit: new Date().toISOString().split('T')[0]
        });
      }
    }
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(appointment => appointment.id !== id));
  };

  // Inventory Management
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      ...itemData
    };
    setInventory([...inventory, newItem]);
    addActivity('inventory', 'agregado', `Producto ${itemData.name} agregado al inventario`, 'Inventario');
  };

  const updateInventoryItem = (id: string, itemData: Partial<InventoryItem>) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, ...itemData } : item
    ));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  // Activity logging
  const addActivity = (type: Activity['type'], action: string, description: string, section: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type,
      action,
      description,
      date: new Date().toISOString(),
      section
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50)); // Keep only last 50 activities
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'calcular':
        return <Calculator onAddClient={addClient} onAddActivity={addActivity} />;
      case 'clients':
        return (
          <ClientManagement
            clients={clients}
            onAddClient={addClient}
            onUpdateClient={updateClient}
            onDeleteClient={deleteClient}
          />
        );
      case 'finances':
        return (
          <FinanceControl
            transactions={transactions}
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        );
      case 'appointments':
        return (
          <AppointmentScheduler
            appointments={appointments}
            clients={clients}
            onAddAppointment={addAppointment}
            onUpdateAppointment={updateAppointment}
            onDeleteAppointment={deleteAppointment}
          />
        );
      case 'inventory':
        return (
          <InventoryManagement
            inventory={inventory}
            onAddItem={addInventoryItem}
            onUpdateItem={updateInventoryItem}
            onDeleteItem={deleteInventoryItem}
          />
        );
      case 'settings':
        return (
          <Settings
            settings={settings}
            onUpdateSettings={setSettings}
          />
        );
      default:
        return (
          <Dashboard
            clients={clients}
            transactions={transactions}
            appointments={appointments}
            inventory={inventory}
            activities={activities}
          />
        );
    }
  };

  return (
    <Layout currentSection={currentSection} onSectionChange={setCurrentSection}>
      {renderCurrentSection()}
    </Layout>
  );
}

export default App;