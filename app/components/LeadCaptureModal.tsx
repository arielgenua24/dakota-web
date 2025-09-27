"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useLeadCaptured } from "@/app/hooks/useLeadCaptured";

const MODAL_ROOT_ID = "lead-modal-root";
const API_PATH = "/api/lead";
const SUBMIT_TIMEOUT = 10_000;

type DataLayerWindow = Window & { dataLayer?: Array<Record<string, unknown>> };
type UTMParams = Partial<Record<"source" | "medium" | "campaign", string>>;

type LeadFormState = {
  name: string;
  phone: string;
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

const initialFormState: LeadFormState = {
  name: "",
  phone: "",
};

const ensurePortalRoot = () => {
  if (typeof document === "undefined") {
    return null;
  }

  let portalRoot = document.getElementById(MODAL_ROOT_ID);

  if (!portalRoot) {
    portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", MODAL_ROOT_ID);
    portalRoot.setAttribute("aria-live", "polite");
    document.body.appendChild(portalRoot);
  }

  return portalRoot;
};

const getUTMParams = (): UTMParams | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const url = new URL(window.location.href);
  const utmSource = url.searchParams.get("utm_source") || undefined;
  const utmMedium = url.searchParams.get("utm_medium") || undefined;
  const utmCampaign = url.searchParams.get("utm_campaign") || undefined;

  const utm: UTMParams = {};

  if (utmSource) utm.source = utmSource;
  if (utmMedium) utm.medium = utmMedium;
  if (utmCampaign) utm.campaign = utmCampaign;

  return Object.keys(utm).length ? utm : null;
};

const validatePhone = (value: string) => {
  const digits = value.replace(/[^0-9+]/g, "");
  return digits.length >= 6;
};

const LeadCaptureModal = () => {
  const { ready, isCaptured, markCaptured } = useLeadCaptured();
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const showToast = useCallback((message: string) => {
    if (typeof window === "undefined") {
      return;
    }

    if ("Toastify" in window) {
      return;
    }

    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = "fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-2 text-white shadow-lg transition-opacity";
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (isCaptured) {
      setIsOpen(false);
      return;
    }

    const portalRoot = ensurePortalRoot();
    portalRef.current = portalRoot as HTMLDivElement | null;
    setIsOpen(true);
  }, [isCaptured, ready]);

  const returnFocus = useCallback(() => {
    if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus();
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setFormState(initialFormState);
      setErrors({});
      setSubmissionState("idle");
      setErrorMessage(null);
    }, 200);
    returnFocus();
  }, [returnFocus]);

  const handleDismiss = useCallback(() => {
    if (submissionState === "submitting") {
      return;
    }
    closeModal();
  }, [closeModal, submissionState]);

  const handleInputChange = (field: keyof LeadFormState) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = useCallback(() => {
    const nextErrors: { name?: string; phone?: string } = {};
    if (!formState.name.trim()) {
      nextErrors.name = "Ingresá tu nombre";
    }
    if (!formState.phone.trim()) {
      nextErrors.phone = "Ingresá tu teléfono";
    } else if (!validatePhone(formState.phone)) {
      nextErrors.phone = "El teléfono debe tener al menos 6 dígitos";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [formState.name, formState.phone]);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (submissionState === "submitting") {
      return;
    }

    setSubmissionState("submitting");
    setErrorMessage(null);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, SUBMIT_TIMEOUT);

    const utm = getUTMParams();

    const payload = {
      name: formState.name.trim(),
      phone: formState.phone.trim(),
      source: "modal" as const,
      timestamp: new Date().toISOString(),
      ...(utm ? { utm } : {}),
    };

    let wasSuccessful = false;

    try {
      const response = await fetch(API_PATH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Non-2xx response");
      }

      markCaptured();
      wasSuccessful = true;
      setSubmissionState("success");
      if (typeof window !== "undefined") {
        (window as DataLayerWindow).dataLayer?.push({
          event: "lead_submit",
          method: "modal",
        });
      }
      showToast("¡Listo! Te contactamos con los precios especiales.");
      closeModal();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setErrorMessage("La conexión tardó demasiado. Intentá de nuevo.");
      } else {
        setErrorMessage("No se pudo enviar. Intentá de nuevo.");
      }
      setSubmissionState("error");
    } finally {
      window.clearTimeout(timeoutId);
      if (!wasSuccessful) {
        setSubmissionState((prev) => (prev === "submitting" ? "idle" : prev));
      }
    }
  }, [closeModal, formState.name, formState.phone, markCaptured, showToast, submissionState, validateForm]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const node = portalRef.current;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleDismiss();
        return;
      }

      if (event.key === "Tab" && node) {
        const focusableElements = Array.from(node.querySelectorAll<HTMLElement>(focusableSelectors)).filter((el) => !el.hasAttribute("disabled"));
        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        } else if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const timer = window.setTimeout(() => {
      firstInputRef.current?.focus();
    }, 100);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleDismiss, isOpen]);

  useEffect(() => {
    if (!isOpen || !portalRef.current) {
      return;
    }

    const { current: portalNode } = portalRef;

    const handleFocus = (event: FocusEvent) => {
      if (portalNode && !portalNode.contains(event.target as Node)) {
        event.stopPropagation();
        portalNode.querySelector<HTMLElement>("[role='dialog']")?.focus();
      }
    };

    document.addEventListener("focus", handleFocus, true);

    return () => {
      document.removeEventListener("focus", handleFocus, true);
    };
  }, [isOpen]);

  const overlayClickHandler = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (submissionState === "submitting") {
      return;
    }

    if (errors.name || errors.phone || errorMessage) {
      return;
    }

    if (event.target === event.currentTarget) {
      handleDismiss();
    }
  }, [errorMessage, errors.name, errors.phone, handleDismiss, submissionState]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!ready || isCaptured || !isOpen || !portalRef.current) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#1f1f1f]/90 backdrop-blur-sm"
      role="presentation"
      onMouseDown={overlayClickHandler}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-title"
        aria-describedby="lead-modal-subtitle"
        className="relative mx-4 w-full max-w-sm rounded-[32px] bg-white px-8 pb-8 pt-10 shadow-[0px_24px_60px_rgba(0,0,0,0.25)] focus:outline-none"
        tabIndex={-1}
      >
        <span className="pointer-events-none absolute -right-6 top-6 hidden h-16 w-16 rounded-full bg-white/40 blur-md sm:block" aria-hidden="true" />
        <button
          onClick={handleDismiss}
          aria-label="Cerrar"
          className="absolute right-6 top-6 h-8 w-8 rounded-full border border-black/10 bg-white text-black transition hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          type="button"
          disabled={submissionState === "submitting"}
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="mb-8 text-center">
          <h2 id="lead-modal-title" className="text-[17px] font-semibold tracking-[0.1em] text-black">
            THOREN
          </h2>
          <p className="mt-1 text-xs uppercase tracking-[0.32em] text-black/70">
            JEANS Y BUZOS PARA HOMBRE
          </p>
        </div>

        <p id="lead-modal-subtitle" className="text-center text-sm text-black/70">
          Inscribite para obtener:
        </p>
        <h3 className="mt-3 text-center text-[26px] font-semibold leading-[1.15] text-black">
          Precios especiales en jeans y buzos de hombre
        </h3>
        <p className="mt-1 text-center text-base text-black/80">
          Descuento mayorista + envío gratis
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="lead-name" className="sr-only">
              Nombre completo
            </label>
            <input
              ref={firstInputRef}
              id="lead-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Nombre completo"
              value={formState.name}
              onChange={handleInputChange("name")}
              className={cn(
                "w-full rounded-[12px] border border-black/10 bg-[#f4f4f4] px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10",
                errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
            />
            {errors.name ? (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="lead-phone" className="sr-only">
              Teléfono (WhatsApp)
            </label>
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Teléfono (WhatsApp)"
              value={formState.phone}
              onChange={handleInputChange("phone")}
              className={cn(
                "w-full rounded-[12px] border border-black/10 bg-[#f4f4f4] px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10",
                errors.phone && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
            />
            {errors.phone ? (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            ) : null}
          </div>

          {errorMessage ? (
            <p className="text-sm text-center text-red-500">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={submissionState === "submitting"}
            className="flex w-full items-center justify-center rounded-[12px] bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submissionState === "submitting" ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent" aria-hidden="true" />
                Enviando...
              </span>
            ) : (
              "Quiero mis precios especiales"
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={handleDismiss}
          className="mt-4 w-full text-center text-sm font-semibold text-black/40 underline-offset-2 hover:underline"
          disabled={submissionState === "submitting"}
        >
          No, gracias
        </button>

        <p className="mt-6 text-center text-xs text-black/40">
          Al enviar, aceptás ser contactado por nuestro equipo comercial.
        </p>
      </div>
    </div>,
    portalRef.current
  );
}

export default LeadCaptureModal;
