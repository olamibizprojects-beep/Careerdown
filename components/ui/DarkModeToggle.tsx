'use client'
import { useEffect, useState } from 'react'

export function DarkModeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const isDark = saved ? saved === 'dark' : true
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-slate-700 text-slate-300"
      aria-label="Toggle dark mode"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
