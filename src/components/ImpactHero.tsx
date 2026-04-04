import { MapPin, Sprout, ShoppingBasket, Users, Ruler } from "lucide-react";

interface ImpactStats {
  locations: number;
  acres: number;
  products: number;
  farms: number;
  permafolk: number;
}

export const ImpactHero = ({ stats }: { stats: ImpactStats }) => {
  const items = [
    { label: "Locations", value: stats.locations, icon: MapPin, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Farm Acres", value: stats.acres, icon: Ruler, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Products", value: stats.products, icon: ShoppingBasket, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Farms", value: stats.farms, icon: Sprout, color: "text-lime-500", bg: "bg-lime-50" },
    { label: "Verified Permafolk", value: stats.permafolk, icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
      {items.map((item) => (
        <div key={item.label} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center text-center transition-transform hover:scale-105">
          <div className={`${item.bg} p-4 rounded-2xl mb-4`}>
            <item.icon className={`w-6 h-6 ${item.color}`} />
          </div>
          <span className="text-3xl font-black text-slate-900 mb-1">{item.value}</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
        </div>
      ))}
    </div>
  );
};