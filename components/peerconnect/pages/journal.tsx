import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useApp } from "@/lib/context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Send, MessageCircle, ChevronDown, ChevronUp, PenLine, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { JournalPost, Comment, User } from "@shared/schema";

export default function Journal() {
  const { currentUser } = useApp();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newPost, setNewPost] = useState("");
  const [allowComments, setAllowComments] = useState(true);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  
  const [editingPost, setEditingPost] = useState<JournalPost | null>(null);
  const [editPostContent, setEditPostContent] = useState("");
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  const { data: posts = [], isLoading: postsLoading } = useQuery<JournalPost[]>({
    queryKey: ["/api/journal"],
    refetchInterval: 5000,
  });

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["/api/comments"],
    refetchInterval: 5000,
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const createPost = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/journal", {
        userId: currentUser?.id,
        content: newPost,
        allowComments,
      });
    },
    onSuccess: () => {
      setNewPost("");
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      toast({ title: "Posted!", description: "Your journal entry has been shared." });
    },
  });

  const addComment = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      await apiRequest("POST", "/api/comments", {
        postId,
        userId: currentUser?.id,
        content,
      });
    },
    onSuccess: (_, { postId }) => {
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
    },
  });

  const updatePost = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      await apiRequest("PATCH", `/api/journal/${postId}`, { content });
    },
    onSuccess: () => {
      setEditingPost(null);
      setEditPostContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      toast({ title: "Post updated!" });
    },
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      await apiRequest("DELETE", `/api/journal/${postId}`);
    },
    onSuccess: () => {
      setDeletingPostId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
      toast({ title: "Post deleted." });
    },
  });

  const updateComment = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      await apiRequest("PATCH", `/api/comments/${commentId}`, { content });
    },
    onSuccess: () => {
      setEditingComment(null);
      setEditCommentContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
      toast({ title: "Comment updated!" });
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      await apiRequest("DELETE", `/api/comments/${commentId}`);
    },
    onSuccess: () => {
      setDeletingCommentId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
      toast({ title: "Comment deleted." });
    },
  });

  const getUserById = (id: string) => users.find(u => u.id === id);
  const getCommentsForPost = (postId: string) => comments.filter(c => c.postId === postId);

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  return (
    <div className="pb-20 md:pt-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Journal Feed</h1>
            <p className="text-sm text-muted-foreground">Share your thoughts, judgment-free</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <Link href={`/profile/${currentUser?.id}`}>
                <Avatar className="w-10 h-10 cursor-pointer">
                  <AvatarImage src={currentUser?.profilePhoto} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {currentUser?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[80px] resize-none"
                  data-testid="input-journal-post"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="allowComments"
                      checked={allowComments}
                      onCheckedChange={setAllowComments}
                      data-testid="switch-allow-comments"
                    />
                    <Label htmlFor="allowComments" className="text-sm text-muted-foreground">
                      Allow comments
                    </Label>
                  </div>
                  <Button
                    onClick={() => createPost.mutate()}
                    disabled={!newPost.trim() || createPost.isPending}
                    data-testid="button-post-journal"
                  >
                    <PenLine className="h-4 w-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {postsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No posts yet</h3>
              <p className="text-sm text-muted-foreground">
                Be the first to share something!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const user = getUserById(post.userId);
              const postComments = getCommentsForPost(post.id);
              const isExpanded = expandedComments.has(post.id);
              
              return (
                <Card key={post.id} data-testid={`post-${post.id}`}>
                  <CardContent className="pt-4">
                    <div className="flex gap-3">
                      <Link href={`/profile/${post.userId}`}>
                        <Avatar className="w-10 h-10 cursor-pointer">
                          <AvatarImage src={user?.profilePhoto} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user?.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link href={`/profile/${post.userId}`}>
                              <span className="font-medium text-foreground hover:text-primary cursor-pointer">
                                {user?.name || "Anonymous"}
                              </span>
                            </Link>
                            <span className="text-xs text-muted-foreground">
                              {new Date(post.timestamp).toLocaleDateString()} at{" "}
                              {new Date(post.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          {post.userId === currentUser?.id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`post-menu-${post.id}`}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingPost(post);
                                    setEditPostContent(post.content);
                                  }}
                                  data-testid={`edit-post-${post.id}`}
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setDeletingPostId(post.id)}
                                  className="text-destructive"
                                  data-testid={`delete-post-${post.id}`}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        <p className="text-sm text-foreground mt-2 whitespace-pre-wrap">
                          {post.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  
                  {post.allowComments && (
                    <CardFooter className="flex-col items-stretch gap-3 pt-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between"
                        onClick={() => toggleComments(post.id)}
                        data-testid={`toggle-comments-${post.id}`}
                      >
                        <span className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          {postComments.length} comments
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {isExpanded && (
                        <div className="space-y-3 pt-2 border-t">
                          {postComments.map((comment) => {
                            const commentUser = getUserById(comment.userId);
                            return (
                              <div key={comment.id} className="flex gap-2 group">
                                <Link href={`/profile/${comment.userId}`}>
                                  <Avatar className="w-7 h-7 cursor-pointer">
                                    <AvatarImage src={commentUser?.profilePhoto} />
                                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                      {commentUser?.name?.charAt(0) || "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                </Link>
                                <div className="flex-1 min-w-0">
                                  <div className="bg-muted rounded-lg px-3 py-2 relative">
                                    <div className="flex justify-between items-start">
                                      <Link href={`/profile/${comment.userId}`}>
                                        <span className="font-medium text-xs text-foreground hover:text-primary cursor-pointer">
                                          {commentUser?.name || "Anonymous"}
                                        </span>
                                      </Link>
                                      {comment.userId === currentUser?.id && (
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                              data-testid={`comment-menu-${comment.id}`}
                                            >
                                              <MoreHorizontal className="h-3 w-3" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                              onClick={() => {
                                                setEditingComment(comment);
                                                setEditCommentContent(comment.content);
                                              }}
                                              data-testid={`edit-comment-${comment.id}`}
                                            >
                                              <Pencil className="h-4 w-4 mr-2" />
                                              Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() => setDeletingCommentId(comment.id)}
                                              className="text-destructive"
                                              data-testid={`delete-comment-${comment.id}`}
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Delete
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      )}
                                    </div>
                                    <p className="text-sm text-foreground">{comment.content}</p>
                                  </div>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {new Date(comment.timestamp).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                          
                          <div className="flex gap-2">
                            <Input
                              placeholder="Write a comment..."
                              value={commentInputs[post.id] || ""}
                              onChange={(e) => 
                                setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && commentInputs[post.id]?.trim()) {
                                  addComment.mutate({ 
                                    postId: post.id, 
                                    content: commentInputs[post.id].trim() 
                                  });
                                }
                              }}
                              className="h-9"
                              data-testid={`input-comment-${post.id}`}
                            />
                            <Button
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => {
                                if (commentInputs[post.id]?.trim()) {
                                  addComment.mutate({ 
                                    postId: post.id, 
                                    content: commentInputs[post.id].trim() 
                                  });
                                }
                              }}
                              disabled={!commentInputs[post.id]?.trim() || addComment.isPending}
                              data-testid={`button-comment-${post.id}`}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardFooter>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={editPostContent}
              onChange={(e) => setEditPostContent(e.target.value)}
              className="min-h-[100px]"
              data-testid="input-edit-post"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPost(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => editingPost && updatePost.mutate({ postId: editingPost.id, content: editPostContent })}
              disabled={updatePost.isPending || !editPostContent.trim()}
              data-testid="button-save-post"
            >
              {updatePost.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingPostId} onOpenChange={(open) => !open && setDeletingPostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingPostId && deletePost.mutate(deletingPostId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-post"
            >
              {deletePost.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!editingComment} onOpenChange={(open) => !open && setEditingComment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editCommentContent}
              onChange={(e) => setEditCommentContent(e.target.value)}
              data-testid="input-edit-comment"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingComment(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => editingComment && updateComment.mutate({ commentId: editingComment.id, content: editCommentContent })}
              disabled={updateComment.isPending || !editCommentContent.trim()}
              data-testid="button-save-comment"
            >
              {updateComment.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingCommentId} onOpenChange={(open) => !open && setDeletingCommentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingCommentId && deleteComment.mutate(deletingCommentId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-comment"
            >
              {deleteComment.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
