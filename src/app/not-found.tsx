import Link from 'next/link'

export default function NotFound() {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Oops! Esta página no está.</p>
        <Link href="/" className="hover:underline">
          Volver al inicio 
        </Link>
      </main>
    )
  }
