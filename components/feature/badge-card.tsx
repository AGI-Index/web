"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Lock } from "lucide-react"

export interface Badge {
    id: string
    titleKey: string
    descriptionKey: string
    conditionKey: string
    image: string
    isUnlocked: boolean
}

interface BadgeCardProps {
    badge: Badge
    title: string
    description: string
    condition: string
    onClick?: () => void
}

export function BadgeCard({ badge, title, description, condition, onClick }: BadgeCardProps) {
    const { image, isUnlocked } = badge

    return (
        <button
            onClick={onClick}
            disabled={!isUnlocked}
            className={cn(
                "relative flex flex-col items-center p-4 rounded-xl border transition-all",
                isUnlocked
                    ? "bg-card hover:bg-accent hover:shadow-md cursor-pointer border-yellow-200"
                    : "bg-muted/50 cursor-default border-muted"
            )}
        >
            {/* Badge Image */}
            <div className={cn(
                "relative w-20 h-20 mb-3",
                !isUnlocked && "grayscale opacity-40 blur-[1px]"
            )}>
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-contain"
                />
                {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-background/80 rounded-full p-2">
                            <Lock className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </div>
                )}
            </div>

            {/* Title or Condition */}
            <div className="text-center">
                {isUnlocked ? (
                    <p className="text-sm font-medium line-clamp-2">{title}</p>
                ) : (
                    <p className="text-xs text-muted-foreground line-clamp-2">{condition}</p>
                )}
            </div>
        </button>
    )
}
