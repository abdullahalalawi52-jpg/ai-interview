"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Trophy, Medal, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore/lite";

// Helper function to assign badges based on rank
const getBadge = (index: number) => {
  if (index === 0) return "🏆";
  if (index === 1) return "🥇";
  if (index === 2) return "🥈";
  if (index === 3) return "🥉";
  if (index < 10) return "⭐";
  return "🌱";
};

// Helper function to guess level based on score
const getLevelKey = (score: number) => {
  if (score > 1000) return "expert";
  if (score > 500) return "pro";
  if (score > 200) return "advanced";
  if (score > 50) return "intermediate";
  return "beginner";
};
interface LeaderboardUser {
  id: string;
  name: string;
  roleKey: string;
  score: number;
  levelKey: string;
  badge: string;
}

export default function LeaderboardClient() {
  const [loading, setLoading] = useState(true);
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("totalScore", "desc"), limit(50));
        const querySnapshot = await getDocs(q);
        
        const usersData = querySnapshot.docs.map((doc, index) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "مستخدم مجهول",
            roleKey: data.roleKey || "appDeveloper",
            score: data.totalScore || 0,
            levelKey: data.levelKey || getLevelKey(data.totalScore || 0),
            badge: getBadge(index),
          };
        });
        
        setTopUsers(usersData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      
      <main id="main-content" className="flex-1 max-w-4xl mx-auto w-full px-4 py-12" tabIndex={-1}>
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-tertiary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Trophy className="w-10 h-10 text-tertiary" />
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">{t("leaderboard.title")}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[36rem] mx-auto">
            {t("leaderboard.subtitle")}
          </p>
        </div>

        <div 
          className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-outline-variant/30 relative overflow-hidden"
          aria-live="polite"
          aria-busy={loading}
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-10 h-10 border-4 border-tertiary/20 border-t-tertiary rounded-full animate-spin" />
            </div>
          ) : topUsers.length === 0 ? (
            <div className="py-16 text-center z-10 relative flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-surface-variant rounded-2xl flex items-center justify-center text-on-surface-variant mb-4 border border-outline-variant/30">
                <Trophy className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">{t("leaderboard.empty")}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[24rem] mb-6">{t("leaderboard.emptyDesc")}</p>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col gap-3">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-outline-variant/30 text-on-surface-variant text-sm font-bold">
                <div className="col-span-2 sm:col-span-1 text-center">{t("leaderboard.table.rank")}</div>
                <div className="col-span-7 sm:col-span-5">{t("leaderboard.table.user")}</div>
                <div className="col-span-3 sm:col-span-4 hidden sm:block">{t("leaderboard.table.levelBadge")}</div>
                <div className="col-span-3 sm:col-span-2 text-center">{t("leaderboard.table.score")}</div>
              </div>

              {/* Leaderboard Rows */}
              {topUsers.map((user, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={user.id} 
                  className={`grid grid-cols-12 gap-4 items-center px-6 py-4 rounded-2xl transition-colors ${index === 0 ? 'bg-tertiary/10 border border-tertiary/20 shadow-sm' : index === 1 ? 'bg-surface-variant/50 border border-outline-variant/20' : index === 2 ? 'bg-surface-container/50 border border-outline-variant/20' : 'hover:bg-surface-variant/30'}`}
                >
                  <div className="col-span-2 sm:col-span-1 flex justify-center">
                    {index === 0 ? <Medal className="w-8 h-8 text-tertiary drop-shadow-md" /> : 
                     index === 1 ? <Medal className="w-7 h-7 text-gray-400" /> : 
                     index === 2 ? <Medal className="w-6 h-6 text-amber-600" /> : 
                     <span className="font-bold text-lg text-on-surface-variant/70">{index + 1}</span>}
                  </div>
                  
                  <div className="col-span-7 sm:col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-tertiary/20 flex items-center justify-center font-bold text-primary shadow-inner">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface">{user.name}</h3>
                      <p className="text-xs text-on-surface-variant">{t(`leaderboard.roles.${user.roleKey}`)}</p>
                    </div>
                  </div>

                  <div className="col-span-3 sm:col-span-4 hidden sm:flex items-center gap-2">
                    <div className="bg-surface-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-outline-variant/30">
                      {user.badge} {t(`leaderboard.levels.${user.levelKey}`)}
                    </div>
                  </div>

                  <div className="col-span-3 sm:col-span-2 flex justify-center">
                    <div className={`px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1 ${index === 0 ? 'bg-tertiary text-on-tertiary shadow-md' : 'bg-surface-container text-on-surface border border-outline-variant/50'}`}>
                      {index === 0 && <Star className="w-3 h-3 fill-current" />}
                      <span dir="ltr">{user.score} pt</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-on-surface-variant text-sm flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" /> {t("leaderboard.footer")}
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
