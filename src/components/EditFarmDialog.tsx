"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Loader2, Image as ImageIcon, MapPin, Globe, Ruler } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/utils/upload";
import { showSuccess, showError } from "@/utils/toast";
import { Farm } from "@/types/farm";

interface EditFarmDialogProps {
  farm: Farm;
  onSuccess: () => void;
}

export const EditFarmDialog = ({ farm, onSuccess }: EditFarmDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Parse size string "Value Unit"
  const sizeParts = farm.size?.split(" ") || ["", "Hectare"];
  const initialValue = sizeParts[0];
  const initialUnit = sizeParts[1] || "Hectare";

  const [formData, setFormData] = useState({
    name: farm.name,
    sizeValue: initialValue,
    sizeUnit: initialUnit,
    address: farm.address || "",
    latitude: farm.latitude?.toString() || "",
    longitude: farm.longitude?.toString() || "",
    google_maps_url: farm.google_maps_url || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let pictureUrl = farm.picture_url;
      if (imageFile) {
        pictureUrl = await uploadImage(imageFile, "profile_pictures");
      }

      const formattedSize = `${formData.sizeValue} ${formData.sizeUnit}`;

      const { error } = await supabase
        .from('farms')
        .update({
          name: formData.name,
          size: formattedSize,
          address: formData.address,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          google_maps_url: formData.google_maps_url,
          picture_url: pictureUrl,
        })
        .eq('id', farm.id);

      if (error) throw error;

      showSuccess("Farm updated successfully!");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      showError(error.message || "Failed to update farm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit2 className="w-3 h-3 mr-2" />
          Edit Farm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Farm Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Farm Name</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Farm Size</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="size" 
                  type="number"
                  step="any"
                  className="pl-10"
                  value={formData.sizeValue}
                  onChange={(e) => setFormData({...formData, sizeValue: e.target.value})}
                  required
                />
              </div>
              <Select 
                value={formData.sizeUnit} 
                onValueChange={(value) => setFormData({...formData, sizeUnit: value})}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Acre">Acre</SelectItem>
                  <SelectItem value="Hectare">Hectare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="address">Manual Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="address" 
                  className="pl-10"
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
              <Label htmlFor="maps_url">Google Maps Link</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="maps_url" 
                  className="pl-10"
                  value={formData.google_maps_url}
                  onChange={(e) => setFormData({...formData, google_maps_url: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label htmlFor="image">Farm Picture</Label>
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