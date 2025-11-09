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

    const farms = await prisma.farm.findMany({
      where: { userId },
      include: {
        crops: {
          where: {
            status: {
              in: ["GROWING", "FLOWERING", "READY_TO_HARVEST"],
            },
          },
        },
        _count: {
          select: {
            crops: true,
            activities: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: farms,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Farms API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch farms",
        timestamp: new Date(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, location, totalArea, soilType } = body;

    const farm = await prisma.farm.create({
      data: {
        userId,
        name,
        location,
        totalArea,
        soilType,
      },
    });

    return NextResponse.json({
      success: true,
      data: farm,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Farm creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create farm",
        timestamp: new Date(),
      },
      { status: 500 }
    );
  }
}
