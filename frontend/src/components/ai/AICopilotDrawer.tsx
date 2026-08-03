import React, { useState } from 'react';
import { X, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { ChatMessageItem } from '@/services/aiCopilot.service';

interface AICopilotDrawerProps {
  open: boolean;
  onClose: () => void;
  messages: ChatMessageItem[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
  suggestedQuestions: string[];
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  open,
  onClose,
  messages,
  onSendMessage,
  isLoading,
  suggestedQuestions,
}) => {
  const [input, setInput] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-card h-full flex flex-col shadow-2xl border-l border-border animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">FleetCore Copilot (Groq)</h2>
              <p className="text-xs text-muted-foreground">Enterprise Fleet Intelligence Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs font-medium leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-muted/80 text-foreground border border-border rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground text-xs font-bold">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold animate-pulse">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-muted/80 border border-border p-4 text-xs font-semibold text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> Groq LPU reasoning...
              </div>
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        {suggestedQuestions.length > 0 && (
          <div className="px-6 py-3 border-t border-border bg-muted/20 space-y-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Suggested Operational Queries
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.slice(0, 3).map((q, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(q)}
                  className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-primary/50 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Footer */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Groq Copilot about fleet telemetry, idle fuel, maintenance..."
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-white font-bold disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
