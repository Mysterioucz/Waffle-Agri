"use client";

import { BarChart3, BookOpen, Home, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Dashboard", icon: Home },
        { href: "/logbook", label: "Logbook", icon: BookOpen },
        { href: "/analytics", label: "Analytics", icon: BarChart3 },
        { href: "/rewards", label: "Rewards", icon: Trophy },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:top-0 md:bottom-auto z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-around md:justify-start md:gap-8 py-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-green-100 text-green-700 font-semibold"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs md:text-base">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
