import { Search, UserPlus, ShoppingBag } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      title: "Join the Network",
      desc: "Register as a practitioner or a supporter. Verified practitioners can list their farms and harvests.",
      icon: UserPlus,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Discover Local Produce",
      desc: "Browse through a variety of permaculture-grown fruits, vegetables, and handmade products in your area.",
      icon: Search,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      title: "Support Regenerative Farming",
      desc: "Connect directly with producers to get fresh, nutrient-dense food while supporting sustainable practices.",
      icon: ShoppingBag,
      color: "bg-amber-100 text-amber-600"
    }
  ];

  return (
    <section className="py-20 bg-white rounded-[64px] border border-slate-100 px-8">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">How the Platform Works</h2>
        <p className="text-slate-500 text-lg leading-relaxed">
          [Placeholder Text: Our platform bridges the gap between permaculture practitioners and the community. 
          We provide a verified directory of sustainable farms and their seasonal harvests, ensuring that 
          regenerative agriculture thrives through direct community support.]
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {steps.map((step, i) => (
          <div key={i} className="relative">
            <div className={`${step.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0`}>
              <step.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 text-center md:text-left">{step.title}</h3>
            <p className="text-slate-500 leading-relaxed text-center md:text-left">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};