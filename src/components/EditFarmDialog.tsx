"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Loader2, Image as ImageIcon, MapPin, Globe, Ruler, Tag } from "lucide-react";
import { updateFarm } from "@/api/farms";
import { uploadImage } from "@/api/upload";
import { showSuccess, showError } from "@/utils/toast";
import { Farm } from "@/types/farm";
import { useSession } from "./SessionProvider";

interface EditFarmDialogProps {
  farm: Farm;
  onSuccess: () => void;
}

export const EditFarmDialog = ({ farm, onSuccess }: EditFarmDialogProps) => {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const initialValue = farm.size_value?.toString() || "";
  const initialUnit = farm.size_unit || "Hectare";

  const [formData, setFormData] = useState({
    name: farm.name,
    about: farm.about || "",
    tags: farm.tags?.join(", ") || "",
    sizeValue: initialValue,
    sizeUnit: initialUnit,
    address: farm.address || "",
    latitude: farm.latitude?.toString() || "",
    longitude: farm.longitude?.toString() || "",
    google_maps_url: farm.google_maps_url || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      let pictureUrl = farm.picture_url || "";
      if (imageFile) {
        pictureUrl = await uploadImage(imageFile, "profile_pictures", user.id);
      }

      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

      await updateFarm(farm.id, {
        name: formData.name,
        about: formData.about,
        tags: tagsArray,
        size_value: formData.sizeValue ? parseFloat(formData.sizeValue) : undefined,
        size_unit: formData.sizeUnit,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        google_maps_url: formData.google_maps_url,
        picture_url: pictureUrl ? pictureUrl : undefined,
      });

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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle>Edit Farm Details</DialogTitle>
          <DialogDescription>
            Modify the location, size, or about section of your farm.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Farm Name</Label>
            <Input 
              id="edit-name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-about">About the Farm</Label>
            <Textarea 
              id="edit-about" 
              className="min-h-[100px] rounded-xl"
              value={formData.about}
              onChange={(e) => setFormData({...formData, about: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tags">Farm Tags (comma separated)</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="edit-tags" 
                className="pl-10"
                placeholder="e.g. Organic, Forest Garden" 
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-size">Farm Size</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="edit-size" 
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
                <SelectTrigger className="w-[120px] rounded-xl">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Acre">Acre</SelectItem>
                  <SelectItem value="Hectare">Hectare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-address">Manual Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="edit-address" 
                  className="pl-10"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-latitude">Latitude</Label>
                <Input 
                  id="edit-latitude" 
                  type="number" 
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-longitude">Longitude</Label>
                <Input 
                  id="edit-longitude" 
                  type="number" 
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-maps_url">Google Maps Link</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="edit-maps_url" 
                  className="pl-10"
                  value={formData.google_maps_url}
                  onChange={(e) => setFormData({...formData, google_maps_url: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4">
            <Label htmlFor="edit-image">Farm Picture</Label>
            <div className="flex items-center gap-4">
              <Input 
                id="edit-image" 
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <Button 
                type="button" 
                variant="outline" 
                className="w-full rounded-xl border-dashed"
                onClick={() => document.getElementById('edit-image')?.click()}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                {imageFile ? imageFile.name : "Change Picture"}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-emerald-600 rounded-xl h-12" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};