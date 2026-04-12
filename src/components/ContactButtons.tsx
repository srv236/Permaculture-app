"use client";

import { Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ContactButtonsProps {
  phone: string;
  email: string;
  name: string;
}

export const ContactButtons = ({ phone, email, name }: ContactButtonsProps) => {
  const cleanPhone = phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi ${name}, I saw your profile on the Permaculture Network!`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 w-full">
      <Button
        variant="outline"
        className="w-full bg-white hover:bg-emerald-50 border-emerald-100 text-emerald-700 font-bold h-11 rounded-xl shadow-sm transition-all"
        onClick={() => window.open(whatsappUrl, "_blank")}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>
      <Button
        variant="outline"
        className="w-full bg-white hover:bg-blue-50 border-blue-100 text-blue-700 font-bold h-11 rounded-xl shadow-sm transition-all"
        onClick={() => window.location.href = `tel:${phone}`}
      >
        <Phone className="w-4 h-4 mr-2" />
        Call
      </Button>
      <Button
        variant="outline"
        className="w-full bg-white hover:bg-amber-50 border-amber-100 text-amber-700 font-bold h-11 rounded-xl shadow-sm transition-all"
        onClick={() => window.location.href = `mailto:${email}`}
      >
        <Mail className="w-4 h-4 mr-2" />
        Email
      </Button>
    </div>
  );
};