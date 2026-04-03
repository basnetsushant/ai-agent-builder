import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import useAgentData from "./hooks/useAgentData";
import SessionTimer from "./components/SessionTimer";
import ProfileCard from "./components/ProfileCard";
import SkillCard from "./components/SkillCard";
import LayerCard from "./components/LayerCard";
import AgentCanvas from "./components/AgentCanvas";
import type { SavedAgent, Skill, Layer } from "./types";
import { FileText, RefreshCcw, TreePalm } from "lucide-react";
import toast from "react-hot-toast";

function App() {
  const { data, loading, error, refetch } = useAgentData();

  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [provider, setProvider] = useState("");
  const [agentName, setAgentName] = useState("");
  const [savedAgents, setSavedAgents] = useState<SavedAgent[]>([]);
  const [activeItem, setActiveItem] = useState<Skill | Layer | null>(null);
  const [activeType, setActiveType] = useState<"skill" | "layer" | null>(null);
  const [activeTab, setActiveTab] = useState<"profiles" | "skills" | "layers">(
    "profiles",
  );
  // Load saved agents from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("savedAgents");
      if (raw) setSavedAgents(JSON.parse(raw));
    } catch {
      console.error("Failed to load saved agents");
    }
  }, []);

  const persist = (agents: SavedAgent[]) => {
    setSavedAgents(agents);
    localStorage.setItem("savedAgents", JSON.stringify(agents));
  };

  const handleSave = () => {
    if (!agentName.trim()) {
      toast.error("Name cannot be Empty.");
      return;
    } else {
      toast.success("Succesfully saveed.");
    }
    const newAgent: SavedAgent = {
      id: Date.now().toString(),
      name: agentName.trim(),
      profileId: selectedProfile,
      skillIds: selectedSkills,
      layerIds: selectedLayers,
      provider,
      createdAt: new Date().toISOString(),
    };
    persist([...savedAgents, newAgent]);
    setAgentName("");
    setSelectedProfile("");
    setSelectedSkills([]);
    setSelectedLayers([]);
    setSelectedProfile("");
  };

  const handleLoad = (agent: SavedAgent) => {
    setSelectedProfile(agent.profileId);
    setSelectedSkills([...agent.skillIds]);
    setSelectedLayers([...agent.layerIds]);
    setProvider(agent.provider);
    setAgentName(agent.name);
  };

  const handleDelete = (id: string) => {
    persist(savedAgents.filter((a) => a.id !== id));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { type, item } = event.active.data.current as {
      type: "skill" | "layer";
      item: Skill | Layer;
    };
    setActiveType(type);
    setActiveItem(item);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    setActiveItem(null);
    setActiveType(null);

    if (!over) return;
    const { type, item } = active.data.current as {
      type: "skill" | "layer";
      item: Skill | Layer;
    };

    if (over.id === "canvas-skills" && type === "skill") {
      const skill = item as Skill;
      if (!selectedSkills.includes(skill.id)) {
        setSelectedSkills((prev) => [...prev, skill.id]);
      }
    }

    if (over.id === "canvas-layers" && type === "layer") {
      const layer = item as Layer;
      if (!selectedLayers.includes(layer.id)) {
        setSelectedLayers((prev) => [...prev, layer.id]);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-[#0f1117]">
        {/* Header */}

        <header className="border-b border-slate-800 px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="flex gap-2 text-base lg:text-lg font-semibold text-slate-100 tracking-tight">
              <TreePalm size={20} /> Agent Builder
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Drag skills and layers onto your canvas
            </p>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <a
              href="/CV_Susanta_Basnet.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs px-2 py-1.5 lg:px-3 lg:py-2 rounded-md bg-[#8E51FF] text-white"
            >
              <FileText size={14} />
              Resume
            </a>
            <SessionTimer />
            <button
              onClick={refetch}
              disabled={loading}
              className="text-sm cursor-pointer px-2 py-1.5 lg:px-3 rounded-lg border border-slate-700 text-white hover:border-slate-500 transition-all disabled:opacity-50"
            >
              {loading ? "…" : <RefreshCcw size={16} />}
            </button>
          </div>
        </header>

        {error && (
          <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            Error: {error}
          </div>
        )}

        {loading && !data && (
          <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
            <span className="animate-pulse">Loading configuration…</span>
          </div>
        )}

        {data && (
          <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-75px)]">
            {/* Mobile tab switcher — only visible on small screens */}
            <div className="flex lg:hidden border-b border-slate-800 bg-[#0f1117] sticky top-0 z-10">
              {(["profiles", "skills", "layers"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors
            ${
              activeTab === tab
                ? "text-violet-400 border-b-2 border-violet-500"
                : "text-white hover:text-slate-300"
            }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Left panel */}
            <aside className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col overflow-hidden lg:h-full">
              {/* Profiles */}
              <div
                className={`flex-1 overflow-y-auto p-4 border-b border-slate-800
        ${activeTab === "profiles" ? "block" : "hidden"} lg:block`}
              >
                <p className="text-xs text-white uppercase tracking-widest mb-3">
                  Base Profile
                </p>
                <div className="flex flex-col gap-2">
                  {data.agentProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      selected={selectedProfile === profile.id}
                      onSelect={setSelectedProfile}
                    />
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div
                className={`flex-1 overflow-y-auto p-4 border-b border-slate-800
        ${activeTab === "skills" ? "block" : "hidden"} lg:block`}
              >
                <p className="text-xs text-white uppercase tracking-widest mb-3">
                  Skills — <span className="normal-case">drag to canvas</span>
                </p>
                <div className="flex flex-col gap-2">
                  {data.skills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      disabled={selectedSkills.includes(skill.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Layers */}
              <div
                className={`flex-1 overflow-y-auto p-4
        ${activeTab === "layers" ? "block" : "hidden"} lg:block`}
              >
                <p className="text-xs text-white uppercase tracking-widest mb-3">
                  Layers — <span className="normal-case">drag to canvas</span>
                </p>
                <div className="flex flex-col gap-2">
                  {data.layers.map((layer) => (
                    <LayerCard
                      key={layer.id}
                      layer={layer}
                      disabled={selectedLayers.includes(layer.id)}
                    />
                  ))}
                </div>
              </div>
            </aside>

            {/* Right panel — canvas */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              <AgentCanvas
                data={data}
                selectedProfile={selectedProfile}
                selectedSkills={selectedSkills}
                selectedLayers={selectedLayers}
                provider={provider}
                agentName={agentName}
                onRemoveSkill={(id) =>
                  setSelectedSkills((prev) => prev.filter((s) => s !== id))
                }
                onRemoveLayer={(id) =>
                  setSelectedLayers((prev) => prev.filter((l) => l !== id))
                }
                onProviderChange={setProvider}
                onAgentNameChange={setAgentName}
                onSave={handleSave}
                onLoad={handleLoad}
                onDelete={handleDelete}
                savedAgents={savedAgents}
              />
            </main>
          </div>
        )}
      </div>

      {/* Drag overlay ghosttcard while dragging */}
      <DragOverlay>
        {activeItem && activeType === "skill" && (
          <div className="p-3 rounded-xl border border-violet-500 bg-slate-900 shadow-xl shadow-violet-500/20 text-sm text-violet-300 rotate-2 opacity-90">
            {(activeItem as Skill).name}
          </div>
        )}
        {activeItem && activeType === "layer" && (
          <div className="p-3 rounded-xl border border-violet-500 bg-slate-900 shadow-xl shadow-violet-500/20 text-sm text-violet-300 rotate-2 opacity-90">
            {(activeItem as Layer).name}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
