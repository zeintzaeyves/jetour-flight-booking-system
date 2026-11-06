"use client";

import { useMemo, useState } from "react";
import qrcode from "qrcode-generator";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPeso } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  method: "GCash" | "Maya";
  amount: number;
  /** Short code shown on the QR so the payment can be matched to the booking. */
  paymentRef: string;
  /** Called once the customer says they've paid. The booking is created after this. */
  onConfirm: () => void;
};

function Qr({ text }: { text: string }) {
  const { size, dark } = useMemo(() => {
    const qr = qrcode(0, "M");
    qr.addData(text);
    qr.make();
    const n = qr.getModuleCount();
    const cells: [number, number][] = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) cells.push([c, r]);
    return { size: n, dark: cells };
  }, [text]);
  const quiet = 3;
  const view = size + quiet * 2;
  return (
    <svg viewBox={`0 0 ${view} ${view}`} role="img" aria-label="Payment QR code" className="size-52 rounded-2xl bg-white" shapeRendering="crispEdges">
      <rect width={view} height={view} fill="#fff" />
      {dark.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x + quiet} y={y + quiet} width="1" height="1" fill="#000" />
      ))}
    </svg>
  );
}

/**
 * Simulated e-wallet checkout. Nothing here is sent anywhere: the QR is real but encodes
 * a demo message, and the details are only checked for format.
 */
export default function EwalletDialog({ open, onOpenChange, method, amount, paymentRef, onConfirm }: Props) {
  const [tab, setTab] = useState<"qr" | "details">("qr");
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<{ mobile?: string; code?: string }>({});

  const qrText = `JETOUR DEMO PAYMENT - ${method} - PHP ${amount} - ${paymentRef} - not a real payment`;

  function payWithDetails(e: React.FormEvent) {
    e.preventDefault();
    const found: typeof errors = {};
    if (!/^(09|\+639)\d{9}$/.test(mobile.replace(/[\s-]/g, ""))) found.mobile = "Use a Philippine mobile number, e.g. 0917 123 4567";
    if (!/^\d{6}$/.test(code)) found.code = "Enter the 6-digit code";
    setErrors(found);
    if (!Object.keys(found).length) onConfirm();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pay {formatPeso(amount)} with {method}</DialogTitle>
          <DialogDescription>
            Demo checkout: nothing is charged. Your e-ticket is issued after this step.
          </DialogDescription>
        </DialogHeader>

        <div role="tablist" aria-label="Payment option" className="flex gap-1 rounded-xl bg-muted p-1">
          {([["qr", "Scan QR"], ["details", "Enter details"]] as const).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              type="button"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={cn(
                "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                tab === value ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "qr" ? (
          <div className="flex flex-col items-center gap-4 py-2">
            <Qr text={qrText} />
            <ol className="w-full list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Open {method} on your phone and choose <span className="text-foreground">Scan QR</span>.</li>
              <li>Scan the code above and check the amount.</li>
              <li>Come back here and tap the button below.</li>
            </ol>
            <p className="text-xs tabular-nums text-muted-foreground">Ref {paymentRef}</p>
            <Button type="button" variant="brand" size="lg" className="w-full" onClick={onConfirm}>
              I&apos;ve paid {formatPeso(amount)}
            </Button>
          </div>
        ) : (
          <form onSubmit={payWithDetails} noValidate className="space-y-4 py-2">
            <div>
              <Label htmlFor="wallet-mobile" className="mb-1.5">{method} mobile number</Label>
              <Input id="wallet-mobile" inputMode="tel" autoComplete="off" placeholder="0917 123 4567" value={mobile}
                aria-invalid={errors.mobile ? true : undefined}
                onChange={(e) => { setMobile(e.target.value); setErrors((p) => ({ ...p, mobile: undefined })); }} />
              {errors.mobile ? <p role="alert" className="mt-1.5 text-sm text-danger-ink">{errors.mobile}</p> : null}
            </div>
            <div>
              <Label htmlFor="wallet-code" className="mb-1.5">6-digit code</Label>
              <Input id="wallet-code" inputMode="numeric" autoComplete="off" maxLength={6} placeholder="Any 6 digits (demo)" value={code}
                aria-invalid={errors.code ? true : undefined}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setErrors((p) => ({ ...p, code: undefined })); }} />
              {errors.code ? <p role="alert" className="mt-1.5 text-sm text-danger-ink">{errors.code}</p> : null}
            </div>
            <Button type="submit" variant="brand" size="lg" className="w-full">
              Pay {formatPeso(amount)}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
