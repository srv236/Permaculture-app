"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/utils/upload";
import { showSuccess, showError } from "@/utils/toast";

interface AddProduceDialogProps {
  farmId: string;
  onSuccess: () => void;
}

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Seeds & Saplings",
  "Grains & Pulses",
  "Honey & Preserves",
  "Herbs & Spices",
  "Dairy & Eggs",
  "Other"
];

const UNITS = ["units", "g", "dozen", "kg", "tonne"];

export const AddProduceDialog = ({ farmId, onSuccess }: AddProduceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Vegetables",
    price_value: "",
    price_unit: "kg",
    quantity_value: "",
    quantity_unit: "kg",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let image_url = "";
      if (imageFile) {
        image_url = await uploadImage(imageFile, "produce_images");
      }

      const { error } = await supabase
        .from('produce')
        .insert({
          farm_id: farmId,
          name: formData.name,
          category: formData.category,
          price_value: parseFloat(formData.price_value),
          price_unit: formData.price_unit,
          quantity_value: parseFloat(formData.quantity_value),
          quantity_unit: formData.quantity_unit,
          image_url: image_url,
        });

      if (error) throw error;

      showSuccess("Produce added successfully!");
      setOpen(false);
      setFormData({ 
        name: "", 
        category: "Vegetables", 
        price_value: "", 
        price_unit: "kg", 
        quantity_value: "", 
        quantity_unit: "kg" 
      });
      setImageFile(null);
      onSuccess();
    } catch (error: any) {
      showError(error.message || "Failed to add produce.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50">
          <Plus className="w-3 h-3 mr-2" />
          Add Produce
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle>Add Produce to Harvest</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Heirloom Tomatoes" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Type</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({...formData, category: value})}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Price (Rs)</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                <Input 
                  type="number"
                  className="pl-7"
                  placeholder="0.00" 
                  required 
                  value={formData.price_value}
                  onChange={(e) => setFormData({...formData, price_value: e.target.value})}
                />
              </div>
              <Select 
                value={formData.price_unit} 
                onValueChange={(value) => setFormData({...formData, price_unit: value})}
              >
                <SelectTrigger className="w-[120px] rounded-xl">
                  <SelectValue placeholder="per unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map(unit => (
                    <SelectItem key={unit} value={unit}>per {unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quantity Available</Label>
            <div className="flex gap-2">
              <Input 
                type="number"
                className="flex-1"
                placeholder="0" 
                required 
                value={formData.quantity_value}
                onChange={(e) => setFormData({...formData, quantity_value: e.target.value})}
              />
              <Select 
                value={formData.quantity_unit} 
                onValueChange={(value) => setFormData({...formData, quantity_unit: value})}
              >
                <SelectTrigger className="w-[120px] rounded-xl">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Produce Image</Label>
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
                className="w-full rounded-xl border-dashed"
                onClick={() => document.getElementById('image')?.click()}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                {imageFile ? imageFile.name : "Upload Image"}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full bg-emerald-600 rounded-xl h-12" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Produce"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};