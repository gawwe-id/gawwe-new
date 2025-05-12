import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";

// Hook for fetching all calendars
export function useCalendars() {
  return useQuery({
    queryKey: ["calendars"],
    queryFn: async () => {
      const res = await client.calendars.list.$get();
      return res.json();
    },
  });
}

// Hook for fetching calendar by ID
export function useCalendar(calendarId: string) {
  return useQuery({
    queryKey: ["calendar", calendarId],
    queryFn: async () => {
      const res = await client.calendars.single.$get({
        calendarId,
      });
      return res.json();
    },
    enabled: !!calendarId,
  });
}

// Hook for creating a calendar
export function useCreateCalendar(
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await client.calendars.create.$post(data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
      if (onSuccess) onSuccess(data);
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
}

// Hook for updating a calendar
export function useUpdateCalendar(
  onSuccess?: () => void,
  onError?: (error: Error) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      calendarId,
      updateCalendar,
    }: {
      calendarId: string;
      updateCalendar: any;
    }) => {
      const res = await client.calendars.update.$post({
        calendarId,
        updateCalendar,
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
      queryClient.invalidateQueries({
        queryKey: ["calendar", variables.calendarId],
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
}

// Hook for deleting a calendar
export function useDeleteCalendar(
  onSuccess?: () => void,
  onError?: (error: Error) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ calendarId }: { calendarId: string }) => {
      const res = await client.calendars.delete.$post({ calendarId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
}
