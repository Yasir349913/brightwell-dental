import {
  Layers,
  ShieldCheck,
  Siren,
  Smile,
  Sparkles,
  Sun,
  type LucideProps,
} from "lucide-react";
import type { IconKey } from "@/data/treatments";

const icons: Record<IconKey, React.ComponentType<LucideProps>> = {
  general: ShieldCheck,
  cosmetic: Sparkles,
  whitening: Sun,
  implants: Layers,
  invisalign: Smile,
  emergency: Siren,
};

export function TreatmentIcon({ name, ...props }: { name: IconKey } & LucideProps) {
  const Icon = icons[name];
  return <Icon aria-hidden {...props} />;
}