import { collection, query, orderBy, limit, getDocs } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";
import { UserProfileData } from "./user.service";

export interface LeaderboardUser extends UserProfileData {
  id: string;
}

export const leaderboardService = {
  /**
   * Fetches the top users for the leaderboard
   */
  async getTopUsers(limitCount: number = 10): Promise<LeaderboardUser[]> {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("totalScore", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as LeaderboardUser));
  }
};
