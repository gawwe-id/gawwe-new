import { create } from "zustand";
import { ProfileParticipant } from "@/server/db/schema/profileParticipants";
import { ProfileAgencies } from "@/server/db/schema/profileAgencies";

interface DialogEditAdressConfig {
  profile: ProfileParticipant | ProfileAgencies | null | undefined;
}

interface DialogEditAddressState {
  isOpen: boolean;
  dialogConfig: DialogEditAdressConfig | null;
  openDialog: (config: DialogEditAdressConfig) => void;
  closeDialog: () => void;
}

export const useDialogEditAddressStore = create<DialogEditAddressState>(
  (set) => ({
    isOpen: false,
    dialogConfig: null,
    openDialog: (config) =>
      set({
        isOpen: true,
        dialogConfig: {
          ...config,
        },
      }),
    closeDialog: () =>
      set({
        isOpen: false,
        dialogConfig: null,
      }),
  })
);
