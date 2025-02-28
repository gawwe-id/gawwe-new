import { client } from "@/lib/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ClassSchedule } from "@/server/db/schema/classSchedules";
import { ScheduleDay } from "@/server/db/schema/classSchedules";

// Get schedules for a class
export function useClassSchedules(classId: string) {
  return useQuery({
    queryKey: ["class-schedules", classId],
    queryFn: async () => {
      const res = await client.classSchedules.byClass.$get({ classId });
      return res.json();
    },
    enabled: !!classId, // Only run the query if classId is provided
  });
}

// Create a new class schedule
export function useCreateClassSchedule(
  onSuccess?: () => void,
  onError?: (error: Error) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      classId: string;
      day: ScheduleDay;
      startTime: string; // Format: "HH:MM:SS"
      endTime: string; // Format: "HH:MM:SS"
    }) => {
      const res = await client.classSchedules.create.$post(data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["class-schedules", variables.classId],
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
}

// Update a class schedule
export function useUpdateClassSchedule(
  onSuccess?: () => void,
  onError?: (error: Error) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      scheduleId,
      classId,
      updateSchedule,
    }: {
      scheduleId: string;
      classId: string;
      updateSchedule: {
        startTime?: string;
        endTime?: string;
      };
    }) => {
      const res = await client.classSchedules.update.$post({
        scheduleId,
        updateSchedule,
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["class-schedules", variables.classId],
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
}

// Delete a class schedule
export function useDeleteClassSchedule(
  onSuccess?: () => void,
  onError?: (error: Error) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      scheduleId,
      classId,
    }: {
      scheduleId: string;
      classId: string;
    }) => {
      const res = await client.classSchedules.delete.$post({ scheduleId });
      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["class-schedules", variables.classId],
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
}

// Delete all schedules for a class
export function useDeleteAllClassSchedules(
  onSuccess?: () => void,
  onError?: (error: Error) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ classId }: { classId: string }) => {
      const res = await client.classSchedules.deleteAllForClass.$post({
        classId,
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["class-schedules", variables.classId],
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
}

// Helper function to format day and time for display
export function formatSchedule(schedule: ClassSchedule): string {
  const day = schedule.day.charAt(0) + schedule.day.slice(1).toLowerCase();

  // Format times (assuming they come in as HH:MM:SS)
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const startTime = formatTime(schedule.startTime);
  const endTime = formatTime(schedule.endTime);

  return `${day} ${startTime}-${endTime}`;
}

// Helper function to get all schedules as a formatted string
export function formatAllSchedules(schedules: ClassSchedule[]): string {
  if (!schedules || schedules.length === 0) {
    return "Belum ada jadwal";
  }

  return schedules.map(formatSchedule).join(", ");
}
