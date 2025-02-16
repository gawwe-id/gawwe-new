import { create } from 'zustand';
import { ProfileParticipant } from '@/server/db/schema/profileParticipants';

interface DialogEditAdressParticipantConfig {
  profile: ProfileParticipant | null | undefined;
}

interface DialogEditAddressParticipantState {
  isOpen: boolean;
  dialogConfig: DialogEditAdressParticipantConfig | null;
  openDialog: (config: DialogEditAdressParticipantConfig) => void;
  closeDialog: () => void;
}

export const useDialogEditAddressParticipantStore =
  create<DialogEditAddressParticipantState>((set) => ({
    isOpen: false,
    dialogConfig: null,
    openDialog: (config) =>
      set({
        isOpen: true,
        dialogConfig: {
          ...config
        }
      }),
    closeDialog: () =>
      set({
        isOpen: false,
        dialogConfig: null
      })
  }));
