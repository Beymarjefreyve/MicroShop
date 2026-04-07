# Módulo de Administración - MicroShop

## Rutas disponibles

- `/admin/dashboard` - Panel principal con estadísticas y gráficos
- `/admin/users` - Gestión de usuarios (cambiar roles, activar/desactivar)
- `/admin/orders` - Gestión de pedidos con drawer de detalles y exportación CSV
- `/admin/incidents` - Gestión de incidencias con observaciones
- `/admin/inventory` - Gestión de inventario con edición inline de stock

## Acceso rápido

Desde el menú de usuario en el Navbar, selecciona "🔧 Panel Admin" para acceder al dashboard.

## Características implementadas

### Dashboard
- 4 tarjetas de estadísticas (ventas, pedidos, usuarios, incidencias)
- Gráfico de barras SVG con ventas de últimos 6 meses
- Tablas de últimos 5 pedidos y usuarios recientes

### Usuarios
- Búsqueda por nombre o email
- Filtro por rol (Comprador, Vendedor, Admin)
- Editar rol con modal
- Activar/desactivar usuarios con toggle
- Badges de rol y estado con colores

### Pedidos
- Filtros por estado y rango de fechas
- Drawer lateral derecho con detalle completo del pedido
- Exportación a CSV
- 15 pedidos mock precargados

### Incidencias
- 6 incidencias mock con diferentes estados
- Cards organizadas por estado (abiertas, en revisión, resueltas)
- Modal de observaciones con historial
- Acciones: cancelar pedido, marcar resuelta, agregar observación
- Notificaciones toast con animación

### Inventario
- Edición inline de stock (click para editar, Enter para guardar, Escape para cancelar)
- Búsqueda por nombre de producto
- Filtro por categoría
- Badges de estado según stock (sin stock, stock bajo, en stock)
- Estadísticas: total productos, alertas de stock, valor total

## Datos mock

- `src/app/data/adminUsers.ts` - 10 usuarios
- `src/app/data/adminOrders.ts` - 15 pedidos
- `src/app/data/incidents.ts` - 6 incidencias
- Reutiliza `src/app/data/products.ts` para inventario

## Sistema de diseño

Mantiene consistencia con el resto de la aplicación:
- Color primario: azul #2563EB
- Textos: #111827 (primario), #6B7280 (secundario)
- Bordes: #E5E7EB
- Sombras: shadow-md
- Bordes redondeados: rounded-xl en cards, rounded-lg en botones
- Preparado para dark mode

## Navegación

El sidebar fijo izquierdo (240px) contiene:
- Dashboard 📊
- Usuarios 👥
- Pedidos 📦
- Incidencias ⚠️
- Inventario 📋

Item activo con fondo azul y texto blanco.
