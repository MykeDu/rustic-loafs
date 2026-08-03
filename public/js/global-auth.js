import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { doc, getDoc } 
  from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const navbarContainer = document.getElementById("user-navbar");

onAuthStateChanged(auth, async (user) => {
  const path = window.location.pathname.toLowerCase();
  const isGuestPage = path.includes("login"); 
  // const isPrivatePage = path.includes("order") || path.includes("admin");
  const isPrivatePage = path.includes("order") || path.includes("admin") || path.includes("profile");
  const isAdminPage = path.includes("admin");

  if (user) {
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
        console.warn("Access Denied: Logged-in user is not an Admin. Redirecting to orders page.");
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
      const email = user.email || "User";
      const initial = email.charAt(0).toUpperCase();

      navbarContainer.innerHTML = `
        <div class="user-menu-container">
          <span class="user-email">${email}</span>
          <button id="avatarBtn" class="avatar-icon">${initial}</button>
          <div id="dropdownMenu" class="logout-dropdown" style="display: none;">
            <a href="profile.html" style="display: block; padding: 8px 12px; text-decoration: none;">My Profile</a>
            <a href="orders.html" style="display: block; padding: 8px 12px; text-decoration: none;">My Orders</a>
            ${userProfile && userProfile.admin === true ? '<a href="admin.html" style="display: block; padding: 8px 12px; text-decoration: none; font-weight: bold; color: #d9534f;">Admin Panel</a>' : ''}
            <button id="actionLogoutBtn" style="width: 100%; text-align: left; background: none; border: none; padding: 8px 12px; cursor: pointer;">Log Out</button>
          </div>
        </div>
      `;

      const avatarBtn = document.getElementById("avatarBtn");
      const dropdownMenu = document.getElementById("dropdownMenu");
      const logoutBtn = document.getElementById("actionLogoutBtn");

      avatarBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
      });

      document.addEventListener("click", () => {
        dropdownMenu.style.display = "none";
      });

      logoutBtn.addEventListener("click", () => {
        signOut(auth).then(() => {
          window.location.href = "login.html";
        }).catch((error) => {
          console.error("Logout error: ", error);
        });
      });
    }
  } else {
    // If logged out on a private page, redirect to login
    if (isPrivatePage) {
      console.log(`Access Denied to ${path}. Redirecting to login...`);
      const targetPage = path.split("/").pop();
      window.location.href = `login.html?redirect=${targetPage}`;
    }
  }
});
