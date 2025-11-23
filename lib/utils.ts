import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isIndexQuestion(question: { suitable_votes?: number; unsuitable_votes?: number }) {
  const suitable = question.suitable_votes || 0
  const unsuitable = question.unsuitable_votes || 0
  const total = suitable + unsuitable

  if (total === 0) return false

  return suitable >= 10 && (suitable / total) > 0.5
}
