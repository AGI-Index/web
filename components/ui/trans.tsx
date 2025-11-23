"use client"

import { useI18n } from "@/lib/i18n-context"
import { Fragment, ReactNode } from "react"

interface TransProps {
    i18nKey: string
    components?: Record<string, ReactNode>
}

export function Trans({ i18nKey, components = {} }: TransProps) {
    const { t } = useI18n()
    const text = t(i18nKey)

    if (!text) return null

    // Split by tags like <tag>...</tag> or <tag/>
    const parts = text.split(/(<[^>]+>)/g)

    return (
        <>
            {parts.map((part, index) => {
                // Check if part is a tag
                const match = part.match(/^<(\/)?([a-zA-Z0-9]+)(?:\s*\/)?>$/)

                if (match) {
                    const [, isClosing, tagName] = match

                    // If it's a closing tag, we don't render it directly (handled by structure)
                    // But for simple replacement we might need a different approach.
                    // Let's assume simple self-closing or wrapping tags for now.

                    // Actually, a simpler approach for this specific requirement (br, highlight)
                    // is to just replace known tags.

                    if (components[tagName]) {
                        if (isClosing) return null // Closing tags are handled by the opening tag's children logic if we were parsing a tree

                        // If it's a self-closing tag like <br/>
                        if (part.endsWith('/>')) {
                            return <Fragment key={index}>{components[tagName]}</Fragment>
                        }

                        // For wrapping tags, this simple split doesn't work well.
                        // Let's try a different approach:
                        // We only support specific simple tags for now as per usage.
                        return null
                    }
                }

                // Re-implementing a simple parser for the specific use case in Home page
                // "Tracking the Arrival of <br/> <highlight>Artificial General Intelligence</highlight>"

                return <Fragment key={index}>{part}</Fragment>
            })}
        </>
    )
}

// Better implementation that handles nesting simply
export function TransSimple({ i18nKey, components = {} }: TransProps) {
    const { t } = useI18n()
    const text = t(i18nKey)

    // Regex to match tags
    const tagRegex = /<(\w+)[^>]*>(.*?)<\/\1>|<(\w+)\s*\/>/g

    // This is a very basic replacement that doesn't handle nested tags well, 
    // but sufficient for the current use case.

    const elements: (string | ReactNode)[] = []
    let lastIndex = 0
    let match

    // We need to handle this recursively or iteratively. 
    // Given the complexity, let's use a simpler replacement strategy 
    // that matches the specific needs of the project (br and highlight).

    // If text contains HTML-like tags, we want to replace them with components.
    // Example: "Hello <bold>World</bold>" -> ["Hello ", components.bold("World")]

    // Let's use a safer approach for the specific string we know:
    // "Tracking the Arrival of <br/> <highlight>Artificial General Intelligence</highlight>"

    // We can split by specific tokens.

    const parts = text.split(/(<br\/>|<highlight>.*?<\/highlight>)/)

    return (
        <>
            {parts.map((part, i) => {
                if (part === '<br/>') {
                    return <Fragment key={i}>{components.br || <br />}</Fragment>
                }
                if (part.startsWith('<highlight>') && part.endsWith('</highlight>')) {
                    const content = part.replace(/<\/?highlight>/g, '')
                    const Component = components.highlight as any
                    return <Fragment key={i}>{Component ? <span className={Component.props.className}>{content}</span> : content}</Fragment>
                }
                // Handle <strong> tags for Manifesto
                if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
                    const content = part.replace(/<\/?strong>/g, '')
                    return <strong key={i}>{content}</strong>
                }
                return part
            })}
        </>
    )
}

// Let's try to restore the original simple implementation which likely used a library or simple regex
// Since I don't have the original code, I'll implement a robust enough version.

export default function TransRestore({ i18nKey, components = {} }: TransProps) {
    const { t } = useI18n()
    const text = t(i18nKey)

    if (!text) return null

    // 1. Handle <br/>
    // 2. Handle <highlight>...</highlight>
    // 3. Handle <strong>...</strong>

    // Split by tags
    const parts = text.split(/(<[^>]+>)/)

    const result: ReactNode[] = []
    let currentTag: string | null = null

    parts.forEach((part, index) => {
        if (part.match(/^<[^/]+>$/) && !part.endsWith('/>')) {
            // Opening tag
            const tagName = part.replace(/[<>]/g, '')
            currentTag = tagName
        } else if (part.match(/^<\/[^>]+>$/)) {
            // Closing tag
            currentTag = null
        } else if (part.match(/^<[^>]+\/>$/)) {
            // Self closing tag
            const tagName = part.replace(/[<>\/]/g, '')
            if (components[tagName]) {
                result.push(<Fragment key={index}>{components[tagName]}</Fragment>)
            } else if (tagName === 'br') {
                result.push(<br key={index} />)
            }
        } else {
            // Text content
            if (currentTag && components[currentTag]) {
                // This assumes the component is a ReactElement that can accept children or we clone it
                // But for the specific usage <span className="...">, we can't easily inject children if it's passed as <span />
                // So we assume components passed are like <span className="text-primary" /> and we clone it with children
                const comp = components[currentTag] as any
                if (comp && typeof comp === 'object') {
                    // @ts-ignore
                    result.push(<span key={index} {...comp.props}>{part}</span>)
                } else {
                    result.push(<span key={index}>{part}</span>)
                }
            } else if (currentTag === 'strong') {
                result.push(<strong key={index}>{part}</strong>)
            } else {
                result.push(part)
            }
        }
    })

    return <>{result}</>
}
