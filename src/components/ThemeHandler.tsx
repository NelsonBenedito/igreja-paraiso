'use client'

import { useEffect } from 'react'

export default function ThemeHandler({ color }: { color: string }) {
    useEffect(() => {
        // Update root elements for overscroll/bounce effects
        const root = document.documentElement
        const body = document.body
        
        root.style.backgroundColor = color
        body.style.backgroundColor = color

        // Update meta theme-color for mobile chrome/safari
        let meta = document.querySelector('meta[name="theme-color"]')
        if (!meta) {
            meta = document.createElement('meta')
            meta.setAttribute('name', 'theme-color')
            document.head.appendChild(meta)
        }
        meta.setAttribute('content', color)

        // Cleanup if needed (though usually we just want to override)
    }, [color])

    return null
}
