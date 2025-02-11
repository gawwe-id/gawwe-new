import { ProfileAgencies } from "@/server/db/schema/profileAgencies";
import { ProfileParticipant } from "@/server/db/schema/profileParticipants";
import { User } from "next-auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  user: Partial<User> | null;
  profileParticipant: Partial<ProfileParticipant> | null;
  profileAgency: Partial<ProfileAgencies> | null;

  // User actions
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => void;
  updateImageUser: (image: string | null) => void;
  clearUser: () => void;

  // Participant profile actions
  setProfileParticipant: (profile: Partial<ProfileParticipant>) => void;
  clearProfileParticipant: () => void;

  // Agency profile actions
  setProfileAgency: (profile: Partial<ProfileAgencies>) => void;
  clearProfileAgency: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      profileParticipant: null,
      profileAgency: null,

      // User actions
      setUser: (user) => set({ user }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : userData,
        })),
      updateImageUser: (image) =>
        set((state) => ({
          user: state.user ? { ...state.user, image } : null,
        })),
      clearUser: () => set({ user: null }),

      // Participant profile actions
      setProfileParticipant: (profile) =>
        set((state) => ({
          profileParticipant: {
            ...state.profileParticipant,
            ...profile,
          },
        })),
      clearProfileParticipant: () => set({ profileParticipant: null }),

      // Agency profile actions
      setProfileAgency: (profile) =>
        set((state) => ({
          profileAgency: {
            ...state.profileAgency,
            ...profile,
          },
        })),
      clearProfileAgency: () => set({ profileAgency: null }),
    }),
    {
      name: "onboarding-storage",
    }
  )
);
