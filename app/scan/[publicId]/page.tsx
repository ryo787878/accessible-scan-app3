import { ScanProgress } from "@/components/scan-progress";
import Link from "next/link";

export default async function ScanPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-12 md:py-5">
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <nav aria-label="パンくずリスト">
          <ol className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                トップ
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium">診断進捗</li>
          </ol>
        </nav>
        <ScanProgress publicId={publicId} />
      </div>
    </main>
  );
}
