"use client";

import { UserPlus, Sprout, ShoppingBag } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "1. Register & Verify",
      desc: "Join the network and complete our mandatory permaculture courses to get verified."
    },
    {
      icon: Sprout,
      title: "2. List Your Farm",
      desc: "Add your farm details, location, and showcase your sustainable practices."
    },
    {
      icon: ShoppingBag,
      title: "3. Share Your Harvest",
      desc: "List your fresh produce and connect directly with the community."
    }
  ];

  return (
    <div className="py-16 bg-emerald-50/50 rounded-3xl mb-16 px-8">
      <h2 className="text-3xl font-bold text-center text-emerald-900 mb-12">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.title} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 text-center transition-all hover:shadow-md">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <step.icon className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
            <p className="text-slate-600 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};