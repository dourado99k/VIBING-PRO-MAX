import { format } from "date-fns";
import { useState } from "react";
import { useCreateNote, useNotes } from "./taskQueries";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/cn";

export function NotesTimeline({ taskId }: { taskId: number }) {
  const { data } = useNotes(taskId);
  const notes = data?.data ?? [];
  const [note, setNote] = useState("");
  const create = useCreateNote();

  return (
    <div className="space-y-3">
      <div className="text-xs text-[rgb(var(--muted))]">
        Observações / Histórico (registra tudo que aconteceu na demanda)
      </div>

      <div className="flex gap-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Escreva uma observação… (alterações, problemas, feedbacks, pendências, etc.)"
          className={cn(
            "flex-1 min-h-[42px] max-h-[120px] resize-y rounded-xl px-3 py-2 text-sm",
            "bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))] outline-none",
            "focus:ring-2 focus:ring-[rgb(var(--brand))]/50",
          )}
        />
        <Button
          disabled={!note.trim() || create.isPending}
          onClick={async () => {
            const text = note.trim();
            if (!text) return;
            await create.mutateAsync({ taskId, note: text });
            setNote("");
          }}
        >
          Registrar
        </Button>
      </div>

      <div className="space-y-2">
        {notes.length === 0 ? (
          <div className="text-sm text-[rgb(var(--muted))]">Nenhuma observação ainda.</div>
        ) : (
          notes.map((n) => (
            <div
              key={n.id}
              className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))] p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-[rgb(var(--muted))]">{n.author}</div>
                <div className="text-xs text-[rgb(var(--muted))]">
                  {format(new Date(n.createdAt), "dd/MM/yyyy HH:mm")}
                </div>
              </div>
              <div className="mt-2 text-sm whitespace-pre-wrap">{n.note}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

