"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Loader2, User, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/utils/upload";
import { showSuccess, showError } from "@/utils/toast";
import { Producer } from "@/types/farm";

interface EditProfileDialogProps {
  profile: Producer;
  onSuccess: () => void;
}

export const EditProfileDialog = ({ profile, onSuccess }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: profile.name,
    phone: profile.phone,
    about: profile.about || "",
    basic_course_date: profile.basic_course_date || "",
    advanced_course_date: profile.advanced_course_date || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let pictureUrl = profile.picture_url;
      if (imageFile) {
        pictureUrl = await uploadImage(imageFile, "profile_pictures");
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          about: formData.about,
          basic_course_date: formData.basic_course_date || null,
          advanced_course_date: formData.advanced_course_date || null,
          picture_url: pictureUrl,
        })
        .eq('id', profile.id);

      if (error) throw error;

      showSuccess("Profile updated successfully!");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      showError(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mt-4">
          <Edit2 className="w-3 h-3 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Practitioner Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About You</Label>
            <Textarea 
              id="about" 
              className="min-h-[100px]"
              value={formData.about}
              onChange={(e) => setFormData({...formData, about: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basic_date">Basic Course Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="basic_date" 
                  type="date" 
                  className="pl-10"
                  value={formData.basic_course_date}
                  onChange={(e) => setFormData({...formData, basic_course_date: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="advanced_date">Advanced Course Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="advanced_date" 
                  type="date" 
                  className="pl-10"
                  value={formData.advanced_course_date}
                  onChange={(e) => setFormData({...formData, advanced_course_date: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="picture">Profile Picture</Label>
            <div className="flex items-center gap-4">
              <Input 
                id="picture" 
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => document.getElementById('picture')?.click()}
              >
                <User className="w-4 h-4 mr-2" />
                {imageFile ? imageFile.name : "Change Picture"}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-emerald-600" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};