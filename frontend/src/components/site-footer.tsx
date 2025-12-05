// src/components/layout/site-footer.tsx
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="#" className="hover:text-slate-700">
            Terms
          </Link>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <Link href="#" className="hover:text-slate-700">
            Privacy
          </Link>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <Link href="#" className="hover:text-slate-700">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
