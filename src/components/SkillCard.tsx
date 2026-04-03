import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Skill } from "../types";

const categoryColors: Record<string, string> = {
  information: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  action: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

interface Props {
  skill: Skill;
  disabled?: boolean;
}

function SkillCard({ skill, disabled }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `skill-${skill.id}`,
      data: { type: "skill", item: skill },
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
          {skill.name}
        </p>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${categoryColors[skill.category] ?? "bg-slate-700 text-slate-400"}`}
        >
          {skill.category}
        </span>
      </div>
      <p className="text-xs text-slate-500 mt-1">{skill.description}</p>
    </div>
  );
}
export default SkillCard;
