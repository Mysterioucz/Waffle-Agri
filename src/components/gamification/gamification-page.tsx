"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { pointsForNextLevel } from "@/lib/utils";
import {
    Award,
    Flame,
    Gift,
    Leaf,
    Loader2,
    Lock,
    Sprout,
    Star,
    Target,
    Trophy,
    Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export default function GamificationPage() {
    const [user, setUser] = useState<any>(null);
    const [badges, setBadges] = useState<any[]>([]);
    const [achievements, setAchievements] = useState<any[]>([]);
    const [rewards, setRewards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Using demo user ID from seed data
    const userId = "user-1";

    useEffect(() => {
        fetchGamificationData();
    }, []);

    const fetchGamificationData = async () => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
            const res = await fetch(
                `${backendUrl}/gamification?userId=${userId}`,
            );
            const data = await res.json();

            if (data.success) {
                setUser(data.data.user);
                setBadges(data.data.badges);
                setAchievements(data.data.achievements);
                setRewards(data.data.rewards);
            }
        } catch (error) {
            console.error("Error fetching gamification data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-16 w-16 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">
                        Loading rewards & achievements...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No user data found</p>
                </div>
            </div>
        );
    }

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
        leaf: Leaf,
        zap: Zap,
        target: Target,
    };

    const getBadgeIcon = (iconName: string) => {
        const Icon = badgeIconMap[iconName.toLowerCase()] || Award;
        return Icon;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-purple-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-3">
                        <Trophy className="h-8 w-8" />
                        <div>
                            <h1 className="text-xl font-bold">
                                Rewards & Achievements
                            </h1>
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
                                <Progress
                                    value={progressToNextLevel}
                                    color="blue"
                                    showLabel
                                />
                                <div className="text-xs text-gray-500 mt-2">
                                    {Math.round(
                                        nextLevelPoints -
                                            (user.points % nextLevelPoints),
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
                                <div className="text-sm text-gray-600 mt-2">
                                    Current Streak
                                </div>
                                <div className="mt-4 text-xs text-gray-500">
                                    Keep logging activities daily to maintain
                                    your streak!
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-6xl mb-3">🏅</div>
                                <div className="text-3xl font-bold text-yellow-600">
                                    {badges.length}
                                </div>
                                <div className="text-sm text-gray-600 mt-2">
                                    Badges Earned
                                </div>
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
                            {badges.map((badge) => {
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
                                        <Badge
                                            variant="default"
                                            className="mt-2 text-xs capitalize"
                                        >
                                            {badge.rarity}
                                        </Badge>
                                        <p className="text-xs text-gray-600 mt-2">
                                            {new Date(
                                                badge.earnedAt,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                );
                            })}
                            {badges.length < 6 &&
                                Array.from({ length: 6 - badges.length }).map(
                                    (_, idx) => (
                                        <div
                                            key={`locked-${idx}`}
                                            className="text-center p-4 bg-gray-100 rounded-lg border-2 border-gray-300 opacity-50"
                                        >
                                            <Lock className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                            <div className="font-semibold text-sm text-gray-600">
                                                Locked Badge
                                            </div>
                                            <Badge
                                                variant="default"
                                                className="mt-2 text-xs"
                                            >
                                                Locked
                                            </Badge>
                                        </div>
                                    ),
                                )}
                        </div>
                    </CardContent>
                </Card>

                {/* Achievements Progress */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Active Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {achievements.length === 0 ? (
                            <div className="text-center py-8">
                                <Target className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">
                                    No active achievements
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {achievements.map((achievement) => {
                                    const progressPercent =
                                        (achievement.progress /
                                            achievement.requirementTarget) *
                                        100;
                                    return (
                                        <div
                                            key={achievement.id}
                                            className="p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {achievement.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {
                                                            achievement.description
                                                        }
                                                    </p>
                                                    <Badge
                                                        variant="info"
                                                        className="mt-2 text-xs capitalize"
                                                    >
                                                        {achievement.category}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <Badge variant="success">
                                                        {
                                                            achievement.pointsReward
                                                        }{" "}
                                                        pts
                                                    </Badge>
                                                    {achievement.completed && (
                                                        <Badge
                                                            variant="success"
                                                            className="text-xs"
                                                        >
                                                            ✓ Completed
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mb-2">
                                                <Progress
                                                    value={progressPercent}
                                                    color="green"
                                                />
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {achievement.progress} /{" "}
                                                {achievement.requirementTarget}
                                                {achievement.completed &&
                                                    achievement.completedAt &&
                                                    ` • Completed ${new Date(
                                                        achievement.completedAt,
                                                    ).toLocaleDateString()}`}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
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
                                const canAfford =
                                    user.points >= reward.pointsCost;
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
                                            {reward.type ===
                                            "subscription-upgrade" ? (
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
                                                    canAfford &&
                                                    reward.available
                                                        ? "primary"
                                                        : "outline"
                                                }
                                                disabled={
                                                    !canAfford ||
                                                    !reward.available
                                                }
                                                className="w-full"
                                            >
                                                {!reward.available
                                                    ? "Coming Soon"
                                                    : canAfford
                                                      ? "Redeem"
                                                      : `Need ${
                                                            reward.pointsCost -
                                                            user.points
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
