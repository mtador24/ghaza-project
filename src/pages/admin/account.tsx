import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AdminLayout from "@/components/admin/layout";
import { Facebook, Mail, MessageCircle, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useToast } from "@/hooks/use-toast";

export default function AccountPage() {
  const { toast } = useToast();
  const { contactSettings, socialSettings, getValue } = useSiteSettings();
  
  // Extract specific contact and social media details
  const email = getValue('email') || '';
  const whatsapp = getValue('whatsapp') || '';
  
  // Social media links
  const socialLinks = {
    facebook: getValue('facebook') || '',
    twitter: getValue('twitter') || '',
    instagram: getValue('instagram') || '',
    linkedin: getValue('linkedin') || '',
    youtube: getValue('youtube') || '',
  };

  // Social media icon mapping
  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
  };

  return (
    <AdminLayout>
      <div className="gaza-container py-10">
        <h1 className="text-3xl font-bold mb-6">إعدادات الحساب</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">معلومات التواصل</h2>
            <div className="space-y-4 bg-muted p-6 rounded-lg">
              {email && (
                <div className="flex items-center">
                  <Mail className="ml-3 text-gaza-primary" />
                  <div>
                    <Label>البريد الإلكتروني</Label>
                    <p>{email}</p>
                  </div>
                </div>
              )}
              
              {whatsapp && (
                <div className="flex items-center">
                  <MessageCircle className="ml-3 text-gaza-primary" />
                  <div>
                    <Label>رقم الواتساب</Label>
                    <p>{whatsapp}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Media Links Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">وسائل التواصل الاجتماعي</h2>
            <div className="space-y-4 bg-muted p-6 rounded-lg">
              {Object.entries(socialLinks).map(([platform, link]) => {
                if (!link) return null;
                const Icon = socialIcons[platform as keyof typeof socialIcons];
                return (
                  <div key={platform} className="flex items-center">
                    <Icon className="ml-3 text-gaza-primary" />
                    <div>
                      <Label>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Label>
                      <a 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline"
                      >
                        {link}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Placeholder for future account settings */}
        <div>
          <h2 className="text-xl font-semibold mb-4">إعدادات الحساب</h2>
          {/* Future account settings will be added here */}
        </div>
      </div>
    </AdminLayout>
  );
}
