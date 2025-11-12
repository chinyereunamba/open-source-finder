"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, UserCheck, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Connection {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  isFollowing: boolean;
  mutualConnections?: number;
}

interface SocialConnectionsProps {
  followers: Connection[];
  following: Connection[];
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
}

export function SocialConnections({
  followers,
  following,
  onFollow,
  onUnfollow,
}: SocialConnectionsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("followers");

  const filteredFollowers = followers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFollowing = following.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUserCard = (user: Connection, showFollowButton: boolean) => (
    <div
      key={user.id}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>
          {user.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{user.name}</p>
          {user.mutualConnections && user.mutualConnections > 0 && (
            <Badge variant="secondary" className="text-xs">
              {user.mutualConnections} mutual
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">@{user.username}</p>
        {user.bio && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {user.bio}
          </p>
        )}
      </div>
      {showFollowButton && (
        <Button
          variant={user.isFollowing ? "outline" : "default"}
          size="sm"
          onClick={() =>
            user.isFollowing ? onUnfollow?.(user.id) : onFollow?.(user.id)
          }
        >
          {user.isFollowing ? (
            <>
              <UserCheck className="h-3 w-3 mr-1" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="h-3 w-3 mr-1" />
              Follow
            </>
          )}
        </Button>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-olivine-500" />
          Connections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="followers">
                Followers ({followers.length})
              </TabsTrigger>
              <TabsTrigger value="following">
                Following ({following.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="followers" className="space-y-2 mt-4">
              {filteredFollowers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No followers found
                </p>
              ) : (
                filteredFollowers.map((user) => renderUserCard(user, true))
              )}
            </TabsContent>

            <TabsContent value="following" className="space-y-2 mt-4">
              {filteredFollowing.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Not following anyone yet
                </p>
              ) : (
                filteredFollowing.map((user) => renderUserCard(user, false))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
