"use client";

import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { useDialogAlertStore } from "@/store/useDialogAlertStore";

export default function DialogAlert() {
  const { isOpen, dialogConfig, closeDialog } = useDialogAlertStore();

  if (!dialogConfig) return null;

  const { title, description, textCancel, textAction, onAction, isLoading } =
    dialogConfig;

  return (
    <Modal open={isOpen} onClose={closeDialog}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          <WarningRoundedIcon />
          {title}
        </DialogTitle>
        <Divider />
        <DialogContent>{description}</DialogContent>
        <DialogActions>
          <Button
            variant="solid"
            color="danger"
            loading={isLoading}
            onClick={onAction}
          >
            {textAction}
          </Button>
          <Button variant="plain" color="neutral" onClick={closeDialog}>
            {textCancel}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
