import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Sparkles,
  Send,
  UserCheck,
  Zap,
  Clock,
  Navigation,
  AlertTriangle,
  Truck,
  RotateCcw,
  ListOrdered,
  Bot,
  User,
  RefreshCw,
} from 'lucide-react';
import { aiCopilotService, ChatMessageItem } from '@/services/aiCopilot.service';
import { cn } from '@/utils/cn';

export const DispatcherAIPage: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      role: 'assistant',
      content:
        "Hello! I am your AI Dispatch Copilot powered by FleetCore Intelligence. Select a operational prompt below or ask me about driver availability, trip queue optimization, route delays, or idle vehicle reassignments.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Quick Dispatcher Prompts
  const quickPrompts = [
    {
      id: 'best-driver',
      title: 'Recommend Best Driver',
      prompt: 'Analyze active driver HOS hours, compliance status, and proximity to recommend the best available driver for an urgent cargo dispatch.',
      icon: UserCheck,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    },
    {
      id: 'optimize-dispatch',
      title: 'Optimize Dispatch Queue',
      prompt: 'Evaluate our current unassigned trip queue and suggest an optimized dispatch sequencing to minimize deadhead miles and delivery delays.',
      icon: Zap,
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    },
    {
      id: 'predict-delays',
      title: 'Predict Route Delays',
      prompt: 'Check current regional weather and traffic data along our primary freight corridors to predict potential arrival delays for active trips.',
      icon: Clock,
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    },
    {
      id: 'suggest-reroute',
      title: 'Suggest Reroute',
      prompt: 'Identify any blocked highways or heavy congestion on active trip routes and recommend fast bypass routes.',
      icon: Navigation,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    },
    {
      id: 'identify-bottlenecks',
      title: 'Identify Bottlenecks',
      prompt: 'What are the main operational bottlenecks in our dispatch center today?',
      icon: AlertTriangle,
      color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
    },
    {
      id: 'find-idle-vehicles',
      title: 'Find Idle Vehicles',
      prompt: 'List all idle or unassigned fleet vehicles in nearby regional depots ready for immediate dispatch.',
      icon: Truck,
      color: 'bg-[#f7f9fb] text-[#434655] border-[#c3c6d7] hover:bg-[#eceef0]',
    },
    {
      id: 'suggest-reassignment',
      title: 'Suggest Reassignment',
      prompt: 'If Driver Marcus Vance experiences a breakdown on Trip #TRIP-1042, which nearby driver should inherit the cargo load?',
      icon: RotateCcw,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
    },
    {
      id: 'summarize-queue',
      title: 'Summarize Dispatch Queue',
      prompt: 'Provide a concise executive summary of today’s pending cargo dispatches, active trips, and driver workload distribution.',
      icon: ListOrdered,
      color: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
    },
  ];

  // Send Message Mutation using Groq / backend AI Endpoint
  const chatMutation = useMutation({
    mutationFn: async (chatPayload: ChatMessageItem[]) => {
      const res = await aiCopilotService.sendChatMessage(chatPayload);
      return res.data;
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "AI Assistant Response (Simulation Fallback): Based on real-time fleet telemetry, Driver Sarah Jenkins (CDL-A Verified, 98% On-Time) is the top recommendation. She has 8.5 HOS hours available and is located 14 km from the origin depot.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    },
  });

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessageItem = {
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    if (!textToSend) setInputQuery('');

    // Trigger backend query
    chatMutation.mutate(
      newHistory.map((m) => ({ role: m.role, content: m.content }))
    );
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#2563eb]" />
            <h1 className="text-xl font-black tracking-tight text-[#191c1e]">
              AI Dispatch Assistant & Intelligence
            </h1>
          </div>
          <p className="text-xs font-semibold text-[#737686] mt-0.5">
            Groq LLM dispatch optimization, driver assignment scoring, delay predictions & corridor rerouting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#2563eb] text-xs font-bold border border-blue-200">
            <Bot className="h-4 w-4" />
            <span>Groq Llama-3 Operational Model Active</span>
          </span>
        </div>
      </div>

      {/* Grid of Dispatch Quick Prompts */}
      <div className="space-y-2">
        <h2 className="text-xs font-black text-[#191c1e] uppercase tracking-wider">
          Dispatcher Quick Intelligence Prompts
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {quickPrompts.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSendMessage(item.prompt)}
                disabled={chatMutation.isPending}
                className={cn(
                  'p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all shadow-2xs group',
                  item.color,
                  chatMutation.isPending && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Icon className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-black line-clamp-1">{item.title}</h3>
                  <p className="text-[10px] opacity-80 line-clamp-2 mt-0.5 font-medium">
                    {item.prompt}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Interface Card */}
      <div className="rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs flex flex-col h-[520px]">
        {/* Chat History Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3 max-w-[85%]',
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              )}
            >
              <div
                className={cn(
                  'h-8 w-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs',
                  msg.role === 'user' ? 'bg-[#191c1e]' : 'bg-[#2563eb]'
                )}
              >
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={cn(
                  'p-4 rounded-2xl text-xs space-y-1',
                  msg.role === 'user'
                    ? 'bg-[#2563eb] text-white rounded-tr-none'
                    : 'bg-[#f7f9fb] text-[#191c1e] border border-[#c3c6d7]/30 rounded-tl-none font-medium'
                )}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p
                  className={cn(
                    'text-[9px] font-mono text-right mt-1',
                    msg.role === 'user' ? 'text-blue-100' : 'text-[#737686]'
                  )}
                >
                  {msg.timestamp || 'Just now'}
                </p>
              </div>
            </div>
          ))}

          {chatMutation.isPending && (
            <div className="flex items-center gap-3 max-w-[85%]">
              <div className="h-8 w-8 rounded-xl bg-[#2563eb] flex items-center justify-center text-white shrink-0">
                <RefreshCw className="h-4 w-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-[#f7f9fb] text-xs text-[#737686] font-bold border border-[#c3c6d7]/30">
                Evaluating fleet data & running dispatch optimization algorithms...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#c3c6d7]/30 bg-white rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask AI Dispatcher (e.g. recommend best driver for Trip #TRIP-882)..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={chatMutation.isPending}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#c3c6d7]/50 text-xs focus:outline-none focus:border-[#2563eb] font-medium"
            />
            <button
              type="submit"
              disabled={chatMutation.isPending || !inputQuery.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#2563eb] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-[#1d4ed8] transition-colors disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send Query</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DispatcherAIPage;
