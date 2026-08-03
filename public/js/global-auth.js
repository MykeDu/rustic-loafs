import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// const navbarContainer = document.getElementById("user-navbar");

document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("user-navbar");
  const loginLink = document.getElementById("loginLink"); // added 8-3-2026

  onAuthStateChanged(auth, async (user) => {
    const path = window.location.pathname.toLowerCase();
    const page = path.split("/").pop();   // <-- new to get exact page name 8-3-2026
    
    const isGuestPage = path.includes("login");

    const isPrivatePage =
      path.includes("orders.html") ||
      path.includes("order.html") ||
      path.includes("admin.html") ||
      path.includes("profile.html");

      const isAdminPage = page === "admin.html";   // <-- FIXED

    if (user) {
      // Hide login link when logged in
      // if (loginLink) loginLink.style.display = "none";
      if (loginLink) {
        console.log("HIDING LOGIN LINK");
        loginLink.style.display = "none";
      }

      // 1. Fetch user profile from the newly setup "users" collection
      let userProfile = null;
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          userProfile = docSnap.data();
        }
      } catch (e) {
        console.error("Error fetching user profile:", e);
      }

      // 2. Block non-admins from accessing admin pages!
      if (isAdminPage) {
        if (!userProfile || userProfile.admin !== true) {
          console.warn(
            "Access Denied: Logged-in user is not an Admin. Redirecting to orders page.",
          );
          window.location.href = "orders.html";
          return;
        }
      }

      // 3. Redirect logged-in users away from guest pages
      if (isGuestPage) {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get("redirect") || "orders.html";
        window.location.href = redirectTo;
        return;
      }

      // 4. Render global navbar (profile dropdown with role-based routing)
      if (navbarContainer) {

        console.log("RENDERING NAVBAR FOR USER:", user.email);

        const email = user.email || "User";
        const initial = email.charAt(0).toUpperCase();

        navbarContainer.innerHTML = `
        <div class="user-menu-container">
          <span class="user-email">${email}</span>
          <button id="avatarBtn" class="avatar-icon">${initial}</button>
          <div id="dropdownMenu" class="logout-dropdown" style="display: none;">
            <a href="profile.html" style="display: block; padding: 8px 12px; text-decoration: none;">My Profile</a>
            <a href="orders.html" style="display: block; padding: 8px 12px; text-decoration: none;">My Orders</a>
            ${userProfile && userProfile.admin === true ? '<a href="admin.html" style="display: block; padding: 8px 12px; text-decoration: none; font-weight: bold; color: #d9534f;">Admin Panel</a>' : ""}
            <button id="actionLogoutBtn" style="width: 100%; text-align: left; background: none; border: none; padding: 8px 12px; cursor: pointer;">Log Out</button>
          </div>
        </div>
      `;

        const avatarBtn = document.getElementById("avatarBtn");
        const dropdownMenu = document.getElementById("dropdownMenu");
        const logoutBtn = document.getElementById("actionLogoutBtn");

        avatarBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          dropdownMenu.style.display =
            dropdownMenu.style.display === "none" ? "block" : "none";
        });

        document.addEventListener("click", () => {
          dropdownMenu.style.display = "none";
        });

        logoutBtn.addEventListener("click", () => {
          signOut(auth)
            .then(() => {
              window.location.href = "login.html";
            })
            .catch((error) => {
              console.error("Logout error: ", error);
            });
        });
      }
    } else {
      // Show login link when logged out
      if (loginLink) loginLink.style.display = "inline-block";

      // If logged out on a private page, redirect to login
      if (isPrivatePage) {
        console.log(`Access Denied to ${path}. Redirecting to login...`);
        const targetPage = path.split("/").pop();
        window.location.href = `login.html?redirect=${targetPage}`;
      }
    }
  });
});
