import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "../AdminTopbar";

type AdminShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function AdminShell({
  title,
  description,
  children,
}: AdminShellProps) {
  return (
    <main className="min-h-screen bg-[#050706] px-4 pb-24 pt-28 text-white sm:px-6">
      <div className="pointer-events-none fixed left-0 top-20 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-white/5 blur-[130px]" />

      <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <AdminSidebar />

        <section className="min-w-0">
          <AdminTopbar title={title} description={description} />
          {children}
        </section>
      </div>
    </main>
  );
}