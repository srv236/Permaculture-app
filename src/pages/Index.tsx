"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Leaf, GraduationCap, Users, Phone, Mail, Globe } from "lucide-react";
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
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                <Leaf className="w-4 h-4" />
                Art of Living Permaculture
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-emerald-950 leading-tight">
                Bringing Ecology & <br />
                <span className="text-emerald-600">Agriculture Together</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0">
                Join our mission to create sustainable, regenerative ecosystems that nourish both people and the planet.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link to="/market">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 h-14 px-8 text-lg rounded-full">
                    Explore the Market
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  Learn About Courses
                </Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse" />
                <img 
                  src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800" 
                  alt="Permaculture Garden" 
                  className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl border-8 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-emerald-950 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-800 shadow-2xl mx-auto">
              <img 
                src={LOGO_URL} 
                alt="AOLPC Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold">Our Vision</h2>
            <p className="text-xl text-emerald-100 leading-relaxed">
              Art of Living Permaculture is dedicated to teaching and implementing regenerative agricultural practices. 
              We believe in working with nature, not against it, to create resilient food systems and healthy communities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
              <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800">
                <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Regenerative</h3>
                <p className="text-emerald-200 text-sm">Restoring soil health and biodiversity through natural methods.</p>
              </div>
              <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800">
                <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Educational</h3>
                <p className="text-emerald-200 text-sm">Empowering individuals with the knowledge to grow their own food.</p>
              </div>
              <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800">
                <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-emerald-200 text-sm">Building a network of certified producers and conscious consumers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-emerald-950">Our Courses</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Become a certified permaculture producer through our comprehensive training programs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-emerald-100 shadow-xl hover:shadow-2xl transition-shadow overflow-hidden">
              <div className="h-48 bg-emerald-600 flex items-center justify-center">
                <GraduationCap className="w-20 h-20 text-white opacity-20" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-emerald-900">Basic Permaculture Course</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Learn the fundamental principles of permaculture, soil health, and water management. 
                  Perfect for beginners and home gardeners.
                </p>
                <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  View Details
                </Button>
              </CardContent>
            </Card>
            <Card className="border-emerald-100 shadow-xl hover:shadow-2xl transition-shadow overflow-hidden">
              <div className="h-48 bg-emerald-800 flex items-center justify-center">
                <GraduationCap className="w-20 h-20 text-white opacity-20" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-emerald-900">Advanced Permaculture Course</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Deep dive into ecosystem design, food forests, and sustainable farm management. 
                  Required for listing produce on our market.
                </p>
                <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  View Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-emerald-50 rounded-3xl p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl font-bold text-emerald-950">Get in Touch</h2>
              <p className="text-lg text-slate-600">
                Have questions about our courses or the market? Reach out to our team.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-emerald-900 font-medium">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Phone className="w-5 h-5 text-emerald-600" />
                  </div>
                  7204236309
                </div>
                <div className="flex items-center gap-4 text-emerald-900 font-medium">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                  permaculture@artofliving.org
                </div>
                <div className="flex items-center gap-4 text-emerald-900 font-medium">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Globe className="w-5 h-5 text-emerald-600" />
                  </div>
                  bangaloreashram.org/permaculture
                </div>
              </div>
            </div>
            <div className="flex-1 text-center space-y-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1560365163-3e8d64e762ef?auto=format&fit=crop&q=80&w=200&h=200" 
                  alt="Binay Kumar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-emerald-950">Binay Kumar</h3>
                <p className="text-emerald-600 font-medium">Permaculturist</p>
              </div>
              <p className="text-slate-500 italic">
                "Bringing ecology and agriculture together for a sustainable future."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-100 py-12">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="flex justify-center">
            <img src={LOGO_URL} alt="AOLPC Logo" className="w-12 h-12 rounded-full opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
          <p className="text-sm opacity-70">
            © 2024 Art of Living Permaculture Department. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;