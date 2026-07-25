"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore/lite";
import dynamic from "next/dynamic";

const AuthModal = dynamic(() => import("@/components/AuthModal"), { ssr: false });

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Set the actual idToken as the cookie so Next.js middleware can verify it
        const token = await currentUser.getIdToken();
        document.cookie = `auth=${token}; path=/; max-age=3600; SameSite=Lax; Secure`;
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              name: currentUser.displayName || "Anonymous User",
              email: currentUser.email,
              photoURL: currentUser.photoURL || "",
              totalScore: 0,
              roleKey: "softwareEngineer",
              levelKey: "beginner",
              createdAt: serverTimestamp(),
            });
          }
        } catch (error) {
          console.error("Error setting up user profile:", error instanceof Error ? error.message : "Unknown error");
        }
      } else {
        // Remove the auth cookie on logout
        document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error instanceof Error ? error.message : "Unknown error");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error instanceof Error ? error.message : "Unknown error");
    }
  };

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, isAuthModalOpen, openAuthModal, closeAuthModal }}>
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
};
