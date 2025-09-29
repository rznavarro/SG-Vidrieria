# 🍀 Barber.Computer - SaaS para Peluquerías

Un sistema completo de gestión para peluquerías desarrollado en React + TypeScript que facilita la administración de clientes, citas, finanzas e inventario.

## ✨ Características

### 🧔 Gestión de Clientes
- Registro completo de información de clientes
- Historial de visitas y servicios realizados
- Seguimiento de monto total pagado
- Contactos y preferencias

### 📅 Programador de Citas
- Agenda visual intuitiva
- Manejo de reservas y cancelaciones
- Confirmación automática de citas
- Recordatorios de citas

### 💰 Control Financiero
- Registro de ingresos y egresos
- Reportes por período
- Categorización de transacciones
- Balance financiero

### 📦 Gestión de Inventario
- Control de productos disponibles
- Alertas de stock mínimo
- Registro de proveedores
- Control de costos

### ⚙️ Configuraciones
- Información del negocio
- Horarios de atención
- Contactos y ubicación
- Personalización de servicios

## 🚀 Tecnologías Utilizadas

- **Frontend:** React + TypeScript
- **Estilos:** TailwindCSS
- **Persistencia:** localStorage
- **Iconos:** Lucide React
- **Build:** Vite
- **Tipado:** TypeScript

## 🛠️ Instalación

1. Clona este repositorio:
```bash
git clone https://github.com/rznavarro/Barber.Computer.git
cd Barber.Computer
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el proyecto en modo desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## 📋 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye el proyecto para producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecuta el linter de código
- `npm run typecheck` - Verifica los tipos de TypeScript

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── Layout.tsx       # Layout principal
│   ├── Dashboard.tsx    # Dashboard principal
│   ├── ClientManagement.tsx
│   ├── AppointmentScheduler.tsx
│   ├── FinanceControl.tsx
│   ├── InventoryManagement.tsx
│   └── Settings.tsx
├── hooks/               # Custom hooks
│   └── useLocalStorage.ts
├── types/               # Definiciones TypeScript
│   └── index.ts
├── App.tsx              # App principal
└── main.tsx             # Punto de entrada
```

## 🎯 Funcionalidades Clave

### Panel de Control
- Métricas en tiempo real
- Resumen financiero
- Calendario de citas
- Alertas importantes

### Gestión Inteligente
- Búsqueda y filtrado de datos
- Formularios intuitivos
- Validaciones en tiempo real
- Interfaz responsiva

### Persistencia de Datos
- localStorage para almacenar datos localmente
- Estructura de datos optimizada
- Backup automático

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un issue primero para discutir cambios mayores.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

---

*Creado con ❤️ para facilitar la gestión de peluquerías*
