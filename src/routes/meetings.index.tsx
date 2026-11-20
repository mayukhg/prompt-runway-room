import { createFileRoute, Link } from "@tanstack/react-router";
import { Guard, Card, PageHeader, Pill, statusTone } from "@/components/relay/kit";
import { MEETINGS } from "@/lib/relay/data";
import { useRelay } from "@/lib/relay/store";
import { pageHead } from "@/lib/relay/head";

export const Route = createFileRoute("/meetings/")({
  head: pageHead("Meetings", "Upcoming and past meetings with prep status and self-graded briefs."),
  component: () => <Guard><Meetings /></Guard>,
});

function Meetings() {
  const prepReady = useRelay((s) => s.prepReady);
  const groups = [{ t: "Upcoming", items: MEETINGS.filter((m) => !m.past) }, { t: "Past", items: MEETINGS.filter((m) => m.past) }];
  return (
    <>
      <PageHeader title="Meetings" sub="Every meeting gets a brief. After it ends, Relay grades how well it predicted the conversation." />
      <div className="space-y-6">
        {groups.map((g) => (
          <Card key={g.t} title={g.t}>
            <ul className="divide-y divide-border">
              {g.items.map((m) => {
                const st = m.id === "m2" && prepReady ? "Brief ready" : m.status;
                return (
                  <li key={m.id}>
                    <Link to="/meetings/$id" params={{ id: m.id }} className="flex flex-wrap items-center gap-3 rounded-md px-2 py-3 hover:bg-accent">
                      <span className="tnum w-28 text-sm text-muted-foreground">{m.day} · {m.time}</span>
                      <span className="min-w-0 flex-1"><span className="block font-medium">{m.title}</span><span className="block text-xs text-muted-foreground">{m.context}</span></span>
                      {m.grade && <Pill tone="info">Graded {m.grade.hit}/{m.grade.total}</Pill>}
                      <Pill tone={st === "No materials yet" ? "muted" : statusTone("ready")}>{st}</Pill>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
