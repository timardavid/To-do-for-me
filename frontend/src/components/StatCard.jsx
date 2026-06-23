export default function StatCard({ label, value, danger }) {
  return (
    <div className="rounded-[12px] px-4 py-3.5 bg-base">
      <p
        className={`text-[26px] font-semibold leading-none tracking-tight tabular-nums ${
          danger && value > 0 ? "text-danger" : "text-ink"
        }`}
      >
        {value}
      </p>
      <p className="text-[12.5px] text-muted mt-1.5 leading-tight">{label}</p>
    </div>
  );
}
