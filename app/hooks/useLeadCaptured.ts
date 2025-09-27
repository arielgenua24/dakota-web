"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "leadCaptured";
const COOKIE_VALUE = `${STORAGE_KEY}=true; Max-Age=31536000; Path=/`;

const readCookie = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie ? document.cookie.split(";") : [];

  for (const cookie of cookies) {
    const [rawKey, ...rest] = cookie.trim().split("=");
    if (rawKey === name) {
      return rest.join("=") || "";
    }
  }

  return null;
};

const writeCookie = (value: string) => {
  if (typeof document === "undefined") {
    return;
  }

  try {
    document.cookie = value;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to write cookie", error);
    }
  }
};

export const useLeadCaptured = () => {
  const [isCaptured, setIsCaptured] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let captured = false;

    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      captured = storedValue === "true";
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("LocalStorage unavailable for leadCaptured", error);
      }
    }

    if (!captured) {
      const cookieValue = readCookie(STORAGE_KEY);
      captured = cookieValue === "true";
    }

    setIsCaptured(captured);
  }, []);

  const markCaptured = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Unable to persist leadCaptured in localStorage", error);
      }
    }

    writeCookie(COOKIE_VALUE);
    setIsCaptured(true);
  }, []);

  return {
    ready: isCaptured !== null,
    isCaptured: Boolean(isCaptured),
    markCaptured,
  };
};
