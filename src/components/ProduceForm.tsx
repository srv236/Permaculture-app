"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Produce } from "@/types/farm";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2 } from "lucide-react";

interface ProduceFormProps {
  producerId: string;
  initialData?: Produce;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProduceForm = ({ producerId, initialData, onSuccess, onCancel }: ProduceFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    variety: initialData?.variety || "",
    price: initialData?.price || "",
    quantity: initialData?.quantity || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        const { error } = await supabase
          .from('produce')
          .update(formData)
          .eq('id', initialData.id);
        if (error) throw error;
        showSuccess("Produce updated successfully!");
      } else {
        const { error } = await supabase
          .from('produce')
          .insert([{ ...formData, producer_id: producerId }]);
        if (error) throw error;
        showSuccess("Produce added successfully!");
      }
      onSuccess();
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Produce Name</Label>
          <Input 
            id="name" 
            placeholder="e.g. Tomatoes, Honey" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="variety">Variety (Optional)</Label>
          <Input 
            id="variety" 
            placeholder="e.g. Heirloom, Wildflower" 
            value={formData.variety}
            onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input 
            id="price" 
            placeholder="e.g. ₹100/kg" 
            required 
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Available Quantity</Label>
          <Input 
            id="quantity" 
            placeholder="e.g. 50kg, 10 jars" 
            required 
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-8">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Listing" : "Add Listing"}
        </Button>
      </div>
    </form>
  );
};