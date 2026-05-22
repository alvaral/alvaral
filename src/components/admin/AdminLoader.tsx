type AdminLoaderProps = {
  label?: string;
};

export default function AdminLoader({ label = "Cargando" }: AdminLoaderProps) {
  return (
    <section className="min-h-screen bg-white px-4 py-8 text-gray-950">
      <div
        className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </section>
  );
}
