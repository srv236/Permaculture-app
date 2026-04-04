import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Image as ImageIcon, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/utils/upload";
import { showSuccess, showError } from "@/utils/toast";
import { useSession } from "./SessionProvider";

interface AddProduceDialogProps {
  farmId: string;
  onSuccess: () => void;
}

const CATEGORIES = [
  "Vegetables", "Fruits", "Grains", "Honey & Bee Products", 
  "Dairy & Eggs", "Herbs & Spices", "Seeds & Saplings", "Other"
];

export const AddProduceDialog = ({ farmId, onSuccess }: AddProduceDialogProps) => {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    description: "",
    category: "Vegetables",
    priceValue: "",
    priceUnit: "kg",
    quantityValue: "",
    quantityUnit: "kg",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "produce_images");
      }

      const formattedPrice = `₹${formData.priceValue} / ${formData.priceUnit}`;
      const formattedQuantity = `${formData.quantityValue} ${formData.quantityUnit}`;

      const { error } = await supabase
        .from('produce')
        .insert({
          farm_id: farmId,
          producer_id: user.id,
          name: formData.name,
          variety: formData.variety,
          description: formData.description,
          category: formData.category,
          price: formattedPrice,
          quantity: formattedQuantity,
          image_url: imageUrl,
        });

      if (error) throw error;

      showSuccess("Produce added successfully!");
      setOpen(false);
      setFormData({ 
        name: "", 
        variety: "", 
        description: "", 
        category: "Vegetables",
        priceValue: "", 
        priceUnit: "kg", 
        quantityValue: "", 
        quantityUnit: "kg" 
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
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="w-3 h-3 mr-2" />
          Add Produce
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Produce to Farm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="variety">Variety</Label>
            <Input 
              id="variety" 
              placeholder="e.g. Heirloom" 
              value={formData.variety}
              onChange={(e) => setFormData({...formData, variety: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Price (in ₹)</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                <Input 
                  type="number"
                  className="pl-7"
                  placeholder="0.00" 
                  required 
                  value={formData.priceValue}
                  onChange={(e) => setFormData({...formData, priceValue: e.target.value})}
                />
              </div>
              <div className="w-[120px]">
                <Select 
                  value={formData.priceUnit} 
                  onValueChange={(value) => setFormData({...formData, priceUnit: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unit">per unit</SelectItem>
                    <SelectItem value="dozen">per dozen</SelectItem>
                    <SelectItem value="g">per g</SelectItem>
                    <SelectItem value="kg">per kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                value={formData.quantityValue}
                onChange={(e) => setFormData({...formData, quantityValue: e.target.value})}
              />
              <div className="w-[120px]">
                <Select 
                  value={formData.quantityUnit} 
                  onValueChange={(value) => setFormData({...formData, quantityUnit: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="units">units</SelectItem>
                    <SelectItem value="dozen">dozen</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="tonne">tonne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                className="w-full"
                onClick={() => document.getElementById('image')?.click()}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                {imageFile ? imageFile.name : "Upload Image"}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full bg-emerald-600" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Produce"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};