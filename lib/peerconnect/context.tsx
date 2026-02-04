import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isProfileComplete: boolean;
  isLoadingProfile: boolean;
  needsCheckIn: boolean;
  setNeedsCheckIn: (needs: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

async function fetchProfile(): Promise<User | null> {
  const response = await fetch("/api/profile", {
    credentials: "include",
  });
  if (response.status === 401 || response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  return response.json();
}

function shouldShowCheckIn(user: User | null): boolean {
  if (!user || !user.asuId) return false;
  
  const today = new Date().toISOString().split('T')[0];
  
  // Check if user already checked in today
  if (user.lastCheckInDate === today) return false;
  
  // Check if user skipped check-in today (stored in localStorage)
  const skippedDate = localStorage.getItem('checkInSkippedDate');
  if (skippedDate === today) return false;
  
  return true;
}

export function skipCheckInForToday() {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem('checkInSkippedDate', today);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [needsCheckIn, setNeedsCheckIn] = useState(false);
  
  const { data: profile, isLoading } = useQuery<User | null>({
    queryKey: ["/api/profile"],
    queryFn: fetchProfile,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (profile !== undefined) {
      setCurrentUser(profile);
      if (shouldShowCheckIn(profile)) {
        setNeedsCheckIn(true);
      }
    }
  }, [profile]);

  const isProfileComplete = currentUser !== null && (currentUser.asuId?.length ?? 0) > 0;

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, isProfileComplete, isLoadingProfile: isLoading, needsCheckIn, setNeedsCheckIn }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
