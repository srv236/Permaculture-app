"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Producer } from "@/types/farm";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2, MapPin, Phone, Building2, User } from "lucide-react";

interface ProfileFormProps {
  initialData: Producer;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProfileForm = ({ initialData, onSuccess, onCancel }: ProfileFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    farm_name: initialData.farm_name || "",
    phone: initialData.phone || "",
    email: initialData.email || "",
    locations: initialData.locations?.join(", ") || "",
    picture_url: initialData.picture_url || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          farm_name: formData.farm_name,
          phone: formData.phone,
          email: formData.email,
          locations: formData.locations.split(",").map(l => l.trim()).filter(l => l !== ""),
          picture_url: formData.picture_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', initialData.id);

      if (error) throw error;
      showSuccess("Profile updated successfully!");
      onSuccess();
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="farm_name" className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Farm Name
          </Label>
          <Input 
            id="farm_name" 
            placeholder="e.g. Green Earth Farm" 
            required 
            value={formData.farm_name}
            onChange={(e) => setFormData({ ...formData, farm_name: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            Producer Name
          </Label>
          <Input 
            id="name" 
            placeholder="Your full name" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            Phone Number
          </Label>
          <Input 
            id="phone" 
            placeholder="e.g. +91 98765 43210" 
            required 
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            Email Address
          </Label>
          <Input 
            id="email" 
            type="email"
            placeholder="your@email.com" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="locations" className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Locations (comma separated)
          </Label>
          <Input 
            id="locations" 
            placeholder="e.g. Bangalore, Mysore" 
            value={formData.locations}
            onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="picture_url">Profile Picture URL</Label>
          <Input 
            id="picture_url" 
            placeholder="https://example.com/your-photo.jpg" 
            value={formData.picture_url}
            onChange={(e) => setFormData({ ...formData, picture_url: e.target.value })}
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-8">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Profile
        </Button>
      </div>
    </form>
  );
};