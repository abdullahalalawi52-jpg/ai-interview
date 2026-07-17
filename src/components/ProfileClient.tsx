"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useActivities } from "@/hooks/useActivities";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, Activity, Trophy, Clock, Mail, Award, Calendar, ChevronRight, Mic, ListChecks } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfileClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t, language } = useLanguage();

  const { activities, loading: isFetching } = useActivities(user?.uid);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const completedInterviews = activities.length;
  const analyzedInterviews = activities.filter(i => (i.analysis && i.analysis.score !== undefined) || i.score !== undefined);
  const averageScore = analyzedInterviews.length > 0 
    ? Math.round(analyzedInterviews.reduce((acc, curr) => {
        if (curr.type === 'quiz' && curr.score !== undefined && curr.total) {
           return acc + Math.round((curr.score / curr.total) * 100);
        }
        return acc + (curr.analysis?.score || 0);
      }, 0) / analyzedInterviews.length) 
    : 0;
  
  const estimatedTimeSpent = activities.filter(a => a.type === 'interview').length * 15 + activities.filter(a => a.type === 'quiz').length * 5;

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      
      <main id="main-content" className="flex-1 max-w-container-max mx-auto w-full px-gutter py-12 text-start" tabIndex={-1}>
        <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
          <Link href="/dashboard" className="hover:text-primary">{t("profile.dashboard")}</Link>
          <ChevronRight className="w-4 h-4 rtl:-scale-x-100" />
          <span className="text-on-surface font-bold">{t("profile.title")}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* User Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-8 rounded-3xl flex flex-col items-center text-center shadow-sm">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 border-4 border-surface shadow-inner">
                {user.photoURL ? (
                  <Image src={user.photoURL} alt={user.displayName || t("profile.newUser")} width={128} height={128} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-16 h-16" />
                )}
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">{user.displayName || t("profile.newUser")}</h1>
              <p className="text-on-surface-variant mb-6 flex items-center gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              
              <div className="w-full h-px bg-outline-variant/30 my-2" />
              
              <div className="w-full flex justify-between items-center mt-4 text-start">
                <p className="text-sm text-on-surface-variant mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> {t("profile.joinDate")}</p>
                <p className="font-bold text-on-surface">{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : t("profile.notAvailable")}</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl shadow-sm text-center">
              <h2 className="font-bold text-lg mb-4 flex items-center justify-center gap-2 text-center">
                <Award className="w-5 h-5 text-tertiary" /> {t("profile.currentLevel")}
              </h2>
              {averageScore >= 80 ? (
                <div className="bg-green-500/10 text-green-600 p-4 rounded-xl font-bold text-center border border-green-500/20">
                  {t("profile.expert")}
                </div>
              ) : averageScore >= 50 ? (
                <div className="bg-yellow-500/10 text-yellow-600 p-4 rounded-xl font-bold text-center border border-yellow-500/20">
                  {t("profile.intermediate")}
                </div>
              ) : (
                <div className="bg-secondary/10 text-secondary p-4 rounded-xl font-bold text-center border border-secondary/20">
                  {t("profile.beginner")}
                </div>
              )}
            </div>
          </div>

          {/* Stats & History */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="font-headline-md text-headline-md text-on-surface">{t("profile.performanceSummary")}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-2">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <p className="text-on-surface-variant text-sm">{t("profile.completedInterviews")}</p>
                <p className="font-headline-lg text-headline-lg">{isFetching ? "..." : completedInterviews}</p>
              </div>
              
              <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-2">
                <div className="w-10 h-10 bg-tertiary/10 text-tertiary rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <p className="text-on-surface-variant text-sm">{t("profile.averageScore")}</p>
                <p className="font-headline-lg text-headline-lg">{isFetching ? "..." : averageScore > 0 ? `${averageScore}%` : "-"}</p>
              </div>

              <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-2">
                <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-on-surface-variant text-sm">{t("profile.trainingTime")}</p>
                <p className="font-headline-lg text-headline-lg">{isFetching ? "..." : `${estimatedTimeSpent} ${t("profile.minutes")}`}</p>
              </div>
            </div>

            <h2 className="font-headline-md text-headline-md text-on-surface mt-8 mb-4">{t("profile.latestInterviews") || "أحدث النشاطات"}</h2>
            <div className="glass-card rounded-3xl overflow-hidden shadow-sm border border-outline-variant/30">
              {isFetching ? (
                <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
              ) : activities.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant">{t("profile.noInterviews") || "لا توجد نشاطات مسجلة بعد"}</div>
              ) : (
                <div className="divide-y divide-outline-variant/20">
                  {activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-variant/30 transition-colors">
                      <div>
                        <p className="font-bold text-on-surface mb-1 flex items-center gap-2">
                           {activity.type === 'quiz' ? <ListChecks className="w-4 h-4 text-tertiary" /> : <Mic className="w-4 h-4 text-primary" />}
                           {activity.jobTitle || t("profile.notSpecified")} {t("profile.in")} {activity.company || t("profile.notSpecified")}
                        </p>
                        <p className="text-sm text-on-surface-variant flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> 
                          {activity.createdAt?.toDate ? new Date(activity.createdAt.toDate()).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : t("profile.notAvailable")}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {activity.type === 'interview' ? (
                          activity.analysis?.score ? (
                            <div className={`px-3 py-1 rounded-full font-bold text-sm border ${activity.analysis.score >= 80 ? 'bg-green-500/10 text-green-600 border-green-500/20' : activity.analysis.score >= 50 ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : 'bg-error/10 text-error border-error/20'}`}>
                              {activity.analysis.score}%
                            </div>
                          ) : (
                            <span className="text-sm text-on-surface-variant">{t("profile.noRating")}</span>
                          )
                        ) : (
                          <div className={`px-3 py-1 rounded-full font-bold text-sm border ${activity.score !== undefined && activity.total ? ((activity.score / activity.total) >= 0.8 ? 'bg-green-500/10 text-green-600 border-green-500/20' : (activity.score / activity.total) >= 0.5 ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : 'bg-error/10 text-error border-error/20') : ''}`}>
                            {activity.score} / {activity.total}
                          </div>
                        )}
                        {activity.type === 'interview' && (
                          <Link href={`/gap-analyzer?interviewId=${activity.id}`} className="text-sm font-bold text-primary hover:underline">
                            {t("profile.viewDetails")}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {activities.length > 5 && (
              <div className="text-center">
                <Link href="/dashboard" className="text-primary font-bold hover:underline">{t("profile.viewAll")}</Link>
              </div>
            )}
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
