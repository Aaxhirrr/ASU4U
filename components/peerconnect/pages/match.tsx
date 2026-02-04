import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCard } from "@/components/user-card";
import { useApp } from "@/lib/context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Users, Heart, Search } from "lucide-react";
import type { User } from "@shared/schema";

export default function Match() {
  const { currentUser, setCurrentUser } = useApp();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const befriendMutation = useMutation({
    mutationFn: async (friendId: string) => {
      const res = await apiRequest("POST", `/api/users/${currentUser?.id}/friends`, { friendId });
      return res.json() as Promise<User>;
    },
    onSuccess: (updatedUser) => {
      setCurrentUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Friend added!",
        description: "You can now message each other.",
      });
    },
  });

  const otherUsers = users?.filter(u => u.id !== currentUser?.id) || [];
  const friendIds = new Set(currentUser?.friends || []);

  const filteredUsers = otherUsers.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.major?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.interests?.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="pb-20 md:pt-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Find Your People</h1>
            <p className="text-sm text-muted-foreground">Connect with peers who understand your journey</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, major, or interests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-match"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : otherUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No peers yet</h3>
              <p className="text-sm text-muted-foreground">
                Be patient, more students will join soon!
              </p>
            </CardContent>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Search className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-sm text-muted-foreground">
                Try searching with different keywords
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isFriend={friendIds.has(user.id)}
                onBefriend={(id) => befriendMutation.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
