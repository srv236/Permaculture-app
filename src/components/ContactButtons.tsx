import { Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ContactButtonsProps {
  phone: string;
  email: string;
  name: string;
}

export const ContactButtons = ({ phone, email, name }: ContactButtonsProps) => {
  const cleanPhone = phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi ${name}, I saw your produce on the Farm Network!`;

  return (
    <div className="flex gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        className="flex-1 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
        onClick={() => window.open(whatsappUrl, "_blank")}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={() => window.location.href = `tel:${phone}`}
      >
        <Phone className="w-4 h-4 mr-2" />
        Call
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={() => window.location.href = `mailto:${email}`}
      >
        <Mail className="w-4 h-4 mr-2" />
        Email
      </Button>
    </div>
  );
};