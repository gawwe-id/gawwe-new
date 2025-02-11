import { useMutation } from "@tanstack/react-query";

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload-image-user", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const useUploadFile = () => {
  return useMutation({
    mutationFn: uploadFile,
  });
};
