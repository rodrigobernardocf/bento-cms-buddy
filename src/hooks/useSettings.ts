import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProfileSettings {
  name: string;
  bio: string;
  avatar_url: string;
}

export function useSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "profile")
        .single();

      if (error) throw error;
      return data.value as ProfileSettings;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (newValue: ProfileSettings) => {
      const { data, error } = await supabase
        .from("site_settings")
        .update({ value: newValue })
        .eq("key", "profile")
        .select()
        .single();

      if (error) throw error;
      return data.value as ProfileSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    updateProfile,
  };
}
