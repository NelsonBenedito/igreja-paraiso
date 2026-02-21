'use client'

import type { ComponentType } from 'react'
import { useRef } from 'react'
import {
    motion,
    useMotionValue,
    useMotionTemplate,
    animate,
} from 'framer-motion'

export function withSoftMask<P extends object>(Component: ComponentType<P>): ComponentType<P> {
    return function SoftMasked(props: P) {
        const maskX = useMotionValue(0)
        const maskY = useMotionValue(0)
        const maskSize = useMotionValue(0)
        const maskImage = useMotionTemplate`radial-gradient(circle ${maskSize}px at ${maskX}px ${maskY}px, black, black 50%, transparent 80%)`
        const ref = useRef<HTMLDivElement>(null)

        return (
            <motion.div
                ref={ref}
                onHoverStart={() => {
                    animate(maskSize, 300, {
                        duration: 0.3,
                        ease: 'easeOut',
                    })
                }}
                onHoverEnd={() => {
                    animate(maskSize, 0, {
                        duration: 0.3,
                        ease: 'easeIn',
                    })
                }}
                onPointerMove={(e) => {
                    if (!ref.current) return
                    const { top, left } = ref.current.getBoundingClientRect()
                    maskX.set(e.clientX - left)
                    maskY.set(e.clientY - top)
                }}
                style={{
                    WebkitMaskImage: maskImage as any,
                    maskImage: maskImage as any,
                    WebkitMaskSize: '100%',
                    maskSize: '100%',
                    WebkitMaskComposite: 'destination-out',
                    maskComposite: 'destination-out',
                }}
            >
                <Component {...props} />
            </motion.div>
        )
    }
}
