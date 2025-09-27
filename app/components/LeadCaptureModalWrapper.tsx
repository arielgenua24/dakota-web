"use client";

import dynamic from "next/dynamic";

const LeadCaptureModal = dynamic(() => import("@/app/components/LeadCaptureModal"), {
  ssr: false
});

export default function LeadCaptureModalWrapper() {
  return <LeadCaptureModal />;
}