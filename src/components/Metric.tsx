import { cn } from "@/lib/utils";

interface MetricProps {
  label: string;
  value: string;
  description?: string;
  className?: string;
}

export function Metric({ label, value, description, className }: MetricProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100/60",
        className,
      )}
    >
      <span className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>
      <span className="mt-3 text-3xl font-semibold text-slate-900">{value}</span>
      {description ? (
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}

