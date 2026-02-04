import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, MessageCircle, BookOpen } from "lucide-react";
import logoImage from "@assets/ChatGPT_Image_Feb_2,_2026,_08_38_47_PM_1770089960450.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 bg-gradient-to-br from-background to-muted/50">
          <div className="max-w-lg mx-auto lg:mx-0">
            <div className="flex items-center gap-3 mb-8">
              <img 
                src={logoImage} 
                alt="PeerConnect Logo" 
                className="w-16 h-16 object-contain"
              />
              <span className="text-3xl font-bold text-primary">PeerConnect</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">
              Find Your <span className="text-primary">Community</span> at ASU
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Connect with fellow international, first-generation, and out-of-state students. 
              Build meaningful friendships, join supportive groups, and share your journey.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">Find peers like you</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Heart className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">Build friendships</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">Join support groups</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">Share your story</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-primary">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <img 
                src={logoImage} 
                alt="PeerConnect Logo" 
                className="w-32 h-32 mx-auto mb-6 object-contain"
              />
              
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Welcome, Sun Devil!
              </h2>
              
              <p className="text-muted-foreground mb-8">
                Sign in to connect with your ASU community and start building meaningful relationships.
              </p>

              <div className="space-y-3">
                <Link href="/register">
                  <Button size="lg" className="w-full bg-secondary text-secondary-foreground" data-testid="button-signup">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full" data-testid="button-login">
                    Log In
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-muted-foreground mt-6">
                Free for all ASU students. New users will create their profile after signing up.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
