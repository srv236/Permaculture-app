"use client";

import { Users, ShoppingBasket, MapPin, CheckCircle } from "lucide-react";

interface ImpactMetricsProps {
  totalFarms: number;
  totalProduce: number;
  totalVerified: number;
}

export const ImpactMetrics = ({ totalFarms, totalProduce, totalVerified }: ImpactMetricsProps) => {
  const stats = [
    { label: "Active Farms", value: totalFarms, icon: MapPin, color: "text-emerald-600" },
    { label: "Fresh Produce", value: totalProduce, icon: ShoppingBasket, color: "text-amber-600" },
    { label: "Verified Producers", value: totalVerified, icon: CheckCircle, color: "text-blue-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};