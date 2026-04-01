"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Loader2, User, MapPin, Globe, Lock, ShieldCheck } from "lucide-react";
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
    address: profile.address || "",
    latitude: profile.latitude?.toString() || "",
    longitude: profile.longitude?.toString() || "",
    google_maps_url: profile.google_maps_url || "",
    about: profile.about || "",
    basic_course_date: profile.basic_course_date || "",
    advanced_course_date: profile.advanced_course_date || "",
    practitioner_since: profile.practitioner_since || "",
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
          about: profile.is_verified ? formData.about : profile.about,
          basic_course_date: formData.basic_course_date || null,
          advanced_course_date: formData.advanced_course_date || null,
          practitioner_since: formData.practitioner_since || null,
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
            <div className="flex items-center justify-between">
              <Label htmlFor="about">About Yourself / Your Story</Label>
              {!profile.is_verified && (
                <span className="text-[10px] text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Lock className="w-2 h-2" /> Verified Only
                </span>
              )}
            </div>
            <Textarea 
              id="about" 
              placeholder={profile.is_verified ? "Tell the community about your permaculture journey..." : "This section will be unlocked once your account is verified."}
              value={formData.about}
              onChange={(e) => setFormData({...formData, about: e.target.value})}
              disabled={!profile.is_verified}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase text-slate-400">Basic Course</Label>
              <Input 
                type="date" 
                className="h-8 text-xs"
                value={formData.basic_course_date}
                onChange={(e) => setFormData({...formData, basic_course_date: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase text-slate-400">Advanced Course</Label>
              <Input 
                type="date" 
                className="h-8 text-xs"
                value={formData.advanced_course_date}
                onChange={(e) => setFormData({...formData, advanced_course_date: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase text-slate-400">Practitioner Since</Label>
              <Input 
                type="date" 
                className="h-8 text-xs"
                value={formData.practitioner_since}
                onChange={(e) => setFormData({...formData, practitioner_since: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label htmlFor="address">Farm Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="address" 
                className="pl-10"
                placeholder="123 Permaculture Way"
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
                value={formData.longitude}
                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
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
            <Label htmlFor="picture">Farm Picture</Label>
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