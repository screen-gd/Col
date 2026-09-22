import { BorderBeam } from "@/components/ui/border-beam-search";
import { GooeyInput } from "@/components/ui/gooey-input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  return (
    <BorderBeam
      size="md"
      colorVariant="mono"
      staticColors
      duration={3.1}
      borderRadius={20}
      brightness={0.8}
      strength={0.32}
      id="hero-search"
      className="w-full max-w-[48rem]"
    >
      <GooeyInput
        value={value}
        onValueChange={onChange}
        onSubmit={onSubmit}
        collapsedWidth={366}
        expandedWidth={700}
        expandedOffset={48}
      />
    </BorderBeam>
  );
}
