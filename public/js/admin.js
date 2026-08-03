import { db } from "./firebase-config.js";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } 
  from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// List of available statuses
const STATUSES = ["new", "confirmed", "paid", "completed", "cancelled"];

function listenToOrders() {
  const container = document.getElementById("orders");
  const q = query(collection(db, "orders"), orderBy("createdAt", "asc"));

  onSnapshot(q, (snapshot) => {
    container.innerHTML = ""; 

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const docId = docSnap.id;
      const orderTime = data.createdAt ? data.createdAt.toDate().toLocaleTimeString() : "Pending...";
      
      // Default to "new" if the document doesn't have a status field yet
      const currentStatus = data.status || "new";

      // Build the dropdown options dynamically
      const statusOptions = STATUSES.map(status => `
        <option value="${status}" ${currentStatus === status ? "selected" : ""}>
          ${status.toUpperCase()}
        </option>
      `).join("");

      // REPLACE OLD INNERHTML BLOCK WITH THIS NEW ONE:
      container.innerHTML += `
        <div style="border-bottom: 1px solid #ccc; padding: 15px 0;">
          <!-- Displays customer's Friendly Name and Phone Number -->
          Name: <strong>${data.customerName || "Anonymous"}</strong> <br>
          Phone: (${data.phoneNumber || "No Phone"})<br>
          Order: <strong>${data.breadType}</strong> (x${data.quantity})<br>
          Pickup Date: ${data.pickupDate}<br>
          <small>Ordered at: ${orderTime}</small><br>
          
          <!-- Your status selector dropdown -->
          <label style="margin-top: 8px; display: inline-block;">
            Status: 
            <select class="status-select" data-id="${docId}">
              ${statusOptions}
            </select>
          </label>
        </div>
      `;
    });
  });

  // Event Delegation: Listen for changes on any dropdown inside the container
  container.addEventListener("change", async (e) => {
    if (e.target.classList.contains("status-select")) {
      const docId = e.target.getAttribute("data-id");
      const newStatus = e.target.value;

      try {
        // Update ONLY the status field in Firestore
        await updateDoc(doc(db, "orders", docId), { status: newStatus });
        console.log(`Order ${docId} successfully updated to: ${newStatus}`);
      } catch (error) {
        console.error("Error updating status: ", error);
        alert("Failed to update status. Check console.");
      }
    }
  });
}

listenToOrders();
