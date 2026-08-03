import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("user-navbar");
  const loginLink = document.getElementById("loginLink");

  onAuthStateChanged(auth, async (user) => {
    const path = window.location.pathname.toLowerCase();
    const page = path.split("/").pop();

    const isGuestPage = path.includes("login");
    const isPrivatePage =
      path.includes("orders.html") ||
      path.includes("order.html") ||
      path.includes("admin.html") ||
      path.includes("profile.html");

    const isAdminPage = page === "admin.html";

    if (user) {
      if (loginLink) loginLink.style.display = "none";

      let userProfile = null;
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) userProfile = docSnap.data();
      } catch (e) {
        console.error("Error fetching user profile:", e);
      }

      if (isAdminPage) {
        if (!userProfile || userProfile.admin !== true) {
          window.location.href = "orders.html";
          return;
        }
      }

      if (isGuestPage) {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get("redirect") || "orders.html";
        window.location.href = redirectTo;
        return;
      }

      let adminLink = "";
      if (userProfile?.admin === true) {
        adminLink = `
          <a href="admin.html"
             style="display:block; padding:8px 12px; text-decoration:none; font-weight:bold; color:#d9534f;">
             Admin Panel
          </a>`;
      }

      if (navbarContainer) {
        const email = user.email || "User";
        const initial = email.charAt(0).toUpperCase();

        navbarContainer.innerHTML = `
          <div class="user-menu-container">
            <span class="user-email">${email}</span>
            <button id="avatarBtn" class="avatar-icon">${initial}</button>

            <div id="dropdownMenu" class="logout-dropdown" style="display:none;">
              <a href="profile.html" style="display:block; padding:8px 12px; text-decoration:none;">My Profile</a>
              <a href="orders.html" style="display:block; padding:8px 12px; text-decoration:none;">My Orders</a>
              ${adminLink}

              <a id="actionLogoutBtn"
                 style="display:block; width:100%; padding:8px 12px; text-decoration:none; cursor:pointer;">
                 Log Out
              </a>
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

        document.addEventListener("click", (e) => {
          if (!dropdownMenu.contains(e.target) && !avatarBtn.contains(e.target)) {
            dropdownMenu.style.display = "none";
          }
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
      if (loginLink) loginLink.style.display = "inline-block";

      if (isPrivatePage) {
        const targetPage = path.split("/").pop();
        window.location.href = `login.html?redirect=${targetPage}`;
      }
    }
  });
});
