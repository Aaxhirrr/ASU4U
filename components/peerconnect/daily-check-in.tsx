import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useApp, skipCheckInForToday } from "@/lib/context";
import { Flame, Heart, Sun, Cloud, CloudRain, Sparkles, X, CheckCircle2 } from "lucide-react";
import type { User } from "@shared/schema";

const MOOD_OPTIONS = [
  { 
    icon: <Sun className="h-5 w-5" />, 
    label: "Great", 
    color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    selectedColor: "bg-yellow-100 dark:bg-yellow-900/40 border-yellow-400 dark:border-yellow-600",
    response: "That's wonderful to hear! Keep that positive energy going today."
  },
  { 
    icon: <Sparkles className="h-5 w-5" />, 
    label: "Good", 
    color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    selectedColor: "bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-600",
    response: "Great to hear you're doing well! Small positive moments add up."
  },
  { 
    icon: <Cloud className="h-5 w-5" />, 
    label: "Okay", 
    color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    selectedColor: "bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600",
    response: "It's okay to have average days. Take things one step at a time."
  },
  { 
    icon: <CloudRain className="h-5 w-5" />, 
    label: "Tough", 
    color: "bg-gray-50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700",
    selectedColor: "bg-gray-100 dark:bg-gray-800/40 border-gray-400 dark:border-gray-600",
    response: "Tough days happen. Remember, you're not alone and things will get better."
  },
  { 
    icon: <Heart className="h-5 w-5" />, 
    label: "Need Support", 
    color: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800",
    selectedColor: "bg-pink-100 dark:bg-pink-900/40 border-pink-400 dark:border-pink-600",
    response: "We're here for you. Consider reaching out to a peer or group for support."
  },
];

const REFLECTION_PROMPTS: Record<string, string[]> = {
  "Great": [
    "What's contributing to this great feeling?",
    "How can you share this positivity with others?",
  ],
  "Good": [
    "What's one thing you're grateful for today?",
    "What's something you're looking forward to?",
  ],
  "Okay": [
    "What's one small thing that could make today better?",
    "Is there anything on your mind you'd like to process?",
  ],
  "Tough": [
    "What's one thing you can do to take care of yourself today?",
    "Is there someone you could reach out to for support?",
  ],
  "Need Support": [
    "What would help you feel more supported right now?",
    "What's weighing on you the most today?",
  ],
};

interface DailyCheckInProps {
  open: boolean;
  onClose: () => void;
}

export function DailyCheckIn({ open, onClose }: DailyCheckInProps) {
  const { setCurrentUser } = useApp();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [reflection, setReflection] = useState("");
  const [step, setStep] = useState(1);
  const [currentPrompt, setCurrentPrompt] = useState("");

  const selectedMoodData = selectedMood !== null ? MOOD_OPTIONS[selectedMood] : null;

  const goToStep3 = () => {
    if (selectedMoodData) {
      const prompts = REFLECTION_PROMPTS[selectedMoodData.label] || [];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)] || "How are you feeling?";
      setCurrentPrompt(randomPrompt);
    }
    setStep(3);
  };

  const checkInMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/check-in", {});
      return res.json() as Promise<User>;
    },
    onSuccess: (user) => {
      setCurrentUser(user);
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      onClose();
    },
  });

  const handleComplete = () => {
    checkInMutation.mutate();
  };

  const handleSkip = () => {
    skipCheckInForToday();
    onClose();
  };

  const handleMoodSelect = (index: number) => {
    setSelectedMood(index);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <div className="sr-only">
          <DialogTitle>Daily Check-In</DialogTitle>
          <DialogDescription>Take a moment to reflect on how you're feeling today</DialogDescription>
        </div>
        
        <div className="relative">
          <div className="border-b bg-muted/30 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Daily Check-In</h2>
                <p className="text-sm text-muted-foreground">
                  Take a moment to reflect on how you're feeling
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {step === 1 && (
              <div className="space-y-5">
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    How are you feeling today?
                  </p>
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {MOOD_OPTIONS.map((mood, index) => (
                    <button
                      key={index}
                      onClick={() => handleMoodSelect(index)}
                      className={`flex flex-col items-center p-3 rounded-lg border transition-all hover-elevate ${
                        selectedMood === index 
                          ? mood.selectedColor
                          : mood.color
                      }`}
                      data-testid={`button-mood-${mood.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <div className={selectedMood === index ? "text-foreground" : "text-muted-foreground"}>
                        {mood.icon}
                      </div>
                      <span className={`text-xs mt-1.5 font-medium ${
                        selectedMood === index ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {mood.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={handleSkip}
                    data-testid="button-checkin-skip"
                  >
                    Skip for now
                  </Button>
                  <Button 
                    className="flex-1" 
                    disabled={selectedMood === null}
                    onClick={() => setStep(2)}
                    data-testid="button-checkin-next"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && selectedMoodData && (
              <div className="space-y-5">
                <div className="text-center space-y-4">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${selectedMoodData.selectedColor}`}>
                    <div className="text-foreground scale-150">
                      {selectedMoodData.icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      {selectedMoodData.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedMoodData.response}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setStep(1)}
                    data-testid="button-checkin-back"
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={goToStep3}
                    data-testid="button-checkin-next-2"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {currentPrompt}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sharing is optional but can help you process your thoughts
                  </p>
                </div>

                <Textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Write your thoughts here..."
                  className="min-h-[120px] resize-none text-sm"
                  data-testid="input-reflection"
                />

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setStep(2)}
                    data-testid="button-checkin-back-2"
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={handleComplete}
                    disabled={checkInMutation.isPending}
                    data-testid="button-complete-checkin"
                  >
                    {checkInMutation.isPending ? "Saving..." : "Complete"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function StreakBadge({ streak }: { streak: number }) {
  if (streak <= 0) return null;
  
  return (
    <Badge variant="secondary" className="gap-1">
      <Flame className="h-3.5 w-3.5 text-orange-500" />
      <span>{streak} day{streak !== 1 ? 's' : ''}</span>
    </Badge>
  );
}
