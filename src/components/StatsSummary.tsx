"use client";

import { Users, ShoppingBasket, MapPin } from "lucide-react";

interface StatsSummaryProps {
  totalProducers: number;
  totalProducts: number;
  totalLocations: number;
}

export const StatsSummary = ({ totalProducers, totalProducts, totalLocations }: StatsSummaryProps) => {
  const stats = [
    {
      label: "Producers",
      value: totalProducers,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Products",
      value: totalProducts,
      icon: ShoppingBasket,
      color: "text-emerald-600",
    },
    {
      label: "Locations",
      value: totalLocations,
      icon: MapPin,
      color: "text-amber-600",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-12 py-4 border-y border-slate-200 bg-white/50 rounded-lg">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2">
          <stat.icon className={`w-5 h-5 ${stat.color}`} />
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-slate-900">{stat.value}</span>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};