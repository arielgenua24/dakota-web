"use client";

import Image from "next/image";

export default function WhatsappButton({ sendMessage }: { sendMessage: () => void }) {

  return (
    <button
      onClick={sendMessage}
      aria-label="Contactar por WhatsApp"
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 1000,
        backgroundColor: '#fff',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <Image style={{zIndex: 1001}} src="/images/whatsapp.png" alt="WhatsApp" width={32} height={32} />
    </button>
  );
}
