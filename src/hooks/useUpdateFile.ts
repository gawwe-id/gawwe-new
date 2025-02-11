import { useMutation } from "@tanstack/react-query";

const updateFile = async ({ file, key }: { file: File; key: string }) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("filekey", key);

  const response = await fetch("/api/upload-image-user", {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const useUpdateFile = () => {
  return useMutation({
    mutationFn: updateFile,
  });
};
