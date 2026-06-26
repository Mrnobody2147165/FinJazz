import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Building2,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { updateUserData, createProfile } from "@/firebase/firestore";
import useThemeStore from "@/stores/themeStore";
import useAuthStore from "@/stores/authStore";

const accountTypeSchema = z.object({
  accountType: z.enum(["personal", "company"], {
    required_error: "Please select an account type",
  }),
});

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  companyName: z.string().optional(),
  currency: z.string().min(1, "Please select a currency"),
});

const currencies = [
  { value: "PKR", label: "PKR - Pakistani Rupee" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "AED", label: "AED - UAE Dirham" },
  { value: "SAR", label: "SAR - Saudi Riyal" },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { addProfile, setActiveProfile } = useAuthStore();
  const { palette, setPalette, getAllPalettes } = useThemeStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState("personal");
  const [selectedTheme, setSelectedTheme] = useState("emerald-violet");

  const themes = getAllPalettes();

  const accountTypeForm = useForm({
    resolver: zodResolver(accountTypeSchema),
    defaultValues: { accountType: "personal" },
  });

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: userData?.fullName || "",
      companyName: "",
      currency: userData?.currency || "PKR",
    },
  });

  const handleAccountTypeSubmit = (data) => {
    setSelectedAccountType(data.accountType);
    setStep(2);
  };

  const handleThemeSelect = (themeKey) => {
    setSelectedTheme(themeKey);
    setPalette(themeKey);
  };

  const handleThemeSubmit = () => {
    setStep(3);
  };

  const handleProfileSubmit = async (data) => {
    setLoading(true);
    try {
      const updateData = {
        accountType: selectedAccountType,
        themePalette: selectedTheme,
        fullName: data.fullName,
        currency: data.currency,
        onboardingComplete: true,
      };

      if (selectedAccountType === "company") {
        updateData.companyName = data.companyName;
      }

      await updateUserData(user.uid, updateData);

      // Create default profile for the user
      const profileData = {
        profileType: selectedAccountType,
        currency: data.currency,
        themePalette: selectedTheme,
        profileName: selectedAccountType === 'company' ? data.companyName : 'Personal',
      };

      const profileId = await createProfile(user.uid, profileData);
      const newProfile = { id: profileId, ...profileData };
      addProfile(newProfile);
      setActiveProfile(profileId);

      // force refresh
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Account Type" },
    { number: 2, title: "Theme" },
    { number: 3, title: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Welcome to FinJazz
          </h1>
          <p className="text-[var(--muted-foreground)] mt-2">
            Let's set up your account
          </p>
        </div>

        <div className="flex items-center justify-center mb-8">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  step >= s.number
                    ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                    : "border-[var(--border)] text-[var(--muted-foreground)]"
                }`}
              >
                {step > s.number ? <Check className="h-5 w-5" /> : s.number}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 md:w-24 h-0.5 ${
                    step > s.number
                      ? "bg-[var(--primary)]"
                      : "bg-[var(--border)]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <h2 className="text-xl font-semibold text-center mb-6">
                  Choose your account type
                </h2>
                <form
                  onSubmit={accountTypeForm.handleSubmit(
                    handleAccountTypeSubmit,
                  )}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <label
                      className={`relative flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        accountTypeForm.watch("accountType") === "personal"
                          ? "border-[var(--primary)] bg-[var(--primary)]/5"
                          : "border-[var(--border)] hover:border-[var(--muted)]"
                      }`}
                    >
                      <input
                        type="radio"
                        value="personal"
                        {...accountTypeForm.register("accountType")}
                        className="sr-only"
                      />
                      <User
                        className={`h-12 w-12 mb-4 ${
                          accountTypeForm.watch("accountType") === "personal"
                            ? "text-[var(--primary)]"
                            : "text-[var(--muted-foreground)]"
                        }`}
                      />
                      <h3 className="font-semibold text-[var(--foreground)]">
                        Personal
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)] text-center mt-1">
                        Manage your personal finances
                      </p>
                      {accountTypeForm.watch("accountType") === "personal" && (
                        <div className="absolute top-3 right-3">
                          <Check className="h-5 w-5 text-[var(--primary)]" />
                        </div>
                      )}
                    </label>

                    <label
                      className={`relative flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        accountTypeForm.watch("accountType") === "company"
                          ? "border-[var(--primary)] bg-[var(--primary)]/5"
                          : "border-[var(--border)] hover:border-[var(--muted)]"
                      }`}
                    >
                      <input
                        type="radio"
                        value="company"
                        {...accountTypeForm.register("accountType")}
                        className="sr-only"
                      />
                      <Building2
                        className={`h-12 w-12 mb-4 ${
                          accountTypeForm.watch("accountType") === "company"
                            ? "text-[var(--primary)]"
                            : "text-[var(--muted-foreground)]"
                        }`}
                      />
                      <h3 className="font-semibold text-[var(--foreground)]">
                        Company
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)] text-center mt-1">
                        Manage business finances & projects
                      </p>
                      {accountTypeForm.watch("accountType") === "company" && (
                        <div className="absolute top-3 right-3">
                          <Check className="h-5 w-5 text-[var(--primary)]" />
                        </div>
                      )}
                    </label>
                  </div>

                  <Button type="submit" className="w-full">
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <h2 className="text-xl font-semibold text-center mb-6">
                  Choose your theme
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {Object.entries(themes).map(([key, theme]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleThemeSelect(key)}
                      className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                        selectedTheme === key
                          ? `border-[var(--primary)] ring-2 ring-[var(--primary)]/30 shadow-lg`
                          : "border-[var(--border)] hover:border-[var(--muted)]"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: theme.secondary }}
                        />
                      </div>
                      <h3 className="font-semibold text-[var(--foreground)]">
                        {theme.name}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {theme.description}
                      </p>
                      {selectedTheme === key && (
                        <div className="absolute top-3 right-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: theme.primary }}
                          >
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleThemeSubmit}
                    className="flex-1"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <h2 className="text-xl font-semibold text-center mb-6">
                  Complete your profile
                </h2>
                <form
                  onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                  className="space-y-4"
                >
                  <Input
                    {...profileForm.register("fullName")}
                    label="Full Name"
                    placeholder="Enter your full name"
                    error={profileForm.formState.errors.fullName?.message}
                  />

                  {selectedAccountType === "company" && (
                    <Input
                      {...profileForm.register("companyName")}
                      label="Company Name"
                      placeholder="Enter your company name"
                      error={profileForm.formState.errors.companyName?.message}
                    />
                  )}

                  <Select
                    {...profileForm.register("currency")}
                    label="Currency"
                  >
                    <option value="">Select a currency</option>
                    {currencies.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </Select>

                  {profileForm.formState.errors.currency && (
                    <p className="text-sm text-[var(--error)]">
                      {profileForm.formState.errors.currency.message}
                    </p>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Setting up...
                        </>
                      ) : (
                        <>
                          Complete Setup
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;
