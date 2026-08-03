import { db, auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    // 1. Create the credentials inside Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Immediately write the details directly into the "users" collection in Firestore
    console.log("Creating Firestore user document for:", user.uid);

    await setDoc(doc(db, "users", user.uid), {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      admin: false,                     // ⭐ REQUIRED ⭐
      createdAt: new Date().toISOString()
    });

    console.log("Firestore user document created!");
    
    console.log("Account and profile document created successfully!");
    alert("Account created successfully!");
  } catch (error) {
    console.error("Registration error:", error);
    alert("Registration failed: " + error.message);
  }

});
