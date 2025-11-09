import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
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

        // Delete existing resources
        await prisma.resourceUsage.deleteMany({
            where: { activityId: id },
        });
        // Update activity with new resources
        const activity = await prisma.farmActivity.update({
            where: { id: id },
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
        console.error("Activity update error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to update activity",
                timestamp: new Date(),
            },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        // Delete resources first (cascade should handle this, but being explicit)
        await prisma.resourceUsage.deleteMany({
            where: { activityId: id },
        });

        // Delete the activity
        await prisma.farmActivity.delete({
            where: { id: id },
        });

        return NextResponse.json({
            success: true,
            message: "Activity deleted successfully",
            timestamp: new Date(),
        });
    } catch (error) {
        console.error("Activity deletion error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to delete activity",
                timestamp: new Date(),
            },
            { status: 500 },
        );
    }
}
