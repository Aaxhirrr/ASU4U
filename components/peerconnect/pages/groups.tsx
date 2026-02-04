import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { UsersRound, Users, ChevronRight, UserPlus, UserMinus, Check, Search } from "lucide-react";
import { useApp } from "@/lib/context";
import { apiRequest } from "@/lib/queryClient";
import type { Group } from "@shared/schema";

export default function Groups() {
  const { currentUser } = useApp();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: groups, isLoading } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
  });

  const joinGroup = useMutation({
    mutationFn: async (groupId: string) => {
      const res = await apiRequest("POST", `/api/groups/${groupId}/join`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-groups"] });
    },
  });

  const leaveGroup = useMutation({
    mutationFn: async (groupId: string) => {
      const res = await apiRequest("POST", `/api/groups/${groupId}/leave`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-groups"] });
    },
  });

  const isMember = (group: Group) => currentUser && group.members.includes(currentUser.id);

  const filteredGroups = groups?.filter(g =>
    g.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="pb-20 md:pt-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
            <UsersRound className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Support Groups</h1>
            <p className="text-sm text-muted-foreground">Find your community and share experiences</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-groups"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : groups?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <UsersRound className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No groups yet</h3>
              <p className="text-sm text-muted-foreground">
                Support groups will be available soon!
              </p>
            </CardContent>
          </Card>
        ) : filteredGroups.length === 0 ? (
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
            {filteredGroups.map((group) => (
              <Card key={group.id} className="overflow-visible">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/groups/${group.id}`} className="flex-1 min-w-0">
                      <div className="cursor-pointer hover-elevate rounded-md p-2 -m-2 overflow-visible">
                        <h3 
                          className="font-semibold text-foreground mb-1"
                          data-testid={`group-name-${group.id}`}
                        >
                          {group.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {group.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            {group.members.length} members
                          </Badge>
                          {isMember(group) && (
                            <Badge variant="default" className="text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Joined
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="shrink-0 flex items-center gap-2">
                      {isMember(group) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            leaveGroup.mutate(group.id);
                          }}
                          disabled={leaveGroup.isPending}
                          data-testid={`button-leave-${group.id}`}
                        >
                          <UserMinus className="h-4 w-4 mr-1" />
                          Leave
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            joinGroup.mutate(group.id);
                          }}
                          disabled={joinGroup.isPending}
                          data-testid={`button-join-${group.id}`}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      )}
                      <Link href={`/groups/${group.id}`}>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
