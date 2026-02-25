import { LoginPanel } from "@/components/auth/login-panel";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/";

  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-3xl flex-col justify-center px-4 py-10">
      <LoginPanel callbackUrl={callbackUrl} />
    </main>
  );
}
