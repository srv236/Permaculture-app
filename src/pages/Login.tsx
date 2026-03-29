"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/components/SessionProvider';

const Login = () => {
  const { session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Sign in to manage your produce listings</p>
          </div>
          <Auth
            supabaseClient={supabase}
            providers={[]}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#059669',
                    brandAccent: '#047857',
                  },
                  radii: {
                    buttonRadius: '1rem',
                    inputRadius: '1rem',
                  }
                }
              }
            }}
            theme="light"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;