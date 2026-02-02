"use client";

import { useResumeStore } from "@/stores/resume-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  IconGripVertical,
  IconPalette,
  IconTypography,
  IconLayoutList,
  IconCheck,
} from "@tabler/icons-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

// Standard sections that can be reordered and renamed
const SECTIONS = [
  { id: "summary", label: "Professional Summary" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
];

// Enhanced Color Presets
const COLOR_PRESETS = [
  { name: "Slate", value: "#0f172a", bg: "bg-slate-950" },
  { name: "Blue", value: "#2563eb", bg: "bg-blue-600" },
  { name: "Violet", value: "#7c3aed", bg: "bg-violet-600" },
  { name: "Emerald", value: "#059669", bg: "bg-emerald-600" },
  { name: "Rose", value: "#e11d48", bg: "bg-rose-600" },
  { name: "Amber", value: "#d97706", bg: "bg-amber-600" },
  { name: "Cyan", value: "#0891b2", bg: "bg-cyan-600" },
  { name: "Fuchsia", value: "#c026d3", bg: "bg-fuchsia-600" },
  { name: "Lime", value: "#65a30d", bg: "bg-lime-600" },
  { name: "Midnight", value: "#1e1b4b", bg: "bg-indigo-950" },
];

function SortableItem({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm group"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
      >
        <IconGripVertical className="w-5 h-5" />
      </div>
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </span>
    </div>
  );
}

export function SettingsForm() {
  const { content, updateSettings, updateContent } = useResumeStore();
  const {
    sectionOrder = SECTIONS.map((s) => s.id),
    settings = {
      themeColor: "#000000",
      font: "Inter",
      sectionTitles: {} as Record<string, string>,
    },
  } = content;

  // Ensure sectionTitles is typed correctly
  const sectionTitles = (settings?.sectionTitles || {}) as Record<
    string,
    string
  >;

  // Dnd Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over.id as string);
      updateContent({
        sectionOrder: arrayMove(sectionOrder, oldIndex, newIndex),
      });
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Theme Color Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-dashed border-neutral-200 dark:border-neutral-800">
          <IconPalette className="w-4 h-4 text-neutral-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
            Accent Color
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color.name}
              onClick={() =>
                updateSettings({ ...settings, themeColor: color.value })
              }
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 focus:outline-none ring-2 ring-offset-2 ring-offset-white dark:ring-offset-neutral-950",
                color.bg,
                settings.themeColor === color.value
                  ? "ring-neutral-900 dark:ring-white scale-110"
                  : "ring-transparent hover:ring-neutral-200 dark:hover:ring-neutral-700",
              )}
              title={color.name}
            >
              {settings.themeColor === color.value && (
                <IconCheck className="w-5 h-5 text-white drop-shadow-sm" />
              )}
            </button>
          ))}

          {/* Custom Color Picker */}
          <div className="relative group" title="Custom Color">
            <div className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-700 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-red-500 via-purple-500 to-blue-500 flex items-center justify-center overflow-hidden cursor-pointer ring-offset-2 ring-offset-white dark:ring-offset-neutral-950 transition-all group-hover:scale-110 group-hover:ring-2 ring-neutral-200">
              <input
                type="color"
                value={settings.themeColor}
                onChange={(e) =>
                  updateSettings({ ...settings, themeColor: e.target.value })
                }
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
              <div
                className="w-full h-full"
                style={{ backgroundColor: settings.themeColor }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section Order Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-dashed border-neutral-200 dark:border-neutral-800">
          <IconLayoutList className="w-4 h-4 text-neutral-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
            Section Ordering
          </h3>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Drag and drop to reorder resume sections
        </p>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sectionOrder}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {sectionOrder.map((sectionId) => {
                const section = SECTIONS.find((s) => s.id === sectionId);
                return section ? (
                  <SortableItem
                    key={sectionId}
                    id={sectionId}
                    label={sectionTitles[sectionId] || section.label}
                  />
                ) : null;
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Custom Titles Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-dashed border-neutral-200 dark:border-neutral-800">
          <IconTypography className="w-4 h-4 text-neutral-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
            Custom Titles
          </h3>
        </div>

        <div className="grid gap-4">
          {SECTIONS.map((section) => (
            <div
              key={section.id}
              className="grid grid-cols-[120px_1fr] items-center gap-4"
            >
              <Label className="text-xs text-neutral-500 dark:text-neutral-400">
                {section.label}
              </Label>
              <Input
                value={sectionTitles[section.id] || ""}
                placeholder={section.label}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    sectionTitles: {
                      ...sectionTitles,
                      [section.id]: e.target.value,
                    },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
