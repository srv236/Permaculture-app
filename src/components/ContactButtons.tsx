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
    <div className="flex flex-wrap gap-2 mt-4">
      <Button
        variant="secondary"
        size="sm"
        className="flex-1 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 font-semibold min-w-[100px]"
        onClick={() => window.open(whatsappUrl, "_blank")}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="flex-1 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-semibold min-w-[80px]"
        onClick={() => window.location.href = `tel:${phone}`}
      >
        <Phone className="w-4 h-4 mr-2" />
        Call
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="flex-1 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-semibold min-w-[80px]"
        onClick={() => window.location.href = `mailto:${email}`}
      >
        <Mail className="w-4 h-4 mr-2" />
        Email
      </Button>
    </div>
  );
};