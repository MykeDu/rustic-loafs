import { db, auth } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp, doc, getDoc } 
  from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const form = document.getElementById("orderForm");
const breadType = document.getElementById("breadType");
const quantity = document.getElementById("quantity");
const pickupDate = document.getElementById("pickupDate");

let userProfile = null;

// 1. Fetch user's profile on load so we have their friendly name ready [1]
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docSnap = await getDoc(doc(db, "users", user.uid));
    if (docSnap.exists()) {
      userProfile = docSnap.data();
      console.log("Loaded customer profile:", userProfile);
    }
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return alert("Not logged in");

  // Determine friendly name (fallback to email if profile doesn't exist yet)
  const customerName = userProfile 
    ? `${userProfile.firstName} ${userProfile.lastName}` 
    : user.email;
  const phone = userProfile ? userProfile.phoneNumber : "N/A";

  try {
    // 2. Write friendly name and phone directly into the order record
    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      customerName: customerName, // Friendly Name!
      phoneNumber: phone,         // Contact Phone!
      breadType: breadType.value,
      quantity: Number(quantity.value),
      pickupDate: pickupDate.value,
      status: "new",
      createdAt: serverTimestamp() 
    });

    alert("Order placed!");
    form.reset();
  } catch (error) {
    console.error("Error placing order: ", error);
    alert("Something went wrong. Please try again!");
  }
});
