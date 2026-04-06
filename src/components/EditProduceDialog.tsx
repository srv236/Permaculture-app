"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Loader2, Image as ImageIcon, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/utils/upload";
import { showSuccess, showError } from "@/utils/toast";
import { Produce } from "@/types/farm";

interface EditProduceDialogProps {
  produce: Produce;
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

export const EditProduceDialog = ({ produce, onSuccess }: EditProduceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: produce.name,
    variety: produce.variety || "",
    category: produce.category,
    price_value: produce.price_value.toString(),
    price_unit: produce.price_unit,
    quantity_value: produce.quantity_value.toString(),
    quantity_unit: produce.quantity_unit,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let image_url = produce.image_url;
      if (imageFile) {
        image_url = await uploadImage(imageFile, "produce_images");
      }

      const { error } = await supabase
        .from('produce')
        .update({
          name: formData.name,
          variety: formData.variety || null,
          category: formData.category,
          price_value: parseFloat(formData.price_value),
          price_unit: formData.price_unit,
          quantity_value: parseFloat(formData.quantity_value),
          quantity_unit: formData.quantity_unit,
          image_url: image_url,
        })
        .eq('id', produce.id);

      if (error) throw error;

      showSuccess("Produce updated successfully!");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      showError(error.message || "Failed to update produce.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-emerald-500 opacity-0 group-hover/item:opacity-100 transition-opacity mr-1">
          <Edit2 className="w-3.5 h-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle>Edit Produce</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Produce Name</Label>
            <Input 
              id="edit-name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-variety">Variety</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="edit-variety" 
                className="pl-10"
                placeholder="e.g. Heirloom" 
                value={formData.variety}
                onChange={(e) => setFormData({...formData, variety: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
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
                  step="any"
                  className="pl-7"
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
                step="any"
                className="flex-1"
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
            <Label htmlFor="edit-image">Update Image</Label>
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
                {imageFile ? imageFile.name : "Change Image"}
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