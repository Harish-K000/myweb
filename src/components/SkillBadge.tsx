import { cn } from "@/lib/utils";

interface SkillBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
}

export function SkillBadge({ label, className, ...props }: SkillBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-100/60 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
      {...props}
    >
      {label}
    </span>
  );
}

