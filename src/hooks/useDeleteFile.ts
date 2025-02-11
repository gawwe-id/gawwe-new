import { useMutation } from "@tanstack/react-query";

const deleteFile = async (key: string) => {
  const response = await fetch(`/api/upload-image-user?key=${key}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const useDeleteFile = () => {
  return useMutation({
    mutationFn: deleteFile,
  });
};
