"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LogIn, Loader2 } from "lucide-react";
import { showError } from "@/utils/toast";
import { signIn } from "@/api/auth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Invalid login credentials.";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-md">
        <Card className="border-emerald-100 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <LogIn className="w-6 h-6 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-900">Permafolk Login</CardTitle>
            <CardDescription>
              Manage your farm profile and permaculture projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="john@example.com" 
                  autoComplete="email"
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  autoComplete="current-password"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-11"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </Button>
              <p className="text-center text-sm text-slate-500 mt-4">
                Don't have an account?{" "}
                <Link to="/register" className="text-emerald-600 font-medium hover:underline">
                  Register here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Login;