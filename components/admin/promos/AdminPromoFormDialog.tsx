"use client";

import {
  BadgePercent,
  CalendarDays,
  Gift,
  MapPinned,
  Plus,
  Star,
  TicketPercent,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AdminPromoFormDialog() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    toast.success("Promo saved. Backend connection will be added later.");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-12 rounded-full px-6">
          <Plus className="mr-2 h-4 w-4" />
          Add Promo
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#080b0d]/95 text-white shadow-2xl shadow-black/40 backdrop-blur-2xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold tracking-[-0.05em]">
            Add promo
          </DialogTitle>
          <DialogDescription className="text-white/45">
            Create a promo CMS record. Later, this form will submit to the
            MongoDB promos collection.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <SectionHeader
              icon={Gift}
              title="Promo identity"
              description="Campaign title, promo code, and publish status."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Promo title" htmlFor="title">
                <Input
                  id="title"
                  name="title"
                  placeholder="Spring Escape"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Promo code" htmlFor="code">
                <Input
                  id="code"
                  name="code"
                  placeholder="JETOUR12"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Status" htmlFor="status">
                <Select name="status" defaultValue="published">
                  <SelectTrigger className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white focus:ring-white/20">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Discount type" htmlFor="discountType">
                <Select name="discountType" defaultValue="percentage">
                  <SelectTrigger className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white focus:ring-white/20">
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed amount</SelectItem>
                    <SelectItem value="fare-drop">Fare drop</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <SectionHeader
              icon={TicketPercent}
              title="Discount details"
              description="Discount label, value, and short promo description."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Discount label" htmlFor="discount">
                <Input
                  id="discount"
                  name="discount"
                  placeholder="12% off"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Minimum fare" htmlFor="minimumFare">
                <Input
                  id="minimumFare"
                  name="minimumFare"
                  placeholder="₱5,000"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Promo description" htmlFor="description">
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Limited offer for selected international routes."
                  className="min-h-28 rounded-[1.5rem] border-white/10 bg-white/10 px-5 py-4 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <SectionHeader
              icon={MapPinned}
              title="Route targeting"
              description="Assign this promotion to a route or make it global."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Target route" htmlFor="targetRoute">
                <Select name="targetRoute" defaultValue="mnl-nrt">
                  <SelectTrigger className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white focus:ring-white/20">
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All routes</SelectItem>
                    <SelectItem value="mnl-nrt">MNL → NRT</SelectItem>
                    <SelectItem value="mnl-icn">MNL → ICN</SelectItem>
                    <SelectItem value="ceb-sin">CEB → SIN</SelectItem>
                    <SelectItem value="crk-bkk">CRK → BKK</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Promo image path" htmlFor="image">
                <Input
                  id="image"
                  name="image"
                  placeholder="/images/promo.jpg"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <SectionHeader
              icon={CalendarDays}
              title="Campaign schedule"
              description="Set the promo campaign start and end dates."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Start date" htmlFor="startDate">
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="End date" htmlFor="endDate">
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>
            </div>

            <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/65 transition hover:bg-white/[0.08] hover:text-white">
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 text-white/45" />
                Feature this promo on dashboard/homepage
              </span>

              <Checkbox className="border-white/20 bg-transparent data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-black" />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>

            <Button type="submit" className="h-12 rounded-full px-6">
              Save Promo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type SectionHeaderProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

function SectionHeader({ icon: Icon, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-sm text-white/40">{description}</p>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};

function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="mb-2 block text-sm text-white/65">
        {label}
      </Label>
      {children}
    </div>
  );
}