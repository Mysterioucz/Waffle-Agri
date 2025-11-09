"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function FarmLogbookPage() {
  const [activities, setActivities] = useState<FarmActivity[]>([
    {
      id: "activity-1",
      farmId: "farm-1",
      cropId: "crop-1",
      type: "watering",
      title: "Morning Watering",
      description: "Watered rice field section A",
      date: new Date(),
      duration: 45,
      resources: [
        {
          resourceType: "water",
          name: "Irrigation water",
          quantity: 1000,
          unit: "liters",
          costPerUnit: 0.05,
          totalCost: 50,
        },
      ],
      laborHours: 1,
      cost: 50,
      createdAt: new Date(),
    },
    {
      id: "activity-2",
      farmId: "farm-1",
      type: "fertilizing",
      title: "Applied NPK Fertilizer",
      description: "Applied balanced fertilizer to vegetable plot",
      date: new Date(Date.now() - 86400000),
      duration: 60,
      resources: [
        {
          resourceType: "fertilizer",
          name: "NPK 16-16-16",
          quantity: 20,
          unit: "kg",
          costPerUnit: 25,
          totalCost: 500,
        },
      ],
      laborHours: 1.5,
      cost: 500,
      createdAt: new Date(Date.now() - 86400000),
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<FarmActivity>>({
    type: "watering",
    title: "",
    description: "",
    date: new Date(),
    resources: [],
  });

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

  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.type) return;

    const activity: FarmActivity = {
      id: `activity-${Date.now()}`,
      farmId: "farm-1",
      type: newActivity.type as ActivityType,
      title: newActivity.title,
      description: newActivity.description || "",
      date: newActivity.date || new Date(),
      duration: ACTIVITY_DURATIONS[newActivity.type as string] || 60,
      resources: newActivity.resources || [],
      cost: calculateResourceCost(newActivity.resources || []),
      createdAt: new Date(),
    };

    setActivities([activity, ...activities]);
    setShowAddForm(false);
    setNewActivity({
      type: "watering",
      title: "",
      description: "",
      date: new Date(),
      resources: [],
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
                      (a) => a.date.toDateString() === new Date().toDateString()
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600 mt-1">Today</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round(
                    activities.reduce((sum, a) => sum + (a.duration || 0), 0) /
                      60
                  )}
                  h
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Hours</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  ฿
                  {activities
                    .reduce((sum, a) => sum + (a.cost || 0), 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Cost</div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Type
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={newActivity.type}
                      onChange={(e) =>
                        setNewActivity({
                          ...newActivity,
                          type: e.target.value as ActivityType,
                        })
                      }
                    >
                      <option value="watering">Watering</option>
                      <option value="fertilizing">Fertilizing</option>
                      <option value="pesticide">Pesticide Application</option>
                      <option value="weeding">Weeding</option>
                      <option value="harvesting">Harvesting</option>
                      <option value="planting">Planting</option>
                      <option value="pruning">Pruning</option>
                      <option value="inspection">Inspection</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={newActivity.date?.toISOString().split("T")[0]}
                      onChange={(e) =>
                        setNewActivity({
                          ...newActivity,
                          date: new Date(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Morning watering of rice field"
                    value={newActivity.title}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, title: e.target.value })
                    }
                  />
                </div>
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
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddActivity}>Save Activity</Button>
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
            <div className="space-y-6">
              {Object.entries(groupedActivities)
                .sort(
                  ([dateA], [dateB]) =>
                    new Date(dateB).getTime() - new Date(dateA).getTime()
                )
                .map(([date, dayActivities]) => (
                  <div key={date}>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                      {formatRelativeDate(new Date(date))}
                    </h3>
                    <div className="space-y-3">
                      {dayActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                            {(() => {
                              const Icon = activityIcons[activity.type];
                              return (
                                <Icon className="h-6 w-6 text-green-600" />
                              );
                            })()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {activity.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {activity.description}
                                </p>
                              </div>
                              <Badge variant="default" className="capitalize">
                                {activity.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              {activity.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />{" "}
                                  {activity.duration} min
                                </span>
                              )}
                              {activity.laborHours && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />{" "}
                                  {activity.laborHours}h labor
                                </span>
                              )}
                              {activity.cost && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" /> ฿
                                  {activity.cost.toLocaleString()}
                                </span>
                              )}
                              {activity.resources &&
                                activity.resources.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Package className="h-4 w-4" />{" "}
                                    {activity.resources.length} resource(s)
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
