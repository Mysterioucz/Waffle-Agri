import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        badges: {
          include: {
            badge: true,
          },
        },
        achievements: {
          include: {
            achievement: true,
          },
        },
        rewards: {
          include: {
            reward: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch all available rewards from the store
    const allRewards = await prisma.reward.findMany({
      orderBy: {
        pointsCost: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          subscriptionTier: user.subscriptionTier,
          points: user.points,
          streak: user.streak,
          level: user.level,
        },
        badges: user.badges.map((ub) => ({
          ...ub.badge,
          earnedAt: ub.earnedAt,
        })),
        achievements: user.achievements.map((ua) => ({
          ...ua.achievement,
          progress: ua.progress,
          completed: ua.completed,
          completedAt: ua.completedAt,
        })),
        rewards: allRewards, // All available rewards in the store
        redeemedRewards: user.rewards.map((ur) => ({
          ...ur.reward,
          redeemedAt: ur.redeemedAt,
          expiresAt: ur.expiresAt,
          used: ur.used,
        })),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Gamification API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch gamification data",
        timestamp: new Date(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, action, data } = body;

    switch (action) {
      case "addPoints":
        await prisma.user.update({
          where: { id: userId },
          data: {
            points: {
              increment: data.points,
            },
          },
        });
        break;

      case "updateStreak":
        await prisma.user.update({
          where: { id: userId },
          data: {
            streak: data.streak,
          },
        });
        break;

      case "redeemReward":
        await prisma.userReward.create({
          data: {
            userId,
            rewardId: data.rewardId,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: {
            points: {
              decrement: data.pointsCost,
            },
          },
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Gamification action error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform action",
        timestamp: new Date(),
      },
      { status: 500 }
    );
  }
}
