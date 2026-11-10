"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppFloatingButtonProps {
  customMessage?: string;
}

export default function WhatsAppFloatingButton({
  customMessage = "Namaste Saubhagya Sarees! I would like to enquire about your bridal and saree collections.",
}: WhatsAppFloatingButtonProps) {
  const whatsappUrl = `https://wa.me/919996088960?text=${encodeURIComponent(customMessage)}`;

  return (
    <aside aria-label="Customer Support">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Saubhagya Bridal Studio on WhatsApp"
        className="fixed bottom-20 md:bottom-8 right-5 z-40 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group border-2 border-white/20"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-semibold tracking-wide uppercase hidden sm:inline-block">
          Studio WhatsApp
        </span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      </a>
    </aside>
  );
}
