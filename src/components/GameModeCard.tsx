import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GameModeCardProps {
  title: string;
  description: string;
  eyebrow: string;
  href?: string;
  actionLabel?: string;
  tone?: "warm" | "calm" | "bright" | "soft";
  onClick?: () => void;
}

const toneClasses: Record<NonNullable<GameModeCardProps["tone"]>, string> = {
  warm: "from-amber-100 via-orange-100 to-rose-100 text-orange-950 border-orange-200",
  calm: "from-sky-100 via-cyan-100 to-teal-100 text-sky-950 border-sky-200",
  bright: "from-lime-100 via-emerald-100 to-teal-100 text-emerald-950 border-emerald-200",
  soft: "from-violet-100 via-fuchsia-100 to-pink-100 text-violet-950 border-violet-200",
};

export default function GameModeCard({ title, description, eyebrow, href, actionLabel = "Open", tone = "warm", onClick }: GameModeCardProps) {
  const content = (
    <Card className={cn("group h-full overflow-hidden border bg-gradient-to-br shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md", toneClasses[tone])}>
      <CardContent className="flex h-full flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/65 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] shadow-xs">{eyebrow}</span>
          <span aria-hidden="true" className="text-2xl transition-transform group-hover:scale-110">*</span>
        </div>
        <div className="grid gap-1.5">
          <h3 className="text-xl font-black tracking-tight sm:text-2xl">{title}</h3>
          <p className="text-sm leading-6 opacity-75">{description}</p>
        </div>
        <div className="mt-auto">
          <Button type={onClick ? "button" : undefined} onClick={onClick} className="w-full rounded-full bg-white/85 text-current shadow-xs hover:bg-white" variant="secondary">
            {actionLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ring">
        {content}
      </Link>
    );
  }

  return content;
}
