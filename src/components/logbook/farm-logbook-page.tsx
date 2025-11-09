"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FarmActivity, ActivityType, ResourceUsage } from "@/types";
import {
    formatRelativeDate,
    calculateResourceCost,
    groupActivitiesByDate,
} from "@/lib/utils";
import { ACTIVITY_DURATIONS } from "@/lib/constants";
import {
    Droplet,
    Sprout,
    Bug,
    Leaf,
    Wheat,
    Scissors,
    Search,
    FileText,
    BookOpen,
    Plus,
    X,
    Clock,
    Users,
    DollarSign,
    Package,
    Loader2,
} from "lucide-react";

export default function FarmLogbookPage() {
    const [activities, setActivities] = useState<FarmActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newActivity, setNewActivity] = useState<Partial<FarmActivity>>({
        type: "watering",
        title: "",
        description: "",
        date: new Date(),
        duration: 60, // Default 60 minutes
        laborHours: 1, // Default 1 hour
        cost: 0,
        resources: [],
    });
    const [showResourceForm, setShowResourceForm] = useState(false);
    const [newResource, setNewResource] = useState<Partial<ResourceUsage>>({
        resourceType: "water",
        name: "",
        quantity: 0,
        unit: "",
        costPerUnit: 0,
        totalCost: 0,
    });

    // Using demo user ID and farm ID from seed data
    const userId = "user-1";
    const farmId = "farm-1";

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
            const res = await fetch(
                `${backendUrl}/activities?userId=${userId}`,
            );
            const data = await res.json();

            if (data.success) {
                // Convert DB format to component format
                const formattedActivities = data.data.map((activity: any) => ({
                    id: activity.id,
                    farmId: activity.farmId,
                    cropId: activity.cropId,
                    type: activity.type.toLowerCase() as ActivityType,
                    title: activity.title,
                    description: activity.description || "",
                    date: new Date(activity.date),
                    duration: activity.duration,
                    laborHours: activity.laborHours,
                    cost: activity.cost,
                    resources:
                        activity.resources?.map((r: any) => ({
                            resourceType: r.resourceType.toLowerCase(),
                            name: r.name,
                            quantity: r.quantity,
                            unit: r.unit,
                            costPerUnit: r.costPerUnit,
                            totalCost: r.totalCost,
                        })) || [],
                    createdAt: new Date(activity.createdAt),
                }));
                setActivities(formattedActivities);
            }
        } catch (error) {
            console.error("Error fetching activities:", error);
        } finally {
            setLoading(false);
        }
    };

    const activityIcons: Record<
        ActivityType,
        React.ComponentType<{ className?: string }>
    > = {
        watering: Droplet,
        fertilizing: Sprout,
        pesticide: Bug,
        weeding: Leaf,
        harvesting: Wheat,
        planting: Sprout,
        pruning: Scissors,
        inspection: Search,
        other: FileText,
    };

    const groupedActivities = groupActivitiesByDate(activities);

    const handleAddActivity = async () => {
        if (!newActivity.title || !newActivity.type) return;

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

        // Prepare activity data for API
        const activityData = {
            farmId,
            cropId: null, // Can be set if specific to a crop
            userId,
            type: newActivity.type?.toUpperCase() as ActivityType,
            title: newActivity.title,
            description: newActivity.description || "",
            date: newActivity.date || new Date(),
            duration: ACTIVITY_DURATIONS[newActivity.type as string] || 60,
            laborHours: newActivity.laborHours || 0,
            cost: calculateResourceCost(newActivity.resources || []),
            resources: (newActivity.resources || []).map((r) => ({
                resourceType: r.resourceType?.toUpperCase() || "OTHER",
                name: r.name || "",
                quantity: r.quantity || 0,
                unit: r.unit || "",
                costPerUnit: r.costPerUnit || 0,
                totalCost: r.totalCost || 0,
            })),
        };

        try {
            const res = await fetch(`${backendUrl}/activities`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(activityData),
            });

            const result = await res.json();

            if (result.success) {
                // Refresh activities from database
                await fetchActivities();

                setShowAddForm(false);
                setNewActivity({
                    type: "watering",
                    title: "",
                    description: "",
                    date: new Date(),
                    duration: 60,
                    laborHours: 1,
                    cost: 0,
                    resources: [],
                });
            }
        } catch (error) {
            console.error("Error creating activity:", error);
        }
    };

    const addResource = () => {
        if (!newResource.name || !newResource.quantity) return;

        const totalCost =
            (newResource.quantity || 0) * (newResource.costPerUnit || 0);
        const resource = {
            ...newResource,
            totalCost,
        } as ResourceUsage;

        const updatedResources = [...(newActivity.resources || []), resource];
        const totalResourceCost = updatedResources.reduce(
            (sum, r) => sum + (r.totalCost || 0),
            0,
        );

        setNewActivity({
            ...newActivity,
            resources: updatedResources,
            cost: totalResourceCost,
        });

        setNewResource({
            resourceType: "water",
            name: "",
            quantity: 0,
            unit: "",
            costPerUnit: 0,
            totalCost: 0,
        });
        setShowResourceForm(false);
    };

    const removeResource = (index: number) => {
        const updatedResources =
            newActivity.resources?.filter((_, i) => i !== index) || [];
        const totalResourceCost = updatedResources.reduce(
            (sum, r) => sum + (r.totalCost || 0),
            0,
        );

        setNewActivity({
            ...newActivity,
            resources: updatedResources,
            cost: totalResourceCost,
        });
    };

    // Update duration based on activity type
    const handleActivityTypeChange = (type: ActivityType) => {
        const defaultDuration = ACTIVITY_DURATIONS[type] || 60;
        setNewActivity({
            ...newActivity,
            type,
            duration: defaultDuration,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-green-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-8 w-8" />
                        <div>
                            <h1 className="text-3xl font-bold">Farm Logbook</h1>
                            <p className="text-green-100 mt-1">
                                Track your daily farming activities
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">
                                    {activities.length}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Total Activities
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">
                                    {
                                        activities.filter(
                                            (a) =>
                                                a.date.toDateString() ===
                                                new Date().toDateString(),
                                        ).length
                                    }
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Today
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600">
                                    {Math.round(
                                        activities.reduce(
                                            (sum, a) => sum + (a.duration || 0),
                                            0,
                                        ) / 60,
                                    )}
                                    h
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Total Hours
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600">
                                    ฿
                                    {activities
                                        .reduce(
                                            (sum, a) => sum + (a.cost || 0),
                                            0,
                                        )
                                        .toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Total Cost
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Add Activity Button */}
                <div className="mb-6">
                    <Button onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm ? (
                            <div className="flex items-center">
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <Plus className="h-4 w-4 mr-2" />
                                Log New Activity
                            </div>
                        )}
                    </Button>
                </div>

                {/* Add Activity Form */}
                {showAddForm && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Log New Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Activity Type and Date */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Activity Type *
                                        </label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            value={newActivity.type}
                                            onChange={(e) =>
                                                handleActivityTypeChange(
                                                    e.target
                                                        .value as ActivityType,
                                                )
                                            }
                                        >
                                            <option value="watering">
                                                Watering
                                            </option>
                                            <option value="fertilizing">
                                                Fertilizing
                                            </option>
                                            <option value="pesticide">
                                                Pesticide Application
                                            </option>
                                            <option value="weeding">
                                                Weeding
                                            </option>
                                            <option value="harvesting">
                                                Harvesting
                                            </option>
                                            <option value="planting">
                                                Planting
                                            </option>
                                            <option value="pruning">
                                                Pruning
                                            </option>
                                            <option value="inspection">
                                                Inspection
                                            </option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date *
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            value={
                                                newActivity.date
                                                    ?.toISOString()
                                                    .split("T")[0]
                                            }
                                            onChange={(e) =>
                                                setNewActivity({
                                                    ...newActivity,
                                                    date: new Date(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="e.g., Morning watering of rice field"
                                        value={newActivity.title}
                                        onChange={(e) =>
                                            setNewActivity({
                                                ...newActivity,
                                                title: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="Add notes about this activity..."
                                        value={newActivity.description}
                                        onChange={(e) =>
                                            setNewActivity({
                                                ...newActivity,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                {/* Duration and Labor Hours */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Duration (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="60"
                                            min="0"
                                            value={newActivity.duration || ""}
                                            onChange={(e) =>
                                                setNewActivity({
                                                    ...newActivity,
                                                    duration:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                })
                                            }
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Default:{" "}
                                            {
                                                ACTIVITY_DURATIONS[
                                                    newActivity.type ||
                                                        "watering"
                                                ]
                                            }{" "}
                                            min
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Labor Hours
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="1"
                                            min="0"
                                            step="0.5"
                                            value={newActivity.laborHours || ""}
                                            onChange={(e) =>
                                                setNewActivity({
                                                    ...newActivity,
                                                    laborHours:
                                                        parseFloat(
                                                            e.target.value,
                                                        ) || 0,
                                                })
                                            }
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Number of worker hours
                                        </p>
                                    </div>
                                </div>

                                {/* Resources Section */}
                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Resources Used
                                        </label>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setShowResourceForm(
                                                    !showResourceForm,
                                                )
                                            }
                                        >
                                            <div className="flex items-center">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Resource
                                            </div>
                                        </Button>
                                    </div>

                                    {/* Resource List */}
                                    {newActivity.resources &&
                                        newActivity.resources.length > 0 && (
                                            <div className="space-y-2 mb-3">
                                                {newActivity.resources.map(
                                                    (resource, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                        >
                                                            <div className="flex-1">
                                                                <div className="font-medium text-sm">
                                                                    {
                                                                        resource.name
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-gray-600">
                                                                    {
                                                                        resource.quantity
                                                                    }{" "}
                                                                    {
                                                                        resource.unit
                                                                    }{" "}
                                                                    × ฿
                                                                    {
                                                                        resource.costPerUnit
                                                                    }{" "}
                                                                    = ฿
                                                                    {
                                                                        resource.totalCost
                                                                    }
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    removeResource(
                                                                        index,
                                                                    )
                                                                }
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ),
                                                )}
                                                <div className="text-right font-semibold text-sm text-gray-900">
                                                    Total Cost: ฿
                                                    {newActivity.cost?.toLocaleString() ||
                                                        0}
                                                </div>
                                            </div>
                                        )}

                                    {/* Add Resource Form */}
                                    {showResourceForm && (
                                        <div className="p-4 bg-blue-50 rounded-lg space-y-3 mb-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Resource Type
                                                    </label>
                                                    <select
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        value={
                                                            newResource.resourceType
                                                        }
                                                        onChange={(e) =>
                                                            setNewResource({
                                                                ...newResource,
                                                                resourceType: e
                                                                    .target
                                                                    .value as any,
                                                            })
                                                        }
                                                    >
                                                        <option value="water">
                                                            Water
                                                        </option>
                                                        <option value="fertilizer">
                                                            Fertilizer
                                                        </option>
                                                        <option value="pesticide">
                                                            Pesticide
                                                        </option>
                                                        <option value="seed">
                                                            Seed
                                                        </option>
                                                        <option value="equipment">
                                                            Equipment
                                                        </option>
                                                        <option value="labor">
                                                            Labor
                                                        </option>
                                                        <option value="other">
                                                            Other
                                                        </option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Resource Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="e.g., NPK Fertilizer"
                                                        value={newResource.name}
                                                        onChange={(e) =>
                                                            setNewResource({
                                                                ...newResource,
                                                                name: e.target
                                                                    .value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Quantity *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="100"
                                                        min="0"
                                                        step="0.01"
                                                        value={
                                                            newResource.quantity ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setNewResource({
                                                                ...newResource,
                                                                quantity:
                                                                    parseFloat(
                                                                        e.target
                                                                            .value,
                                                                    ) || 0,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Unit
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="kg"
                                                        value={newResource.unit}
                                                        onChange={(e) =>
                                                            setNewResource({
                                                                ...newResource,
                                                                unit: e.target
                                                                    .value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Cost/Unit (฿)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="50"
                                                        min="0"
                                                        step="0.01"
                                                        value={
                                                            newResource.costPerUnit ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setNewResource({
                                                                ...newResource,
                                                                costPerUnit:
                                                                    parseFloat(
                                                                        e.target
                                                                            .value,
                                                                    ) || 0,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setShowResourceForm(
                                                            false,
                                                        );
                                                        setNewResource({
                                                            resourceType:
                                                                "water",
                                                            name: "",
                                                            quantity: 0,
                                                            unit: "",
                                                            costPerUnit: 0,
                                                            totalCost: 0,
                                                        });
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={addResource}
                                                >
                                                    Add Resource
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setShowResourceForm(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddActivity}>
                                        <div className="flex items-center">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Save Activity
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Activities Timeline */}
                <Card>
                    <CardHeader>
                        <CardTitle>Activity History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-12">
                                <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                                <p className="text-gray-600">
                                    Loading activities...
                                </p>
                            </div>
                        ) : activities.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-2">
                                    No activities logged yet
                                </p>
                                <p className="text-sm text-gray-500">
                                    Click "Log New Activity" to add your first
                                    entry
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(groupedActivities)
                                    .sort(
                                        ([dateA], [dateB]) =>
                                            new Date(dateB).getTime() -
                                            new Date(dateA).getTime(),
                                    )
                                    .map(([date, dayActivities]) => (
                                        <div key={date}>
                                            <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                                {formatRelativeDate(
                                                    new Date(date),
                                                )}
                                            </h3>
                                            <div className="space-y-3">
                                                {dayActivities.map(
                                                    (activity) => (
                                                        <div
                                                            key={activity.id}
                                                            className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                                        >
                                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                                                                {(() => {
                                                                    const Icon =
                                                                        activityIcons[
                                                                            activity
                                                                                .type
                                                                        ];
                                                                    return (
                                                                        <Icon className="h-6 w-6 text-green-600" />
                                                                    );
                                                                })()}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <div>
                                                                        <h4 className="font-semibold text-gray-900">
                                                                            {
                                                                                activity.title
                                                                            }
                                                                        </h4>
                                                                        <p className="text-sm text-gray-600">
                                                                            {
                                                                                activity.description
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <Badge
                                                                        variant="default"
                                                                        className="capitalize"
                                                                    >
                                                                        {
                                                                            activity.type
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                                                    {activity.duration && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Clock className="h-4 w-4" />{" "}
                                                                            {
                                                                                activity.duration
                                                                            }{" "}
                                                                            min
                                                                        </span>
                                                                    )}
                                                                    {activity.laborHours && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Users className="h-4 w-4" />{" "}
                                                                            {
                                                                                activity.laborHours
                                                                            }
                                                                            h
                                                                            labor
                                                                        </span>
                                                                    )}
                                                                    {activity.cost && (
                                                                        <span className="flex items-center gap-1">
                                                                            <DollarSign className="h-4 w-4" />{" "}
                                                                            ฿
                                                                            {activity.cost.toLocaleString()}
                                                                        </span>
                                                                    )}
                                                                    {activity.resources &&
                                                                        activity
                                                                            .resources
                                                                            .length >
                                                                            0 && (
                                                                            <span className="flex items-center gap-1">
                                                                                <Package className="h-4 w-4" />{" "}
                                                                                {
                                                                                    activity
                                                                                        .resources
                                                                                        .length
                                                                                }{" "}
                                                                                resource(s)
                                                                            </span>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
