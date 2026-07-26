"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { userService } from "@/services/user.service";
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
        // Set the actual idToken as an HttpOnly cookie via the server API
        const token = await currentUser.getIdToken();
        try {
          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
        } catch (error) {
          console.error("Failed to set auth session:", error);
        }
        
        try {
          await userService.createUserProfileIfNotExists(currentUser.uid, {
            name: currentUser.displayName || "Anonymous User",
            email: currentUser.email,
            photoURL: currentUser.photoURL || "",
            totalScore: 0,
            roleKey: "softwareEngineer",
            levelKey: "beginner",
          });
        } catch (error) {
          console.error("Error setting up user profile:", error instanceof Error ? error.message : "Unknown error");
        }
      } else {
        // Remove the auth cookie on logout via the server API
        try {
          await fetch("/api/auth/session", { method: "DELETE" });
        } catch (error) {
          console.error("Failed to clear auth session:", error);
        }
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
