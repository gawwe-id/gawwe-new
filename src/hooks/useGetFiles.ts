import { useQuery } from "@tanstack/react-query";

const fetchFiles = async () => {
  const response = await fetch("/api/upload-image-user");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useGetFiles = () => {
  return useQuery({ queryKey: ["files"], queryFn: fetchFiles });
};
