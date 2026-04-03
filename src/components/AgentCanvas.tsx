import { useDroppable } from "@dnd-kit/core";
import type { AgentData, SavedAgent } from "../types";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ui/ConfirmModal";
const PROVIDERS = ["Claude", "ChatGPT", "Gemini", "DeepSeek", "Kimi"];
// import ConfirmModal from "
import { useState } from "react";
interface Props {
  data: AgentData;
  selectedProfile: string;
  selectedSkills: string[];
  selectedLayers: string[];
  provider: string;
  agentName: string;
  onRemoveSkill: (id: string) => void;
  onRemoveLayer: (id: string) => void;
  onProviderChange: (p: string) => void;
  onAgentNameChange: (n: string) => void;
  onSave: () => void;
  onLoad: (agent: SavedAgent) => void;
  onDelete: (id: string) => void;
  savedAgents: SavedAgent[];
}

function DropZone({
  id,
  label,
  children,
  hasItems,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  hasItems: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-24 rounded-xl border-2 border-dashed p-3 transition-all duration-200
        ${isOver ? "border-violet-400 bg-violet-500/10" : "border-slate-700 bg-slate-800/30"}
      `}
    >
      {!hasItems && (
        <p className="text-xs text-yellow-400 text-center mt-2">
          {isOver ? "✦ Drop here" : label}
        </p>
      )}
      {children}
    </div>
  );
}

function AgentCanvas({
  data,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  provider,
  agentName,
  onRemoveSkill,
  onRemoveLayer,
  onProviderChange,
  onAgentNameChange,
  onSave,
  onLoad,
  onDelete,
  savedAgents,
}: Props) {
  const profile = data.agentProfiles.find((p) => p.id === selectedProfile);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  return (
    <div className="flex flex-col gap-5">
      {/* Profile preview */}
      <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/30">
        <p className="text-xs text-white uppercase tracking-widest mb-2">
          Base Profile
        </p>
        {profile ? (
          <div>
            <p className="text-sm font-medium text-violet-300">
              {profile.name}
            </p>
            <p className="text-xs text-white mt-1">{profile.description}</p>
          </div>
        ) : (
          <p className="text-xs text-white">← Select a profile from the left</p>
        )}
      </div>

      {/* Skills drop zone */}
      <div>
        <p className="text-xs text-white uppercase tracking-widest mb-2">
          Skills
        </p>
        <DropZone
          id="canvas-skills"
          label="Drag skills here"
          hasItems={selectedSkills.length > 0}
        >
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skillId) => {
              const skill = data.skills.find((s) => s.id === skillId);
              if (!skill) return null;
              return (
                <span
                  key={skillId}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-sky-500/10 text-sky-300 border border-sky-500/20"
                >
                  {skill.name}
                  <button
                    onClick={() => onRemoveSkill(skillId)}
                    className="text-sky-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <X size={22} />
                  </button>
                </span>
              );
            })}
          </div>
        </DropZone>
      </div>

      {/* Layers drop zone */}
      <div>
        <p className="text-xs text-white uppercase tracking-widest mb-2">
          Personality Layers
        </p>
        <DropZone
          id="canvas-layers"
          label="Drag layers here"
          hasItems={selectedLayers.length > 0}
        >
          <div className="flex flex-wrap gap-2">
            {selectedLayers.map((layerId) => {
              const layer = data.layers.find((l) => l.id === layerId);
              if (!layer) return null;
              return (
                <span
                  key={layerId}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-violet-500/10 text-violet-300 border border-violet-500/20"
                >
                  {layer.name}
                  <button
                    onClick={() => onRemoveLayer(layerId)}
                    className="text-violet-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <X size={22} />
                  </button>
                </span>
              );
            })}
          </div>
        </DropZone>
      </div>

      {/* Provider */}
      <div>
        <p className="text-xs text-white uppercase tracking-widest mb-2">
          AI Provider
        </p>
        <div className="flex flex-wrap gap-2">
          {PROVIDERS.map((p) => (
            <button
              key={p}
              onClick={() => onProviderChange(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer
                ${
                  provider === p
                    ? "border-violet-500 bg-violet-500/20 text-violet-300"
                    : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="border-t border-slate-700/50 pt-4">
        <p className="text-xs text-white uppercase tracking-widest mb-2">
          Save Agent
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Name your agent..."
            value={agentName}
            onChange={(e) => onAgentNameChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSave()}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-400 outline-none focus:border-violet-500 transition-colors"
          />
          <button
            onClick={onSave}
            className="px-4 py-2 cursor-pointer rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Saved agents */}
      {savedAgents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-white uppercase tracking-widest">
              Saved Agents
            </p>
            <button
              onClick={() =>
                setConfirmState({
                  open: true,
                  title: "Clear all agents?",
                  message: "This action cannot be undone.",
                  onConfirm: () => {
                    savedAgents.forEach((a) => onDelete(a.id));
                  },
                })
              }
              className="text-xs text-white hover:text-red-400 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {savedAgents.map((agent) => {
              const agentProfile = data.agentProfiles.find(
                (p) => p.id === agent.profileId,
              );
              return (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-700 bg-slate-800/30 hover:border-slate-600 transition-colors "
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">
                      {agent.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {agentProfile?.name ?? "No profile"} ·{" "}
                      {agent.skillIds.length} skills ·{" "}
                      {agent.provider || "No provider"} ·{" "}
                      {new Date(agent.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0 ml-3">
                    <button
                      onClick={() => {
                        onLoad(agent);
                        toast.success("Agent loaded successfully 🚀");
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors cursor-pointer"
                    >
                      Load
                    </button>
                    <button
                      onClick={() =>
                        setConfirmState({
                          open: true,
                          title: "Delete agent?",
                          message: "This agent will be permanently removed.",
                          onConfirm: () => {
                            onDelete(agent.id);
                            toast.success("Agent deleted successfully");
                          },
                        })
                      }
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 cursor-pointer text-red-400 border border-red-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onClose={() => setConfirmState((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
export default AgentCanvas;
