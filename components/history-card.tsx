'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/components/ui/glass-card';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HistoryCardProps {
  record: any;
}

export function HistoryCard({ record }: HistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalClaims = record.trueCount + record.partialCount + record.falseCount + (record.unverifiableCount || 0);
  const acc = record.accuracy || 0;
  let status = 'INCONCLUSIVE';
  let color = 'text-amber-400';
  let bg = 'bg-amber-400/10';
  let border = 'border-amber-400/20';

  if (acc >= 80) {
    status = 'HIGHLY RELIABLE';
    color = 'text-emerald-400';
    bg = 'bg-emerald-500/10';
    border = 'border-emerald-500/20';
  } else if (acc >= 50) {
    status = 'MIXED SIGNALS';
    color = 'text-amber-400';
    bg = 'bg-amber-500/10';
    border = 'border-amber-500/20';
  } else {
    status = 'POTENTIALLY DECEPTIVE';
    color = 'text-red-400';
    bg = 'bg-red-500/10';
    border = 'border-red-500/20';
  }

  return (
    <GlassCard
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300",
        isExpanded ? "border-[#7dd3fc]/30 shadow-[0_0_20px_rgba(125,211,252,0.1)]" : "hover:border-[#7dd3fc]/20"
      )}
    >
      {/* ALWAYS VISIBLE HEADER */}
      <div className="flex items-start justify-between">
        <span className={cn("text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md border", color, bg, border)}>
          {status}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            {record.createdAt ? formatDistanceToNow(new Date(record.createdAt), { addSuffix: true }) : 'Unknown'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* USER CONTENT */}
      <div className="mt-2 text-sm text-slate-300">
        <h3 className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">User Content</h3>
        <p className={cn("text-white bg-white/5 p-3 rounded-lg border border-white/10", !isExpanded && "line-clamp-3")}>
          {record.originalText}
        </p>
      </div>

      {/* EXPANDABLE DETAILS */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-white/5 text-sm text-slate-300 space-y-4">
              <div className="flex items-center gap-2 font-semibold">
                <span>AI Confidence:</span>
                <span className={record.accuracy > 70 ? 'text-emerald-400' : 'text-amber-400'}>
                  {Math.round(record.accuracy)}%
                </span>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Verified Claims ({totalClaims})</h3>
                <ul className="space-y-3">
                  {(record.verifiedClaims as any[]).map((vc: any, idx: number) => (
                    <li key={idx} className="bg-[#0a0e1a]/50 p-3 rounded-lg border border-white/5">
                      <p className="font-medium text-white mb-2">"{vc.claim}"</p>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className={cn(
                          "font-bold uppercase tracking-wider",
                          vc.status === 'VERIFIED TRUE' ? 'text-emerald-400' :
                            vc.status === 'VERIFIED FALSE' ? 'text-red-400' :
                              vc.status === 'UNVERIFIABLE' ? 'text-slate-400' :
                                'text-amber-400'
                        )}>{vc.status} ({vc.confidence}%)</span>
                      </div>
                      <p className="text-xs text-slate-400">{vc.reasoning}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <h3 className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">AI Overall Reasoning</h3>
                <p className="text-xs text-slate-300 italic">{record.aiReasoning}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
