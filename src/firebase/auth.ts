import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebase";

// Reusable Firebase Authentication instance
export const auth = getAuth(firebaseApp);
