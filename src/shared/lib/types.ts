export type SkillCategory = 
  | "LANGUAGE"
  | "FRAMEWORK"
  | "TOOL"
  | "DATABASE"
  | "CONCEPT"
  | "OTHER";

export interface AISkillSuggestion {
  name: string;
  category: SkillCategory;
  confidence: number;
  reason: string;
}

export type EvidenceType = "LINK" | "CODE_SNIPPET" | "DESCRIPTION" | "METRIC";

export interface AIEvidenceSuggestion {
  title: string;
  type: EvidenceType;
  content: string;
  suggestedSkills: string[];
  reason: string;
}

export interface AIAnalysisResult {
  skills: AISkillSuggestion[];
  evidence: AIEvidenceSuggestion[];
  summary: string;
  projectType: string;
  complexity: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface CodeAnalysisResult {
  language: string;
  frameworks: string[];
  patterns: string[];
  skills: AISkillSuggestion[];
  qualityNotes: string[];
}
