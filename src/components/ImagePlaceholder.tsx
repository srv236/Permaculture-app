"use client";

import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  text?: string;
  className?: string;
}

export const ImagePlaceholder = ({ text = "No Image", className }: ImagePlaceholderProps) => {
  return (
    <div className={cn(
      "w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 gap-2 p-4 min-h-[100px]",
      className
    )}>
      <ImageIcon className="w-1/4 h-1/4 opacity-20" />
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-center">
        {text}
      </span>
    </div>
  );
};