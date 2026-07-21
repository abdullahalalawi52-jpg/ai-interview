"use client";

import { Settings, ArrowLeft, Activity, Trophy, Clock, Mic, FileText, ListChecks } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";

const SettingsModal = dynamic(() => import("@/components/SettingsModal"), { ssr: false });
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useActivities } from "@/hooks/useActivities";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * DashboardClient Component
 * 
 * The main user dashboard that displays an overview of the user's progress.
 * It fetches the user's recent activities (interviews and quizzes) using the `useActivities` hook
 * and visualizes them through charts, statistics cards, and a recent activity list.
 * 
 * @returns React Component
 */
export default function DashboardClient() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const { activities, loading: isFetching } = useActivities(user?.uid);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const avgScore = useMemo(() => {
    if (!activities || activities.length === 0) return null;
    const scored = activities.filter(i => i.analysis?.score || i.score);
    if (scored.length === 0) return null;
    const sum = scored.reduce((acc, curr) => acc + (curr.analysis?.score || curr.score || 0), 0);
    return Math.round(sum / scored.length);
  }, [activities]);

  if (loading || !user) {
    return (
      <div className="flex flex-col flex-1 bg-surface min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 md:p-12 max-w-container-max mx-auto w-full">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <Skeleton className="h-10 w-48 mb-4" />
              <Skeleton className="h-6 w-72" />
            </div>
            <Skeleton className="w-11 h-11 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
          <Skeleton className="h-8 w-40 mb-6" />
          <Skeleton className="h-64 rounded-3xl mb-12" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!activities) return null;
  return (
    <div className="flex flex-col flex-1 bg-surface text-on-surface min-h-screen">
      <Navbar />

      {/* Main Content */}
      <main id="main-content" className="flex-1 p-6 md:p-12 max-w-container-max mx-auto w-full" tabIndex={-1}>
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">{t("dashboard.welcome")}</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">{t("dashboard.subtitle")}</p>
          </div>
          <div className="flex items-center gap-sm">

            <button onClick={() => setIsSettingsOpen(true)} className="p-3 bg-surface-container-high rounded-full hover:bg-surface-variant transition-colors shadow-sm" aria-label="Settings">
              <Settings className="w-5 h-5 text-on-surface" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <Activity className="text-primary w-6 h-6" />, label: t("dashboard.stats.completed"), value: isFetching ? <Skeleton className="h-8 w-12" /> : activities.length.toString() },
            { icon: <Trophy className="text-tertiary w-6 h-6" />, label: t("dashboard.stats.avgScore"), value: isFetching ? <Skeleton className="h-8 w-16" /> : (avgScore !== null ? avgScore + "%" : t("dashboard.stats.none")) },
            { icon: <Clock className="text-secondary w-6 h-6" />, label: t("dashboard.stats.estTime"), value: isFetching ? <Skeleton className="h-8 w-20" /> : (activities.filter(a => a.type === 'interview').length * 15 + activities.filter(a => a.type === 'quiz').length * 5) + " " + t("dashboard.stats.minutes") }
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-transparent hover:border-outline-variant/30 transition-colors">
              <div className="p-3 bg-primary/10 rounded-xl">
                {stat.icon}
              </div>
              <div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{stat.label}</p>
                <div className="font-headline-md text-headline-md text-on-surface">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* History Table */}
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">{t("dashboard.history.title")}</h2>
        <div className="glass-card rounded-3xl p-6 mb-12 overflow-x-auto shadow-sm">
          {isFetching ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center p-8 text-on-surface-variant">
              <p className="mb-4">{t("dashboard.history.empty")}</p>
              <Link href="/interview" className="text-primary font-bold hover:underline">{t("dashboard.history.startFirst")}</Link>
            </div>
          ) : (
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  <th className="p-4 font-bold text-on-surface-variant text-start">{t("dashboard.history.date")}</th>
                  <th className="p-4 font-bold text-on-surface-variant text-start">{t("dashboard.history.typeJob")}</th>
                  <th className="p-4 font-bold text-on-surface-variant text-start">{t("dashboard.history.score")}</th>
                  <th className="p-4 font-bold text-on-surface-variant text-center">{t("dashboard.history.action")}</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id} className="border-b border-outline-variant/20 hover:bg-surface-variant/30 transition-colors">
                    <td className="p-4 text-start">{activity.createdAt?.toDate ? new Date(activity.createdAt.toDate()).toLocaleDateString() : t("dashboard.history.notAvailable")}</td>
                    <td className="p-4 text-start">
                      <div className="font-bold flex items-center gap-2">
                        {activity.type === 'quiz' ? <ListChecks className="w-4 h-4 text-tertiary" /> : <Mic className="w-4 h-4 text-primary" />}
                        {activity.company || t("dashboard.history.notSpecified")}
                      </div>
                      <div className="text-sm text-on-surface-variant">{activity.jobTitle || t("dashboard.history.notSpecified")}</div>
                    </td>
                    <td className="p-4 text-start">
                      {activity.type === 'interview' ? (
                        activity.analysis?.score ? (
                          <span className={`font-bold ${activity.analysis.score >= 80 ? 'text-green-500' : activity.analysis.score >= 50 ? 'text-yellow-500' : 'text-error'}`}>
                            {activity.analysis.score}%
                          </span>
                        ) : (
                          <span className="text-on-surface-variant text-sm">{t("dashboard.history.pending")}</span>
                        )
                      ) : (
                        <span className={`font-bold ${activity.score !== undefined && activity.total ? ((activity.score / activity.total) >= 0.8 ? 'text-green-500' : (activity.score / activity.total) >= 0.5 ? 'text-yellow-500' : 'text-error') : ''}`}>
                          {activity.score} / {activity.total}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {activity.type === 'interview' ? (
                        <Link href={`/gap-analyzer?interviewId=${activity.id}`} className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full font-bold hover:bg-secondary/20 transition-colors text-sm">
                          <FileText className="w-4 h-4" /> {t("dashboard.history.viewReport")}
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-2 bg-tertiary/10 text-tertiary px-4 py-2 rounded-full font-bold text-sm">
                            {t("dashboard.history.quizCompleted")}
                          </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Actions */}
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">{t("dashboard.actions.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          <Link href="/interview" className="glass-card group flex flex-col items-start p-8 rounded-3xl border-2 border-transparent hover:border-primary/30 transition-all hover:shadow-lg relative overflow-hidden">
            <div className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <Mic className="w-7 h-7" />
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-2">{t("dashboard.actions.interview.title")}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">{t("dashboard.actions.interview.desc")}</p>
            <div className="flex items-center gap-2 text-primary font-bold mt-auto group-hover:gap-4 transition-all">
              {t("dashboard.actions.interview.btn")} <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />
            </div>
          </Link>

          <Link href="/gap-analyzer" className="glass-card group flex flex-col items-start p-8 rounded-3xl border-2 border-transparent hover:border-secondary/30 transition-all hover:shadow-lg relative overflow-hidden">
            <div className="w-14 h-14 bg-secondary text-on-secondary rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="font-headline-md text-headline-md text-secondary mb-2">{t("dashboard.actions.gap.title")}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">{t("dashboard.actions.gap.desc")}</p>
            <div className="flex items-center gap-2 text-secondary font-bold mt-auto group-hover:gap-4 transition-all">
              {t("dashboard.actions.gap.btn")} <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />
            </div>
          </Link>

          <Link href="/quiz" className="glass-card group flex flex-col items-start p-8 rounded-3xl border-2 border-transparent hover:border-tertiary/30 transition-all hover:shadow-lg relative overflow-hidden">
            <div className="w-14 h-14 bg-tertiary text-on-primary rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <ListChecks className="w-7 h-7" />
            </div>
            <h3 className="font-headline-md text-headline-md text-tertiary mb-2">{t("dashboard.actions.quiz.title")}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">{t("dashboard.actions.quiz.desc")}</p>
            <div className="flex items-center gap-2 text-tertiary font-bold mt-auto group-hover:gap-4 transition-all">
              {t("dashboard.actions.quiz.btn")} <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />
            </div>
          </Link>
        </div>
      </main>

      <Footer />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
