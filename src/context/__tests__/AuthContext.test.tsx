// @vitest-environment jsdom
import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../AuthContext";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { getDoc, setDoc } from "firebase/firestore/lite";

// Mock Firebase
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("firebase/firestore/lite", () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({
  auth: {},
  googleProvider: {},
  db: {},
}));

vi.mock("next/dynamic", () => ({
  default: () => () => <div data-testid="auth-modal">Auth Modal</div>,
}));

const TestComponent = () => {
  const { user, loading, signInWithGoogle, logout, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="user">{user ? user.uid : "no user"}</div>
      <div data-testid="modal-state">{isAuthModalOpen.toString()}</div>
      
      <button onClick={signInWithGoogle}>Sign In</button>
      <button onClick={logout}>Logout</button>
      <button onClick={openAuthModal}>Open</button>
      <button onClick={closeAuthModal}>Close</button>
    </div>
  );
};

describe("AuthContext", () => {
  let onAuthStateChangedCallback: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Capture the callback passed to onAuthStateChanged
    (onAuthStateChanged as any).mockImplementation((auth: any, callback: any) => {
      onAuthStateChangedCallback = callback;
      return vi.fn(); // unsubscribe function
    });
  });

  it("provides loading state initially", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("loading").textContent).toBe("true");
    expect(screen.getByTestId("user").textContent).toBe("no user");
  });

  it("updates user state when authenticated", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simulate auth state change
    const mockUser = {
      uid: "123",
      displayName: "Test User",
      email: "test@example.com",
      getIdToken: vi.fn().mockResolvedValue("mock-token")
    };

    (getDoc as any).mockResolvedValue({ exists: () => true });

    await act(async () => {
      await onAuthStateChangedCallback(mockUser);
    });

    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("123");
    
    // Cookie should be set
    expect(document.cookie).toContain("auth=mock-token");
  });

  it("creates user profile if it does not exist", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const mockUser = {
      uid: "456",
      displayName: "New User",
      email: "new@example.com",
      getIdToken: vi.fn().mockResolvedValue("mock-token")
    };

    (getDoc as any).mockResolvedValue({ exists: () => false });

    await act(async () => {
      await onAuthStateChangedCallback(mockUser);
    });

    expect(setDoc).toHaveBeenCalled();
  });

  it("handles login and logout actions", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signInBtn = screen.getByText("Sign In");
    const logoutBtn = screen.getByText("Logout");

    await act(async () => {
      fireEvent.click(signInBtn);
    });
    expect(signInWithPopup).toHaveBeenCalled();

    await act(async () => {
      fireEvent.click(logoutBtn);
    });
    expect(signOut).toHaveBeenCalled();
  });

  it("manages AuthModal state", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("modal-state").textContent).toBe("false");

    await act(async () => {
      fireEvent.click(screen.getByText("Open"));
    });
    expect(screen.getByTestId("modal-state").textContent).toBe("true");

    await act(async () => {
      fireEvent.click(screen.getByText("Close"));
    });
    expect(screen.getByTestId("modal-state").textContent).toBe("false");
  });
});
