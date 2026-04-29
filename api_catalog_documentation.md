# Documentación de API - Catalog Service

Esta guía detalla todos los endpoints, estructuras JSON y parámetros necesarios para que el frontend pueda consumir el microservicio `catalog-service`.

## Información Base
- **Base URL:** `http://localhost:8002/api`
- **Formato de Datos:** JSON
- **Autenticación:** Por el momento, el microservicio espera el `seller_id` o `user_id` en el cuerpo de las peticiones (POST/PUT), aunque en producción esto se manejaría vía JWT.

---

## 1. Productos (`/products/`)

Maneja el catálogo de productos.

### Listar Productos
- **Endpoint:** `GET /api/products/`
- **Paginación:** Devuelve 10 resultados por página. Use el parámetro `page` (ej: `?page=2`).
- **Filtros disponibles:**
  - `category`: ID de la categoría.
  - `price`: Precio exacto.
  - `seller_id`: ID del vendedor.
- **Búsqueda:** `search` (busca en nombre y descripción).
- **Ordenamiento:** `ordering` (campos: `price`, `created_at`).
- **Respuesta (Paginada):**
```json
{
  "count": 100,
  "next": "http://localhost:8001/api/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Producto Ejemplo",
      "description": "Descripción detallada",
      "price": "99.99",
      "stock": 10,
      "category": 1,
      "category_name": "Electrónica",
      "seller_id": 5,
      "average_rating": 4.5,
      "reviews": [...],
      "created_at": "2024-04-29T10:00:00Z",
      "updated_at": "2024-04-29T10:30:00Z"
    }
  ]
}
```


### Crear Producto
- **Endpoint:** `POST /api/products/`
- **Cuerpo (JSON):**
```json
{
  "name": "Nuevo Producto",
  "description": "Descripción",
  "price": 45.50,
  "stock": 50,
  "category": 1,
  "seller_id": 5
}
```

### Detalle de Producto
- **Endpoint:** `GET /api/products/{id}/`

### Calificar Producto (Crear Reseña)
- **Endpoint:** `POST /api/products/{id}/rate/`
- **Cuerpo (JSON):**
```json
{
  "user_id": 10,
  "rating": 5,
  "comment": "Excelente producto, muy recomendado."
}
```

---

## 2. Categorías (`/categories/`)

Maneja la clasificación de los productos.

### Listar Categorías
- **Endpoint:** `GET /api/categories/`
- **Paginación:** Devuelve 10 resultados por página.
- **Respuesta (Paginada):**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Electrónica",
      "slug": "electronica"
    }
  ]
}
```

### Crear Categoría
- **Endpoint:** `POST /api/categories/`
- **Cuerpo (JSON):**
```json
{
  "name": "Ropa",
  "slug": "ropa"
}
```

---

## 3. Reseñas (`/reviews/`)

Endpoints directos para manejar reseñas individuales.

### Listar Reseñas
- **Endpoint:** `GET /api/reviews/`
- **Paginación:** Devuelve 10 resultados por página.
- **Respuesta (Paginada):**
```json
{
  "count": 20,
  "next": "http://localhost:8001/api/reviews/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "product": 1,
      "user_id": 10,
      "rating": 5,
      "comment": "Excelente",
      "created_at": "..."
    }
  ]
}
```

### Crear Reseña Directa
- **Endpoint:** `POST /api/reviews/`
- **Cuerpo (JSON):**
```json
{
  "product": 1,
  "user_id": 10,
  "rating": 4,
  "comment": "Buen producto"
}
```

---

## Tipos de Datos y Validaciones

| Campo | Tipo | Notas |
| :--- | :--- | :--- |
| `price` | Decimal | Formato string en la respuesta, número en la petición. |
| `stock` | Integer | Mínimo 0. |
| `rating` | Integer | Rango de 1 a 5. |
| `seller_id` / `user_id` | Integer | ID de referencia del usuario. |
| `category` | Integer | ID (FK) de la categoría existente. |

---

## Ejemplo de Consumo en React (Vite)

```typescript
const fetchProducts = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/products/`);
  const data = await response.json();
  return data;
};
```
