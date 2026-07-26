import { useState, useEffect } from "react";
import { activityService, ActivityData } from "@/services/activity.service";

export type { ActivityData };

export function useActivities(userId: string | undefined | null) {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [limitCount, setLimitCount] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const mergedData = await activityService.getUserActivities(userId, limitCount);
        
        setActivities(mergedData);
        setHasMore(mergedData.length === limitCount);
        setError(null);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch activities"));
      } finally {
        setLoading(false);
      }
    }
    
    fetchActivities();
  }, [userId, limitCount]);

  const loadMore = () => {
    setLimitCount(prev => prev + 10);
  };

  return { activities, loading, error, hasMore, loadMore };
}
