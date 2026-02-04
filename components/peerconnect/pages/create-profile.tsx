import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/lib/context";
import { apiRequest } from "@/lib/queryClient";
import { ArrowRight, ArrowLeft, X, Plus, Sparkles, Upload, Camera, BookOpen } from "lucide-react";
import logoImage from "@assets/ChatGPT_Image_Feb_2,_2026,_08_38_47_PM_1770089960450.png";
import type { User } from "@shared/schema";

const YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate", "PhD"];
const INTEREST_SUGGESTIONS = [
  "Music", "Gaming", "Sports", "Art", "Reading", "Cooking", 
  "Travel", "Photography", "Fitness", "Movies", "Technology", "Nature"
];

export default function CreateProfile() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { setCurrentUser } = useApp();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    profilePhoto: "",
    name: "",
    asuId: "",
    major: "",
    age: "",
    year: "",
    courses: [] as string[],
    description: "",
    interests: [] as string[],
  });
  const [newInterest, setNewInterest] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const completeProfile = useMutation({
    mutationFn: async (data: typeof formData) => {
      const parsedAge = parseInt(data.age);
      if (isNaN(parsedAge) || parsedAge < 16 || parsedAge > 100) {
        throw new Error("Please enter a valid age between 16 and 100");
      }
      const res = await apiRequest("PATCH", "/api/profile", {
        profilePhoto: data.profilePhoto,
        name: data.name,
        asuId: data.asuId,
        major: data.major,
        age: parsedAge,
        year: data.year,
        courses: data.courses,
        description: data.description,
        interests: data.interests,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update profile");
      }
      return res.json() as Promise<User>;
    },
    onSuccess: (user) => {
      setCurrentUser(user);
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Welcome to PeerConnect!",
        description: "Your profile has been created. Start connecting with peers!",
      });
      navigate("/match");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      completeProfile.mutate(formData);
    }
  };

  const addInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !formData.interests.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, trimmed],
      }));
    }
    setNewInterest("");
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest),
    }));
  };

  const addCourse = () => {
    const trimmed = newCourse.trim().toUpperCase();
    if (trimmed && !formData.courses.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        courses: [...prev.courses, trimmed],
      }));
    }
    setNewCourse("");
  };

  const removeCourse = (course: string) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.filter(c => c !== course),
    }));
  };

  const ageNum = parseInt(formData.age);
  const isValidAge = !isNaN(ageNum) && ageNum >= 16 && ageNum <= 100;
  
  const canProceed = step === 1 
    ? formData.asuId.length > 0 && formData.major.length > 0 && isValidAge && formData.year.length > 0
    : true;

  const isOptionalStep = step === 2 || step === 3 || step === 4;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <img src={logoImage} alt="PeerConnect Logo" className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Complete Your Profile</CardTitle>
          <CardDescription>
            Step {step} of 4: {
              step === 1 ? "Basic Info" :
              step === 2 ? "Courses (Optional)" :
              step === 3 ? "Interests (Optional)" :
              "About You (Optional)"
            }
          </CardDescription>
          <div className="flex justify-center gap-1 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 w-12 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-24 h-24">
                  {formData.profilePhoto ? (
                    <AvatarImage src={formData.profilePhoto} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      <Camera className="h-8 w-8" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="button-upload-photo"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Display Name (Optional)</Label>
                <Input
                  id="name"
                  data-testid="input-display-name"
                  placeholder="How should we call you?"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="asuId">ASU ID <span className="text-destructive">*</span></Label>
                <Input
                  id="asuId"
                  data-testid="input-asu-id"
                  placeholder="1234567890"
                  value={formData.asuId}
                  onChange={(e) => setFormData(prev => ({ ...prev, asuId: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="major">Major <span className="text-destructive">*</span></Label>
                <Input
                  id="major"
                  data-testid="input-major"
                  placeholder="e.g., Computer Science"
                  value={formData.major}
                  onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age <span className="text-destructive">*</span></Label>
                  <Input
                    id="age"
                    data-testid="input-age"
                    type="number"
                    min="16"
                    max="100"
                    placeholder="21"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  />
                  {formData.age && !isValidAge && (
                    <p className="text-xs text-destructive">Age must be 16-100</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year <span className="text-destructive">*</span></Label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}
                  >
                    <SelectTrigger id="year" data-testid="select-year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEAR_OPTIONS.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Add your current courses so peers can find study buddies
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Current Courses</Label>
                <div className="flex gap-2">
                  <Input
                    data-testid="input-course"
                    placeholder="e.g., CSE 340"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCourse();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCourse}
                    disabled={!newCourse.trim()}
                    data-testid="button-add-course"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {formData.courses.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.courses.map((course) => (
                    <Badge key={course} variant="secondary" className="gap-1 pr-1">
                      {course}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-transparent"
                        onClick={() => removeCourse(course)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Select interests to find peers who share your passions
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {INTEREST_SUGGESTIONS.filter(i => !formData.interests.includes(i)).map((interest) => (
                  <Badge
                    key={interest}
                    variant="outline"
                    className="cursor-pointer hover-elevate"
                    onClick={() => addInterest(interest)}
                    data-testid={`badge-interest-${interest.toLowerCase()}`}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {interest}
                  </Badge>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label>Add Custom Interest</Label>
                <div className="flex gap-2">
                  <Input
                    data-testid="input-custom-interest"
                    placeholder="e.g., Hiking"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addInterest(newInterest);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addInterest(newInterest)}
                    disabled={!newInterest.trim()}
                    data-testid="button-add-interest"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {formData.interests.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="gap-1 pr-1">
                      {interest}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-transparent"
                        onClick={() => removeInterest(interest)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">About You (Optional)</Label>
                <Textarea
                  id="description"
                  data-testid="textarea-description"
                  placeholder="Share a bit about yourself, your background, or what brings you to PeerConnect..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  This helps others understand your journey and connect with you
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button variant="ghost" onClick={handleBack} data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}
            
            <div className="flex gap-2">
              {isOptionalStep && step < 4 && (
                <Button variant="ghost" onClick={handleSkip} data-testid="button-skip">
                  Skip
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed || completeProfile.isPending}
                data-testid="button-next"
              >
                {completeProfile.isPending ? "Saving..." : step === 4 ? "Complete Profile" : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
