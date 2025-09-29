import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentSection, onSectionChange }) => {
  const sections = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'clients', label: 'Clientes' },
    { id: 'finances', label: 'Finanzas' },
    { id: 'appointments', label: 'Agenda' },
    { id: 'inventory', label: 'Inventario' },
    { id: 'settings', label: 'Configuración' }
  ];

  return (
    <div className="min-h-screen bg-forest-green">
      {/* Header */}
      <header className="bg-forest-green-dark p-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-white font-great-vibes text-3xl md:text-4xl text-center">
            Benjamin Castro
          </h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-forest-green-dark border-t border-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center md:justify-start gap-2 p-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  currentSection === section.id
                    ? 'bg-forest-green-light text-white'
                    : 'text-white hover:bg-forest-green'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;