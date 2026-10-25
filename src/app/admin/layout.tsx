import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Admin prototype",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-line bg-white">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 sm:inline">
              Admin prototype · mock data
            </span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-teal-dark hover:underline"
          >
            <ArrowLeft size={16} aria-hidden /> Back to website
          </Link>
        </Container>
      </header>
      <Container className="py-8">{children}</Container>
    </div>
  );
}