import { getAuth, Auth } from "firebase/auth";
import { firebaseApp } from "./firebase";

// Initialize Firebase Authentication (singleton)
export const auth: Auth = getAuth(firebaseApp);

// Safety check
console.log('[Firebase Auth] Initialized for project:', auth.app.options.projectId);
console.log('[Firebase Auth] Auth domain:', auth.config.authDomain);
