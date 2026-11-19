'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

/**
 * Pinta html/body (área de overscroll) e o meta theme-color.
 * `darkColor` opcional: usado quando o tema resolvido é escuro.
 */
export default function ThemeHandler({ color, darkColor }: { color: string; darkColor?: string }) {
    const { resolvedTheme } = useTheme()
    const active = darkColor && resolvedTheme === 'dark' ? darkColor : color

    useEffect(() => {
        // Update root elements for overscroll/bounce effects
        const root = document.documentElement
        const body = document.body

        root.style.backgroundColor = active
        body.style.backgroundColor = active

        // Update meta theme-color for mobile chrome/safari
        let meta = document.querySelector('meta[name="theme-color"]')
        if (!meta) {
            meta = document.createElement('meta')
            meta.setAttribute('name', 'theme-color')
            document.head.appendChild(meta)
        }
        meta.setAttribute('content', active)
    }, [active])

    return null
}
