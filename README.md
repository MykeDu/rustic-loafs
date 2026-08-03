
📁 ## Project Structure
```
this was the structure sent in chat window a few days ago

⭐ Full Project Structure (recommended)

sourdough-order-app/
│
├── public/                     # Everything Firebase Hosting will serve
│   ├── index.html              # Redirect or landing page
│   ├── login.html              # Client login page
│   ├── order.html              # Client order form
│   ├── admin.html              # Admin dashboard
│   │
│   ├── css/
│   │   ├── styles.css          # Shared styling
│   │   └── admin.css           # Admin-specific styling (optional)
│   │
│   ├── js/
│   │   ├── firebase-config.js  # Your Firebase config + initialization
│   │   ├── auth.js             # Login, logout, auth state handling
│   │   ├── order.js            # Order form logic + Firestore writes
│   │   ├── admin.js            # Admin dashboard logic + Firestore reads
│   │   └── utils.js            # Shared helpers (date formatting, etc.)
│   │
│   ├── img/
│   │   └── logo.png            # Your bakery logo (optional)
│   │
│   └── 404.html                # Optional custom error page
│
├── firebase.json               # Hosting + rewrite rules
├── .firebaserc                 # Firebase project alias
└── README.md                   # Notes for future you

```

✨ ## Features

**Customer Features**
- Create an account
- Log in securely
- Update profile (name, phone number)
- Place bread orders
- View order history
- See real‑time status updates (new → confirmed → paid → completed → cancelled)

## Admin Features
- Role‑based access control

- View all orders in real time

- Update order status

- See customer name + phone number

- Prevent non‑admins from accessing admin pages

## Technical Features
- Firebase Hosting

- Firebase Authentication

- Firestore (real‑time listeners)

- Mobile‑friendly UI

- Clean project structure

- Safe for GitHub (no private keys)

🔧 ## Firebase Setup
This project uses:

- Firebase Hosting
- Firebase Authentication
- Cloud Firestore

Your firebase-config.js contains your public web API key, which is safe to commit to GitHub. Firebase confirms that web API keys are not secrets.

**Firestore Collections:**

- users/{uid} – profile data + admin flag

- orders/{orderId} – customer orders

---

🚀 ## Running Locally

Install Firebase CLI:
```
npm install -g firebase-tools

```
Log in:
```
firebase login
```

Serve locally:
```
firebase serve

```

Your app will run at:

```
http://localhost:5000

```

🌐 ## Deploying

Deploy to Firebase Hosting:

```
firebase deploy

```
🔒 ## Security Notes

Safe to upload:

- All HTML, CSS, JS

- firebase-config.js

- firebase.json

- .firebaserc

**Never upload:**

- serviceAccountKey.json

- .env files

- Private keys

- Admin SDK credentials

This project contains none of these.
