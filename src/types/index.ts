export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPaid: number;
  lastVisit?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  service: string;
  price: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
}

export interface BusinessSettings {
  businessName: string;
  address: string;
  phone: string;
  email: string;
  workingHours: {
    monday: { start: string; end: string; closed: boolean };
    tuesday: { start: string; end: string; closed: boolean };
    wednesday: { start: string; end: string; closed: boolean };
    thursday: { start: string; end: string; closed: boolean };
    friday: { start: string; end: string; closed: boolean };
    saturday: { start: string; end: string; closed: boolean };
    sunday: { start: string; end: string; closed: boolean };
  };
}

export interface Activity {
  id: string;
  type: 'client' | 'transaction' | 'appointment' | 'inventory' | 'calculation';
  action: string;
  description: string;
  date: string;
  section: string;
}