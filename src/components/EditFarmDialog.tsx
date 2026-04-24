"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Loader2, Image as ImageIcon, Ruler, Tag, MapPin } from "lucide-react";
import { updateFarm } from "@/api/farms";
import { uploadImage } from "@/api/upload";
import { showSuccess, showError } from "@/utils/toast";
import { Farm } from "@/types/farm";
import { useSession } from "./SessionProvider";
import { LocationPicker } from "./LocationPicker";


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
        latitude: formData.latitude ? parseFloat(formData.latitude) : 0,
        longitude: formData.longitude ? parseFloat(formData.longitude) : 0,
        picture_url: pictureUrl ? pictureUrl : undefined,
      });

      showSuccess("Farm updated successfully!");
      setOpen(false);
      onSuccess();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update farm.";
      showError(message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl border-slate-200">
          <Edit2 className="w-3 h-3 mr-2" />
          Edit Farm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto rounded-[32px] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-900">Edit Farm Details</DialogTitle>
          <DialogDescription>
            Update your farm's vision and location details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-emerald-800 font-semibold ml-1">Farm Name</Label>
              <Input 
                id="edit-name" 
                name="farm_name"
                className="h-12 rounded-2xl border-slate-200 focus:ring-emerald-500"
                autoComplete="organization"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-about" className="text-emerald-800 font-semibold ml-1">About the Farm</Label>
              <Textarea 
                id="edit-about" 
                name="about"
                className="min-h-[120px] rounded-[24px] border-slate-200 focus:ring-emerald-500"
                value={formData.about}
                onChange={(e) => setFormData({...formData, about: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tags" className="text-emerald-800 font-semibold ml-1">Farm Tags</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="edit-tags" 
                  name="tags"
                  className="pl-10 h-12 rounded-2xl border-slate-200"
                  placeholder="Organic, Forest Garden..." 
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-size" className="text-emerald-800 font-semibold ml-1">Farm Size</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="edit-size" 
                    name="size"
                    type="number"
                    step="any"
                    className="pl-10 h-12 rounded-2xl border-slate-200"
                    value={formData.sizeValue}
                    onChange={(e) => setFormData({...formData, sizeValue: e.target.value})}
                    required
                  />
                </div>
                <Select 
                  value={formData.sizeUnit} 
                  onValueChange={(value) => setFormData({...formData, sizeUnit: value})}
                >
                  <SelectTrigger className="w-[120px] h-12 rounded-2xl border-slate-200 shadow-none">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Acre">Acre</SelectItem>
                    <SelectItem value="Hectare">Hectare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="space-y-4 pt-2">
            <LocationPicker
              address={formData.address}
              latitude={formData.latitude === "" ? "" : Number(formData.latitude)}
              longitude={formData.longitude === "" ? "" : Number(formData.longitude)}
              onLocationChange={(lat, lng, address) => {
                setFormData({
                  ...formData,
                  latitude: lat.toString(),
                  longitude: lng.toString(),
                  address: address,
                });
              }}
            />
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="edit-image" className="text-emerald-800 font-semibold ml-1">Farm Picture</Label>
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
                className="w-full h-14 rounded-2xl border-dashed border-2 hover:bg-slate-50 border-slate-200 text-slate-500"
                onClick={() => document.getElementById('edit-image')?.click()}
              >
                <ImageIcon className="w-5 h-5 mr-3" />
                {imageFile ? imageFile.name : "Change Farm Picture"}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-emerald-600 rounded-[22px] h-14 text-lg font-bold shadow-lg shadow-emerald-200" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};