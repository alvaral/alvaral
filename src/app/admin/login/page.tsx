import { redirect } from "next/navigation";
import SubmitButton from "@/components/admin/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  config: "Faltan las variables de entorno de Supabase.",
  invalid: "Email o password incorrectos.",
  not_admin: "Tu usuario no esta autorizado como admin.",
};

async function signIn(formData: FormData) {
  "use server";

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/admin/login?error=config");
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/admin/login?error=invalid");
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params?.error ? errorMessages[params.error] : null;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-sm flex-col justify-center px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Backoffice</h1>
        <p className="mt-2 text-sm text-gray-600">
          Entra con tu usuario de Supabase.
        </p>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form action={signIn} className="space-y-4">
        <input type="hidden" name="next" value={params?.next ?? "/admin"} />
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <SubmitButton pendingLabel="Entrando..." className="w-full">
          Entrar
        </SubmitButton>
      </form>
    </main>
  );
}
