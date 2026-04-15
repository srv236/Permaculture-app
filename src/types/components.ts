import { Produce, Farm, Producer } from "@/types/farm";
import { DialogProps } from "@radix-ui/react-dialog";

export interface StatsSummaryProps {
  totalProducers: number;
  totalProducts: number;
  totalLocations: number;
}

export interface SecureImageProps {
  path?: string | null;
  bucket: string;
  alt: string;
  className?: string;
  fallback?: string;
  coordinates?: { lat: number; lng: number };
}

export interface ProduceCardProps {
  produce: Produce;
}

export interface ProducerCardProps {
  producer: Producer;
  onClick?: () => void;
}

export interface PermafolkCardProps {
  permafolk: Producer;
  layout?: "grid" | "list" | "compact";
}

export interface FarmMapProps {
  farms: Farm[];
}

export interface ContactButtonsProps {
  phone?: string;
  email?: string;
  name: string;
}

export interface EditProfileDialogProps {
  profile: Producer;
  onSuccess?: () => void;
}

export interface EditProduceDialogProps {
  produce: Produce;
  onSuccess?: () => void;
}

export interface EditFarmDialogProps {
  farm: Farm;
  onSuccess?: () => void;
}

export interface AddProduceDialogProps {
  farmId: string;
  onSuccess?: () => void;
}

export interface AddFarmDialogProps {
  onSuccess?: () => void;
}
