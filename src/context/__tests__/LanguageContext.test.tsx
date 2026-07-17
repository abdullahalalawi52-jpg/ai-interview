import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LanguageProvider, useLanguage } from "../LanguageContext";

// Simple test component to consume the context
function TestComponent() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="translated">{t("home.title")}</span>
      <button onClick={() => setLanguage("en")}>Set English</button>
      <button onClick={() => setLanguage("ar")}>Set Arabic</button>
    </div>
  );
}

describe("LanguageContext", () => {
  it("provides default language and translation", () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Initial state should be Arabic by default
    expect(screen.getByTestId("lang").textContent).toBe("ar");
    expect(screen.getByTestId("translated").textContent).toBeTruthy();
  });

  it("switches language and updates document properties", () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Switch to English
    act(() => {
      screen.getByText("Set English").click();
    });

    expect(screen.getByTestId("lang").textContent).toBe("en");
    expect(document.documentElement.dir).toBe("ltr");
    expect(document.documentElement.lang).toBe("en");

    // Switch back to Arabic
    act(() => {
      screen.getByText("Set Arabic").click();
    });

    expect(screen.getByTestId("lang").textContent).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(document.documentElement.lang).toBe("ar");
  });

  it("throws error if used outside provider", () => {
    // Suppress console.error for this specific expected throw
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => render(<TestComponent />)).toThrow(
      "useLanguage must be used within a LanguageProvider"
    );

    console.error = originalError;
  });
});
