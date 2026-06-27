import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User, Plus, Check, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/stores/index';
import { getInitials } from '@/utils/helpers';

const ProfileSwitcher = ({ onAddProfile }) => {
  const profiles = useAuthStore((s) => s.profiles);
  const activeProfileId = useAuthStore((s) => s.activeProfileId);
  const setActiveProfile = useAuthStore((s) => s.setActiveProfile);
  const activeProfile = profiles.find((p) => p.id === activeProfileId);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (profiles.length === 0) return null;

  return (
    <div className="px-3 py-2" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--sidebar-hover)] hover:bg-[var(--sidebar-active)]/20 transition-all"
      >
        <div className="flex-shrink-0">
          {activeProfile?.profileType === 'company' ? (
            activeProfile?.companyLogo ? (
              <img
                src={activeProfile.companyLogo}
                alt={activeProfile.companyName}
                className="h-8 w-8 rounded-lg object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-[var(--sidebar-active)] flex items-center justify-center text-sm font-semibold text-[var(--sidebar-text)]">
                {getInitials(activeProfile?.companyName || 'C')}
              </div>
            )
          ) : (
            <div className="h-8 w-8 rounded-full bg-[var(--sidebar-active)] flex items-center justify-center">
              <User className="h-4 w-4 text-[var(--sidebar-text)]" />
            </div>
          )}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-[var(--sidebar-text)] truncate">
            {activeProfile?.profileType === 'company'
              ? activeProfile?.companyName
              : 'Personal'}
          </p>
          <p className="text-xs text-[var(--sidebar-icon)] capitalize">
            {activeProfile?.profileType}
          </p>
        </div>
        <ChevronDown className="h-4 w-4 text-[var(--sidebar-icon)]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 mt-2 bg-[var(--card)] rounded-[var(--radius)] shadow-[var(--shadow-lg)] border border-[var(--border)] overflow-hidden z-50"
          >
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => {
                  setActiveProfile(profile.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface)] transition-colors"
              >
                <div className="flex-shrink-0">
                  {profile.profileType === 'company' ? (
                    profile.companyLogo ? (
                      <img
                        src={profile.companyLogo}
                        alt={profile.companyName}
                        className="h-8 w-8 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-lg bg-[var(--primary-muted)] flex items-center justify-center text-sm font-semibold text-[var(--primary)]">
                        {getInitials(profile.companyName || 'C')}
                      </div>
                    )
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[var(--primary-muted)] flex items-center justify-center">
                      <User className="h-4 w-4 text-[var(--primary)]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {profile.profileType === 'company'
                      ? profile.companyName
                      : 'Personal'}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] capitalize">
                    {profile.profileType}
                  </p>
                </div>
                {profile.id === activeProfileId && (
                  <Check className="h-4 w-4 text-[var(--success)]" />
                )}
              </button>
            ))}

            <div className="border-t border-[var(--border)]">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onAddProfile?.();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add New Profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileSwitcher;
