"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/utils/upload";
import { showSuccess, showError } from "@/utils/toast";
import { useSession } from "./SessionProvider";

interface AddProduceDialogProps {
  onSuccess: () => void;
}

export const AddProduceDialog = ({ onSuccess }: AddProduceDialogProps) => {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    price: "",
    quantity: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showError("You must be logged in to add produce.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "produce_images");
      }

      const { error } = await supabase
        .from('produce')
        .insert({
          producer_id: user.id,
          name: formData.name,
          variety: formData.variety,
          price: formData.price,
          quantity: formData.quantity,
          image_url: imageUrl,
        });

      if (error) throw error;

      showSuccess("Produce added successfully!");
      setOpen(false);
      setFormData({ name: "", variety: "", price: "", quantity: "" });
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
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Produce
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Produce</DialogTitle>
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
            <Input 
              id="variety" 
              placeholder="e.g. Heirloom Cherokee Purple" 
              value={formData.variety}
              onChange={(e) => setFormData({...formData, variety: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input 
                id="price" 
                placeholder="e.g. $4.50/lb" 
                required 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Available</Label>
              <Input 
                id="quantity" 
                placeholder="e.g. 20 lbs" 
                required 
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
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