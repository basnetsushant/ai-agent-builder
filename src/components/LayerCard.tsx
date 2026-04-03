import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Layer } from "../types";

const typeColors: Record<string, string> = {
  reasoning: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  personality: "bg-pink-500/10   text-pink-400   border-pink-500/20",
  context: "bg-teal-500/10   text-teal-400   border-teal-500/20",
  formatting: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

interface Props {
  layer: Layer;
  disabled?: boolean;
}

function LayerCard({ layer, disabled }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `layer-${layer.id}`,
      data: { type: "layer", item: layer },
      disabled,
    });

  const style = { transform: CSS.Translate.toString(transform) };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 rounded-xl border transition-all duration-200 select-none
        ${
          disabled
            ? "border-violet-500/40 bg-violet-500/10 opacity-60 cursor-not-allowed"
            : "border-slate-700 bg-slate-800/50 cursor-grab hover:border-slate-500 hover:bg-slate-800 active:cursor-grabbing"
        }
        ${isDragging ? "opacity-30" : ""}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={`text-sm font-medium ${disabled ? "text-violet-300" : "text-slate-200"}`}
        >
          {layer.name}
        </p>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${typeColors[layer.type] ?? "bg-slate-700 text-slate-400"}`}
        >
          {layer.type}
        </span>
      </div>
      <p className="text-xs text-slate-500 mt-1">{layer.description}</p>
    </div>
  );
}

export default LayerCard;
