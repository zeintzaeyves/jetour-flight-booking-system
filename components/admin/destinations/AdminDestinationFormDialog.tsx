"use client";

import { ImageIcon, MapPinned, Plus, Star, Ticket } from "lucide-react";
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

export default function AdminDestinationFormDialog() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    toast.success("Destination saved. Backend connection will be added later.");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-12 rounded-full px-6">
          <Plus className="mr-2 h-4 w-4" />
          Add Destination
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#080b0d]/95 text-white shadow-2xl shadow-black/40 backdrop-blur-2xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold tracking-[-0.05em]">
            Add destination
          </DialogTitle>
          <DialogDescription className="text-white/45">
            Create a destination CMS record. Later, this form will submit to the
            MongoDB destinations collection.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <SectionHeader
              icon={MapPinned}
              title="Destination identity"
              description="City, country, airport code, and publish status."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="City" htmlFor="city">
                <Input
                  id="city"
                  name="city"
                  placeholder="Tokyo"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Country" htmlFor="country">
                <Input
                  id="country"
                  name="country"
                  placeholder="Japan"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Airport code" htmlFor="code">
                <Input
                  id="code"
                  name="code"
                  placeholder="NRT"
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
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <SectionHeader
              icon={ImageIcon}
              title="Visual content"
              description="Image path and destination description."
            />

            <div className="grid gap-4">
              <Field label="Image path" htmlFor="image">
                <Input
                  id="image"
                  name="image"
                  placeholder="/images/tokyo.jpg"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Description" htmlFor="description">
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Neon nights and timeless city stays."
                  className="min-h-28 rounded-[1.5rem] border-white/10 bg-white/10 px-5 py-4 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <SectionHeader
              icon={Ticket}
              title="Fare and display settings"
              description="Starting price, route count, and featured homepage status."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Starting price" htmlFor="price">
                <Input
                  id="price"
                  name="price"
                  placeholder="from ₱12,499"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>

              <Field label="Linked routes" htmlFor="routes">
                <Input
                  id="routes"
                  name="routes"
                  type="number"
                  placeholder="8"
                  className="h-12 rounded-full border-white/10 bg-white/10 px-5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                />
              </Field>
            </div>

            <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/65 transition hover:bg-white/[0.08] hover:text-white">
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 text-white/45" />
                Show as featured destination
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
              Save Destination
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