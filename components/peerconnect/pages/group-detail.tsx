import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/lib/context";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Send, Users, ShieldCheck } from "lucide-react";
import type { Group, GroupMessage, User } from "@shared/schema";

export default function GroupDetail() {
  const [, params] = useRoute("/groups/:id");
  const { currentUser } = useApp();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");

  const { data: group, isLoading: groupLoading } = useQuery<Group>({
    queryKey: ["/api/groups", params?.id],
    enabled: !!params?.id,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<GroupMessage[]>({
    queryKey: ["/api/groups", params?.id, "messages"],
    enabled: !!params?.id,
    refetchInterval: 3000,
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", `/api/groups/${params?.id}/messages`, {
        userId: currentUser?.id,
        content,
      });
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/groups", params?.id, "messages"] });
    },
  });

  const getUserById = (id: string) => users.find(u => u.id === id);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage.mutate(message.trim());
    }
  };

  if (groupLoading) {
    return (
      <div className="pb-20 md:pt-20 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="pb-20 md:pt-20 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <p className="text-muted-foreground">Group not found</p>
          <Link href="/groups">
            <Button variant="ghost" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Groups
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pt-20 md:pb-8 h-screen flex flex-col">
      <div className="max-w-2xl mx-auto px-4 py-4 w-full flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/groups">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{group.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {group.members.length} members
              </Badge>
            </div>
          </div>
        </div>

        <Card className="mb-4">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
            {group.rules.length > 0 && (
              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Group Rules</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {group.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-muted-foreground/50">{idx + 1}.</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="py-3 px-4 border-b shrink-0">
            <CardTitle className="text-base">Group Chat</CardTitle>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messagesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">
                  No messages yet. Be the first to say hello!
                </p>
              ) : (
                messages.map((msg) => {
                  const user = getUserById(msg.userId);
                  const isOwn = msg.userId === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                    >
                      <Link href={`/profile/${msg.userId}`}>
                        <Avatar className="w-8 h-8 cursor-pointer">
                          <AvatarImage src={user?.profilePhoto} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {user?.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className={`max-w-[70%] ${isOwn ? "text-right" : ""}`}>
                        <p className="text-xs text-muted-foreground mb-1">
                          {user?.name || "Unknown"}
                        </p>
                        <div
                          className={`rounded-lg px-3 py-2 text-sm ${
                            isOwn 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], { 
                            hour: "2-digit", 
                            minute: "2-digit" 
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t shrink-0">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                data-testid="input-group-message"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!message.trim() || sendMessage.isPending}
                data-testid="button-send-group-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
