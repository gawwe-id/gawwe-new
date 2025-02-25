// File: /components/class-management/AddLanguageModal.tsx
"use client";

import { useState } from "react";
import {
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  FormHelperText,
  Divider,
} from "@mui/joy";
import { Language as LanguageIcon } from "@mui/icons-material";

interface AddLanguageDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddLanguageDialog({
  open,
  onClose,
}: AddLanguageDialogProps) {
  const [formData, setFormData] = useState({
    languageName: "",
    level: "Beginner",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    languageName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLevelChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    if (newValue) {
      setFormData((prev) => ({ ...prev, level: newValue }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.languageName.trim()) {
      newErrors.languageName = "Nama bahasa tidak boleh kosong";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Here you would typically call your API to save the new language
      console.log("Submitting new language:", formData);

      // Reset form and close modal
      setFormData({
        languageName: "",
        level: "Beginner",
      });
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        aria-labelledby="add-language-modal-title"
        aria-describedby="add-language-modal-description"
        sx={{
          maxWidth: 500,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <ModalClose
          variant="outlined"
          sx={{
            top: "calc(-1/4 * var(--IconButton-size))",
            right: "calc(-1/4 * var(--IconButton-size))",
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.2)",
            borderRadius: "50%",
            bgcolor: "background.body",
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              width: 60,
              height: 60,
              bgcolor: "primary.softBg",
              color: "primary.500",
              mb: 1,
            }}
          >
            <LanguageIcon sx={{ fontSize: 30 }} />
          </Box>

          <Typography
            component="h2"
            id="add-language-modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
          >
            Tambah Bahasa Baru
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl error={!!errors.languageName} sx={{ mb: 2 }} required>
            <FormLabel>Nama Bahasa</FormLabel>
            <Input
              name="languageName"
              value={formData.languageName}
              onChange={handleChange}
              placeholder="Contoh: Bahasa Jepang"
              autoFocus
              fullWidth
            />
            {errors.languageName && (
              <FormHelperText>{errors.languageName}</FormHelperText>
            )}
          </FormControl>

          <FormControl sx={{ mb: 3 }}>
            <FormLabel>Level</FormLabel>
            <Select
              value={formData.level}
              onChange={handleLevelChange}
              sx={{ width: "100%" }}
            >
              <Option value="Beginner">Beginner</Option>
              <Option value="Intermediate">Intermediate</Option>
              <Option value="Advanced">Advanced</Option>
              <Option value="All Levels">All Levels</Option>
            </Select>
            <FormHelperText>Pilih level umum untuk bahasa ini</FormHelperText>
          </FormControl>

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button variant="plain" color="neutral" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
