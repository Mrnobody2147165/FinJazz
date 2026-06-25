import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Building2, Upload, Loader2 } from 'lucide-react';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { CURRENCIES, getInitials } from '@/utils/helpers';
import { uploadCompanyLogo } from '@/firebase/storage';
import { createProfile } from '@/firebase/firestore';
import { useAuthStore } from '@/stores/index';
import { getErrorMessage } from '@/utils/helpers';

const profileSchema = z.object({
  profileType: z.enum(['personal', 'company']),
  companyName: z.string().optional(),
  currency: z.string().min(1, 'Please select a currency'),
});

const CreateProfileModal = ({ isOpen, onClose }) => {
  const { user, addProfile, setActiveProfile } = useAuthStore();
  const [isCompany, setIsCompany] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      profileType: 'personal',
      companyName: '',
      currency: 'PKR',
    },
  });

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (isCompany && !data.companyName) {
      setError('Company name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let companyLogo = null;
      if (isCompany && logoFile) {
        companyLogo = await uploadCompanyLogo(user.uid, logoFile);
      }

      const profileData = {
        profileType: isCompany ? 'company' : 'personal',
        currency: data.currency,
        themePalette: 'emerald-violet',
        ...(isCompany && {
          companyName: data.companyName,
          companyLogo,
          profileName: data.companyName,
        }),
        ...(!isCompany && {
          profileName: 'Personal',
        }),
      };

      const profileId = await createProfile(user.uid, profileData);
      const newProfile = { id: profileId, ...profileData };
      addProfile(newProfile);
      setActiveProfile(profileId);

      reset();
      setLogoFile(null);
      setLogoPreview(null);
      setIsCompany(false);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setLogoFile(null);
    setLogoPreview(null);
    setIsCompany(false);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Profile">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Type Toggle */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Profile Type
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsCompany(false)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-[var(--radius)] border-2 transition-all ${
                  !isCompany
                    ? 'border-[var(--primary)] bg-[var(--primary-muted)]'
                    : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                }`}
              >
                <User className="h-6 w-6 text-[var(--primary)]" />
                <span className="text-sm font-medium">Personal</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCompany(true)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-[var(--radius)] border-2 transition-all ${
                  isCompany
                    ? 'border-[var(--primary)] bg-[var(--primary-muted)]'
                    : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                }`}
              >
                <Building2 className="h-6 w-6 text-[var(--primary)]" />
                <span className="text-sm font-medium">Company</span>
              </button>
            </div>
          </div>

          {/* Company Details */}
          {isCompany && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <Input
                {...register('companyName')}
                label="Company Name"
                placeholder="Enter company name"
                error={errors.companyName?.message}
              />

              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  Company Logo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-[var(--surface)] flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-[var(--muted-foreground)]" />
                      </div>
                    )}
                    <label className="absolute -bottom-2 -right-2 p-2 bg-[var(--primary)] rounded-full cursor-pointer hover:bg-[var(--primary-hover)] transition-colors">
                      <Upload className="h-4 w-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Upload a logo for your company. Recommended size: 200x200px
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Currency Selection */}
          <Select {...register('currency')} label="Default Currency" error={errors.currency?.message}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-[var(--danger)] text-sm px-4 py-3 rounded-[var(--radius-sm)]"
            >
              {error}
            </motion.div>
          )}
        </form>
      </ModalContent>

      <ModalFooter>
        <Button type="button" variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Profile'
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateProfileModal;
