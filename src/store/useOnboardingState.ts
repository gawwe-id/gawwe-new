import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";
import { User } from "next-auth";
import { ProfileParticipant } from "@/server/db/schema/profileParticipants";
import { ProfileAgencies } from "@/server/db/schema/profileAgencies";

export const useOnboardingState = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createQueryString = (params: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === undefined) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    }

    return current.toString();
  };

  const updateState = (params: Record<string, string>) => {
    router.push(`${pathname}?${createQueryString(params)}`);
  };

  // User state management
  const setUser = (user: User) => {
    updateState({ user: JSON.stringify(user) });
  };

  const updateUser = (userData: Partial<User>) => {
    const currentUser = searchParams.get("user");
    const updatedUser = currentUser
      ? { ...JSON.parse(currentUser), ...userData }
      : userData;
    updateState({ user: JSON.stringify(updatedUser) });
  };

  const updateImageUser = (image: string | null) => {
    const currentUser = searchParams.get("user");
    if (currentUser) {
      const updatedUser = { ...JSON.parse(currentUser), image };
      updateState({ user: JSON.stringify(updatedUser) });
    }
  };

  const clearUser = () => {
    updateState({ user: "" });
  };

  // Profile participant state management
  const setProfileParticipant = (profile: Partial<ProfileParticipant>) => {
    updateState({ participant: JSON.stringify(profile) });
  };

  const clearProfileParticipant = () => {
    updateState({ participant: "" });
  };

  // Profile agency state management
  const setProfileAgency = (profile: Partial<ProfileAgencies>) => {
    updateState({ agency: JSON.stringify(profile) });
  };

  const clearProfileAgency = () => {
    updateState({ agency: "" });
  };

  // Get current states
  const getCurrentUser = (): Partial<User> | null => {
    const userParam = searchParams.get("user");
    return userParam ? JSON.parse(userParam) : null;
  };

  const getCurrentParticipant = (): Partial<ProfileParticipant> | null => {
    const participantParam = searchParams.get("participant");
    return participantParam ? JSON.parse(participantParam) : null;
  };

  const getCurrentAgency = (): Partial<ProfileAgencies> | null => {
    const agencyParam = searchParams.get("agency");
    return agencyParam ? JSON.parse(agencyParam) : null;
  };

  return {
    // State getters
    user: getCurrentUser(),
    profileParticipant: getCurrentParticipant(),
    profileAgency: getCurrentAgency(),

    // User actions
    setUser,
    updateUser,
    updateImageUser,
    clearUser,

    // Participant actions
    setProfileParticipant,
    clearProfileParticipant,

    // Agency actions
    setProfileAgency,
    clearProfileAgency,
  };
};
