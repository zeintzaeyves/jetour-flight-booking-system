export default function BookingOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="mx-4 flex w-full max-w-xs flex-col items-center rounded-[1.75rem] border border-white/10 bg-card px-8 py-9 text-center shadow-card">
        <span className="relative flex size-12 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-white/15" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-white" />
        </span>
        <p className="mt-5 text-base font-medium">Confirming your booking</p>
        <p className="mt-1 text-sm text-muted-foreground">Reserving your seats. Please don&apos;t close this page.</p>
      </div>
    </div>
  );
}
