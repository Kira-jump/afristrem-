import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-md bg-gold-gradient text-bg shadow-gold">
        <span className="font-display text-lg font-bold">A</span>
      </span>
      <span className="font-display text-xl font-semibold tracking-wide">
        Afri<span className="text-gold">Stream</span>
      </span>
    </Link>
  );
}
