import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SettingsContextType {
  activeSeason: string;
  setActiveSeason: (season: string) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSeason, setActiveSeasonState] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase
      .from("app_settings" as any)
      .select("key, value")
      .eq("key", "active_season")
      .maybeSingle();
    if (data) setActiveSeasonState(((data as any).value as string) || "");
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  // Realtime sync
  useEffect(() => {
    const channel = supabase
      .channel("app_settings_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_settings" },
        (payload: any) => {
          const row = payload.new || payload.old;
          if (row?.key === "active_season") {
            setActiveSeasonState(payload.new?.value || "");
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const setActiveSeason = useCallback(async (season: string) => {
    const { error } = await supabase
      .from("app_settings" as any)
      .upsert({ key: "active_season", value: season }, { onConflict: "key" });
    if (error) { toast.error("Failed to update collection"); return; }
    setActiveSeasonState(season);
  }, []);

  return (
    <SettingsContext.Provider value={{ activeSeason, setActiveSeason, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};
