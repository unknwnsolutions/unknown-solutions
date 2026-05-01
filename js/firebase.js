// Firebase Configuration
// TODO: Replace with your Firebase project config (see FIREBASE_SETUP.md)
const firebaseConfig = {
    apiKey: "AIzaSyB3gtcBsz55B-w_g2UQFRbiCDbBhm2n0ZU",
    authDomain: "unknwn-5ead6.firebaseapp.com",
    databaseURL: "https://unknwn-5ead6-default-rtdb.firebaseio.com",
    projectId: "unknwn-5ead6",
    storageBucket: "unknwn-5ead6.firebasestorage.app",
    messagingSenderId: "347016909257",
    appId: "1:347016909257:web:c4f1278823f196e05a9818",
    measurementId: "G-BQ1E356D5W"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Register a new user with Firebase Auth and create Firestore profile
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password (min 6 characters)
 * @returns {Promise<Object>} User data object
 */
export async function registerUser(name, email, password) {
    try {
        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update display name
        await updateProfile(user, { displayName: name });

        // Create Firestore user profile
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            createdAt: serverTimestamp(),
            progress: {
                modulesCompleted: [],
                resourcesDownloaded: []
            }
        });

        return { success: true, user };
    } catch (error) {
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

/**
 * Sign in existing user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data object
 */
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Listen to authentication state changes
 * @param {Function} callback - Function to call with user object or null
 * @returns {Function} Unsubscribe function
 */
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

/**
 * Get current user's Firestore profile data
 * @returns {Promise<Object|null>} User profile data or null
 */
export async function getUserProfile() {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
            return { ...docSnap.data(), uid: user.uid };
        }
        return null;
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
}

/**
 * Mark a module as completed
 * @param {string} moduleId - Module identifier
 * @returns {Promise<Object>} Result object
 */
export async function completeModule(moduleId) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Not authenticated" };

    try {
        await updateDoc(doc(db, "users", user.uid), {
            "progress.modulesCompleted": arrayUnion(moduleId)
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating progress:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Track a resource download
 * @param {string} resourceId - Resource identifier
 * @returns {Promise<Object>} Result object
 */
export async function trackResourceDownload(resourceId) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Not authenticated" };

    try {
        await updateDoc(doc(db, "users", user.uid), {
            "progress.resourcesDownloaded": arrayUnion(resourceId)
        });
        return { success: true };
    } catch (error) {
        console.error("Error tracking download:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Convert Firebase Auth error codes to user-friendly messages
 * @param {string} errorCode - Firebase error code
 * @returns {string} User-friendly error message
 */
function getAuthErrorMessage(errorCode) {
    const messages = {
        "auth/email-already-in-use": "This email is already registered",
        "auth/invalid-email": "Invalid email address",
        "auth/weak-password": "Password must be at least 6 characters",
        "auth/user-not-found": "No account found with this email",
        "auth/wrong-password": "Incorrect password",
        "auth/invalid-credential": "Invalid email or password",
        "auth/too-many-requests": "Too many attempts. Please try again later",
        "auth/network-request-failed": "Network error. Check your connection"
    };
    return messages[errorCode] || "An unexpected error occurred";
}

// Export functions for use in other scripts
window.firebaseAuth = {
    registerUser,
    loginUser,
    logoutUser,
    onAuthChange,
    getUserProfile,
    completeModule,
    trackResourceDownload,
    auth,
    db
};
