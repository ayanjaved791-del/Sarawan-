# Sarwan Restaurant — Production Online Ordering & Kitchen Dispatch System

Complete, production-ready full-stack online ordering website and receptionist kitchen dispatch dashboard built for **Sarwan Restaurant**.

---

## 1. System Architecture & End-to-End Workflow

```
Customer Browser (Mobile / Desktop)
   │
   ├── 1. Browse authentic categorized menu with portions & search
   ├── 2. Add dishes to Cart with variant & notes
   ├── 3. Enter Name, Phone, and Delivery Address
   ├── 4. Submit Order (Cash on Delivery)
   │
   ▼
Backend API (`server.ts` & `server/db.ts`)
   │
   ├── 5. Validates inputs, calculates subtotal, delivery fee, & total
   ├── 6. Atomically saves order in JSON database (`data/orders.json`)
   ├── 7. Generates unique order ID (e.g., `SW-9289`)
   │
   ▼
Server-Sent Events (SSE) Real-Time Hub (`/api/realtime/reception`)
   │
   ├── 8. Broadcasts `NEW_ORDER` event to connected reception devices
   │
   ▼
Receptionist Dashboard (`#reception`)
   │
   ├── 9. Immediately renders order card without page refresh
   ├── 10. Rings browser-synthesized audio bell / alert chime
   ├── 11. Receptionist clicks "Accept Order" -> "Start Preparing" -> "Out for Delivery" -> "Complete Order"
   ├── 12. Prints thermal kitchen ticket / invoice
   │
   ▼
Customer Order Tracker Modal
   └── 13. Customer sees live status update automatically every step
```

---

## 2. Quick Start & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```env
   # Receptionist Dashboard Credentials
   RECEPTION_USERNAME=admin
   RECEPTION_PASSWORD=sarwan_reception_secure_password
   SESSION_SECRET=sarwan_restaurant_hmac_secret_key_2025

   # Official Restaurant Details
   RESTAURANT_NAME=Sarwan Restaurant
   RESTAURANT_PHONE=0300-1234567
   RESTAURANT_WHATSAPP=923001234567
   RESTAURANT_ADDRESS=Main Commercial Boulevard, Near Food Street, City Center
   RESTAURANT_OPENING_HOURS=12:00 PM - 02:00 AM (Daily)

   # Delivery Settings
   DEFAULT_DELIVERY_FEE=150
   MIN_ORDER_AMOUNT=300
   ESTIMATED_DELIVERY_TIME=30 - 45 Mins
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will start on **`http://localhost:3000`**.

---

## 3. How to Use the System

### For Customers
- Visit `http://localhost:3000`
- Click **"View Menu"** or browse by category (Biryani, Karahi, Bar B.Q, Handi, Broast, Rolls, Naan, etc.).
- Select portion size (e.g., Half kg vs Full kg, Chest vs Leg) and click **"Add to Cart"**.
- Click the Cart icon in the navbar, review items and fees, and click **"Proceed to Checkout"**.
- Fill in Name, Phone, and Full Delivery Address. Click **"Confirm & Place Order"**.
- The **Live Order Tracking Modal** will display the order number and live progress tracker.

### For Restaurant Receptionists
- Click **"Reception Portal"** in the top navigation bar or go directly to `http://localhost:3000/#reception`.
- Log in with staff credentials:
  - **Username**: `admin`
  - **Password**: `sarwan_reception_secure_password`
- **Real-Time Notification**:
  - Keep the dashboard open on a PC, tablet, or mobile phone.
  - Make sure **"Bell On"** is active. When a customer places an order, the bell chime will ring automatically and a high-priority banner will appear.
- **Workflow Pipeline**:
  - Click **"Accept Order"** to confirm with the customer.
  - Click **"Start Preparing"** when sending the order to the kitchen.
  - Click **"Out for Delivery"** when the delivery rider departs.
  - Click **"Complete Order"** when the rider delivers and collects Cash on Delivery.
- **Printing Kitchen Tickets**:
  - Click the **Printer icon** on any order card to print a clean 80mm thermal receipt / kitchen order ticket.
- **Menu & Price Management**:
  - Click the **"Menu & Prices"** tab to add new dishes, modify prices, update descriptions, or mark items as "In Stock" or "Sold Out".
- **Store Settings**:
  - Click the **"Store Settings"** tab to modify phone numbers, delivery fee, or average delivery time.

---

## 4. Production Build & Deployment

### Build Command
```bash
npm run build
```
This compiles:
1. The Vite React client into `dist/`
2. The Express server and SSE engine into `dist/server.cjs` via `esbuild`

### Production Start Command
```bash
npm start
```
Starts the production server on port 3000.

---

## 5. Deployment Options

### Option A: Cloud Run / Docker Container
Deploying to Google Cloud Run, Railway, Render, or any Docker container platform:
```bash
# Build and run container
docker build -t sarwan-restaurant .
docker run -p 3000:3000 -e RECEPTION_PASSWORD=your_secure_password sarwan-restaurant
```

### Option B: VPS (Ubuntu / Linux with PM2 & Nginx)
1. Clone the project onto your server.
2. Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs`
3. Run `npm install && npm run build`
4. Use PM2 to run continuously:
   ```bash
   npm install -g pm2
   pm2 start dist/server.cjs --name "sarwan-restaurant"
   pm2 save
   pm2 startup
   ```
5. Configure Nginx to reverse proxy port 3000 with SSE buffering disabled:
   ```nginx
   server {
       server_name sarwanrestaurant.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           
           # Crucial for SSE real-time notifications
           proxy_buffering off;
           proxy_read_timeout 86400s;
       }
   }
   ```

---

## 6. Pre-Launch Checklist for the Client
Before sharing the website publicly:
1. Update `RESTAURANT_PHONE` and `RESTAURANT_WHATSAPP` in `.env` or in the Receptionist Store Settings tab with the actual SIM / WhatsApp numbers.
2. Change the default `RECEPTION_PASSWORD` in `.env` to a strong, private password.
3. Review menu items and adjust prices according to the current Sarwan Restaurant dining card.
4. Verify the physical delivery radius and set the `DEFAULT_DELIVERY_FEE`.
