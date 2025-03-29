
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { BellRing, Moon, LogOut, HelpCircle, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    reminders: true,
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
  }, []);

  const handleToggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: !prev[key] };
      localStorage.setItem('settings', JSON.stringify(newSettings));
      return newSettings;
    });
    toast.success('Setting updated!');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      toast.success('All data cleared. Refreshing...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="taskly-container page-transition">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Customize your app experience</p>
      </header>
      
      <div className="space-y-6">
        <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-sm">
          <h2 className="font-medium text-lg mb-4">Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BellRing size={20} />
                <Label htmlFor="notifications">Notifications</Label>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={() => handleToggleSetting('notifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Moon size={20} />
                <Label htmlFor="darkMode">Dark Mode (coming soon)</Label>
              </div>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={() => handleToggleSetting('darkMode')}
                disabled
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BellRing size={20} />
                <Label htmlFor="reminders">Daily Reminders</Label>
              </div>
              <Switch
                id="reminders"
                checked={settings.reminders}
                onCheckedChange={() => handleToggleSetting('reminders')}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-sm">
          <h2 className="font-medium text-lg mb-4">Support</h2>
          
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <HelpCircle size={18} className="mr-2" />
              Help & FAQ
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <Info size={18} className="mr-2" />
              About TaskApp
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleClearData}
          >
            Clear All Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
