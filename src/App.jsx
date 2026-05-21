import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { supabase } from "./supabase.js";

function formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

// ─── DEFAULT DATA ──────────────────────────────────────────────────────────────
const DEFAULT_CHECKLIST = [{ phase: "FASE 0 — Pianificazione", tasks: [{ title: "0.1 — Definire l'architettura del sito", description: `Hai già concordato 3 keyword principali durante la vendita.\nLa struttura del sito sarà:\n/ → Home ottimizzata per la keyword principale più importante\n/servizi/ → Pagina servizi\n/keyword-2/ → Pagina SEO dedicata al secondo servizio\n/keyword-3/ → Pagina SEO dedicata al terzo servizio\n/chi-siamo/ → Chi siamo\n/contatti/ → Contatti\nLa Home sarà la pagina SEO principale del sito e sarà ottimizzata per il servizio/keyword più importante.\nLe altre 2 keyword avranno invece pagine SEO dedicate separate.\nOgni pagina SEO deve essere costruita per posizionarsi su una keyword specifica già concordata col cliente.\nGli URL vanno decisi subito prima della costruzione del sito. Non modificarli dopo l'indicizzazione.`, practicalGuide: `PASSO PASSO PRATICO:\n1. Apri Notion oppure crea un foglio Google Docs dedicato al progetto.\n2. Scrivi il nome del cliente e sotto crea la struttura delle pagine:\n• Home\n• Servizi\n• Pagina SEO keyword 2\n• Pagina SEO keyword 3\n• Chi siamo\n• Contatti\n3. Decidi subito gli URL finali.\nEsempio:\n/servizi/\n/videoispezioni-milano/\n/spurghi-milano/\n4. Associa ad ogni pagina:\n• keyword principale\n• CTA\n• obiettivo pagina\n5. NON iniziare Elementor o WordPress finché la struttura non è chiara.\n6. Controlla che:\n• gli URL siano corti\n• leggibili\n• senza caratteri strani\n• coerenti col servizio.` }, { title: "0.2 — Organizzare le keyword già concordate", description: `Le 3 keyword principali sono già state concordate durante la vendita.\nAdesso devi solo organizzare:\n• keyword principale della Home\n• keyword della seconda pagina SEO\n• keyword della terza pagina SEO\nPer ogni pagina annota:\n• keyword principale\n• keyword secondarie correlate\n• intento di ricerca\n• CTA principale\nL'obiettivo è costruire ogni pagina per un servizio specifico già venduto al cliente.`, practicalGuide: `💡 UTILITÀ: Senza una mappa chiara delle keyword ogni pagina rischia di ottimizzarsi per le stesse parole, cannibalizzando il posizionamento invece di coprire più ricerche.\n\nPASSO PASSO PRATICO:\n1. Apri il documento di progetto creato nel task 0.1.\n2. Crea una tabella con 3 colonne: Pagina | Keyword principale | Keyword secondarie.\n3. Inserisci le 3 keyword già concordate col cliente, una per riga.\n4. Per ciascuna annota l'intento di ricerca: informazionale, commerciale o transazionale.\n5. Aggiungi la CTA principale di ogni pagina (es. "Chiama ora", "Richiedi preventivo").\n6. Verifica che nessuna keyword compaia come principale su due pagine diverse.\n7. Salva il documento — lo userai come riferimento fisso durante tutta la Fase 4 e 5.` }, { title: "0.3 — Raccogliere tutti i materiali", description: `Prima di costruire:\n• testi definitivi (o bozze avanzate)\n• loghi in formato SVG o PNG trasparente\n• immagini già compresse e rinominate con keyword\n• numero di telefono\n• indirizzo\n• P.IVA\n• email professionale`, practicalGuide: `💡 UTILITÀ: Iniziare Elementor senza avere testi e immagini pronti significa riempire il sito di placeholder che poi si dimenticano, rallentare il lavoro e rischiare di pubblicare contenuti incompleti.\n\nPASSO PASSO PRATICO:\n1. Crea una cartella sul PC nominata con il dominio del cliente (es. "rossiidraulica-it").\n2. Al suo interno crea sottocartelle: /loghi /immagini /testi /dati-aziendali.\n3. Chiedi al cliente via email o WhatsApp:\n   • logo in SVG o PNG trasparente (almeno 500px)\n   • 5-10 foto dell'attività (no stock)\n   • testi delle pagine o punti chiave del servizio\n   • numero di telefono, indirizzo, P.IVA, email\n4. Comprimi e rinomina le immagini con la keyword prima di salvarle (es. "idraulico-milano-pronto-intervento.jpg").\n5. Se i testi non sono pronti, scrivi almeno una bozza per H1, descrizione servizio e CTA di ogni pagina.\n6. Non aprire WordPress finché non hai almeno l'80% dei materiali.` }] }, { phase: "FASE 1 — Acquisto e configurazione iniziale", tasks: [{ title: "1.1 — Acquistare il dominio su Hostinger", description: `Registra il dominio direttamente su Hostinger così gestisci tutto da un pannello solo.\nScegli:\n• .it per business locale italiano\n• .com per brand più internazionale\nEvita:\n• domini troppo lunghi\n• trattini\n• numeri inutili\nSalva tutte le credenziali nel password manager.`, practicalGuide: `💡 UTILITÀ: Avere dominio e hosting sullo stesso pannello elimina la configurazione DNS manuale e riduce i tempi di propagazione da ore a minuti.\n\nPASSO PASSO PRATICO:\n1. Vai su hostinger.it e accedi al tuo account.\n2. Clicca su "Domini" nel menu principale → "Cerca dominio".\n3. Digita il nome desiderato e scegli l'estensione (.it per business locale).\n4. Verifica che non ci siano trattini o numeri nel nome.\n5. Aggiungi al carrello e completa l'acquisto (NON attivare addon inutili come "protezione privacy" a pagamento — Hostinger lo include già).\n6. Salva subito credenziali nel password manager con etichetta "Hostinger – [nomecliente]".\n7. Controlla la email di conferma registrazione.` }] }, { phase: "FASE 2 — Configurazione WordPress", tasks: [{ title: "2.1 — Accedere alla dashboard", description: `Vai su tuodominio.it/wp-admin e accedi. Prima cosa: controlla che la barra superiore mostri che sei su HTTPS.`, practicalGuide: `💡 UTILITÀ: Verificare subito HTTPS e rimuovere la toolbar pubblica evita di esporre informazioni sulla versione WordPress ai visitatori.` }] }, { phase: "FASE 3 — Tema e Plugin", tasks: [{ title: "3.1 — Installare Hello Elementor", description: `Aspetto → Temi → Aggiungi nuovo → cerca "Hello Elementor" → Installa e attiva.`, practicalGuide: `💡 UTILITÀ: Hello Elementor è il tema più leggero per Elementor.` }] }, { phase: "FASE 4 — Costruzione con Elementor Pro", tasks: [{ title: "4.1 — Creare header globale con Theme Builder", description: `Con Elementor Pro usi il Theme Builder per header, footer e template globali.`, practicalGuide: `💡 UTILITÀ: Un header costruito con Theme Builder viene aggiornato in un solo posto.` }] }, { phase: "FASE 5 — Ottimizzazione SEO On-Page", tasks: [{ title: "5.1 — URL ottimizzati per ogni pagina", description: `Lo slug deve contenere la keyword principale, essere breve (3-5 parole).`, practicalGuide: `💡 UTILITÀ: Google legge lo slug dell'URL come segnale di pertinenza per la keyword.` }] }, { phase: "FASE 6 — Prima di Pubblicare", tasks: [{ title: "6.1 — Creare staging", description: `Prima di pubblicare fai sempre una copia staging.`, practicalGuide: `💡 UTILITÀ: Lo staging è una copia del sito live dove testare aggiornamenti.` }] }, { phase: "FASE 7 — Dopo la Pubblicazione", tasks: [{ title: "7.1 — Collegare Google Search Console", description: `Aggiungi il sito su Google Search Console e verifica proprietà.`, practicalGuide: `💡 UTILITÀ: Search Console è il pannello di controllo SEO gratuito di Google.` }] }, { phase: "MANUTENZIONE MENSILE", tasks: [{ title: "M.1 — Aggiornare WordPress", description: `Aggiorna core WordPress, plugin e tema. Prima fai backup.`, practicalGuide: `💡 UTILITÀ: Plugin non aggiornati sono la principale porta di accesso degli hacker.` }] }];

const PHASE_COLORS = [
  { accent: "#a78bfa", badge: "rgba(167,139,250,0.15)", badgeText: "#c4b5fd" },
  { accent: "#60a5fa", badge: "rgba(96,165,250,0.15)", badgeText: "#93c5fd" },
  { accent: "#22d3ee", badge: "rgba(34,211,238,0.15)", badgeText: "#67e8f9" },
  { accent: "#2dd4bf", badge: "rgba(45,212,191,0.15)", badgeText: "#5eead4" },
  { accent: "#34d399", badge: "rgba(52,211,153,0.15)", badgeText: "#6ee7b7" },
  { accent: "#fbbf24", badge: "rgba(251,191,36,0.15)", badgeText: "#fcd34d" },
  { accent: "#fb923c", badge: "rgba(251,146,60,0.15)", badgeText: "#fdba74" },
  { accent: "#fb7185", badge: "rgba(251,113,133,0.15)", badgeText: "#fda4af" },
  { accent: "#f472b6", badge: "rgba(244,114,182,0.15)", badgeText: "#f9a8d4" },
];

// ─── STRUCTURE HELPERS ─────────────────────────────────────────────────────────
function buildTasksFromStructure(structure) {
  return structure.flatMap((section, si) =>
    section.tasks.map((task, ti) => ({
      id: task.id || `${si}-${ti}`,
      phase: section.phase,
      title: task.title,
      description: task.description,
      practicalGuide: task.practicalGuide || null,
      completed: false,
      status: "Da fare",
      timerRunning: false,
      sessionSeconds: 0,
      totalSeconds: 0,
      notes: "",
      suspended: false,
    }))
  );
}

function buildStructureFromTasks(tasks, phases) {
  return phases.map((phase) => ({
    phase,
    tasks: tasks
      .filter((t) => t.phase === phase)
      .map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        practicalGuide: t.practicalGuide || "",
      })),
  }));
}

// ─── AUTO-BACKUP ───────────────────────────────────────────────────────────────
function triggerBackupDownload(tasks, structure) {
  const backup = {
    version: 2,
    exportedAt: new Date().toISOString(),
    structure: structure,
    taskState: tasks.map((t) => ({
      id: t.id,
      completed: t.completed,
      status: t.status,
      totalSeconds: t.totalSeconds,
      notes: t.notes,
      suspended: t.suspended,
    })),
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `seo-checklist-backup-${new Date().toISOString().slice(0, 16).replace("T", "_")}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  // Structure = ordered phases + task definitions (title/desc/guide/id)
  const [structure, setStructure] = useState(DEFAULT_CHECKLIST);
  // Tasks = runtime state (completed, timer, notes, etc.)
  const [tasks, setTasks] = useState(() => buildTasksFromStructure(DEFAULT_CHECKLIST));

  const [search, setSearch] = useState("");
  const [searchResultIndex, setSearchResultIndex] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedTasks, setExpandedTasks] = useState({});
  const [expandedGuides, setExpandedGuides] = useState({});
  const [syncStatus, setSyncStatus] = useState("idle");
  const [loaded, setLoaded] = useState(false);

  // ── EDIT MODE ──
  const [editMode, setEditMode] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // { id, title, description, practicalGuide }
  const [editingPhase, setEditingPhase] = useState(null); // index being renamed
  const [dragState, setDragState] = useState(null); // { taskId, overTaskId, phaseIdx }
  const [backupCount, setBackupCount] = useState(0);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");

  // ─── LOAD ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setSyncStatus("syncing");

      // 1. Try Supabase for structure
      const { data: structData } = await supabase
        .from("checklist_structure")
        .select("*")
        .order("phase_index")
        .order("task_index");

      // 2. Try Supabase for task state
      const { data: stateData, error: stateError } = await supabase
        .from("checklist_tasks")
        .select("*");

      let resolvedStructure = DEFAULT_CHECKLIST;
      let resolvedState = [];

      if (structData && structData.length > 0) {
        // Rebuild structure from DB rows
        const phases = [...new Set(structData.map((r) => r.phase))].sort(
          (a, b) =>
            structData.find((r) => r.phase === a).phase_index -
            structData.find((r) => r.phase === b).phase_index
        );
        resolvedStructure = phases.map((phase) => ({
          phase,
          tasks: structData
            .filter((r) => r.phase === phase)
            .sort((a, b) => a.task_index - b.task_index)
            .map((r) => ({
              id: r.id,
              title: r.title,
              description: r.description,
              practicalGuide: r.practical_guide || "",
            })),
        }));
      } else {
        // Fallback: localStorage structure
        const localStruct = localStorage.getItem("seo-checklist-structure");
        if (localStruct) {
          try { resolvedStructure = JSON.parse(localStruct); } catch {}
        }
      }

      if (stateData && stateData.length > 0) {
        resolvedState = stateData;
      } else if (stateError) {
        // Fallback: localStorage state
        const local = localStorage.getItem("seo-checklist-local");
        if (local) {
          try { resolvedState = JSON.parse(local); } catch {}
        }
      }

      setStructure(resolvedStructure);
      const fresh = buildTasksFromStructure(resolvedStructure);
      setTasks(fresh.map((f) => {
        const s = resolvedState.find((r) => r.id === f.id);
        if (!s) return f;
        return {
          ...f,
          completed: s.completed ?? false,
          status: s.status ?? "Da fare",
          totalSeconds: s.total_seconds ?? s.totalSeconds ?? 0,
          notes: s.notes ?? "",
          suspended: s.suspended ?? false,
        };
      }));

      setExpandedTasks((prev) => {
        const map = {};
        fresh.forEach((t) => { map[t.id] = prev[t.id] !== undefined ? prev[t.id] : true; });
        return map;
      });

      const dl = localStorage.getItem("seo-deadline-local");
      if (dl) setDeadline(dl);
      setSyncStatus(stateError ? "error" : "ok");
      setLoaded(true);
    }
    load();
  }, []);

  // ─── TIMER ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => {
      setTasks((p) => p.map((t) => t.timerRunning ? { ...t, sessionSeconds: t.sessionSeconds + 1 } : t));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  // ─── DEADLINE ────────────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("seo-deadline-local", deadline);
  }, [deadline]);

  // ─── SAVE STATE ──────────────────────────────────────────────────────────────
  const saveTaskState = useCallback(async (taskId, updates, allTasks) => {
    const task = (allTasks || tasks).find((t) => t.id === taskId);
    if (!task) return;
    const merged = { ...task, ...updates };
    const row = {
      id: merged.id,
      completed: merged.completed,
      status: merged.status,
      total_seconds: merged.totalSeconds + merged.sessionSeconds,
      notes: merged.notes,
      suspended: merged.suspended,
    };
    setSyncStatus("syncing");
    const { error } = await supabase.from("checklist_tasks").upsert(row);
    setSyncStatus(error ? "error" : "ok");
    // always backup locally
    const next = (allTasks || tasks).map((t) => t.id === taskId ? { ...t, ...updates } : t);
    localStorage.setItem("seo-checklist-local", JSON.stringify(
      next.map((t) => ({ id: t.id, completed: t.completed, status: t.status, totalSeconds: t.totalSeconds + t.sessionSeconds, notes: t.notes, suspended: t.suspended }))
    ));
  }, [tasks]);

  const updateAndSave = (id, updates) => {
    setTasks((prev) => {
      const next = prev.map((t) => t.id === id ? { ...t, ...updates } : t);
      saveTaskState(id, updates, next);
      return next;
    });
  };

  const toggleDone = (id) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      const newCompleted = !task.completed;
      const updates = { completed: newCompleted, status: newCompleted ? "Completato" : "Da fare" };
      const next = prev.map((t) => t.id === id ? { ...t, ...updates } : t);
      saveTaskState(id, updates, next);
      return next;
    });
  };

  const startTimer = (id) => updateAndSave(id, { timerRunning: true, status: "In corso" });
  const pauseTimer = (id) => {
    setTasks((prev) => {
      const t = prev.find((x) => x.id === id);
      const newTotal = t.totalSeconds + t.sessionSeconds;
      const next = prev.map((x) => x.id === id ? { ...x, timerRunning: false, totalSeconds: newTotal, sessionSeconds: 0 } : x);
      saveTaskState(id, { timerRunning: false, totalSeconds: newTotal, sessionSeconds: 0 }, next);
      return next;
    });
  };
  const stopTimer = pauseTimer;
  const resetTimer = (id) => {
    setTasks((prev) => {
      const next = prev.map((x) => x.id === id ? { ...x, timerRunning: false, totalSeconds: 0, sessionSeconds: 0 } : x);
      saveTaskState(id, { timerRunning: false, totalSeconds: 0, sessionSeconds: 0 }, next);
      return next;
    });
  };

  // ─── SAVE STRUCTURE ───────────────────────────────────────────────────────────
  const saveStructureToSupabase = async (newStructure) => {
    setSyncStatus("syncing");
    // Delete all existing structure rows
    await supabase.from("checklist_structure").delete().neq("id", "___never___");
    // Insert new rows
    const rows = [];
    newStructure.forEach((section, si) => {
      section.tasks.forEach((task, ti) => {
        rows.push({
          id: task.id,
          phase: section.phase,
          phase_index: si,
          task_index: ti,
          title: task.title,
          description: task.description,
          practical_guide: task.practicalGuide || "",
        });
      });
    });
    if (rows.length > 0) {
      const { error } = await supabase.from("checklist_structure").insert(rows);
      setSyncStatus(error ? "error" : "ok");
      if (error) console.error("Structure save error:", error);
    } else {
      setSyncStatus("ok");
    }
    // Always save locally too
    localStorage.setItem("seo-checklist-structure", JSON.stringify(newStructure));
  };

  // ─── EDIT MODE ACTIONS ────────────────────────────────────────────────────────
  const applyStructureChange = async (newStructure) => {
    // Merge task state into new structure
    const fresh = buildTasksFromStructure(newStructure);
    const merged = fresh.map((f) => {
      const existing = tasks.find((t) => t.id === f.id);
      return existing ? { ...f, ...existing, id: f.id, title: f.title, description: f.description, practicalGuide: f.practicalGuide } : f;
    });
    setStructure(newStructure);
    setTasks(merged);
    await saveStructureToSupabase(newStructure);
    // Auto-backup
    triggerBackupDownload(merged, newStructure);
    setBackupCount((c) => c + 1);
  };

  const handleSaveEditingTask = async () => {
    if (!editingTask) return;
    const newStructure = structure.map((section) => ({
      ...section,
      tasks: section.tasks.map((t) =>
        t.id === editingTask.id
          ? { ...t, title: editingTask.title, description: editingTask.description, practicalGuide: editingTask.practicalGuide }
          : t
      ),
    }));
    // Also update tasks state immediately for UI
    setTasks((prev) => prev.map((t) =>
      t.id === editingTask.id
        ? { ...t, title: editingTask.title, description: editingTask.description, practicalGuide: editingTask.practicalGuide }
        : t
    ));
    setEditingTask(null);
    await applyStructureChange(newStructure);
  };

  const handleAddTask = async (phaseIdx) => {
    const newId = `custom-${Date.now()}`;
    const newTask = {
      id: newId,
      title: "Nuovo task",
      description: "Descrizione del task...",
      practicalGuide: "Guida pratica...",
    };
    const newStructure = structure.map((section, si) =>
      si === phaseIdx
        ? { ...section, tasks: [...section.tasks, newTask] }
        : section
    );
    await applyStructureChange(newStructure);
    // Open it for editing immediately
    setEditingTask({ ...newTask });
    setExpandedTasks((p) => ({ ...p, [newId]: true }));
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Eliminare questo task?")) return;
    const newStructure = structure.map((section) => ({
      ...section,
      tasks: section.tasks.filter((t) => t.id !== taskId),
    }));
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await applyStructureChange(newStructure);
  };

  const handleAddPhase = async () => {
    const newPhase = { phase: `NUOVA FASE ${structure.length + 1}`, tasks: [] };
    const newStructure = [...structure, newPhase];
    await applyStructureChange(newStructure);
  };

  const handleDeletePhase = async (phaseIdx) => {
    const section = structure[phaseIdx];
    if (!window.confirm(`Eliminare la fase "${section.phase}" e tutti i suoi task?`)) return;
    const newStructure = structure.filter((_, i) => i !== phaseIdx);
    setTasks((prev) => prev.filter((t) => t.phase !== section.phase));
    await applyStructureChange(newStructure);
  };

  const handleRenamePhase = async (phaseIdx, newName) => {
    const oldPhase = structure[phaseIdx].phase;
    const newStructure = structure.map((s, i) =>
      i === phaseIdx ? { ...s, phase: newName } : s
    );
    setTasks((prev) => prev.map((t) => t.phase === oldPhase ? { ...t, phase: newName } : t));
    setEditingPhase(null);
    await applyStructureChange(newStructure);
  };

  // ─── DRAG & DROP ─────────────────────────────────────────────────────────────
  const handleDragStart = (e, taskId) => {
    setDragState({ taskId, overTaskId: null });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, overTaskId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragState((d) => d ? { ...d, overTaskId } : d);
  };

  const handleDrop = async (e, overTaskId, phaseIdx) => {
    e.preventDefault();
    if (!dragState || dragState.taskId === overTaskId) {
      setDragState(null);
      return;
    }
    const section = structure[phaseIdx];
    const taskIds = section.tasks.map((t) => t.id);
    const fromIdx = taskIds.indexOf(dragState.taskId);
    const toIdx = taskIds.indexOf(overTaskId);
    if (fromIdx === -1 || toIdx === -1) { setDragState(null); return; }
    const reordered = [...section.tasks];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    const newStructure = structure.map((s, i) =>
      i === phaseIdx ? { ...s, tasks: reordered } : s
    );
    setDragState(null);
    await applyStructureChange(newStructure);
  };

  const handleDragEnd = () => setDragState(null);

  // ─── BACKUP / IMPORT ─────────────────────────────────────────────────────────
  const handleManualBackup = () => {
    triggerBackupDownload(tasks, structure);
    setBackupCount((c) => c + 1);
  };

  const handleImport = async () => {
    setImportError("");
    try {
      const parsed = JSON.parse(importText);
      if (!parsed.structure || !Array.isArray(parsed.structure)) {
        setImportError("File non valido: manca il campo 'structure'.");
        return;
      }
      const newStructure = parsed.structure;
      const fresh = buildTasksFromStructure(newStructure);
      const stateMap = {};
      (parsed.taskState || []).forEach((s) => { stateMap[s.id] = s; });
      const merged = fresh.map((f) => {
        const s = stateMap[f.id];
        if (!s) return f;
        return { ...f, completed: s.completed ?? false, status: s.status ?? "Da fare", totalSeconds: s.totalSeconds ?? 0, notes: s.notes ?? "", suspended: s.suspended ?? false };
      });
      setStructure(newStructure);
      setTasks(merged);
      await saveStructureToSupabase(newStructure);
      localStorage.setItem("seo-checklist-local", JSON.stringify(
        merged.map((t) => ({ id: t.id, completed: t.completed, status: t.status, totalSeconds: t.totalSeconds, notes: t.notes, suspended: t.suspended }))
      ));
      setSyncStatus("ok");
      setShowImportModal(false);
      setImportText("");
    } catch (err) {
      setImportError("Errore nel parsing JSON: " + err.message);
    }
  };

  // ─── DERIVED STATE ────────────────────────────────────────────────────────────
  const phases = useMemo(() => structure.map((s) => s.phase), [structure]);

  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);
  const total = tasks.length;
  const progress = total ? Math.round((completedCount / total) * 100) : 0;
  const totalTime = tasks.reduce((a, t) => a + t.totalSeconds + t.sessionSeconds, 0);
  const suspended = tasks.filter((t) => t.suspended);
  const inProgress = tasks.filter((t) => t.status === "In corso");
  const daysLeft = deadline ? Math.ceil((new Date(deadline) - new Date()) / 86400000) : null;

  const grouped = useMemo(() =>
    structure.map((section, si) => ({
      ...section,
      colorIdx: si % PHASE_COLORS.length,
      items: tasks.filter((t) => t.phase === section.phase),
      phaseIdx: si,
    })), [structure, tasks]);

  const filteredGrouped = useMemo(() =>
    grouped.map((s) => ({
      ...s,
      items: s.items.filter((t) => {
        const q = search.toLowerCase();
        const match = !search ||
          t.title.toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q) ||
          (t.practicalGuide || "").toLowerCase().includes(q);
        if (activeTab === "suspended") return match && t.suspended;
        if (activeTab === "inprogress") return match && t.status === "In corso";
        if (activeTab === "todo") return match && !t.completed;
        if (activeTab === "done") return match && t.completed;
        return match;
      }),
    })).filter((s) => s.items.length > 0 || (editMode && s.items.length === 0)),
    [grouped, search, activeTab, editMode]
  );

  const searchResultIds = useMemo(() => {
    if (!search) return [];
    return filteredGrouped.flatMap((s) => s.items.map((t) => t.id));
  }, [filteredGrouped, search]);

  useEffect(() => { setSearchResultIndex(0); }, [search]);
  const currentResultId = searchResultIds[searchResultIndex] ?? null;

  useEffect(() => {
    if (!currentResultId) return;
    const el = document.getElementById(`task-${currentResultId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentResultId]);

  useEffect(() => {
    if (!currentResultId || !search) return;
    const task = tasks.find((t) => t.id === currentResultId);
    if (!task) return;
    setExpandedTasks((p) => ({ ...p, [currentResultId]: true }));
    if (task.practicalGuide && task.practicalGuide.toLowerCase().includes(search.toLowerCase())) {
      setExpandedGuides((p) => ({ ...p, [currentResultId]: true }));
    }
  }, [currentResultId, search]);

  const Highlight = useCallback(({ text }) => {
    if (!search || !text) return <>{text}</>;
    const q = search.toLowerCase();
    const parts = [];
    let last = 0;
    const str = text;
    const strLower = str.toLowerCase();
    let idx;
    while ((idx = strLower.indexOf(q, last)) !== -1) {
      if (idx > last) parts.push(<span key={`t${last}`}>{str.slice(last, idx)}</span>);
      parts.push(<mark key={`m${idx}`} style={{ background: "#fbbf24", color: "#000", borderRadius: 3, padding: "0 2px" }}>{str.slice(idx, idx + q.length)}</mark>);
      last = idx + q.length;
    }
    if (last < str.length) parts.push(<span key={`e${last}`}>{str.slice(last)}</span>);
    return <>{parts}</>;
  }, [search]);

  const SyncDot = () => {
    const map = {
      idle: ["#52525b", ""],
      syncing: ["#fbbf24", ""],
      ok: ["#34d399", "✓ Sincronizzato"],
      error: ["#ef4444", "⚠ Offline — dati salvati localmente"],
    };
    const [color, label] = map[syncStatus];
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: syncStatus === "ok" ? `0 0 6px ${color}` : "none" }} />
        {label && <span style={{ fontSize: 11, color }}>{label}</span>}
      </div>
    );
  };

  // ─── LOADING SCREEN ───────────────────────────────────────────────────────────
  if (!loaded) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 40, height: 40, border: "3px solid #333", borderTop: "3px solid #a78bfa", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#52525b", fontSize: 14 }}>Caricamento checklist...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .task-card { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .task-card:hover { transform: translateY(-1px); }
        .task-card.drag-over { border-color: #a78bfa !important; box-shadow: 0 0 0 2px rgba(167,139,250,0.3) !important; }
        .task-card.dragging { opacity: 0.4; }
        .timer-pulse { animation: tpulse 2s infinite; }
        @keyframes tpulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .pbar { transition: width 0.5s cubic-bezier(0.4,0,0.2,1); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .edit-badge { animation: fadeIn 0.2s ease; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.4); }
        textarea, input, select { font-family: inherit; }
        .edit-input { background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.3); border-radius: 8px; padding: 7px 10px; font-size: 13px; color: #e4e4e7; outline: none; width: 100%; transition: border-color 0.15s; }
        .edit-input:focus { border-color: rgba(167,139,250,0.7); }
        .edit-textarea { background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.3); border-radius: 8px; padding: 9px 12px; font-size: 12px; color: #a1a1aa; outline: none; width: 100%; resize: vertical; line-height: 1.7; transition: border-color 0.15s; }
        .edit-textarea:focus { border-color: rgba(167,139,250,0.7); }
        .drag-handle { cursor: grab; color: #3f3f46; font-size: 14px; padding: 0 4px; user-select: none; }
        .drag-handle:hover { color: #a78bfa; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(4px); }
        .modal-box { background: #12121f; border: 1px solid rgba(167,139,250,0.2); border-radius: 20px; padding: 24px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
        .btn-edit { padding: 5px 10px; border-radius: 7px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: 1px solid rgba(167,139,250,0.3); background: rgba(167,139,250,0.1); color: #c4b5fd; }
        .btn-edit:hover { background: rgba(167,139,250,0.2); }
        .btn-danger { padding: 5px 10px; border-radius: 7px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); color: #fca5a5; }
        .btn-danger:hover { background: rgba(239,68,68,0.2); }
        .btn-add { padding: 7px 14px; border-radius: 9px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: 1px dashed rgba(52,211,153,0.3); background: rgba(52,211,153,0.05); color: #6ee7b7; width: 100%; }
        .btn-add:hover { background: rgba(52,211,153,0.12); border-color: rgba(52,211,153,0.5); }
      `}</style>

      {/* ── STICKY HEADER ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#0d0d18", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(1.3rem,4vw,1.8rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>SEO Checklist</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                <span style={{ fontSize: 11, color: "#52525b" }}>WordPress · Elementor Pro · Rank Math</span>
                <SyncDot />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {/* Edit Mode Toggle */}
              <button
                onClick={() => setEditMode((e) => !e)}
                title={editMode ? "Esci dalla modalità editing" : "Attiva modalità editing"}
                style={{
                  padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  background: editMode ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)",
                  border: editMode ? "1px solid rgba(167,139,250,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  color: editMode ? "#c4b5fd" : "#71717a",
                  display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
                  boxShadow: editMode ? "0 0 12px rgba(167,139,250,0.2)" : "none",
                }}>
                🔧 {editMode ? "Edit ON" : "Edit"}
              </button>

              {/* Backup button */}
              <button
                onClick={handleManualBackup}
                title="Scarica backup JSON"
                style={{
                  padding: "7px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", color: "#93c5fd",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                💾 Backup
                {backupCount > 0 && <span style={{ fontSize: 10, background: "rgba(96,165,250,0.2)", borderRadius: 20, padding: "1px 6px" }}>{backupCount}</span>}
              </button>

              {/* Import */}
              <button
                onClick={() => setShowImportModal(true)}
                title="Importa da backup JSON"
                style={{
                  padding: "7px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#71717a",
                }}>
                📥 Importa
              </button>

              {daysLeft !== null && (
                <div style={{ padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: daysLeft < 0 ? "rgba(239,68,68,0.15)" : daysLeft < 7 ? "rgba(251,191,36,0.15)" : "rgba(52,211,153,0.1)", border: `1px solid ${daysLeft < 0 ? "rgba(239,68,68,0.3)" : daysLeft < 7 ? "rgba(251,191,36,0.3)" : "rgba(52,211,153,0.2)"}`, color: daysLeft < 0 ? "#f87171" : daysLeft < 7 ? "#fbbf24" : "#34d399" }}>
                  {daysLeft < 0 ? `⚠️ Scaduto ${Math.abs(daysLeft)}g fa` : daysLeft === 0 ? "⚡ Scade oggi" : `📅 ${daysLeft}g rimasti`}
                </div>
              )}
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: "6px 12px", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.1rem", fontWeight: 700 }}>{progress}%</div>
                <div style={{ fontSize: 10, color: "#52525b" }}>completato</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: "6px 12px", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.1rem", fontWeight: 700 }}>{formatDuration(totalTime)}</div>
                <div style={{ fontSize: 10, color: "#52525b" }}>tempo totale</div>
              </div>
            </div>
          </div>

          {/* Edit mode banner */}
          {editMode && (
            <div className="edit-badge" style={{ marginTop: 8, padding: "8px 14px", borderRadius: 10, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.25)", fontSize: 12, color: "#c4b5fd", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700 }}>🔧 Modalità Editing attiva</span>
              <span style={{ color: "#71717a" }}>·</span>
              <span style={{ color: "#71717a" }}>✏️ modifica titoli e contenuti &nbsp;·&nbsp; ➕ aggiungi task &nbsp;·&nbsp; 🗑️ elimina &nbsp;·&nbsp; ↕️ trascina per riordinare</span>
              <span style={{ color: "#71717a" }}>·</span>
              <span style={{ color: "#6ee7b7", fontWeight: 600 }}>💾 ogni modifica salva su Supabase + backup locale automatico</span>
            </div>
          )}

          {/* Progress bar */}
          <div style={{ marginTop: 10, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div className="pbar" style={{ height: "100%", borderRadius: 2, width: `${progress}%`, background: "linear-gradient(90deg,#6366f1,#a78bfa)" }} />
          </div>

          {/* Search + deadline */}
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 160, position: "relative", display: "flex", alignItems: "center" }}>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍  Cerca task, descrizione, guida..."
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "7px 12px", fontSize: 13, color: "#fff", outline: "none" }} />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 8, background: "none", border: "none", color: "#52525b", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>✕</button>
              )}
            </div>
            {search && searchResultIds.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "4px 8px" }}>
                <span style={{ fontSize: 11, color: "#a1a1aa", whiteSpace: "nowrap" }}>{searchResultIndex + 1}/{searchResultIds.length}</span>
                <button onClick={() => setSearchResultIndex((i) => (i - 1 + searchResultIds.length) % searchResultIds.length)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, color: "#e4e4e7", cursor: "pointer", width: 24, height: 24, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>▲</button>
                <button onClick={() => setSearchResultIndex((i) => (i + 1) % searchResultIds.length)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, color: "#e4e4e7", cursor: "pointer", width: 24, height: 24, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>▼</button>
              </div>
            )}
            {search && searchResultIds.length === 0 && (
              <div style={{ display: "flex", alignItems: "center", padding: "4px 10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10 }}>
                <span style={{ fontSize: 11, color: "#f87171" }}>Nessun risultato</span>
              </div>
            )}
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "7px 10px", fontSize: 13, color: "#a1a1aa", outline: "none" }} />
          </div>

          {/* Tabs */}
          <div style={{ marginTop: 8, display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2 }}>
            {[
              { key: "all", label: `Tutte (${total})` },
              { key: "todo", label: `Da fare (${tasks.filter((t) => !t.completed).length})` },
              { key: "inprogress", label: `In corso (${inProgress.length})` },
              { key: "suspended", label: `Sospese (${suspended.length})` },
              { key: "done", label: `Fatte (${completedCount})` },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                style={{ whiteSpace: "nowrap", padding: "4px 10px", borderRadius: 7, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer", background: activeTab === key ? "rgba(255,255,255,0.1)" : "transparent", color: activeTab === key ? "#fff" : "#52525b", transition: "all 0.15s" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Suspended quick links */}
      {suspended.length > 0 && activeTab !== "suspended" && (
        <div style={{ maxWidth: 860, margin: "12px auto 0", padding: "0 16px" }}>
          <div style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 12, padding: "8px 12px", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#fb923c" }}>⏸ Sospese:</span>
            {suspended.map((t) => (
              <button key={t.id} onClick={() => document.getElementById(`task-${t.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
                style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)", borderRadius: 7, padding: "3px 8px", fontSize: 11, color: "#fdba74", cursor: "pointer" }}>
                {t.title.split("—")[0].trim()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px 16px 40px" }}>
        {filteredGrouped.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#3f3f46" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
            <p>Nessun task trovato</p>
          </div>
        )}

        {filteredGrouped.map((section) => {
          const c = PHASE_COLORS[section.colorIdx];
          const done = section.items.filter((t) => t.completed).length;
          const pct = section.items.length ? Math.round((done / section.items.length) * 100) : 0;

          return (
            <div key={section.phase} style={{ marginBottom: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden" }}>
              {/* Section header */}
              <div style={{ background: `linear-gradient(90deg, ${c.accent}12 0%, transparent 100%)`, borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.accent, boxShadow: `0 0 8px ${c.accent}60`, flexShrink: 0 }} />
                  {editMode && editingPhase === section.phaseIdx ? (
                    <PhaseNameEditor
                      initialName={section.phase}
                      onSave={(name) => handleRenamePhase(section.phaseIdx, name)}
                      onCancel={() => setEditingPhase(null)}
                    />
                  ) : (
                    <h2
                      style={{ fontFamily: "Syne, sans-serif", fontSize: "0.95rem", fontWeight: 700, margin: 0, cursor: editMode ? "pointer" : "default" }}
                      onClick={() => editMode && setEditingPhase(section.phaseIdx)}
                      title={editMode ? "Clicca per rinominare la fase" : undefined}>
                      {section.phase}
                      {editMode && <span style={{ fontSize: 10, color: "#52525b", marginLeft: 6 }}>✏️</span>}
                    </h2>
                  )}
                  <span style={{ fontSize: 11, fontWeight: 600, background: c.badge, color: c.badgeText, padding: "2px 8px", borderRadius: 20 }}>{done}/{section.items.length}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {editMode && (
                    <button className="btn-danger" onClick={() => handleDeletePhase(section.phaseIdx)} title="Elimina fase">🗑️ Fase</button>
                  )}
                  <div style={{ width: 80, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div className="pbar" style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: c.accent }} />
                  </div>
                  <span style={{ fontSize: 11, color: "#52525b" }}>{pct}%</span>
                </div>
              </div>

              {/* Tasks */}
              <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 10 }}>
                {section.items.map((task) => {
                  const isExpanded = expandedTasks[task.id] !== false;
                  const isGuideOpen = expandedGuides[task.id];
                  const secs = task.totalSeconds + task.sessionSeconds;
                  const isDragging = dragState?.taskId === task.id;
                  const isDragOver = dragState?.overTaskId === task.id;

                  return (
                    <div
                      id={`task-${task.id}`}
                      key={task.id}
                      className={`task-card${isDragging ? " dragging" : ""}${isDragOver && !isDragging ? " drag-over" : ""}`}
                      draggable={editMode}
                      onDragStart={editMode ? (e) => handleDragStart(e, task.id) : undefined}
                      onDragOver={editMode ? (e) => handleDragOver(e, task.id) : undefined}
                      onDrop={editMode ? (e) => handleDrop(e, task.id, section.phaseIdx) : undefined}
                      onDragEnd={editMode ? handleDragEnd : undefined}
                      style={{
                        background: task.completed ? "rgba(52,211,153,0.04)" : task.suspended ? "rgba(251,146,60,0.06)" : "rgba(255,255,255,0.025)",
                        border: `1px solid ${currentResultId === task.id ? "#fbbf24" : task.completed ? "rgba(52,211,153,0.15)" : task.suspended ? "rgba(251,146,60,0.2)" : editMode ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.06)"}`,
                        borderRadius: 14,
                        boxShadow: currentResultId === task.id ? "0 0 0 2px rgba(251,191,36,0.25)" : "none",
                      }}>

                      {/* Task row */}
                      <div style={{ padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                        {/* Drag handle in edit mode */}
                        {editMode && (
                          <span className="drag-handle" title="Trascina per riordinare">⠿</span>
                        )}

                        {/* Checkbox */}
                        {!editMode && (
                          <button onClick={() => toggleDone(task.id)}
                            style={{ width: 22, height: 22, minWidth: 22, borderRadius: 6, border: task.completed ? "none" : "2px solid rgba(255,255,255,0.18)", background: task.completed ? "#34d399" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginTop: 1 }}>
                            {task.completed && <span style={{ color: "#000", fontSize: 12, fontWeight: 800 }}>✓</span>}
                          </button>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ fontSize: "0.85rem", fontWeight: 600, textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#3f3f46" : "#e4e4e7" }}>
                              <Highlight text={task.title} />
                            </span>
                            {!editMode && (
                              <>
                                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: { "Da fare": "rgba(255,255,255,0.06)", "In corso": "rgba(96,165,250,0.15)", "In pausa": "rgba(251,191,36,0.15)", "Completato": "rgba(52,211,153,0.15)" }[task.status], color: { "Da fare": "#71717a", "In corso": "#93c5fd", "In pausa": "#fcd34d", "Completato": "#6ee7b7" }[task.status] }}>{task.status}</span>
                                {task.suspended && <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(251,146,60,0.15)", color: "#fdba74", padding: "2px 7px", borderRadius: 20 }}>⏸ Sospesa</span>}
                                {task.timerRunning && <span className="timer-pulse" style={{ fontSize: 10, fontWeight: 600, background: "rgba(96,165,250,0.15)", color: "#93c5fd", padding: "2px 7px", borderRadius: 20 }}>⏱ {formatDuration(secs)}</span>}
                                {secs > 0 && !task.timerRunning && <span style={{ fontSize: 10, color: "#3f3f46" }}>{formatDuration(secs)}</span>}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Edit mode actions */}
                        {editMode ? (
                          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                            <button className="btn-edit" onClick={() => setEditingTask({ id: task.id, title: task.title, description: task.description, practicalGuide: task.practicalGuide || "" })}>✏️ Modifica</button>
                            <button className="btn-danger" onClick={() => handleDeleteTask(task.id)}>🗑️</button>
                          </div>
                        ) : (
                          <button onClick={() => setExpandedTasks((p) => ({ ...p, [task.id]: !isExpanded }))}
                            style={{ fontSize: 16, color: "#52525b", background: "rgba(255,255,255,0.04)", border: "none", borderRadius: 6, width: 26, height: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {isExpanded ? "−" : "+"}
                          </button>
                        )}
                      </div>

                      {/* Expanded (normal mode only) */}
                      {!editMode && isExpanded && (
                        <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                          <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 14px" }}>
                            <p style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}><Highlight text={task.description} /></p>
                          </div>
                          {task.practicalGuide && (
                            <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden" }}>
                              <button onClick={() => setExpandedGuides((p) => ({ ...p, [task.id]: !isGuideOpen }))}
                                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: "#d4d4d8", fontSize: 13, fontWeight: 600 }}>
                                <span>📋 Guida pratica passo passo</span>
                                <span style={{ color: "#52525b" }}>{isGuideOpen ? "▲" : "▼"}</span>
                              </button>
                              {isGuideOpen && (
                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "10px 14px" }}>
                                  <p style={{ fontSize: 12, color: "#71717a", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}><Highlight text={task.practicalGuide} /></p>
                                </div>
                              )}
                            </div>
                          )}
                          {/* Timer */}
                          <div style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                              <div>
                                <div style={{ fontSize: 10, color: "#52525b", marginBottom: 2 }}>Cronometro</div>
                                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.5rem", letterSpacing: "0.05em", color: task.timerRunning ? "#60a5fa" : "#e4e4e7" }}>{formatDuration(secs)}</div>
                              </div>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {[
                                  { l: "▶ Avvia", fn: () => startTimer(task.id), bg: "rgba(52,211,153,0.15)", c: "#6ee7b7", bo: "rgba(52,211,153,0.3)" },
                                  { l: "⏸ Pausa", fn: () => pauseTimer(task.id), bg: "rgba(251,191,36,0.15)", c: "#fcd34d", bo: "rgba(251,191,36,0.3)" },
                                  { l: "⏹ Stop", fn: () => stopTimer(task.id), bg: "rgba(251,113,133,0.15)", c: "#fda4af", bo: "rgba(251,113,133,0.3)" },
                                  { l: "↺", fn: () => resetTimer(task.id), bg: "rgba(255,255,255,0.05)", c: "#71717a", bo: "rgba(255,255,255,0.1)" },
                                ].map(({ l, fn, bg, c, bo }) => (
                                  <button key={l} onClick={fn} style={{ padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: `1px solid ${bo}`, background: bg, color: c, cursor: "pointer" }}>{l}</button>
                                ))}
                              </div>
                            </div>
                          </div>
                          {/* Status + Notes */}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <div>
                              <div style={{ fontSize: 10, color: "#52525b", marginBottom: 4 }}>Stato</div>
                              <select value={task.status} onChange={(e) => updateAndSave(task.id, { status: e.target.value })}
                                style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 10px", fontSize: 12, color: "#d4d4d8", outline: "none" }}>
                                {["Da fare", "In corso", "In pausa", "Completato"].map((s) => <option key={s}>{s}</option>)}
                              </select>
                            </div>
                            <div>
                              <div style={{ fontSize: 10, color: "#52525b", marginBottom: 4 }}>Note operative</div>
                              <textarea value={task.notes} onChange={(e) => updateAndSave(task.id, { notes: e.target.value })}
                                placeholder="Aggiungi note..."
                                style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 10px", fontSize: 12, color: "#d4d4d8", outline: "none", resize: "vertical", minHeight: 64, fontFamily: "inherit" }} />
                            </div>
                          </div>
                          <button onClick={() => updateAndSave(task.id, { suspended: !task.suspended })}
                            style={{ alignSelf: "flex-start", padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", background: task.suspended ? "rgba(251,146,60,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${task.suspended ? "rgba(251,146,60,0.4)" : "rgba(255,255,255,0.08)"}`, color: task.suspended ? "#fb923c" : "#71717a" }}>
                            {task.suspended ? "⏸ Sospesa — clicca per riprendere" : "Sospendi task"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add task button (edit mode) */}
                {editMode && (
                  <button className="btn-add" onClick={() => handleAddTask(section.phaseIdx)}>
                    ➕ Aggiungi task in "{section.phase}"
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add phase (edit mode) */}
        {editMode && (
          <button
            onClick={handleAddPhase}
            style={{ width: "100%", padding: "14px", borderRadius: 16, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "rgba(167,139,250,0.05)", border: "2px dashed rgba(167,139,250,0.25)", color: "#a78bfa", marginTop: 8 }}>
            ➕ Aggiungi nuova fase
          </button>
        )}
      </div>

      {/* ── EDIT TASK MODAL ── */}
      {editingTask && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditingTask(null)}>
          <div className="modal-box">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, margin: 0, fontSize: "1.1rem" }}>✏️ Modifica Task</h3>
              <button onClick={() => setEditingTask(null)} style={{ background: "none", border: "none", color: "#71717a", fontSize: 18, cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: "#71717a", marginBottom: 6, fontWeight: 600 }}>TITOLO</div>
                <input
                  className="edit-input"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask((t) => ({ ...t, title: e.target.value }))}
                  placeholder="Titolo del task..."
                />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#71717a", marginBottom: 6, fontWeight: 600 }}>DESCRIZIONE</div>
                <textarea
                  className="edit-textarea"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask((t) => ({ ...t, description: e.target.value }))}
                  placeholder="Descrizione del task..."
                  style={{ minHeight: 120 }}
                />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#71717a", marginBottom: 6, fontWeight: 600 }}>GUIDA PRATICA</div>
                <textarea
                  className="edit-textarea"
                  value={editingTask.practicalGuide}
                  onChange={(e) => setEditingTask((t) => ({ ...t, practicalGuide: e.target.value }))}
                  placeholder="Guida passo passo..."
                  style={{ minHeight: 160 }}
                />
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                <button onClick={() => setEditingTask(null)}
                  style={{ padding: "8px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#71717a" }}>
                  Annulla
                </button>
                <button onClick={handleSaveEditingTask}
                  style={{ padding: "8px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "rgba(167,139,250,0.2)", border: "1px solid rgba(167,139,250,0.4)", color: "#c4b5fd" }}>
                  💾 Salva
                </button>
              </div>
              <div style={{ fontSize: 11, color: "#52525b", textAlign: "center", marginTop: 4 }}>
                Il salvataggio aggiornerà Supabase e scaricherà automaticamente un backup JSON
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── IMPORT MODAL ── */}
      {showImportModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowImportModal(false)}>
          <div className="modal-box">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, margin: 0, fontSize: "1.1rem" }}>📥 Importa da Backup</h3>
              <button onClick={() => setShowImportModal(false)} style={{ background: "none", border: "none", color: "#71717a", fontSize: 18, cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>
            <p style={{ fontSize: 13, color: "#71717a", marginBottom: 14 }}>
              Incolla il contenuto di un file JSON di backup. Questo sovrascriverà la struttura attuale ma manterrà lo stato dei task (completati, note, timer).
            </p>
            <textarea
              className="edit-textarea"
              value={importText}
              onChange={(e) => { setImportText(e.target.value); setImportError(""); }}
              placeholder='Incolla il JSON del backup qui...'
              style={{ minHeight: 200, fontFamily: "monospace", fontSize: 11 }}
            />
            {importError && <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", fontSize: 12, color: "#f87171" }}>{importError}</div>}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14 }}>
              <button onClick={() => setShowImportModal(false)}
                style={{ padding: "8px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#71717a" }}>
                Annulla
              </button>
              <button onClick={handleImport}
                style={{ padding: "8px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "rgba(96,165,250,0.2)", border: "1px solid rgba(96,165,250,0.4)", color: "#93c5fd" }}>
                📥 Importa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── INLINE PHASE NAME EDITOR ──────────────────────────────────────────────────
function PhaseNameEditor({ initialName, onSave, onCancel }) {
  const [val, setVal] = useState(initialName);
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", flex: 1 }}>
      <input
        ref={ref}
        className="edit-input"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onSave(val); if (e.key === "Escape") onCancel(); }}
        style={{ flex: 1, fontSize: "0.95rem", fontWeight: 700, fontFamily: "Syne, sans-serif" }}
      />
      <button onClick={() => onSave(val)} style={{ padding: "4px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", color: "#6ee7b7" }}>✓</button>
      <button onClick={onCancel} style={{ padding: "4px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#71717a" }}>✕</button>
    </div>
  );
}
