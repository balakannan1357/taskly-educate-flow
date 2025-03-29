import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';
import { Camera, Upload } from 'lucide-react';
import { toast } from 'sonner';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    profilePicture: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify(user));
    toast.success('Profile updated successfully!');
  };

  const getInitials = () => {
    if (!user.name) return '?';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUser({
        ...user,
        profilePicture: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-white shadow-md">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback className="text-xl bg-gradient-primary text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <label 
            htmlFor="profilePicture" 
            className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer"
          >
            <Camera size={16} />
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
        <h3 className="text-xl font-medium">{user.name || 'Your Name'}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="bg-white bg-opacity-80"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="bg-white bg-opacity-80"
          />
        </div>
      </div>
      
      <Button onClick={handleSave} className="w-full">
        Save Changes
      </Button>
    </div>
  );
};

export default UserProfile;
