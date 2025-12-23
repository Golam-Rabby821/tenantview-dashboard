/**
 * Organization Settings Page
 * 
 * Allows org admins and super admins to configure organization settings.
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Save, Building2, Bell, Shield, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your changes have been saved successfully.',
    });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Organization Settings"
        description={`Configure settings for ${currentTenant?.name || 'your organization'}`}
      />

      <div className="max-w-3xl space-y-8">
        {/* General Settings */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">
                General
              </h2>
              <p className="text-sm text-muted-foreground">
                Basic organization information
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                defaultValue={currentTenant?.name || ''}
                placeholder="Enter organization name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-slug">URL Slug</Label>
              <Input
                id="org-slug"
                defaultValue={currentTenant?.slug || ''}
                placeholder="organization-slug"
              />
              <p className="text-xs text-muted-foreground">
                Used in your organization's URL: app.adminhub.com/
                {currentTenant?.slug || 'your-org'}
              </p>
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">
                Notifications
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure notification preferences
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">
                  Email notifications
                </p>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about important events
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">
                  New user alerts
                </p>
                <p className="text-sm text-muted-foreground">
                  Get notified when new users join
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">
                  Weekly digest
                </p>
                <p className="text-sm text-muted-foreground">
                  Receive a weekly summary of activity
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </section>

        {/* Security Settings */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">
                Security
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage security settings
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">
                  Two-factor authentication
                </p>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for all organization members
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">
                  Session timeout
                </p>
                <p className="text-sm text-muted-foreground">
                  Automatically log out inactive users
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        {user?.role === 'super_admin' && (
          <section className="rounded-xl border border-destructive/50 bg-card p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">
                  Danger Zone
                </h2>
                <p className="text-sm text-muted-foreground">
                  Irreversible actions
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">
                  Delete organization
                </p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete this organization and all its data
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </section>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="min-w-[120px]">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
