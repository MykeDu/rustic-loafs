import { db, auth } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const profileForm = document.getElementById("profileForm");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const phoneInput = document.getElementById("phoneNumber");

// 1. Populate form fields on load if user already has data
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        firstNameInput.value = data.firstName || "";
        lastNameInput.value = data.lastName || "";
        phoneInput.value = data.phoneNumber || "";
      }
    } catch (error) {
      console.error("Error loading profile: ", error);
    }
  }
});

// 2. Create or Update the profile document
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const user = auth.currentUser;
  if (!user) return alert("You must be logged in to update your profile.");

  try {
    const userDocRef = doc(db, "users", user.uid);
    
    // setDoc with { merge: true } creates the document if it doesn't exist,
    // and safely overwrites ONLY the specified fields if it does.
    await setDoc(userDocRef, {
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      phoneNumber: phoneInput.value.trim()
    }, { merge: true });

    alert("Profile saved successfully!");
  } catch (error) {
    console.error("Error saving profile: ", error);
    alert("Failed to save profile. Please try again.");
  }
});
