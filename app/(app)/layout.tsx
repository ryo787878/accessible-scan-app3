import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buildLoginRedirectPath } from "@/lib/auth-redirect";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(buildLoginRedirectPath("/billing"));
  }

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
