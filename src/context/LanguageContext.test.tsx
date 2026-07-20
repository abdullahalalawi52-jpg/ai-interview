import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider, useLanguage, TranslationKey } from "./LanguageContext";
import { expect, test, describe } from "vitest";

// A dummy component to consume the context and display values
const TestComponent = ({ translationKey, count }: { translationKey: TranslationKey | string; count?: number }) => {
  const { t, language, setLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="translated">{t(translationKey as TranslationKey, count !== undefined ? { count } : undefined)}</span>
      <button data-testid="change-lang" onClick={() => setLanguage("en")}>
        To English
      </button>
    </div>
  );
};

describe("LanguageContext & Pluralization", () => {
  test("translates standard static keys correctly in Arabic (default)", () => {
    render(
      <LanguageProvider>
        <TestComponent translationKey="nav.dashboard" />
      </LanguageProvider>
    );
    expect(screen.getByTestId("lang").textContent).toBe("ar");
    expect(screen.getByTestId("translated").textContent).toBe("لوحة التحكم");
  });

  test("translates standard static keys correctly in English when switched", () => {
    render(
      <LanguageProvider>
        <TestComponent translationKey="nav.dashboard" />
      </LanguageProvider>
    );
    fireEvent.click(screen.getByTestId("change-lang"));
    expect(screen.getByTestId("lang").textContent).toBe("en");
    expect(screen.getByTestId("translated").textContent).toBe("Dashboard");
  });

  describe("Arabic CLDR Pluralization Rules", () => {
    test("handles zero (0) rule", () => {
      render(
        <LanguageProvider>
          <TestComponent translationKey="testPlural" count={0} />
        </LanguageProvider>
      );
      expect(screen.getByTestId("translated").textContent).toBe("لا توجد مقابلات");
    });

    test("handles one (1) rule", () => {
      render(
        <LanguageProvider>
          <TestComponent translationKey="testPlural" count={1} />
        </LanguageProvider>
      );
      expect(screen.getByTestId("translated").textContent).toBe("مقابلة واحدة");
    });

    test("handles two (2) rule", () => {
      render(
        <LanguageProvider>
          <TestComponent translationKey="testPlural" count={2} />
        </LanguageProvider>
      );
      expect(screen.getByTestId("translated").textContent).toBe("مقابلتان");
    });

    test("handles few (3-10) rule", () => {
      render(
        <LanguageProvider>
          <TestComponent translationKey="testPlural" count={5} />
        </LanguageProvider>
      );
      expect(screen.getByTestId("translated").textContent).toBe("5 مقابلات");
    });

    test("handles many (11-99) rule", () => {
      render(
        <LanguageProvider>
          <TestComponent translationKey="testPlural" count={15} />
        </LanguageProvider>
      );
      expect(screen.getByTestId("translated").textContent).toBe("15 مقابلة");
    });

    test("handles other (100+) rule", () => {
      render(
        <LanguageProvider>
          <TestComponent translationKey="testPlural" count={100} />
        </LanguageProvider>
      );
      expect(screen.getByTestId("translated").textContent).toBe("100 مقابلة");
    });
  });

  describe("English CLDR Pluralization Rules", () => {
    test("handles zero (0) rule in English", () => {
      render(
        <LanguageProvider>
          <TestComponent translationKey="testPlural" count={0} />
        </LanguageProvider>
      );
      fireEvent.click(screen.getByTestId("change-lang"));
      expect(screen.getByTestId("translated").textContent).toBe("No interviews");
    });

    test("handles one (1) rule in English", () => {
      render(
        <LanguageProvider>
          <TestComponent translationKey="testPlural" count={1} />
        </LanguageProvider>
      );
      fireEvent.click(screen.getByTestId("change-lang"));
      expect(screen.getByTestId("translated").textContent).toBe("1 interview");
    });

    test("handles other rule in English", () => {
      render(
        <LanguageProvider>
          <TestComponent translationKey="testPlural" count={5} />
        </LanguageProvider>
      );
      fireEvent.click(screen.getByTestId("change-lang"));
      expect(screen.getByTestId("translated").textContent).toBe("5 interviews");
    });
  });
});
