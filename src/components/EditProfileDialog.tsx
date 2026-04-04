"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Loader2, User, MapPin, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/utils/upload";
import { showSuccess, showError } from "@/utils/toast";
import { Producer } from "@/types/farm";

interface EditProfileDialogProps {
  profile: Producer;
  onSuccess: () => void;
}

export const EditProfileDialog = ({ profile, onSuccess }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: profile.name,
    farm_name: profile.farm_name,
    phone: profile.phone,
    address: (profile as any).address || "",
    latitude: (profile as any).latitude?.toString() || "",
    longitude: (profile as any).longitude?.toString() || "",
    google_maps_url: (profile as any).google_maps_url || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let pictureUrl = profile.picture_url;
      if (imageFile) {
        pictureUrl = await uploadImage(imageFile, "profile_pictures");
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          farm_name: formData.farm_name,
          phone: formData.phone,
          address: formData.address,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          google_maps_url: formData.google_maps_url,
          picture_url: pictureUrl,
        })
        .eq('id', profile.id);

      if (error) throw error;

      showSuccess("Profile updated successfully!");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      showError(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mt-4">
          <Edit2 className="w-3 h-3 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Farm Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farm_name">Farm Name</Label>
              <Input 
                id="farm_name" 
                value={formData.farm_name}
                onChange={(e) => setFormData({...formData, farm_name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Producer Name</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Farm Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="address" 
                className="pl-10"
                placeholder="123 Permaculture Way, Green Valley"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input 
                id="latitude" 
                type="number" 
                step="any"
                placeholder="-23.5505"
                value={formData.latitude}
                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input 
                id="longitude" 
                type="number" 
                step="any"
                placeholder="-46.6333"
                value={formData.longitude}
                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maps_url">Google Maps Link</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="maps_url" 
                className="pl-10"
                placeholder="https://goo.gl/maps/..."
                value={formData.google_maps_url}
                onChange={(e) => setFormData({...formData, google_maps_url: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="picture">Farm Picture (Optional)</Label>
            <div className="flex items-center gap-4">
              <Input 
                id="picture" 
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => document.getElementById('picture')?.click()}
              >
                <User className="w-4 h-4 mr-2" />
                {imageFile ? imageFile.name : "Change Picture"}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-emerald-600" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};