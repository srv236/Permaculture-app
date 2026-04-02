"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Image as ImageIcon, MapPin, Globe, Ruler } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/utils/upload";
import { showSuccess, showError } from "@/utils/toast";
import { useSession } from "./SessionProvider";

interface AddFarmDialogProps {
  onSuccess: () => void;
}

export const AddFarmDialog = ({ onSuccess }: AddFarmDialogProps) => {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    address: "",
    latitude: "",
    longitude: "",
    google_maps_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation: At least one location field must be filled
    const hasLocation = formData.address || (formData.latitude && formData.longitude) || formData.google_maps_url;
    
    if (!hasLocation) {
      showError("Please provide at least one location: Address, Coordinates, or Google Maps link.");
      return;
    }

    setLoading(true);

    try {
      let pictureUrl = "";
      if (imageFile) {
        pictureUrl = await uploadImage(imageFile, "profile_pictures");
      }

      const { error } = await supabase
        .from('farms')
        .insert({
          user_id: user.id,
          name: formData.name,
          size: formData.size,
          address: formData.address,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          google_maps_url: formData.google_maps_url,
          picture_url: pictureUrl,
        });

      if (error) throw error;

      showSuccess("Farm added successfully!");
      setOpen(false);
      setFormData({ name: "", size: "", address: "", latitude: "", longitude: "", google_maps_url: "" });
      setImageFile(null);
      onSuccess();
    } catch (error: any) {
      showError(error.message || "Failed to add farm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Farm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Farm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Farm Name</Label>
              <Input 
                id="name" 
                placeholder="e.g. Green Valley" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Farm Size</Label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="size" 
                  className="pl-10"
                  placeholder="e.g. 2 hectares" 
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <p className="text-sm font-medium text-slate-500">Location (Provide at least one)</p>
            
            <div className="space-y-2">
              <Label htmlFor="address">Manual Address</Label>
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
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label htmlFor="image">Farm Picture (Optional)</Label>
            <div className="flex items-center gap-4">
              <Input 
                id="image" 
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => document.getElementById('image')?.click()}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                {imageFile ? imageFile.name : "Upload Image"}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-emerald-600" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Farm"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};