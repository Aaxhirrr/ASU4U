import { Link, useLocation } from "wouter";
import { Users, UsersRound, BookOpen, MessageCircle, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context";
import { cn } from "@/lib/utils";
import logoImage from "@assets/ChatGPT_Image_Feb_2,_2026,_08_38_47_PM_1770089960450.png";

const navItems = [
  { path: "/match", label: "Match", icon: Users },
  { path: "/groups", label: "Groups", icon: UsersRound },
  { path: "/journal", label: "Journal", icon: BookOpen },
  { path: "/messages", label: "Messages", icon: MessageCircle },
];

export function Navigation() {
  const [location] = useLocation();
  const { currentUser } = useApp();

  if (!currentUser) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/match" className="hidden md:flex items-center gap-2">
            <img 
              src={logoImage} 
              alt="PeerConnect Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-lg text-primary">PeerConnect</span>
          </Link>
          
          <div className="flex items-center justify-around w-full md:w-auto md:gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} href={path}>
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid={`nav-${label.toLowerCase()}`}
                  className={cn(
                    "flex flex-col md:flex-row items-center gap-1 h-auto py-2 px-3 md:px-4",
                    location === path && "bg-muted text-primary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs md:text-sm">{label}</span>
                </Button>
              </Link>
            ))}
            
            <Link href={`/profile/${currentUser.id}`}>
              <Button
                variant="ghost"
                size="sm"
                data-testid="nav-profile"
                className={cn(
                  "flex flex-col md:flex-row items-center gap-1 h-auto py-2 px-3 md:px-4",
                  location.startsWith("/profile") && "bg-muted text-primary"
                )}
              >
                {currentUser.profilePhoto ? (
                  <img
                    src={currentUser.profilePhoto}
                    alt={currentUser.name || "Profile"}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="text-xs md:text-sm hidden md:inline">Profile</span>
              </Button>
            </Link>

            <a href="/api/logout" className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                data-testid="nav-logout"
                className="flex items-center gap-1 h-auto py-2 px-4 text-muted-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Sign Out</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
