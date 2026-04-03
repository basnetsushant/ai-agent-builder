import type { AgentProfile } from "../types";

const profileIcons: Record<string, string> = {
  profile_1: "🎧",
  profile_2: "💻",
  profile_3: "📊",
  profile_4: "✍️",
  profile_5: "💼",
  profile_6: "💰",
  profile_7: "🧑‍💼",
  profile_8: "⚙️",
  profile_9: "⚖️",
  profile_10: "🎨",
};

interface Props {
  profile: AgentProfile;
  selected: boolean;
  onSelect: (id: string) => void;
}

function ProfileCard({ profile, selected, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(profile.id)}
      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer group
        ${
          selected
            ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10"
            : "border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800"
        }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{profileIcons[profile.id] ?? "🤖"}</span>
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium text-sm  ${selected ? "text-violet-300" : "text-slate-200"}`}
          >
            {profile.name}
          </p>
          <p className="text-xs text-slate-500 ">
            {profile.description}
          </p>
        </div>
        {selected && (
          <span className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
        )}
      </div>
    </button>
  );
}
export default ProfileCard;
