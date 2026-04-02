"use client";

import { Users, ShoppingBasket, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      bg: "bg-blue-50",
    },
    {
      label: "Products",
      value: totalProducts,
      icon: ShoppingBasket,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Locations",
      value: totalLocations,
      icon: MapPin,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`${stat.bg} p-3 rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};