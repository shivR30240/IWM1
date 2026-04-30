import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <ShieldX className="h-16 w-16 text-[var(--color-danger)]" />
      <h1 className="mt-4 font-[family-name:var(--font-hind)] text-3xl font-bold text-[var(--color-foreground)]">Access Denied</h1>
      <p className="mt-2 text-[var(--color-muted-foreground)]">You don&apos;t have permission to access this page.</p>
      <div className="mt-6 flex gap-4">
        <Link href="/login"><Button>Go to Login</Button></Link>
        <Link href="/"><Button variant="outline">Back to Home</Button></Link>
      </div>
    </div>
  );
}
