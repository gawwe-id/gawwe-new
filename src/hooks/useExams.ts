import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";

// Hook for fetching all exams
export function useAllExams() {
  return useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const res = await client.exams.list.$get();
      return res.json();
    },
  });
}

// Hook for fetching exam by ID
export function useExamById(examId: string | null) {
  return useQuery({
    queryKey: ["exams", examId],
    queryFn: async () => {
      if (!examId) return null;

      const res = await client.exams.byId.$get({
        examId,
      });
      return res.json();
    },
    enabled: !!examId,
  });
}

// Hook for fetching exams by class ID
export function useExamsByClassId(classId: string | null) {
  return useQuery({
    queryKey: ["exams", "class", classId],
    queryFn: async () => {
      if (!classId) return [];

      const res = await client.exams.byClassId.$get({
        classId,
      });
      return res.json();
    },
    enabled: !!classId,
  });
}

// Hook for creating a new exam
export function useCreateExam(
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (examData: any) => {
      const res = await client.exams.create.$post(examData);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      if (onSuccess) onSuccess(data);
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
}

// Hook for updating an exam
export function useUpdateExam(
  onSuccess?: (data: any, variables: any) => void,
  onError?: (error: Error) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ examId, data }: { examId: string; data: any }) => {
      const res = await client.exams.update.$post({
        examId,
        data,
      });
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams", variables.examId] });
      if (onSuccess) onSuccess(data, variables);
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
}

// Hook for deleting an exam
export function useDeleteExam(
  onSuccess?: () => void,
  onError?: (error: Error) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ examId }: { examId: string }) => {
      const res = await client.exams.delete.$post({
        examId,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
}
