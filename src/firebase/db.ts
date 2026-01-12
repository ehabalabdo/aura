import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./firebase";

// Reusable Firestore instance
export const db = getFirestore(firebaseApp);
