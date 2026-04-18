"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Image as ImageIcon, Ruler, Tag, MapPin, CheckCircle2 } from "lucide-react";
import { createFarm } from "@/api/farms";
import { uploadImage } from "@/api/upload";
import { showSuccess, showError } from "@/utils/toast";
import { useSession } from "./SessionProvider";
import { LocationPicker } from "./LocationPicker";

interface AddFarmDialogProps {
  onSuccess: () => void;
}

export const AddFarmDialog = ({ onSuccess }: AddFarmDialogProps) => {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    tags: "",
    size_value: "",
    size_unit: "Hectare",
    address: "",
    latitude: "",
    longitude: "",
  });

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      address: location.address,
      latitude: location.lat.toString(),
      longitude: location.lng.toString()
    }));
    setLocationCaptured(true);
    showSuccess("Location captured!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!locationCaptured) {
      showError("Please search and confirm your farm location on the map.");
      return;
    }

    setLoading(true);

    try {
      let picture_url = "";
      if (imageFile) {
        picture_url = await uploadImage(imageFile, "profile_pictures", user.id);
      }

      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

      await createFarm({
        user_id: user.id,
        name: formData.name,
        about: formData.about,
        tags: tagsArray,
        address: formData.address,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        size_value: formData.size_value ? parseFloat(formData.size_value) : undefined,
        size_unit: formData.size_unit,
        picture_url: picture_url,
      });

      showSuccess("Farm added successfully!");
      setOpen(false);
      setFormData({ 
        name: "", 
        about: "", 
        tags: "", 
        size_value: "", 
        size_unit: "Hectare", 
        address: "", 
        latitude: "", 
        longitude: "",
      });
      setImageFile(null);
      setLocationCaptured(false);
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
        <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl h-11">
          <Plus className="w-4 h-4 mr-2" />
          Add New Farm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[95vh] overflow-y-auto rounded-[32px] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-900">Add New Farm</DialogTitle>
          <DialogDescription>
            Showcase your regenerative farm. Pin your location precisely on the map.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-emerald-800 font-semibold ml-1">Farm Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Green Valley Sanctuary" 
                  required 
                  className="h-12 rounded-2xl border-slate-200 focus:ring-emerald-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about" className="text-emerald-800 font-semibold ml-1">About the Farm</Label>
                <Textarea 
                  id="about" 
                  placeholder="Describe your regenerative practices..." 
                  className="min-h-[120px] rounded-[24px] border-slate-200 focus:ring-emerald-500"
                  value={formData.about}
                  onChange={(e) => setFormData({...formData, about: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size" className="text-emerald-800 font-semibold ml-1">Farm Size</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="size" 
                      type="number"
                      step="any"
                      className="h-12 rounded-2xl border-slate-200"
                      placeholder="Size" 
                      required
                      value={formData.size_value}
                      onChange={(e) => setFormData({...formData, size_value: e.target.value})}
                    />
                    <Select 
                      value={formData.size_unit} 
                      onValueChange={(value: any) => setFormData({...formData, size_unit: value})}
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

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-emerald-800 font-semibold ml-1">Farm Picture</Label>
                  <div className="flex items-center gap-4">
                    <Input id="image" type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-12 rounded-2xl border-dashed border-2 hover:bg-slate-50 border-slate-200 text-slate-500"
                      onClick={() => document.getElementById('image')?.click()}
                    >
                      <ImageIcon className="w-5 h-5 mr-3" />
                      {imageFile ? imageFile.name : "Upload Picture"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-emerald-800 font-semibold ml-1">Farm Location</Label>
                {locationCaptured && (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Pin Set
                  </Badge>
                )}
              </div>
              
              <LocationPicker 
                onLocationSelect={handleLocationSelect}
                initialAddress={formData.address}
              />

              {locationCaptured && (
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
              )}
            </div>
          </div>

          <Button type="submit" className="w-full bg-emerald-600 rounded-[22px] h-14 text-lg font-bold shadow-lg shadow-emerald-200 mt-4" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Farm"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};