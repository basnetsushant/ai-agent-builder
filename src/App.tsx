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
import { ChevronDown, FileText, RefreshCcw, TreePalm } from "lucide-react";
import toast from "react-hot-toast";
import { useIsMobile } from "./hooks/useIsMobile";

const categoryColors: Record<string, string> = {
  information: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  action: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const typeColors: Record<string, string> = {
  reasoning: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  personality: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  context: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  formatting: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};
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
  const [openSection, setOpenSection] = useState<
    "profiles" | "skills" | "layers" | null
  >("profiles");
  const isMobile = useIsMobile();
  const toggleSection = (section: "profiles" | "skills" | "layers") => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

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
    setProvider("");
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
  const handleClearAll = () => {
    persist([]);

    toast.success("All agents cleared ");
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
              href="/CV_Sushant_Basnet.pdf"
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
            {/* Left panel */}
            <aside className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col lg:h-full overflow-hidden">
              {/* Profiles Section */}
              <div className="flex flex-col border-b border-slate-800">
                <button
                  onClick={() => toggleSection("profiles")}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white uppercase tracking-widest font-medium">
                      Base Profile
                    </span>
                    {selectedProfile && openSection !== "profiles" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">
                        {
                          data.agentProfiles.find(
                            (p) => p.id === selectedProfile,
                          )?.name
                        }
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    size={15}
                    className={`text-slate-400 transition-transform duration-200
              ${openSection === "profiles" ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out
          ${openSection === "profiles" ? "max-h-150 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="overflow-y-auto p-4 flex flex-col gap-2 max-h-125">
                    {data.agentProfiles.map((profile) => (
                      <ProfileCard
                        key={profile.id}
                        profile={profile}
                        selected={selectedProfile === profile.id}
                        onSelect={(id) => {
                          setSelectedProfile(id);
                          toggleSection("skills");
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="flex flex-col border-b border-slate-800">
                <button
                  onClick={() => toggleSection("skills")}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white uppercase tracking-widest font-medium">
                      Skills
                    </span>
                    {selectedSkills.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/20">
                        {selectedSkills.length} added
                      </span>
                    )}
                    {openSection === "skills" && (
                      <span className="text-xs text-slate-500 normal-case">
                        — drag to canvas
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    size={15}
                    className={`text-slate-400 transition-transform duration-200
              ${openSection === "skills" ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out
          ${openSection === "skills" ? "max-h-150 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="overflow-y-auto p-4 flex flex-col gap-2 max-h-115">
                    {isMobile
                      ? data.skills.map((skill) => {
                          const isAdded = selectedSkills.includes(skill.id);
                          return (
                            <button
                              key={skill.id}
                              onClick={() => {
                                if (!isAdded)
                                  setSelectedSkills((prev) => [
                                    ...prev,
                                    skill.id,
                                  ]);
                              }}
                              disabled={isAdded}
                              className={`w-full text-left p-3 rounded-xl border transition-all duration-200
            ${
              isAdded
                ? "border-violet-500/40 bg-violet-500/10 opacity-60 cursor-not-allowed"
                : "border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800 cursor-pointer"
            }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={`text-sm font-medium ${isAdded ? "text-violet-300" : "text-slate-200"}`}
                                >
                                  {skill.name}
                                </p>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full border shrink-0
              ${
                isAdded
                  ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                  : (categoryColors[skill.category] ??
                    "bg-slate-700 text-slate-400 border-slate-600")
              }`}
                                >
                                  {isAdded ? "added" : skill.category}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                {skill.description}
                              </p>
                            </button>
                          );
                        })
                      : data.skills.map((skill) => (
                          <SkillCard
                            key={skill.id}
                            skill={skill}
                            disabled={selectedSkills.includes(skill.id)}
                          />
                        ))}
                  </div>
                </div>
              </div>

              {/* Layers Section */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleSection("layers")}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white uppercase tracking-widest font-medium">
                      Personality Layers
                    </span>
                    {selectedLayers.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">
                        {selectedLayers.length} added
                      </span>
                    )}
                    {openSection === "layers" && (
                      <span className="text-xs text-slate-500 normal-case">
                        — drag to canvas
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    size={15}
                    className={`text-slate-400 transition-transform duration-200
              ${openSection === "layers" ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out
          ${openSection === "layers" ? "max-h-150 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="overflow-y-auto p-4 flex flex-col gap-2 max-h-115">
                    {isMobile
                      ? data.layers.map((layer) => {
                          const isAdded = selectedLayers.includes(layer.id);
                          return (
                            <button
                              key={layer.id}
                              onClick={() => {
                                if (!isAdded)
                                  setSelectedLayers((prev) => [
                                    ...prev,
                                    layer.id,
                                  ]);
                              }}
                              disabled={isAdded}
                              className={`w-full text-left p-3 rounded-xl border transition-all duration-200
            ${
              isAdded
                ? "border-violet-500/40 bg-violet-500/10 opacity-60 cursor-not-allowed"
                : "border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800 cursor-pointer"
            }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={`text-sm font-medium ${isAdded ? "text-violet-300" : "text-slate-200"}`}
                                >
                                  {layer.name}
                                </p>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full border shrink-0
              ${
                isAdded
                  ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                  : (typeColors[layer.type] ??
                    "bg-slate-700 text-slate-400 border-slate-600")
              }`}
                                >
                                  {isAdded ? "added" : layer.type}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                {layer.description}
                              </p>
                            </button>
                          );
                        })
                      : data.layers.map((layer) => (
                          <LayerCard
                            key={layer.id}
                            layer={layer}
                            disabled={selectedLayers.includes(layer.id)}
                          />
                        ))}
                  </div>
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
                onClearAll={handleClearAll}
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
