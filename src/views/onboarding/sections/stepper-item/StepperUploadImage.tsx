"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import { Avatar, Box, Button, IconButton, Stack, styled } from "@mui/joy";

import { useOnboardingStore } from "@/store/useOnboardingStore";

import { useUploadFile } from "@/hooks/useUploadFile";
import { useUpdateFile } from "@/hooks/useUpdateFile";
import { useDeleteFile } from "@/hooks/useDeleteFile";

// assets
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useSnackbar } from "@/hooks/useSnackbar";

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

interface StepperUploadImageProps {
  handleBack: () => void;
  handleNext: () => void;
}

const StepperUploadImage = ({
  handleBack,
  handleNext,
}: StepperUploadImageProps) => {
  const user = useOnboardingStore((state) => state.user);
  const updateImageUser = useOnboardingStore((state) => state.updateImageUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { showSnackbar } = useSnackbar();
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();
  const { mutate: updateFile, isPending: isUpdating } = useUpdateFile();
  const { mutate: deleteFile, isPending: isDeleting } = useDeleteFile();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage); // Cleanup URL object
      }
    };
  }, [previewImage]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file?.type.includes("image")) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    } else {
      setSelectedFile(null);
      setPreviewImage(null);
      showSnackbar("File yang diupload harus berupa gambar!", "danger");
    }

    if (event.target) {
      event.target.value = "";
    }
  };

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getImageKeyFromUrl = (url: string) => {
    // Extract the key from the URL (everything after gawwe.space/)
    return url.split("gawwe.space/")[1];
  };

  const generateUniqueFileName = (file: File) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split(".").pop();
    return `${timestamp}-${randomString}.${extension}`;
  };

  const handleFileUpload = () => {
    if (!selectedFile) return;

    const uniqueFileName = generateUniqueFileName(selectedFile);
    const newFile = new File([selectedFile], uniqueFileName, {
      type: selectedFile.type,
    });

    const updatedImage = `https://gawwe.space/${uniqueFileName}`;

    if (user?.image) {
      const existingImageKey = getImageKeyFromUrl(user.image);

      updateFile(
        { file: newFile, key: existingImageKey || "" },
        {
          onSuccess: () => {
            showSnackbar("Update foto profil berhasil!", "success");
            updateImageUser(updatedImage);
            setSelectedFile(null);
            setPreviewImage(null);
          },
          onError: () => {
            showSnackbar("Update foto profil gagal!", "danger");
          },
        }
      );
    } else {
      uploadFile(newFile, {
        onSuccess: () => {
          showSnackbar("Upload foto profil berhasil!", "success");
          updateImageUser(updatedImage);
          setSelectedFile(null);
          setPreviewImage(null);
        },
        onError: () => {
          showSnackbar("Upload foto profil gagal!", "danger");
        },
      });
    }
  };

  const handleDeleteImage = () => {
    if (!user?.image) {
      setSelectedFile(null);
      setPreviewImage(null);

      return;
    }

    const imageKey = getImageKeyFromUrl(user.image);
    if (!imageKey) {
      showSnackbar("Hapus foto profil gagal!", "danger");
      return;
    }
    deleteFile(imageKey, {
      onSuccess: () => {
        showSnackbar("Hapus foto profil berhasil!", "success");
        updateImageUser(null);
        setSelectedFile(null);
        setPreviewImage(null);
      },
      onError: () => {
        showSnackbar("Hapus foto profil gagal!", "danger");
      },
    });
  };

  const isLoading = isUploading || isUpdating || isDeleting;

  return (
    <Box width={"50%"} mt={4}>
      <Stack direction="row" justifyContent="center" alignItems="center" mb={4}>
        <Box position="relative">
          <Avatar
            sx={{ height: 85, width: 85 }}
            src={previewImage || user?.image || ""}
          />
          {(user?.image || previewImage) && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <IconButton
                size="sm"
                variant="soft"
                color="primary"
                onClick={handleEditClick}
                disabled={isLoading}
              >
                <EditRoundedIcon />
              </IconButton>
              <VisuallyHiddenInput
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
              />
              <IconButton
                size="sm"
                variant="soft"
                color="danger"
                onClick={handleDeleteImage}
                disabled={isLoading}
              >
                <DeleteRoundedIcon />
              </IconButton>
            </Stack>
          )}
        </Box>
      </Stack>

      <Stack spacing={2} direction="row" justifyContent="center">
        {!user?.image && !previewImage ? (
          <Button
            component="label"
            color="neutral"
            variant="outlined"
            size="md"
            startDecorator={<UploadFileRoundedIcon />}
            disabled={isLoading}
            // onClick={handleEditClick}
          >
            Pilih Foto
            <VisuallyHiddenInput
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
            />
          </Button>
        ) : (
          previewImage && (
            <Button
              color="primary"
              variant="outlined"
              size="md"
              loading={isLoading}
              onClick={handleFileUpload}
              startDecorator={<CloudUploadRoundedIcon />}
            >
              {user?.image ? "Update Foto" : "Upload Foto"}
            </Button>
          )
        )}
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={10}
      >
        <Button
          size="sm"
          color="neutral"
          variant="soft"
          startDecorator={<NavigateBeforeRoundedIcon />}
          onClick={handleBack}
          disabled={isLoading}
        >
          Kembali
        </Button>
        <Button
          size="sm"
          color="primary"
          variant="soft"
          type="submit"
          endDecorator={<NavigateNextRoundedIcon />}
          onClick={handleNext}
          disabled={isLoading}
        >
          Selanjutnya
        </Button>
      </Stack>
    </Box>
  );
};

export default StepperUploadImage;
