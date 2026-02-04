import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Check } from "lucide-react";
import type { User } from "@shared/schema";

interface UserCardProps {
  user: User;
  isFriend?: boolean;
  onBefriend?: (userId: string) => void;
  showBefriendButton?: boolean;
}

export function UserCard({ user, isFriend = false, onBefriend, showBefriendButton = true }: UserCardProps) {
  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : user.username 
      ? user.username.slice(0, 2).toUpperCase()
      : "?";

  const displayName = user.name || user.username || "Anonymous User";
  const showYear = !user.hideYear && user.year;

  return (
    <Card className="overflow-visible hover-elevate">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Link href={`/profile/${user.id}`}>
            <Avatar className="w-16 h-16 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
              <AvatarImage src={user.profilePhoto} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link href={`/profile/${user.id}`}>
                  <h3 
                    className="font-semibold text-foreground hover:text-primary cursor-pointer truncate"
                    data-testid={`user-name-${user.id}`}
                  >
                    {displayName}
                  </h3>
                </Link>
                {(user.major || showYear) && (
                  <p className="text-sm text-muted-foreground truncate">
                    {[user.major, showYear ? user.year : null].filter(Boolean).join(" • ")}
                  </p>
                )}
              </div>
              
              {showBefriendButton && (
                <Button
                  size="sm"
                  variant={isFriend ? "secondary" : "default"}
                  onClick={() => onBefriend?.(user.id)}
                  disabled={isFriend}
                  data-testid={`befriend-${user.id}`}
                  className="shrink-0"
                >
                  {isFriend ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Friends
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-1" />
                      Befriend
                    </>
                  )}
                </Button>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {user.description}
            </p>
            
            {user.interests && user.interests.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {user.interests.slice(0, 3).map((interest, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {user.interests.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{user.interests.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
