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
        <h1 className="text-3xl font-bold text-white mb-2">Verification History</h1>
        <p className="text-slate-400">Review all previously analyzed claims and documents.</p>
      </header>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-[#0f1524]/60 rounded-2xl border border-[#7dd3fc]/10">
          <Activity className="w-12 h-12 mb-4 opacity-50" />
          <p>No verification history found yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {history.map((record) => (
            <HistoryCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
}
