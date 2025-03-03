import { client } from "@/lib/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Class } from "@/server/db/schema/classes";

export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await client.classes.list.$get();
      return res.json();
    },
  });
}

export function useClass(classId: string) {
  return useQuery({
    queryKey: ["class", classId],
    queryFn: async () => {
      const res = await client.classes.single.$get({
        classId,
      });
      return res.json();
    },
    enabled: !!classId,
  });
}

export function useClassesByLanguage(languageClassId: string) {
  return useQuery({
    queryKey: ["classes-by-language", languageClassId],
    queryFn: async () => {
      const res = await client.classes.byLanguage.$get({
        languageClassId,
      });
      return res.json();
    },
    enabled: !!languageClassId,
  });
}

export function useCreateClass(
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      schedule?: string;
      languageClassId: string;
      batch: number;
      startDate: Date;
      endDate: Date;
    }) => {
      const res = await client.classes.create.$post(data);
      return res.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({
        queryKey: ["classes-by-language", variables.languageClassId],
      });
      if (onSuccess) onSuccess(data);
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
}

export function useUpdateClass(
  onSuccess?: () => void,
  onError?: (error: Error) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      languageClassId,
      updateClass,
    }: {
      classId: string;
      languageClassId: string;
      updateClass: Partial<Class>;
    }) => {
      const res = await client.classes.update.$post({
        classId,
        updateClass,
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["class", variables.classId] });
      queryClient.invalidateQueries({
        queryKey: ["classes-by-language", variables.languageClassId],
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
}

export function useDeleteClass(
  onSuccess?: () => void,
  onError?: (error: Error) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ classId }: { classId: string }) => {
      const res = await client.classes.delete.$post({ classId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
}
