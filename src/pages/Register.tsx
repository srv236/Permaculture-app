import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GraduationCap, AlertCircle, Loader2, Calendar } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [hasCompletedCourse, setHasCompletedCourse] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    farmName: "",
    email: "",
    phone: "",
    password: "",
    basicCourseDate: "",
    advancedCourseDate: "",
    practitionerSince: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasCompletedCourse) return;

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: formData.name,
            farm_name: formData.farmName,
            email: formData.email,
            phone: formData.phone,
            has_completed_course: true,
            basic_course_date: formData.basicCourseDate || null,
            advanced_course_date: formData.advancedCourseDate || null,
            practitioner_since: formData.practitionerSince || null,
          });

        if (profileError) throw profileError;

        showSuccess("Registration successful! Your credentials will be verified shortly.");
        navigate("/");
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
        <Card className="border-emerald-100 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-emerald-900">Join the Producer Network</CardTitle>
              <CardDescription>
                Share your permaculture harvest with the community.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-bold mb-1">Mandatory Requirement</p>
                <p>Before registering, all farmers must have completed the <strong>Basic and Advanced Course</strong> of our Permaculture Department.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <Label htmlFor="farm">Farm Name</Label>
                    <Input 
                      id="farm" 
                      placeholder="Sunlight Acres" 
                      required 
                      value={formData.farmName}
                      onChange={(e) => setFormData({...formData, farmName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+1 (555) 000-0000" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">Basic Course Date</Label>
                    <Input 
                      type="date" 
                      required={hasCompletedCourse}
                      value={formData.basicCourseDate}
                      onChange={(e) => setFormData({...formData, basicCourseDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">Advanced Course Date</Label>
                    <Input 
                      type="date" 
                      required={hasCompletedCourse}
                      value={formData.advancedCourseDate}
                      onChange={(e) => setFormData({...formData, advancedCourseDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-slate-500">Practitioner Since</Label>
                    <Input 
                      type="date" 
                      required={hasCompletedCourse}
                      value={formData.practitionerSince}
                      onChange={(e) => setFormData({...formData, practitionerSince: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <Checkbox 
                  id="course" 
                  checked={hasCompletedCourse}
                  onCheckedChange={(checked) => setHasCompletedCourse(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="course"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-emerald-900"
                  >
                    I confirm I have completed the Basic and Advanced Permaculture courses.
                  </Label>
                  <p className="text-xs text-emerald-600">
                    Your credentials will be verified by our department.
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
                disabled={!hasCompletedCourse || loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Register;