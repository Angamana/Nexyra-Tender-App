import { useState } from 'react'
import { type Tender, useTenders } from '../../Universal/code/lib/tenderContext'
import { MessageSquare, Activity, Clock } from 'lucide-react'

export default function TenderTracker({ tender }: { tender: Tender }) {
  const { updateTender } = useTenders()
  const [newNote, setNewNote] = useState('')

  const handleAddNote = () => {
    if (!newNote.trim()) return
    const log = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      note: newNote,
      author: 'Current User'
    }
    const updatedLogs = [...(tender.trackerLogs || []), log]
    updateTender(tender.id, { trackerLogs: updatedLogs })
    setNewNote('')
  }

  let daysRemaining: number | null = null
  if (tender.submissionDate && tender.validityDays) {
    const start = new Date(tender.submissionDate)
    const end = new Date(start.getTime() + tender.validityDays * 24 * 60 * 60 * 1000)
    const now = new Date()
    daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row" style={{ minHeight: 'calc(100vh - 200px)' }}>
      {/* Tracker Status Sidebar */}
      <div className="w-full md:w-80 border-r border-gray-100 bg-gray-50 p-6 flex flex-col gap-6">
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Post-Submission Status</h3>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <Activity className="w-5 h-5" />
              <span className="font-semibold">Tracking Active</span>
            </div>
            <p className="text-xs text-blue-600">The AI is monitoring the tender portal for any extensions or announcements.</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Validity Period</h3>
          {tender.validityDays ? (
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
              <div className={`text-4xl font-bold mb-1 ${daysRemaining && daysRemaining < 14 ? 'text-orange-500' : 'text-blue-600'}`}>
                {daysRemaining}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Days Remaining</div>
              <div className="mt-3 text-xs text-gray-400">Total Validity: {tender.validityDays} days</div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
              No validity period set.
              <button 
                className="mt-2 text-blue-600 font-medium hover:underline block w-full"
                onClick={() => updateTender(tender.id, { validityDays: 90, submissionDate: new Date().toISOString() })}
              >
                Set 90-Day Default
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Follow-up Logs Main */}
      <div className="flex-1 p-6 md:p-8 bg-white flex flex-col h-full">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-400" />
          Procurement Follow-up Log
        </h2>

        <div className="flex-1 overflow-y-auto pr-4 space-y-4 mb-6">
          {(!tender.trackerLogs || tender.trackerLogs.length === 0) ? (
            <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No follow-ups logged yet.</p>
            </div>
          ) : (
            tender.trackerLogs.map(log => (
              <div key={log.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-900 text-sm">{log.author}</span>
                  <span className="text-xs font-medium text-gray-400">{new Date(log.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{log.note}</p>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-100 pt-6 mt-auto">
          <textarea 
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Log a call, email, or meeting with the procurement officer..."
            className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-none shadow-sm"
          />
          <div className="flex justify-end mt-3">
            <button 
              onClick={handleAddNote}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Add Log Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
