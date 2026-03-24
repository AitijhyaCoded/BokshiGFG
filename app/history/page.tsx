import { db } from '@/lib/db';
import { verifications } from '@/lib/schema';
import { desc } from 'drizzle-orm';
import { Activity } from 'lucide-react';
import { HistoryCard } from '@/components/history-card';

export const revalidate = 0; // Dynamic server component

export default async function HistoryPage() {
  const history = await db.select().from(verifications).orderBy(desc(verifications.createdAt)).limit(100);

  return (
    <div className="min-h-full p-8 lg:p-12 max-w-6xl mx-auto flex flex-col">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#7dd3fc] to-[#white] bg-[length:200%_auto] animate-gradient mb-2 tracking-tight drop-shadow-[0_0_15px_rgba(125,211,252,0.3)]">Verification History</h1>
        <p className="text-slate-400 text-lg">Review all previously analyzed claims and documents.</p>
      </header>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(125,211,252,0.1)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7dd3fc]/5 via-transparent to-transparent pointer-events-none" />
          <Activity className="w-12 h-12 mb-4 opacity-70 group-hover:text-[#7dd3fc] transition-colors duration-500" />
          <p className="font-medium tracking-wide">No verification history found yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative z-10">
          {history.map((record) => (
            <HistoryCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
}
