import { db, auth } from "./firebase-config.js";
import { collection, query, where, orderBy, onSnapshot } 
  from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const ordersList = document.getElementById("ordersList");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // 1. Build query to ONLY fetch orders belonging to this logged-in user
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    // 2. Listen to real-time status changes
    onSnapshot(q, (snapshot) => {
      ordersList.innerHTML = "";

      if (snapshot.empty) {
        ordersList.innerHTML = "<p>You haven't placed any orders yet.</p>";
        return;
      }

      snapshot.forEach((docSnap) => {
        const order = docSnap.data();
        const orderTime = order.createdAt ? order.createdAt.toDate().toLocaleString() : "Processing...";
        
        ordersList.innerHTML += `
          <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
            <h3>Order #${docSnap.id.substring(0, 6).toUpperCase()}</h3>
            <p><strong>Bread Type:</strong> ${order.breadType} (x${order.quantity})</p>
            <p><strong>Pickup Date:</strong> ${order.pickupDate}</p>
            <p><strong>Order Status:</strong> <span class="status-badge ${order.status}">${order.status.toUpperCase()}</span></p>
            <p><small>Placed on: ${orderTime}</small></p>
          </div>
        `;
      });
    }, (error) => {
      console.error("Error loading orders:", error);
      // IMPORTANT NOTE: Since this query combines "where" and "orderBy",
      // look inside your browser's DevTools console. Firestore will print a direct
      // link to automatically build the required composite index!
      ordersList.innerHTML = "<p>Error loading your orders. Check developer console.</p>";
    });
  } else {
    ordersList.innerHTML = "<p>Please log in to view your orders.</p>";
  }
});
