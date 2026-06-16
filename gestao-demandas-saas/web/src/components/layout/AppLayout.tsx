import { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import { CalendarDays, CheckCircle2, ListTodo, Sparkles } from "lucide-react";
import { cn } from "../../lib/cn";
import { useRealtimeBridge } from "../../realtime/useRealtimeBridge";

export function AppLayout({ children }: PropsWithChildren) {
  useRealtimeBridge();
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      <div className="flex">
        <aside className="hidden md:flex w-[260px] shrink-0 flex-col border-r border-[rgb(var(--border))] bg-[rgb(var(--panel))]">
          <div className="p-5 border-b border-[rgb(var(--border))]">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-[rgb(var(--brand))]/20 ring-1 ring-[rgb(var(--brand))]/40 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-[rgb(var(--text))]" />
              </div>
              <div>
                <div className="text-sm font-semibold leading-tight">Gestão de Demandas</div>
                <div className="text-xs text-[rgb(var(--muted))]">Operacional • Dashboard</div>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            <SideLink to="/demandas" icon={<ListTodo className="h-4 w-4" />} label="Demandas" />
            <SideLink
              to="/finalizadas"
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Demandas finalizadas"
            />
            <SideLink
              to="/calendario"
              icon={<CalendarDays className="h-4 w-4" />}
              label="Calendário"
            />
          </nav>

          <div className="mt-auto p-4 text-xs text-[rgb(var(--muted))] border-t border-[rgb(var(--border))]">
            Premium UX • Dark corporativo • Tempo real
          </div>
        </aside>

        <main className="flex-1">
          <div className="max-w-[1600px] mx-auto p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SideLink(props: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm",
          "hover:bg-[rgb(var(--panel-2))] hover:text-white transition-colors",
          isActive
            ? "bg-[rgb(var(--panel-2))] ring-1 ring-[rgb(var(--border))] text-white"
            : "text-[rgb(var(--muted))]",
        )
      }
    >
      <span className="text-[rgb(var(--text))]">{props.icon}</span>
      <span>{props.label}</span>
    </NavLink>
  );
}

