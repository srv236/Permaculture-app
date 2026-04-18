"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Loader2, Image as ImageIcon, Ruler, Tag, MapPin, CheckCircle2 } from "lucide-react";
import { updateFarm } from "@/api/farms";
import { uploadImage } from "@/api/upload";
import { showSuccess, showError } from "@/utils/toast";
import { Farm } from "@/types/farm";
import { useSession } from "./SessionProvider";
import { LocationPicker } from "./LocationPicker";
import { Badge } from "./ui/badge";

interface EditFarmDialogProps {
  farm: Farm;
  onSuccess: () => void;
}

export const EditFarmDialog = ({ farm, onSuccess }: EditFarmDialogProps) => {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [locationChanged, setLocationChanged] = useState(false);
  
  const [formData, setFormData] = useState({
    name: farm.name,
    about: farm.about || "",
    tags: farm.tags?.join(", ") || "",
    sizeValue: farm.size_value?.toString() || "",
    sizeUnit: farm.size_unit || "Hectare",
    address: farm.address || "",
    latitude: farm.latitude?.toString() || "",
    longitude: farm.longitude?.toString() || "",
  });

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      address: location.address,
      latitude: location.lat.toString(),
      longitude: location.lng.toString()
    }));
    setLocationChanged(true);
  };

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
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
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
        <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl border-slate-200">
          <Edit2 className="w-3 h-3 mr-2" />
          Edit Farm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[95vh] overflow-y-auto rounded-[32px] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-900">Edit Farm Details</DialogTitle>
          <DialogDescription>
            Update your farm's vision and pin its exact location.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-emerald-800 font-semibold ml-1">Farm Name</Label>
                <Input 
                  id="edit-name" 
                  className="h-12 rounded-2xl border-slate-200 focus:ring-emerald-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-about" className="text-emerald-800 font-semibold ml-1">About the Farm</Label>
                <Textarea 
                  id="edit-about" 
                  className="min-h-[120px] rounded-[24px] border-slate-200 focus:ring-emerald-500"
                  value={formData.about}
                  onChange={(e) => setFormData({...formData, about: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-size" className="text-emerald-800 font-semibold ml-1">Farm Size</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="edit-size" 
                      type="number"
                      step="any"
                      className="h-12 rounded-2xl border-slate-200"
                      value={formData.sizeValue}
                      onChange={(e) => setFormData({...formData, sizeValue: e.target.value})}
                      required
                    />
                    <Select value={formData.sizeUnit} onValueChange={(value) => setFormData({...formData, sizeUnit: value})}>
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

                <div className="space-y-2">
                  <Label htmlFor="edit-image" className="text-emerald-800 font-semibold ml-1">Farm Picture</Label>
                  <div className="flex items-center gap-4">
                    <Input id="edit-image" type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-12 rounded-2xl border-dashed border-2 hover:bg-slate-50 border-slate-200 text-slate-500"
                      onClick={() => document.getElementById('edit-image')?.click()}
                    >
                      <ImageIcon className="w-5 h-5 mr-3" />
                      {imageFile ? imageFile.name : "Change Picture"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-emerald-800 font-semibold ml-1">Update Location</Label>
                {locationChanged && (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Location Updated
                  </Badge>
                )}
              </div>
              
              <LocationPicker 
                onLocationSelect={handleLocationSelect}
                initialLat={parseFloat(formData.latitude) || 20.5937}
                initialLng={parseFloat(formData.longitude) || 78.9629}
                initialAddress={formData.address}
              />

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600 leading-tight font-medium">{formData.address}</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[10px] text-slate-400">LAT: <span className="font-mono text-slate-600">{parseFloat(formData.latitude).toFixed(6)}</span></div>
                  <div className="text-[10px] text-slate-400">LNG: <span className="font-mono text-slate-600">{parseFloat(formData.longitude).toFixed(6)}</span></div>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-emerald-600 rounded-[22px] h-14 text-lg font-bold shadow-lg shadow-emerald-200 mt-4" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};