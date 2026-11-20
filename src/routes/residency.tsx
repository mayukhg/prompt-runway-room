import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Globe, Clock } from "lucide-react";
import { toast } from "@/lib/relay/toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Guard, Card, PageHeader, Pill } from "@/components/relay/kit";
import { pageHead } from "@/lib/relay/head";

export const Route = createFileRoute("/residency")({
  head: pageHead("Data residency", "Region, retention period and tenant-held key status."),
  component: () => <Guard><Residency /></Guard>,
});

function Residency() {
  const [ret, setRet] = useState("90");
  return (
    <>
      <PageHeader title="Data residency" sub="Where Relay stores data and for how long." />
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Region"><p className="flex items-center gap-2 text-lg font-semibold"><Globe className="h-5 w-5 text-info" />EU (Frankfurt)</p><p className="mt-1 text-sm text-muted-foreground">Processing and storage stay in region. Model inference: EU endpoints only.</p></Card>
        <Card title="Retention">
          <p className="flex items-center gap-2 text-lg font-semibold"><Clock className="h-5 w-5 text-info" />{ret} days</p>
          <Select value={ret} onValueChange={(v) => { setRet(v); toast(`Retention set to ${v} days`, { description: "Logged in the audit trail." }); }}>
            <SelectTrigger className="mt-3" aria-label="Retention period"><SelectValue /></SelectTrigger>
            <SelectContent>{["30", "90", "180", "365"].map((d) => <SelectItem key={d} value={d}>{d} days</SelectItem>)}</SelectContent>
          </Select>
        </Card>
        <Card title="Encryption keys"><p className="flex items-center gap-2 text-lg font-semibold"><KeyRound className="h-5 w-5 text-success" />Tenant-held key</p><div className="mt-2"><Pill tone="success">Active · rotated 1 Nov</Pill></div><p className="mt-2 text-sm text-muted-foreground">Revoking the key makes all Relay data unreadable within minutes.</p></Card>
      </div>
    </>
  );
}
