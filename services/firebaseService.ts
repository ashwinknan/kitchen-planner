
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query,
  orderBy
} from "firebase/firestore";
import { Recipe } from "../types";

// Firebase configuration using environment variables
// Note: These will be provided via process.env as per your hosting setup
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Fetches only the names and basic info for searching to optimize performance.
 */
export const fetchRecipeIndex = async (): Promise<Partial<Recipe>[]> => {
  try {
    const q = query(collection(db, "recipes"), orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      variation: doc.data().variation,
      category: doc.data().category
    }));
  } catch (error) {
    console.error("Error fetching recipe index:", error);
    throw error;
  }
};

/**
 * Fetches the full recipe details by ID.
 */
export const fetchFullRecipe = async (id: string): Promise<Recipe> => {
  try {
    const docRef = doc(db, "recipes", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Recipe;
    } else {
      throw new Error("Recipe not found");
    }
  } catch (error) {
    console.error("Error fetching full recipe:", error);
    throw error;
  }
};
