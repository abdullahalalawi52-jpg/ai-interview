import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";

export interface UserProfileData {
  name: string;
  email: string | null;
  photoURL: string;
  totalScore: number;
  roleKey: string;
  levelKey: string;
}

export const userService = {
  /**
   * Fetches a user profile by UID
   */
  async getUserProfile(uid: string) {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data() as UserProfileData;
    }
    return null;
  },

  /**
   * Creates a new user profile if it doesn't exist
   */
  async createUserProfileIfNotExists(uid: string, data: UserProfileData) {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        ...data,
        createdAt: serverTimestamp(),
      });
      return true;
    }
    return false;
  },

  /**
   * Updates an existing user profile
   */
  async updateUserProfile(uid: string, data: Partial<UserProfileData>) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }
};
