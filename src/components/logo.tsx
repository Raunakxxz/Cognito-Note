import { cn } from "@/lib/utils";
import { BrainCircuit } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <BrainCircuit className="h-7 w-7 text-accent-primary" />
      <h1 className="font-display text-xl font-bold text-text-primary">
        CognitoNote
      </h1>
    </div>
  );
}
