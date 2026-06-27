import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Palette,
  DollarSign,
  Shield,
  Camera,
  Loader2,
  Check,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Avatar } from '@/components/ui/Avatar';
import { Toggle } from '@/components/ui/Toggle';
import { Badge } from '@/components/ui/Badge';
import { useAuth, useActiveProfile } from '@/hooks/useAuth';
import useThemeStore from '@/stores/themeStore';
import useAuthStore from '@/stores/authStore';
import { updateProfile as updateProfileData } from '@/firebase/firestore';
import { uploadCompanyLogo } from '@/firebase/storage';
import { getErrorMessage, CURRENCIES } from '@/utils/helpers';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  companyName: z.string().optional(),
  currency: z.string().min(1, 'Please select a currency'),
});

const currencies = [
  { value: 'PKR', label: 'PKR - Pakistani Rupee' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'AED', label: 'AED - UAE Dirham' },
  { value: 'SAR', label: 'SAR - Saudi Riyal' },
];

const SettingsPage = () => {
  const { user, userData } = useAuth();
  const { activeProfileId, activeProfile } = useActiveProfile();
  const updateProfileStore = useAuthStore((s) => s.updateProfile);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const { palette, setPalette, setDarkMode, darkMode, getAllThemesMeta } = useThemeStore();
  const themes = getAllThemesMeta();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.displayName || '',
      companyName: activeProfile?.companyName || '',
      currency: activeProfile?.currency || 'PKR',
    },
  });

  useEffect(() => {
    if (activeProfile) {
      reset({
        fullName: user?.displayName || '',
        companyName: activeProfile.companyName || '',
        currency: activeProfile.currency || 'PKR',
      });
    }
  }, [activeProfile, user?.displayName, reset]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleProfileSubmit = async (data) => {
    if (!activeProfileId || !user?.uid) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updateData = {
        ...data,
        ...(activeProfile?.profileType === 'company' && { companyName: data.companyName }),
      };
      await updateProfileData(user.uid, activeProfileId, updateData);
      updateProfileStore(activeProfileId, updateData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeProfileId || !user?.uid) return;

    setUploading(true);
    setError('');
    try {
      const isCompany = activeProfile?.profileType === 'company';
      const downloadUrl = await uploadCompanyLogo(user.uid, file);

      if (isCompany) {
        await updateProfileData(user.uid, activeProfileId, { companyLogo: downloadUrl });
        updateProfileStore(activeProfileId, { companyLogo: downloadUrl });
        setSuccess('Logo uploaded successfully');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleThemeChange = async (themeKey) => {
    setPalette(themeKey);
    if (!activeProfileId || !user?.uid) return;
    try {
      await updateProfileData(user.uid, activeProfileId, { themePalette: themeKey });
      updateProfileStore(activeProfileId, { themePalette: themeKey });
      setSuccess('Theme updated successfully');
    } catch (err) {
      console.error('Error updating theme:', err);
    }
  };

  const handleDarkModeChange = async (value) => {
    setDarkMode(value);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', value);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'currency', label: 'Currency', icon: DollarSign },
    { id: 'account', label: 'Account', icon: Shield },
  ];

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Update your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(handleProfileSubmit)} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {activeProfile?.profileType === 'company' ? (
                          <Avatar
                            src={activeProfile?.companyLogo}
                            name={activeProfile?.companyName}
                            size="xl"
                          />
                        ) : (
                          <Avatar src={user?.photoURL} name={user?.displayName} size="xl" />
                        )}
                        {activeProfile?.profileType === 'company' && (
                          <>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploading}
                              className="absolute -bottom-2 -right-2 p-2 bg-[var(--primary)] text-white rounded-full hover:opacity-90 transition-opacity"
                            >
                              {uploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Camera className="h-4 w-4" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">
                          {activeProfile?.profileType === 'company'
                            ? activeProfile?.companyName
                            : user?.displayName}
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)]">{user?.email}</p>
                        <Badge variant="outline" className="mt-1 capitalize">
                          {activeProfile?.profileType} Account
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Input
                        {...register('fullName')}
                        label="Full Name"
                        placeholder="Enter your full name"
                        error={errors.fullName?.message}
                      />

                      {activeProfile?.profileType === 'company' && (
                        <Input
                          {...register('companyName')}
                          label="Company Name"
                          placeholder="Enter company name"
                          error={errors.companyName?.message}
                        />
                      )}
                    </div>

                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)] text-sm px-4 py-3 rounded-lg flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        {success}
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--error)]/10 border border-[var(--error)]/20 text-[var(--error)] text-sm px-4 py-3 rounded-lg"
                      >
                        {error}
                      </motion.div>
                    )}

                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'theme' && (
              <Card>
                <CardHeader>
                  <CardTitle>Theme Settings</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                        Color Palette
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(themes).map(([key, theme]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleThemeChange(key)}
                            className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                              palette === key
                                ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/30'
                                : 'border-[var(--border)] hover:border-[var(--muted)]'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className="w-8 h-8 rounded-full"
                                style={{ backgroundColor: theme.primary }}
                              />
                              <div
                                className="w-8 h-8 rounded-full"
                                style={{ backgroundColor: theme.secondary }}
                              />
                            </div>
                            <h4 className="font-semibold text-[var(--foreground)]">{theme.name}</h4>
                            <p className="text-sm text-[var(--muted-foreground)]">
                              {theme.description}
                            </p>
                            {palette === key && (
                              <div className="absolute top-3 right-3">
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: theme.primary }}
                                >
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--border)]">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-[var(--foreground)]">
                            Dark Mode
                          </h3>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            Use dark theme for low-light environments
                          </p>
                        </div>
                        <Toggle enabled={darkMode} onChange={handleDarkModeChange} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'currency' && (
              <Card>
                <CardHeader>
                  <CardTitle>Currency Settings</CardTitle>
                  <CardDescription>
                    Set your preferred currency for transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(handleProfileSubmit)} className="space-y-4">
                    <Select {...register('currency')} label="Preferred Currency">
                      {currencies.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </Select>

                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)] text-sm px-4 py-3 rounded-lg flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        {success}
                      </motion.div>
                    )}

                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Currency'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'account' && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-[var(--muted)]/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[var(--foreground)]">Email Address</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{user?.email}</p>
                        </div>
                        <Badge variant="outline">Primary</Badge>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[var(--muted)]/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[var(--foreground)]">Account Type</p>
                          <p className="text-sm text-[var(--muted-foreground)] capitalize">
                            {activeProfile?.profileType || 'personal'}
                          </p>
                        </div>
                        <Badge
                          variant={activeProfile?.profileType === 'company' ? 'secondary' : 'default'}
                        >
                          {activeProfile?.profileType || 'personal'}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[var(--muted)]/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[var(--foreground)]">Member Since</p>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            {activeProfile?.createdAt?.toDate
                              ? new Date(activeProfile.createdAt.toDate()).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--border)]">
                      <p className="text-sm text-[var(--muted-foreground)] mb-4">
                        Account management features like password change and account deletion are
                        handled through Firebase Authentication. Contact support for assistance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
