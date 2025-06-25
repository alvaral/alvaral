'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-white transition-colors duration-300">
        <div className="mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">alvaral</Link>
          {/* Botón hamburguesa fijo y con z-index alto */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="md:hidden fixed top-4 right-4 z-60 w-10 h-10 bg-white rounded-md flex items-center justify-center"
          >
            <MenuIcon isOpen={open} />
          </button>
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <Link href="/blog">Blog</Link>
            <Link href="/about">About</Link>
          </nav>
        </div>
      </header>

      {/* Menú fullscreen */}
      <div
        className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center space-y-8 text-lg font-semibold
          transition-opacity duration-300 ease-in-out
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        style={{ marginTop: '3.5rem' }} // Deja espacio para el botón
      >
        <Link href="/" onClick={() => setOpen(false)}>Home</Link>
        <Link href="/blog" onClick={() => setOpen(false)}>Blog</Link>
        <Link href="/about" onClick={() => setOpen(false)}>About</Link>
      </div>
    </>
  )
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="relative w-6 h-6">
      <div
        className={`absolute left-0 top-0 w-6 h-[2px] bg-black transition-transform duration-300 origin-center
          ${isOpen ? 'rotate-45 translate-y-2.5' : 'rotate-0 translate-y-0'}
        `}
      />
      <div
        className={`absolute left-0 top-2.5 w-6 h-[2px] bg-black transition-opacity duration-300
          ${isOpen ? 'opacity-0' : 'opacity-100'}
        `}
      />
      <div
        className={`absolute left-0 top-5 w-6 h-[2px] bg-black transition-transform duration-300 origin-center
          ${isOpen ? '-rotate-45 -translate-y-2.5' : 'rotate-0 translate-y-0'}
        `}
      />
    </div>
  )
}
