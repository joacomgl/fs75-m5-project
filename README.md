# ⚡ TechStore – Plataforma E-Commerce Fullstack (SPA)

> **Proyecto Integrador 5 – Especialización Frontend | Henry Bootcamp**  
> Desarrollado para **Patagonix Tech** para el sector retail.

---

## 📌 1. Descripción del Proyecto y Contexto del Cliente

**TechStore** es una Single Page Application (SPA) de comercio electrónico moderna, rápida y escalable, construida bajo el modelo Backend-as-a-Service (BaaS) y arquitectura Serverless para minimizar costos operativos y maximizar la seguridad y el rendimiento.

La plataforma ofrece **dos experiencias de usuario completamente diferenciadas**:

1. **Experiencia del Cliente (Customer)**:
   - Navegación pública y catálogo interactivo sin requerir autenticación previa.
   - Búsqueda en tiempo real con **debounce de 400ms** para optimizar el rendimiento.
   - Filtros por categoría (Mouse, Teclado, Auriculares, Monitor, Silla) y ordenamiento dinámico por precio/nombre.
   - Vista de detalle de producto (`/products/:id`) con selector de cantidades y control de stock.
   - Gestión de estado global del carrito de compras con **`Context API + useReducer`** y drawer lateral.
   - Flujo de checkout simulado en 3 pasos: *Resumen ➔ Datos de Entrega ➔ Confirmación & Pago*.
   - Historial de órdenes personales en tiempo real (`/orders` y `/orders/:id`).

2. **Experiencia del Administrador (Admin)**:
   - Panel administrativo protegido por rol (`/admin`) con layout y barra lateral exclusivos.
   - **Dashboard de Métricas**: Estadísticas en tiempo real de ingresos totales, pedidos pendientes y estado del catálogo.
   - **CRUD Completo de Catálogo**: Creación, edición y eliminación de productos con modal de confirmación.
   - **Carga segura de imágenes a AWS S3**: Flujo de Presigned URLs a través de Serverless Functions (sin exponer credenciales).
   - **Gestión Global de Órdenes**: Monitoreo y actualización del ciclo de vida de los pedidos (`pending`, `processing`, `completed`, `cancelled`).

---

## 🏛️ 2. Arquitectura y Decisiones Técnicas

El proyecto sigue una arquitectura organizada por **capas con separación estricta de responsabilidades** y tipado estricto con **TypeScript (sin `any`)**:

```text
ecommerce-ft74/
├── api/                     # Vercel Serverless Functions (AWS SDK Backend)
│   └── presign.ts           # Generador seguro de Presigned URLs de S3
├── public/                  # Favicons y activos estáticos
├── src/
│   ├── components/          # Componentes reutilizables de UI y estado
│   │   ├── common/          # Header, ProductCard, ProductList, CartDrawer
│   │   │   └── admin/       # AdminLayout, AdminProductForm
│   │   ├── router/          # ProtectedRoute, AdminRoute
│   │   ├── states/          # EmptyState, ErrorState, LoadingState
│   │   └── ui/              # Button, Modal, Spinner
│   ├── config/              # Configuración e inicialización de Firebase
│   ├── contexts/            # Estado global (Context API + useReducer)
│   │   ├── auth/            # AuthContext (Firebase Auth + Roles Firestore)
│   │   ├── cart/            # CartContext + cartReducer puro
│   │   ├── orders/          # OrdersContext (Pedidos del usuario)
│   │   ├── products/        # ProductsContext (Catálogo de Firestore)
│   │   └── Theme/           # ThemeContext (Dark / Light Mode)
│   ├── hooks/               # Custom hooks (useDebounce, useProductFilters)
│   ├── pages/               # Vistas principales (Home, ProductDetail, Checkout, Admin, etc.)
│   ├── services/            # Servicios de acceso a datos (Auth, Products, Orders, Upload)
│   ├── styles/              # Variables CSS y Tailwind CSS v4
│   ├── test/                # Setup de Vitest, helpers y test-utils
│   └── types/               # Interfaces y tipos de dominio TypeScript
├── firestore.rules          # Reglas de seguridad del lado del servidor
├── vercel.json              # Configuración de routing y serverless en producción
└── vite.config.ts           # Configuración de Vite y Vitest (jsdom)
```

### 🧠 ¿Por qué `Context API + useReducer` para el Carrito?
El carrito de compras maneja múltiples transiciones de estado (`ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QTY`, `CLEAR_CART`) con reglas de negocio (como no superar el stock disponible o eliminar el producto si la cantidad es menor a 1).  
- **Predecibilidad**: `cartReducer` es una función pura que no genera efectos secundarios; dado un estado y una acción, siempre devuelve el mismo resultado determinista.
- **Mantenibilidad y Testing**: Permite escribir tests unitarios aislados sin necesidad de montar componentes ni renderizar el DOM.
- **Separación de responsabilidades**: El estado de sesión (`AuthContext`) y el carrito (`CartContext`) se mantienen en contextos independientes para evitar renderizados innecesarios y acoplamiento.

### 🔒 ¿Por qué AWS S3 + Presigned URLs?
Subir imágenes directamente desde el cliente con credenciales de AWS expondría el `Access Key ID` y el `Secret Access Key` en el código del navegador, lo cual es una vulnerabilidad crítica.  
En su lugar, se implementó el flujo de **URLs Prefirmadas (Presigned URLs)**:
1. El cliente solicita una URL de subida a una función serverless (`/api/presign`).
2. La función serverless genera una URL firmada con el SDK de AWS v3 con validez de 5 minutos utilizando variables de entorno protegidas en el servidor.
3. El navegador sube el archivo binario **directamente a S3 vía HTTP PUT** utilizando dicha URL.
4. S3 almacena la imagen y el cliente persiste la URL pública en Firestore.
5. **Resultado**: Cero exposición de credenciales y carga directa a la nube sin saturar el servidor.

```text
[ Cliente (Browser) ] ──(1. POST /api/presign)──> [ Vercel Serverless Function ]
                                                              │
                                                (2. Genera Presigned URL con SDK v3)
                                                              ▼
[ Cliente (Browser) ] <──(3. Recibe Upload URL)─── [ AWS IAM Credentials (Server) ]
        │
        └───(4. HTTP PUT directo con el archivo)───> [ AWS S3 Bucket ]
                                                              │
[ Firestore Database ] <──(5. Guarda publicUrl)───────────────┘
```

---

## 🔏 3. Reglas de Seguridad de Firestore (`firestore.rules`)

La seguridad no depende únicamente del frontend; se aplican reglas en el servidor:
- **`products`**: Lectura pública para cualquier usuario; creación, edición y eliminación permitida únicamente para usuarios con `role == "admin"`.
- **`users`**: Cada usuario solo puede leer y escribir su propio perfil (`request.auth.uid == userId`).
- **`orders`**: Los clientes solo pueden consultar y crear órdenes asociadas a su propio `userId`. La actualización de estado está reservada a administradores.

---

## 🚀 4. Instalación y Configuración Local

### Requisitos previos
- Node.js (v18 o superior)
- Cuenta de Firebase con Authentication (Email y Google) y Firestore Database habilitados.
- Bucket de AWS S3 con permisos CORS configurados y usuario IAM con acceso a S3.

### Paso a paso

1. **Clonar el repositorio y entrar a la carpeta:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ecommerce-ft74
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**
   Copia el archivo de ejemplo y completa con tus credenciales:
   ```bash
   cp .env.example .env
   ```

   Variables requeridas en `.env`:
   ```env
   # Firebase (Frontend)
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id

   # AWS S3 (Serverless Backend)
   AWS_ACCESS_KEY_ID=tu_access_key_id
   AWS_SECRET_ACCESS_KEY=tu_secret_access_key
   AWS_REGION=us-east-2
   S3_BUCKET_NAME=ecommerce-ft75-images
   ```

4. **Poblar la base de datos inicial (Seed opcional):**
   ```bash
   npm run seed
   ```

5. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 🧪 5. Testing y Calidad de Código

El proyecto cuenta con **24 tests automatizados** desarrollados con **Vitest + React Testing Library + jsdom**:

```bash
# Correr toda la suite de tests
npm run test

# Correr tests en modo interactivo (watch)
npm run test:watch

# Validar tipos TypeScript y compilar bundle
npm run build
```

---

## 🌐 6. Deploy en Producción (Vercel)

- **URL de Producción:** [https://vercel.com/glados-project/ecommerce-ft75](https://vercel.com/glados-project/ecommerce-ft75)
- Despliegue continuo (CI/CD) vinculado a la rama principal de GitHub.
- Serverless Functions integradas en `/api/*`.