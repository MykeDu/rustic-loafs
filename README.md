
📁 ## Project Structure
```
public/
  index.html
  login.html
  register.html
  order.html
  orders.html
  admin.html
  profile.html
  404.html

  css/
    styles.css
    admin.css

  js/
    firebase-config.js
    global-auth.js
    login.js
    register.js
    order.js
    orders.js
    admin.js
    profile.js

firebase.json
.firebaserc
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
