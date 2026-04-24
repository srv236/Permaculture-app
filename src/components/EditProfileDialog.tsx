"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Loader2, User, Calendar, Facebook, Instagram, Youtube, Globe, Smartphone } from "lucide-react";
import { updateProfile } from "@/api/profiles";
import { uploadImage } from "@/api/upload";
import { showSuccess, showError } from "@/utils/toast";
import { Producer } from "@/types/farm";
import { useSession } from "./SessionProvider";

interface EditProfileDialogProps {
  profile: Producer;
  onSuccess: () => void;
}

export const EditProfileDialog = ({ profile, onSuccess }: EditProfileDialogProps) => {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: profile.name,
    phone: profile.phone,
    alt_phone: profile.alt_phone || "",
    about: profile.about || "",
    facebook_url: profile.facebook_url || "",
    instagram_url: profile.instagram_url || "",
    youtube_url: profile.youtube_url || "",
    website_url: profile.website_url || "",
    basic_course_date: profile.basic_course_date || "",
    advanced_course_date: profile.advanced_course_date || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      let pictureUrl = profile.picture_url || "";
      if (imageFile) {
        pictureUrl = await uploadImage(imageFile, "profile_pictures", user.id);
      }

      await updateProfile(profile.id, {
        name: formData.name,
        phone: formData.phone,
        alt_phone: formData.alt_phone || undefined,
        about: formData.about || undefined,
        facebook_url: formData.facebook_url || undefined,
        instagram_url: formData.instagram_url || undefined,
        youtube_url: formData.youtube_url || undefined,
        website_url: formData.website_url || undefined,
        basic_course_date: formData.basic_course_date || undefined,
        advanced_course_date: formData.advanced_course_date || undefined,
        picture_url: pictureUrl ? pictureUrl : undefined,
      });

      showSuccess("Profile updated successfully!");
      setOpen(false);
      onSuccess();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update profile.";
      showError(message);
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle>Edit Practitioner Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name"
                value={formData.name}
                autoComplete="name"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone"
                value={formData.phone}
                autoComplete="tel"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt_phone">Alternate Phone (Optional)</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="alt_phone" 
                  name="alt_phone"
                  className="pl-10"
                  value={formData.alt_phone}
                  autoComplete="tel"
                  onChange={(e) => setFormData({...formData, alt_phone: e.target.value})}
                />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About You</Label>
            <Textarea 
              id="about" 
              name="about"
              className="min-h-[100px] rounded-xl"
              value={formData.about}
              onChange={(e) => setFormData({...formData, about: e.target.value})}
            />
          </div>

          <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm font-bold text-slate-700">Social Media & Links</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook URL</Label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                  <Input 
                    id="facebook" 
                    name="facebook"
                    className="pl-10"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData({...formData, facebook_url: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram URL</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-600" />
                  <Input 
                    id="instagram" 
                    name="instagram"
                    className="pl-10"
                    value={formData.instagram_url}
                    onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube URL</Label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                  <Input 
                    id="youtube" 
                    name="youtube"
                    className="pl-10"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website Link</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  <Input 
                    id="website" 
                    name="website"
                    className="pl-10"
                    value={formData.website_url}
                    onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                  />
                </div>
              </div>
            </div>
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

          <Button type="submit" className="w-full bg-emerald-600 rounded-xl h-12" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};