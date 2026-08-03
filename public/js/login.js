// login.js

import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    // Sign in securely using Firebase Auth
    await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful!");
    // No redirect logic needed here! 
    // global-auth.js will automatically detect the sign-in and redirect the user.
  } catch (error) {
    console.error("Login submission error:", error);
    if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
      alert("Invalid email or password. Please try again.");
    } else {
      alert("Unable to sign in. Please verify your internet connection.");
    }
  }
});
