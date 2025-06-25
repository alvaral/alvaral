export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center animate-fadeIn">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Oops! Página no encontrada.</p>
      <a href="/" className="text-blue-600 hover:underline">Volver al inicio</a>
    </main>
  )
}
