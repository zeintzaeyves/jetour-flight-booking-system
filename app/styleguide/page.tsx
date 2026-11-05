import type { Metadata } from "next";

import { Container, PageHeader, Section } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatPeso } from "@/lib/format";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const SWATCHES = [
  ["background", "bg-background"],
  ["surface", "bg-surface"],
  ["card", "bg-card"],
  ["muted", "bg-muted"],
  ["primary", "bg-primary"],
  ["brand", "bg-brand"],
  ["brand-soft", "bg-brand-soft"],
  ["success", "bg-success"],
  ["warning", "bg-warning"],
  ["destructive", "bg-destructive"],
  ["border", "bg-border"],
] as const;

export default function StyleguidePage() {
  return (
    <main className="pt-24">
      <Section>
        <Container className="space-y-16">
          <PageHeader
            eyebrow="Design system"
            title="Jetour foundations"
            description="Tokens and primitives every page is built from. Internal reference; not indexed."
          />

          <div className="space-y-4">
            <h2 className="text-title">Color</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {SWATCHES.map(([name, cls]) => (
                <div key={name} className="space-y-2">
                  <div className={`h-16 rounded-xl border border-border ${cls}`} />
                  <p className="text-xs text-muted-foreground">{name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-title">Type</h2>
            <p className="text-display">Display 48–72</p>
            <p className="text-headline">Headline 30–44</p>
            <p className="text-title">Title 20</p>
            <p className="text-base leading-7">Body 16. Fares are shown per passenger and include taxes.</p>
            <p className="text-sm text-muted-foreground">Secondary 14</p>
            <p className="text-eyebrow text-brand-ink">Eyebrow 12</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-title">Buttons</h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Continue</Button>
              <Button variant="brand">Search flights</Button>
              <Button variant="outline">Back</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Cancel booking</Button>
              <Button variant="link">Learn more</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="xs">xs</Button>
              <Button size="sm">sm</Button>
              <Button>default</Button>
              <Button size="lg" variant="brand">lg</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-title">Status</h2>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="Confirmed" />
              <StatusBadge status="Pending" />
              <StatusBadge status="Cancelled" />
              <StatusBadge status="Scheduled" />
              <StatusBadge status="Delayed" />
              <StatusBadge status="Completed" />
              <Badge variant="info">Info</Badge>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sg-name">Full name</Label>
                  <Input id="sg-name" placeholder="Juan Dela Cruz" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sg-email">Email</Label>
                  <Input id="sg-email" type="email" aria-invalid defaultValue="not-an-email" />
                  <p className="text-sm text-danger-ink">Enter a valid email.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fare card</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-eyebrow text-muted-foreground">From</p>
                <p className="text-headline tabular-nums">{formatPeso(12499)}</p>
                <p className="text-sm text-muted-foreground">per passenger</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </main>
  );
}
