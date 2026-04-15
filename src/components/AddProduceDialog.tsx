"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Image as ImageIcon, Tag } from "lucide-react";
import { createProduce } from "@/api/produce";
import { uploadImage } from "@/api/upload";
import { showSuccess, showError } from "@/utils/toast";
import { useSession } from "./SessionProvider";

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
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    category: "Vegetables",
    description: "",
    tags: "",
    price_value: "",
    price_unit: "kg",
    quantity_value: "",
    quantity_unit: "kg",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      let image_url = "";
      if (imageFile) {
        image_url = await uploadImage(imageFile, "produce_images", user.id);
      }

      await createProduce({
        farm_id: farmId,
        name: formData.name,
        variety: formData.variety || undefined,
        category: formData.category,
        description: formData.description,
        tags: tagsArray,
        price_value: formData.price_value ? parseFloat(formData.price_value) : 0,
        price_unit: formData.price_unit,
        quantity_value: formData.quantity_value ? parseFloat(formData.quantity_value) : 0,
        quantity_unit: formData.quantity_unit,
        image_url: image_url,
      });

      showSuccess("Produce added successfully!");
      setOpen(false);
      setFormData({ 
        name: "", 
        variety: "",
        category: "Vegetables", 
        description: "",
        tags: "",
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
      <DialogContent className="sm:max-w-[425px] rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Produce to Harvest</DialogTitle>
          <DialogDescription>
            List your fresh produce available for the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Produce Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Tomatoes" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="variety">Variety</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="variety" 
                className="pl-10"
                placeholder="e.g. Heirloom Cherokee Purple" 
                value={formData.variety}
                onChange={(e) => setFormData({...formData, variety: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
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
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Flavor profile, nutrition, or growth details..." 
              className="min-h-[80px] rounded-xl"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Produce Tags (comma separated)</Label>
            <Input 
              id="tags" 
              placeholder="e.g. Organic, Freshly Picked, Local" 
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Price</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                <Input 
                  type="number"
                  step="any"
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
                step="any"
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