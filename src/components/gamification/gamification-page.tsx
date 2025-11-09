"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Badge as BadgeType, Achievement, Reward } from "@/types";
import { BADGES, POINTS, REWARD_COSTS } from "@/lib/constants";
import { calculateLevel, pointsForNextLevel } from "@/lib/utils";
import {
  Trophy,
  Star,
  Flame,
  Award,
  Lock,
  Gift,
  Sparkles,
  Sprout,
} from "lucide-react";

export default function GamificationPage() {
  // Mock user data
  const user: User = {
    id: "user-1",
    email: "farmer@example.com",
    name: "สมชาย เกษตรกร",
    language: "th",
    subscriptionTier: "Pro",
    points: 1250,
    streak: 7,
    level: 5,
    badges: [
      {
        id: "badge-1",
        name: "First Steps",
        description: "Created your first farm",
        icon: "sprout",
        rarity: "common",
        earnedAt: new Date("2025-09-01"),
      },
      {
        id: "badge-2",
        name: "Dedicated Farmer",
        description: "Maintained a 7-day streak",
        icon: "flame",
        rarity: "rare",
        earnedAt: new Date("2025-11-01"),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const achievements: Achievement[] = [
    {
      id: "achievement-1",
      name: "Green Thumb",
      description: "Successfully harvest 10 crops",
      category: "productivity",
      pointsReward: 200,
      requirement: {
        type: "harvest",
        target: 10,
      },
      progress: 3,
    },
    {
      id: "achievement-2",
      name: "Consistent Logger",
      description: "Log activities for 30 consecutive days",
      category: "consistency",
      pointsReward: 300,
      requirement: {
        type: "daily-log",
        target: 30,
      },
      progress: 15,
    },
    {
      id: "achievement-3",
      name: "Resource Master",
      description: "Achieve 90% resource efficiency for a month",
      category: "resource-efficiency",
      pointsReward: 500,
      requirement: {
        type: "efficiency",
        target: 90,
      },
      progress: 75,
    },
  ];

  const rewards: Reward[] = [
    {
      id: "reward-1",
      type: "subscription-upgrade",
      name: "Pro Plan - 7 Days",
      description: "Unlock all Pro features for 7 days",
      pointsCost: REWARD_COSTS.PRO_7_DAYS,
      duration: 7,
      available: true,
    },
    {
      id: "reward-2",
      type: "marketplace-discount",
      name: "10% Marketplace Discount",
      description: "Get 10% off on marketplace purchases",
      pointsCost: REWARD_COSTS.MARKETPLACE_DISCOUNT_10,
      discountPercentage: 10,
      available: true,
    },
    {
      id: "reward-3",
      type: "subscription-upgrade",
      name: "Pro Plan - 30 Days",
      description: "Unlock all Pro features for 30 days",
      pointsCost: REWARD_COSTS.PRO_30_DAYS,
      duration: 30,
      available: false,
    },
  ];

  const nextLevelPoints = pointsForNextLevel(user.level);
  const progressToNextLevel =
    ((user.points % nextLevelPoints) / nextLevelPoints) * 100;

  const badgeIconMap: Record<
    string,
    React.ComponentType<{ className?: string }>
  > = {
    sprout: Sprout,
    flame: Flame,
    trophy: Trophy,
    star: Star,
    award: Award,
  };

  const getBadgeIcon = (iconName: string) => {
    const Icon = badgeIconMap[iconName] || Award;
    return Icon;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Rewards & Achievements</h1>
              <p className="text-purple-100 mt-1">
                Track your progress and redeem rewards
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Star className="h-16 w-16 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-600">
                  Level {user.level}
                </div>
                <div className="text-sm text-gray-600 mt-2 mb-4">
                  {user.points.toLocaleString()} total points
                </div>
                <Progress value={progressToNextLevel} color="blue" showLabel />
                <div className="text-xs text-gray-500 mt-2">
                  {Math.round(
                    nextLevelPoints - (user.points % nextLevelPoints)
                  )}{" "}
                  points to Level {user.level + 1}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Flame className="h-16 w-16 text-orange-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-orange-600">
                  {user.streak} Days
                </div>
                <div className="text-sm text-gray-600 mt-2">Current Streak</div>
                <div className="mt-4 text-xs text-gray-500">
                  Keep logging activities daily to maintain your streak!
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-6xl mb-3">🏅</div>
                <div className="text-3xl font-bold text-yellow-600">
                  {user.badges.length}
                </div>
                <div className="text-sm text-gray-600 mt-2">Badges Earned</div>
                <div className="mt-4 text-xs text-gray-500">
                  Complete achievements to earn more badges
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earned Badges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {user.badges.map((badge) => {
                const BadgeIcon = getBadgeIcon(badge.icon);
                return (
                  <div
                    key={badge.id}
                    className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300"
                  >
                    <BadgeIcon className="h-10 w-10 text-yellow-600 mx-auto mb-2" />
                    <div className="font-semibold text-sm text-gray-900">
                      {badge.name}
                    </div>
                    <Badge variant="default" className="mt-2 text-xs">
                      {badge.rarity}
                    </Badge>
                  </div>
                );
              })}
              {Object.values(BADGES)
                .filter((b) => !user.badges.find((ub) => ub.name === b.name))
                .slice(0, 4)
                .map((badge, idx) => (
                  <div
                    key={idx}
                    className="text-center p-4 bg-gray-100 rounded-lg border-2 border-gray-300 opacity-50"
                  >
                    <Lock className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <div className="font-semibold text-sm text-gray-600">
                      {badge.name}
                    </div>
                    <Badge variant="default" className="mt-2 text-xs">
                      Locked
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement) => {
                const progressPercent =
                  (achievement.progress / achievement.requirement.target) * 100;
                return (
                  <div
                    key={achievement.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {achievement.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {achievement.description}
                        </p>
                      </div>
                      <Badge variant="info">
                        {achievement.pointsReward} pts
                      </Badge>
                    </div>
                    <div className="mb-2">
                      <Progress value={progressPercent} color="green" />
                    </div>
                    <div className="text-sm text-gray-600">
                      {achievement.progress} / {achievement.requirement.target}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Rewards Store */}
        <Card>
          <CardHeader>
            <CardTitle>Rewards Store</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => {
                const canAfford = user.points >= reward.pointsCost;
                return (
                  <div
                    key={reward.id}
                    className={`p-6 rounded-lg border-2 ${
                      canAfford && reward.available
                        ? "bg-green-50 border-green-300"
                        : "bg-gray-50 border-gray-300"
                    }`}
                  >
                    <div className="text-center mb-4">
                      {reward.type === "subscription-upgrade" ? (
                        <Star className="h-10 w-10 text-purple-600 mx-auto mb-2" />
                      ) : (
                        <Gift className="h-10 w-10 text-green-600 mx-auto mb-2" />
                      )}
                      <h4 className="font-semibold text-gray-900">
                        {reward.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-2">
                        {reward.description}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-3">
                        {reward.pointsCost} points
                      </div>
                      <Button
                        variant={
                          canAfford && reward.available ? "primary" : "outline"
                        }
                        disabled={!canAfford || !reward.available}
                        className="w-full"
                      >
                        {!reward.available
                          ? "Coming Soon"
                          : canAfford
                          ? "Redeem"
                          : `Need ${
                              reward.pointsCost - user.points
                            } more points`}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
