"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, AlertCircle, Loader2, Calendar, Facebook, Instagram, Youtube, Globe, Smartphone } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { signUp } from "@/api/auth";
import { createProfile } from "@/api/profiles";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    alt_phone: "",
    password: "",
    about: "",
    facebook_url: "",
    instagram_url: "",
    youtube_url: "",
    website_url: "",
    has_completed_basic: false,
    basic_completion_date: "",
    has_completed_advanced: false,
    advanced_completion_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.has_completed_basic || !formData.has_completed_advanced) {
      showError("You must have completed both Basic and Advanced courses to join.");
      return;
    }

    setLoading(true);
    try {
      const authData = await signUp(formData.email, formData.password);

      if (authData.user) {
        await createProfile({
            id: authData.user.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            alt_phone: formData.alt_phone || null,
            about: formData.about,
            facebook_url: formData.facebook_url || null,
            instagram_url: formData.instagram_url || null,
            youtube_url: formData.youtube_url || null,
            website_url: formData.website_url || null,
            has_completed_basic: formData.has_completed_basic,
            basic_course_date: formData.basic_completion_date || null,
            has_completed_advanced: formData.has_completed_advanced,
            advanced_course_date: formData.advanced_completion_date || null,
            is_verified: false,
            is_admin: false,
          });

        showSuccess("Registration successful!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      showError(error.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="border-emerald-100 shadow-xl rounded-3xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center">
              < GraduationCap className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-emerald-900">Join the Permafolk Network</CardTitle>
              <CardDescription>
                Share your regenerative journey with the community.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-bold mb-1">Mandatory Requirement</p>
                <p>Registration requires completion of both <strong>Basic and Advanced Permaculture Courses</strong>.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="about">About Your Journey</Label>
                  <Textarea 
                    id="about" 
                    placeholder="Tell us about your farm and permaculture practice..." 
                    className="min-h-[100px] rounded-xl"
                    value={formData.about}
                    onChange={(e) => setFormData({...formData, about: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      required 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+91 00000 00000" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alt_phone">Alternate Phone (Optional)</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        id="alt_phone" 
                        type="tel" 
                        className="pl-10"
                        placeholder="+91 00000 00000" 
                        value={formData.alt_phone}
                        onChange={(e) => setFormData({...formData, alt_phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm font-bold text-slate-700">Social Media & Links (Optional)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook URL</Label>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                      <Input 
                        id="facebook" 
                        className="pl-10"
                        placeholder="facebook.com/yourprofile" 
                        value={formData.facebook_url}
                        onChange={(e) => setFormData({...formData, facebook_url: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram URL</Label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-600" />
                      <Input 
                        id="instagram" 
                        className="pl-10"
                        placeholder="instagram.com/yourprofile" 
                        value={formData.instagram_url}
                        onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube URL</Label>
                    <div className="relative">
                      <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                      <Input 
                        id="youtube" 
                        className="pl-10"
                        placeholder="youtube.com/@yourchannel" 
                        value={formData.youtube_url}
                        onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website Link</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                      <Input 
                        id="website" 
                        className="pl-10"
                        placeholder="www.yourfarm.com" 
                        value={formData.website_url}
                        onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="basic" 
                      checked={formData.has_completed_basic}
                      onCheckedChange={(checked) => setFormData({...formData, has_completed_basic: checked as boolean})}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="basic" className="text-sm font-medium text-emerald-900">
                        I have completed the Basic Permaculture Course
                      </Label>
                    </div>
                  </div>
                  {formData.has_completed_basic && (
                    <div className="pl-7 space-y-2">
                      <Label htmlFor="basic_date" className="text-xs">Completion Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                          id="basic_date" 
                          type="date" 
                          className="pl-10 h-10 rounded-xl"
                          value={formData.basic_completion_date}
                          onChange={(e) => setFormData({...formData, basic_completion_date: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="advanced" 
                      checked={formData.has_completed_advanced}
                      onCheckedChange={(checked) => setFormData({...formData, has_completed_advanced: checked as boolean})}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="advanced" className="text-sm font-medium text-emerald-900">
                        I have completed the Advanced Permaculture Course
                      </Label>
                    </div>
                  </div>
                  {formData.has_completed_advanced && (
                    <div className="pl-7 space-y-2">
                      <Label htmlFor="advanced_date" className="text-xs">Completion Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                          id="advanced_date" 
                          type="date" 
                          className="pl-10 h-10 rounded-xl"
                          value={formData.advanced_completion_date}
                          onChange={(e) => setFormData({...formData, advanced_completion_date: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 text-lg rounded-2xl"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Register;