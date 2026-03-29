"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Sprout, 
  BookOpen, 
  MapPin, 
  ArrowRight, 
  Leaf, 
  Droplets, 
  Sun, 
  Users,
  Instagram
} from "lucide-react";
import { Link } from "react-router-dom";

const LOGO_URL = "https://ugc.production.linktr.ee/2709b2db-5589-432c-92ea-5fdce99252ca_aolpclogo.jpeg?io=true&size=avatar-v3_0";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-50/50 -z-10" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
                <Sprout className="w-4 h-4" />
                Art of Living Permaculture
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                Regenerating Earth, <br />
                <span className="text-emerald-600">Nourishing Lives</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl">
                A 5-acre model farm at the Art of Living International Center, Bangalore, 
                demonstrating how we can live in harmony with nature while producing 
                abundant, nutrient-dense food.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/market">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 h-14 px-8 text-lg rounded-full">
                    Explore the Market
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a href="#courses">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    Our Courses
                  </Button>
                </a>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
                <div className="absolute inset-0 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse" />
                <img 
                  src={LOGO_URL} 
                  alt="AOLPC Logo" 
                  className="relative z-10 w-full h-full object-cover rounded-full border-8 border-white shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The 5-Acre Model</h2>
            <p className="text-slate-600 text-lg">
              Our farm serves as a living laboratory for sustainable agriculture, 
              focusing on four key pillars of ecological restoration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Leaf className="w-8 h-8 text-emerald-600" />,
                title: "Soil Health",
                desc: "Building living soil through composting, mulching, and zero-chemical interventions."
              },
              {
                icon: <Droplets className="w-8 h-8 text-blue-500" />,
                title: "Water Conservation",
                desc: "Harvesting every drop through swales, ponds, and efficient irrigation systems."
              },
              {
                icon: <Sun className="w-8 h-8 text-amber-500" />,
                title: "Biodiversity",
                desc: "Creating a resilient ecosystem with multi-layered food forests and companion planting."
              },
              {
                icon: <Users className="w-8 h-8 text-purple-500" />,
                title: "Community",
                desc: "Empowering farmers and urban dwellers with the skills to grow their own food."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="mb-6 p-3 bg-slate-50 inline-block rounded-2xl">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Learn Permaculture</h2>
              <p className="text-slate-600 text-lg mb-8">
                We offer comprehensive training programs designed to take you from 
                a beginner to a confident practitioner of sustainable living.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4 p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="bg-white p-3 rounded-xl shadow-sm h-fit">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-emerald-900 mb-1">Basic Course</h4>
                    <p className="text-emerald-800/70">An introduction to the ethics, principles, and basic techniques of permaculture design.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="bg-white p-3 rounded-xl shadow-sm h-fit">
                    <Sprout className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">Advanced Course</h4>
                    <p className="text-slate-600">Deep dive into complex system design, water management, and professional implementation.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-emerald-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
              <h3 className="text-3xl font-bold mb-6 relative z-10">Visit the Farm</h3>
              <p className="text-emerald-100 mb-8 relative z-10 leading-relaxed">
                Experience the magic of permaculture firsthand. Our model farm is located 
                within the serene Bangalore Ashram.
              </p>
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <MapPin className="text-emerald-400" />
                <span>Art of Living International Center, Bangalore</span>
              </div>
              <Button className="w-full bg-white text-emerald-900 hover:bg-emerald-50 h-14 text-lg font-bold rounded-2xl relative z-10">
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Market CTA */}
      <section className="py-24 bg-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Support Local Producers</h2>
          <p className="text-emerald-50 text-xl mb-12 max-w-2xl mx-auto">
            Our graduates are growing amazing produce across the country. 
            Buy directly from them and support the movement.
          </p>
          <Link to="/market">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 h-16 px-12 text-xl font-bold rounded-full shadow-xl">
              Go to Market
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-800 pb-12 mb-12">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Logo" className="w-10 h-10 rounded-full" />
              <span className="text-white font-bold text-xl">AOL Permaculture</span>
            </div>
            <div className="flex gap-6">
              <a href="https://www.instagram.com/aolpermaculture/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div className="text-center text-sm">
            <p>© 2024 Art of Living Permaculture Department. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;