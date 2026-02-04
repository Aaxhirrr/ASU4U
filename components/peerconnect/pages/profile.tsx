import { useState, useRef } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { StreakBadge } from "@/components/daily-check-in";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, GraduationCap, Sparkles, Heart, MessageCircle, UserPlus, Check, Pencil, X, Plus, Upload, Camera, Users, Building, BookOpen, Calendar, Eye, EyeOff } from "lucide-react";
import type { User, Group } from "@shared/schema";

const YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate", "PhD"];
const INTEREST_SUGGESTIONS = [
  "Music", "Gaming", "Sports", "Art", "Reading", "Cooking", 
  "Travel", "Photography", "Fitness", "Movies", "Technology", "Nature"
];

export default function Profile() {
  const [, params] = useRoute("/profile/:id");
  const { currentUser, setCurrentUser } = useApp();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [justAdded, setJustAdded] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    profilePhoto: "",
    name: "",
    major: "",
    age: "",
    year: "",
    description: "",
    interests: [] as string[],
    courses: [] as string[],
    hideAge: false,
    hideYear: false,
  });
  const [newInterest, setNewInterest] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/users", params?.id],
    enabled: !!params?.id,
  });

  const { data: allGroups = [] } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
  });

  const userGroups = allGroups.filter(g => g.members.includes(params?.id || ""));

  const befriend = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/users/${currentUser?.id}/friends`, {
        friendId: params?.id,
      });
      return res.json();
    },
    onSuccess: (updatedUser: User) => {
      setCurrentUser(updatedUser);
      setJustAdded(true);
      qc.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: typeof editData) => {
      const res = await apiRequest("PATCH", `/api/users/${currentUser?.id}`, {
        ...data,
        age: data.age ? parseInt(data.age) : undefined,
      });
      return res.json() as Promise<User>;
    },
    onSuccess: (updatedUser: User) => {
      setCurrentUser(updatedUser);
      qc.invalidateQueries({ queryKey: ["/api/users"] });
      qc.invalidateQueries({ queryKey: ["/api/profile"] });
      setIsEditOpen(false);
      toast({
        title: "Profile updated!",
        description: "Your changes have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

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
        setEditData(prev => ({ ...prev, profilePhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditDialog = () => {
    if (user) {
      setEditData({
        profilePhoto: user.profilePhoto || "",
        name: user.name || "",
        major: user.major || "",
        age: user.age ? String(user.age) : "",
        year: user.year || "",
        description: user.description || "",
        interests: user.interests || [],
        courses: user.courses || [],
        hideAge: user.hideAge || false,
        hideYear: user.hideYear || false,
      });
      setIsEditOpen(true);
    }
  };

  const addInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !editData.interests.includes(trimmed)) {
      setEditData(prev => ({
        ...prev,
        interests: [...prev.interests, trimmed],
      }));
    }
    setNewInterest("");
  };

  const removeInterest = (interest: string) => {
    setEditData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest),
    }));
  };

  const addCourse = (course: string) => {
    const trimmed = course.trim().toUpperCase();
    if (trimmed && !editData.courses.includes(trimmed)) {
      setEditData(prev => ({
        ...prev,
        courses: [...prev.courses, trimmed],
      }));
    }
    setNewCourse("");
  };

  const removeCourse = (course: string) => {
    setEditData(prev => ({
      ...prev,
      courses: prev.courses.filter(c => c !== course),
    }));
  };

  const isOwnProfile = currentUser?.id === params?.id;
  const isFriend = currentUser?.friends?.includes(params?.id || "");

  if (isLoading) {
    return (
      <div className="pb-20 md:pt-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Card>
            <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-t-lg" />
            <CardContent className="pt-0 pb-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16">
                <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-card" />
                <div className="flex-1">
                  <Skeleton className="h-7 w-48 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pb-20 md:pt-20 md:pb-8">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center">
          <p className="text-muted-foreground">User not found</p>
          <Link href="/match">
            <Button variant="ghost" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Match
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : user.username 
      ? user.username.slice(0, 2).toUpperCase()
      : "?";

  const showAge = isOwnProfile || !user.hideAge;
  const showYear = isOwnProfile || !user.hideYear;

  return (
    <div className="pb-20 md:pt-20 md:pb-8 bg-muted/30 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <Card className="overflow-hidden">
          <div className="h-32 md:h-40 bg-gradient-to-r from-primary/30 via-primary/20 to-secondary/30" />
          <CardContent className="pt-0 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 ring-4 ring-card border-4 border-card">
                <AvatarImage src={user.profilePhoto} alt={user.name || user.username || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl md:text-3xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 
                      className="text-xl md:text-2xl font-bold text-foreground"
                      data-testid="profile-name"
                    >
                      {user.name || user.username || "Anonymous User"}
                    </h1>
                    
                    {user.username && user.name && (
                      <p className="text-sm text-muted-foreground" data-testid="profile-username">
                        @{user.username}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                      {user.major && (
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {user.major}
                        </p>
                      )}
                      
                      {showYear && user.year && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          {user.year}
                          {isOwnProfile && user.hideYear && (
                            <EyeOff className="h-3 w-3 ml-1 text-muted-foreground/50" />
                          )}
                        </p>
                      )}
                      
                      {showAge && user.age && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {user.age} years old
                          {isOwnProfile && user.hideAge && (
                            <EyeOff className="h-3 w-3 ml-1 text-muted-foreground/50" />
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {isOwnProfile && user.checkInStreak > 0 && (
                    <div data-testid="streak-badge">
                      <StreakBadge streak={user.checkInStreak} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {isOwnProfile ? (
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      onClick={openEditDialog}
                      data-testid="button-edit-profile"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Profile Photo</Label>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 border-2 border-muted">
                            {editData.profilePhoto ? (
                              <AvatarImage src={editData.profilePhoto} alt="Profile preview" />
                            ) : (
                              <AvatarFallback className="bg-muted">
                                <Camera className="h-6 w-6 text-muted-foreground" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              data-testid="input-edit-photo-file"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full"
                              data-testid="button-edit-upload-photo"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {editData.profilePhoto ? "Change" : "Upload"}
                            </Button>
                            {editData.profilePhoto && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditData(prev => ({ ...prev, profilePhoto: "" }))}
                                className="w-full text-muted-foreground"
                                data-testid="button-edit-remove-photo"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Display Name</Label>
                        <Input
                          id="edit-name"
                          value={editData.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          data-testid="input-edit-name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-major">Major</Label>
                        <Input
                          id="edit-major"
                          value={editData.major}
                          onChange={(e) => setEditData(prev => ({ ...prev, major: e.target.value }))}
                          data-testid="input-edit-major"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-age">Age</Label>
                          <Input
                            id="edit-age"
                            type="number"
                            min="16"
                            max="100"
                            value={editData.age}
                            onChange={(e) => setEditData(prev => ({ ...prev, age: e.target.value }))}
                            data-testid="input-edit-age"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-year">Year</Label>
                          <Select
                          value={editData.year}
                          onValueChange={(value) => setEditData(prev => ({ ...prev, year: value }))}
                        >
                          <SelectTrigger id="edit-year" data-testid="select-edit-year">
                            <SelectValue placeholder="Select your year" />
                          </SelectTrigger>
                          <SelectContent>
                            {YEAR_OPTIONS.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-description">About</Label>
                        <Textarea
                          id="edit-description"
                          value={editData.description}
                          onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                          className="min-h-[80px]"
                          data-testid="input-edit-description"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Courses</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g., CSE 340"
                            value={newCourse}
                            onChange={(e) => setNewCourse(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addCourse(newCourse)}
                            data-testid="input-edit-course"
                          />
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => addCourse(newCourse)}
                            data-testid="button-edit-add-course"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {editData.courses.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {editData.courses.map((course) => (
                              <Badge key={course} variant="secondary">
                                {course}
                                <X
                                  className="h-3 w-3 ml-1 cursor-pointer"
                                  onClick={() => removeCourse(course)}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Interests</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {INTEREST_SUGGESTIONS.map((interest) => (
                            <Badge
                              key={interest}
                              variant={editData.interests.includes(interest) ? "default" : "outline"}
                              className="cursor-pointer text-xs"
                              onClick={() => 
                                editData.interests.includes(interest)
                                  ? removeInterest(interest)
                                  : addInterest(interest)
                              }
                            >
                              {editData.interests.includes(interest) ? (
                                <X className="h-3 w-3 mr-1" />
                              ) : (
                                <Plus className="h-3 w-3 mr-1" />
                              )}
                              {interest}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add custom interest"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addInterest(newInterest)}
                            data-testid="input-edit-custom-interest"
                          />
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => addInterest(newInterest)}
                            data-testid="button-edit-add-interest"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {editData.interests.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {editData.interests.map((interest) => (
                              <Badge key={interest} variant="secondary">
                                {interest}
                                <X
                                  className="h-3 w-3 ml-1 cursor-pointer"
                                  onClick={() => removeInterest(interest)}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-t pt-4 space-y-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Privacy Settings
                        </h4>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="hide-age">Hide Age</Label>
                            <p className="text-xs text-muted-foreground">
                              Your age won't be visible to others
                            </p>
                          </div>
                          <Switch
                            id="hide-age"
                            checked={editData.hideAge}
                            onCheckedChange={(checked) => setEditData(prev => ({ ...prev, hideAge: checked }))}
                            data-testid="switch-hide-age"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="hide-year">Hide Year</Label>
                            <p className="text-xs text-muted-foreground">
                              Your year won't be visible to others
                            </p>
                          </div>
                          <Switch
                            id="hide-year"
                            checked={editData.hideYear}
                            onCheckedChange={(checked) => setEditData(prev => ({ ...prev, hideYear: checked }))}
                            data-testid="switch-hide-year"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => updateProfile.mutate(editData)}
                          disabled={updateProfile.isPending}
                          className="flex-1"
                          data-testid="button-save-profile"
                        >
                          {updateProfile.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <>
                  {isFriend ? (
                    justAdded ? (
                      <Button 
                        variant="secondary"
                        disabled
                        data-testid="button-added"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Added
                      </Button>
                    ) : (
                      <>
                        <Badge variant="secondary" className="gap-1 py-1.5 px-3">
                          <Heart className="h-3 w-3" />
                          Friends
                        </Badge>
                        <Link href="/messages">
                          <Button data-testid="button-message">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </Link>
                      </>
                    )
                  ) : (
                    <Button 
                      onClick={() => befriend.mutate()}
                      disabled={befriend.isPending}
                      data-testid="button-befriend"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {befriend.isPending ? "Adding..." : "Befriend"}
                    </Button>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p 
              className="text-muted-foreground leading-relaxed"
              data-testid="profile-description"
            >
              {user.description || "No description provided."}
            </p>
          </CardContent>
        </Card>

        {user.courses && user.courses.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.courses.map((course, idx) => (
                  <Badge key={idx} variant="outline">
                    {course}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {user.interests && user.interests.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, idx) => (
                  <Badge key={idx} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {userGroups.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userGroups.map((group) => (
                  <Link key={group.id} href={`/groups/${group.id}`}>
                    <div 
                      className="flex items-center gap-3 p-3 rounded-lg hover-elevate overflow-visible cursor-pointer -m-1"
                      data-testid={`profile-group-${group.id}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{group.name}</p>
                        <p className="text-sm text-muted-foreground">{group.members.length} members</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
