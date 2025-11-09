import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const farmId = searchParams.get("farmId");
    const userId = searchParams.get("userId");

    if (!farmId && !userId) {
      return NextResponse.json(
        { success: false, error: "farmId or userId is required" },
        { status: 400 }
      );
    }

    const where: any = {};
    if (farmId) where.farmId = farmId;
    if (userId) where.userId = userId;

    const activities = await prisma.farmActivity.findMany({
      where,
      include: {
        farm: {
          select: {
            name: true,
          },
        },
        crop: {
          select: {
            name: true,
          },
        },
        resources: true,
      },
      orderBy: { date: "desc" },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: activities,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Activities API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch activities",
        timestamp: new Date(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      farmId,
      cropId,
      userId,
      type,
      title,
      description,
      date,
      duration,
      laborHours,
      cost,
      resources,
    } = body;

    const activity = await prisma.farmActivity.create({
      data: {
        farmId,
        cropId,
        userId,
        type,
        title,
        description,
        date: new Date(date),
        duration,
        laborHours,
        cost,
        resources: {
          create:
            resources?.map((r: any) => ({
              resourceType: r.resourceType,
              name: r.name,
              quantity: r.quantity,
              unit: r.unit,
              costPerUnit: r.costPerUnit,
              totalCost: r.totalCost,
            })) || [],
        },
      },
      include: {
        resources: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: activity,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Activity creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create activity",
        timestamp: new Date(),
      },
      { status: 500 }
    );
  }
}
