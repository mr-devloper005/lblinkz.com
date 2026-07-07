'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Tag = 'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'aside' | 'ul' | 'ol' | 'li' | 'span'

type Props = {
  children: ReactNode
  index?: number
  as?: Tag
  className?: string
  delayMs?: number
  style?: CSSProperties
}

// Scroll-driven fade + rise. Priming only happens after mount, so JS-off
// visitors get content immediately. Uses the site-wide --ease-premium curve.
export function EditableReveal({
  children,
  index = 0,
  as = 'div',
  className = '',
  delayMs,
  style,
}: Props) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const nodeRef = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {
      observerRef.current?.disconnect()
      observerRef.current = null
    }
  }, [])

  const attach = useCallback((node: HTMLElement | null) => {
    observerRef.current?.disconnect()
    nodeRef.current = node
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(node)
    observerRef.current = observer
  }, [])

  const stagger = typeof delayMs === 'number' ? delayMs : Math.min(index, 12) * 80
  const cls = `editable-reveal${mounted ? ' is-primed' : ''}${visible ? ' is-visible' : ''} ${className}`.trim()
  const inlineStyle: CSSProperties = { transitionDelay: `${stagger}ms`, ...(style || {}) }

  // Keep the type check narrow: enumerate the tags we actually use.
  const common = { ref: attach as never, className: cls, style: inlineStyle, children }
  switch (as) {
    case 'section': return <section {...common} />
    case 'article': return <article {...common} />
    case 'header': return <header {...common} />
    case 'footer': return <footer {...common} />
    case 'main': return <main {...common} />
    case 'aside': return <aside {...common} />
    case 'ul': return <ul {...common} />
    case 'ol': return <ol {...common} />
    case 'li': return <li {...common} />
    case 'span': return <span {...common} />
    default: return <div {...common} />
  }
}
