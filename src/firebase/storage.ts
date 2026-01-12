import { getStorage } from "firebase/storage";
import { firebaseApp } from "./firebase";

// Reusable Firebase Storage instance
export const storage = getStorage(firebaseApp);
