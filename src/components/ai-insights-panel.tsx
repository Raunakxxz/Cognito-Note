'use client';

import type { Note } from "@/lib/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { CheckSquare, FileText, Loader2, Sparkles, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { summarizeNote } from "@/ai/flows/ai-summarize-note";
import { taskExtraction } from "@/ai/flows/ai-task-extraction";
import { suggestTags } from "@/ai/flows/ai-suggest-tags";
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AiInsightsPanelProps {
  note: Note;
  isOpen: boolean;
  onClose: () => void;
  onAddSuggestedTag: (tag: string) => void;
}

type AiLoadingState = {
  summarize?: boolean;
  tasks?: boolean;
  tags?: boolean;
};

export function AiInsightsPanel({ note, isOpen, onClose, onAddSuggestedTag }: AiInsightsPanelProps) {
  const [insights, setInsights] = useState(note.aiInsights);
  const [loading, setLoading] = useState<AiLoadingState>({});
  const { toast } = useToast();

  useEffect(() => {
    setInsights(note.aiInsights);
  }, [note.aiInsights]);

  const handleSummarize = async () => {
    if (!note.content) return;
    setLoading(prev => ({ ...prev, summarize: true }));
    try {
      const result = await summarizeNote({ noteContent: note.content });
      setInsights(prev => ({ ...prev, summary: result.summary, keyInsights: result.keyInsights }));
      // Here you would also update the note in Firestore
    } catch (e) {
      toast({ title: "AI Error", description: "Failed to generate summary.", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, summarize: false }));
    }
  };

  const handleExtractTasks = async () => {
    if (!note.content) return;
    setLoading(prev => ({ ...prev, tasks: true }));
    try {
      const result = await taskExtraction({ noteContent: note.content });
      setInsights(prev => ({ ...prev, actionItems: result.actionItems }));
      // Here you would also update the note in Firestore
    } catch (e) {
      toast({ title: "AI Error", description: "Failed to extract tasks.", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  };

  const handleSuggestTags = async () => {
    if (!note.content) return;
    setLoading(prev => ({ ...prev, tags: true }));
    try {
      const result = await suggestTags({ noteContent: note.content });
      setInsights(prev => ({ ...prev, suggestedTags: result.suggestedTags }));
      // Here you would also update the note in Firestore
    } catch (e) {
      toast({ title: "AI Error", description: "Failed to suggest tags.", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, tags: false }));
    }
  };


  return (
    <aside className={cn(
      "transition-all duration-300 ease-in-out flex-shrink-0 bg-bg-surface border-l border-border-default",
      isOpen ? "w-full md:w-96" : "w-0"
    )}>
      <div className={cn("h-full flex flex-col", !isOpen && "hidden")}>
        <header className="flex h-16 items-center justify-between px-4 border-b border-border-default flex-shrink-0">
          <h2 className="font-display text-h3 font-semibold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent-purple" />
            AI Insights
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </header>

        <div className="p-4 space-y-2 border-b border-border-default">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-border-default" onClick={handleSummarize} disabled={loading.summarize || !note.content}>
              {loading.summarize ? <Loader2 className="h-4 w-4 animate-spin"/> : <FileText className="h-4 w-4"/>}
              Summarize
            </Button>
            <Button variant="outline" className="border-border-default" onClick={handleExtractTasks} disabled={loading.tasks || !note.content}>
              {loading.tasks ? <Loader2 className="h-4 w-4 animate-spin"/> : <CheckSquare className="h-4 w-4"/>}
              Tasks
            </Button>
            <Button variant="outline" className="border-border-default" onClick={handleSuggestTags} disabled={loading.tags || !note.content}>
              {loading.tags ? <Loader2 className="h-4 w-4 animate-spin"/> : <Tag className="h-4 w-4"/>}
              Tags
            </Button>
            <Button variant="outline" className="border-border-default" disabled>Find Related</Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {insights?.summary && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">Summary</h4>
              <p className="text-sm text-text-secondary">{insights.summary}</p>
            </div>
          )}

          {insights?.keyInsights && insights.keyInsights.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">Key Insights</h4>
              <ul className="space-y-2 list-disc list-inside text-sm text-text-secondary">
                {insights.keyInsights.map((insight, i) => <li key={i}>{insight}</li>)}
              </ul>
            </div>
          )}
          
          {insights?.actionItems && insights.actionItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">Action Items</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                {insights.actionItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-text-tertiary"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insights?.suggestedTags && insights.suggestedTags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">Suggested Tags</h4>
              <div className="flex flex-wrap gap-2">
                {insights.suggestedTags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="cursor-pointer hover:bg-accent-primary hover:text-primary-foreground" onClick={() => onAddSuggestedTag(tag)}>
                    + {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {!insights?.summary && !insights?.keyInsights && !insights?.actionItems && !insights?.suggestedTags && !Object.values(loading).some(v => v) && (
             <div className="text-center py-8 text-text-secondary">
                <Sparkles className="w-12 h-12 mx-auto opacity-30" />
                <p className="mt-4 text-sm">Use AI tools to analyze your note.</p>
              </div>
          )}
        </div>
      </div>
    </aside>
  );
}
