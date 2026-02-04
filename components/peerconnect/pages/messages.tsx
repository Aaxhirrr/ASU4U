import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/lib/context";
import { apiRequest } from "@/lib/queryClient";
import { MessageCircle, Send, ArrowLeft, Search, MoreHorizontal } from "lucide-react";
import type { User, DirectMessage } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function Messages() {
  const { currentUser } = useApp();
  const queryClient = useQueryClient();
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<DirectMessage[]>({
    queryKey: ["/api/messages", currentUser?.id, selectedFriend?.id],
    enabled: !!currentUser && !!selectedFriend,
    refetchInterval: 2000,
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", "/api/messages", {
        senderId: currentUser?.id,
        receiverId: selectedFriend?.id,
        content,
      });
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ 
        queryKey: ["/api/messages", currentUser?.id, selectedFriend?.id] 
      });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const friends = users.filter(u => currentUser?.friends?.includes(u.id));
  
  const filteredFriends = friends.filter(f => 
    f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.major?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (message.trim()) {
      sendMessage.mutate(message.trim());
    }
  };

  const getConversationMessages = () => {
    if (!currentUser || !selectedFriend) return [];
    return messages.filter(
      (m) =>
        (m.senderId === currentUser.id && m.receiverId === selectedFriend.id) ||
        (m.senderId === selectedFriend.id && m.receiverId === currentUser.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getLastMessage = (friendId: string) => {
    const friendMessages = messages.filter(
      m => (m.senderId === currentUser?.id && m.receiverId === friendId) ||
           (m.senderId === friendId && m.receiverId === currentUser?.id)
    );
    return friendMessages[friendMessages.length - 1];
  };

  return (
    <div className="pb-20 md:pt-20 md:pb-8 h-screen flex flex-col bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-4 w-full flex-1 flex flex-col min-h-0">
        <div className="flex gap-4 flex-1 min-h-0">
          <Card className={cn(
            "w-full md:w-80 shrink-0 flex flex-col overflow-hidden",
            selectedFriend && "hidden md:flex"
          )}>
            <CardHeader className="py-3 px-4 border-b shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Messaging
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                  data-testid="input-search-messages"
                />
              </div>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="py-1">
                {usersLoading ? (
                  <div className="space-y-1 p-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : friends.length === 0 ? (
                  <div className="py-12 px-4 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-1">No conversations yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with peers to start messaging
                    </p>
                    <Link href="/match">
                      <Button size="sm">
                        Find peers
                      </Button>
                    </Link>
                  </div>
                ) : filteredFriends.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <p className="text-sm text-muted-foreground">No results found</p>
                  </div>
                ) : (
                  <div>
                    {filteredFriends.map((friend) => (
                      <button
                        key={friend.id}
                        onClick={() => setSelectedFriend(friend)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                          selectedFriend?.id === friend.id 
                            ? "bg-muted border-l-2 border-l-primary" 
                            : "hover:bg-muted/50"
                        )}
                        data-testid={`friend-${friend.id}`}
                      >
                        <Avatar className="w-12 h-12 shrink-0">
                          <AvatarImage src={friend.profilePhoto} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {friend.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-foreground truncate">
                              {friend.name || "Anonymous"}
                            </p>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {getLastMessage(friend.id) && 
                                new Date(getLastMessage(friend.id).timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {friend.major || "ASU Student"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>

          <Card className={cn(
            "flex-1 flex flex-col min-h-0 overflow-hidden",
            !selectedFriend && "hidden md:flex"
          )}>
            {!selectedFriend ? (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-sm">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Your messages</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a conversation from the left to start messaging
                  </p>
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader className="py-3 px-4 border-b shrink-0">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedFriend(null)}
                      className="md:hidden h-8 w-8"
                      data-testid="button-back-messages"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Link href={`/profile/${selectedFriend.id}`}>
                      <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                        <AvatarImage src={selectedFriend.profilePhoto} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {selectedFriend.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/profile/${selectedFriend.id}`}>
                        <p className="font-semibold text-foreground hover:underline cursor-pointer">
                          {selectedFriend.name || "Anonymous"}
                        </p>
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {selectedFriend.major || "ASU Student"}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <div className="flex-1 overflow-y-auto p-4 bg-muted/20" ref={scrollRef}>
                  {messagesLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <Skeleton className="h-14 w-48 rounded-2xl" />
                        </div>
                      ))}
                    </div>
                  ) : getConversationMessages().length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Avatar className="w-16 h-16 mb-4">
                        <AvatarImage src={selectedFriend.profilePhoto} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                          {selectedFriend.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-foreground">{selectedFriend.name}</p>
                      <p className="text-sm text-muted-foreground mb-4">{selectedFriend.major}</p>
                      <p className="text-sm text-muted-foreground">
                        Start a conversation by sending a message
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {getConversationMessages().map((msg, idx, arr) => {
                        const isOwn = msg.senderId === currentUser?.id;
                        const prevMsg = arr[idx - 1];
                        const showDate = !prevMsg || 
                          new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
                        
                        return (
                          <div key={msg.id}>
                            {showDate && (
                              <div className="flex items-center justify-center my-4">
                                <span className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full">
                                  {new Date(msg.timestamp).toLocaleDateString(undefined, {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            )}
                            <div
                              className={cn(
                                "flex items-end gap-2",
                                isOwn && "flex-row-reverse"
                              )}
                            >
                              {!isOwn && (
                                <Avatar className="w-7 h-7 shrink-0">
                                  <AvatarImage src={selectedFriend.profilePhoto} />
                                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                    {selectedFriend.name?.charAt(0) || "?"}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={cn(
                                  "max-w-[70%] rounded-2xl px-4 py-2.5",
                                  isOwn
                                    ? "bg-primary text-primary-foreground rounded-br-md"
                                    : "bg-card text-foreground rounded-bl-md border"
                                )}
                              >
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                              </div>
                            </div>
                            <p
                              className={cn(
                                "text-[10px] text-muted-foreground mt-1",
                                isOwn ? "text-right mr-2" : "ml-9"
                              )}
                            >
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t bg-card shrink-0">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Write a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      className="rounded-full"
                      data-testid="input-direct-message"
                    />
                    <Button
                      size="icon"
                      onClick={handleSend}
                      disabled={!message.trim() || sendMessage.isPending}
                      className="rounded-full shrink-0"
                      data-testid="button-send-message"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
