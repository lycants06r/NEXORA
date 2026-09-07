/*
  TaskStatusCard.jsx
  ------------------
  Shows the real-time status of a background collection task with NEXORA dark styling.
  Polls the backend every 3 seconds until task completes.
*/

import React, { useEffect, useState } from 'react'
import { getTaskStatus } from '../../api/ingestionApi'
import Badge from '../common/Badge.jsx'
import PlatformLogo from '../common/PlatformLogo.jsx'

const STATUS_CONFIG = {
  queued:    { color: 'yellow',  emoji: '⏳', label: 'Queued'     },
  running:   { color: 'blue',    emoji: '🔄', label: 'Running...' },
  completed: { color: 'green',   emoji: '✅', label: 'Completed'  },
  failed:    { color: 'red',     emoji: '❌', label: 'Failed'     },
}

function TaskStatusCard({ task }) {
  const [status, setStatus] = useState(task)

  useEffect(() => {
    if (status.status === 'completed' || status.status === 'failed') return

    const interval = setInterval(async () => {
      try {
        const res = await getTaskStatus(task.task_id)
        setStatus(res.data)
      } catch {
        clearInterval(interval)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [status.status, task.task_id])

  const config = STATUS_CONFIG[status.status] || STATUS_CONFIG.queued

  return (
    <div className="
      liquid-glass-soft border border-cyan-500/25 rounded-2xl p-4
      animate-slide-up shadow-[0_8px_24px_rgba(0,0,0,0.45)]
    ">
      <div className="flex items-center justify-between mb-2">
        {/* Task ID + Platform */}
        <div className="flex items-center gap-2">
          <span className="text-[#4cd7f6] font-mono text-xs font-bold bg-cyan-500/15 px-2.5 py-0.5 rounded-lg border border-cyan-500/30 shadow-[0_0_8px_rgba(76,215,246,0.15)]">
            #{status.task_id}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-lg bg-black/40 text-[#8ea0b5] border border-white/10 font-mono uppercase flex items-center gap-1.5">
            <PlatformLogo platform={status.platform} className="w-3.5 h-3.5" colored={true} />
            {status.platform}
          </span>
        </div>
        <Badge label={config.label} color={config.color} dot />
      </div>

      {/* Query */}
      <p className="text-xs font-mono mb-2 text-[#8ea0b5]">
        TARGET: <span className="text-white font-semibold">"{status.query}"</span>
      </p>

      {/* Result info */}
      {status.posts_count !== undefined && (
        <p className="text-xs font-mono text-[#4edea3] font-semibold flex items-center gap-1.5">
          <span>✅</span> {status.posts_count} signals ingested to cache
        </p>
      )}
      {status.error && (
        <p className="text-xs font-mono text-[#f43f5e] font-semibold">❌ {status.error}</p>
      )}

      {/* Progress bar for running state */}
      {status.status === 'running' && (
        <div className="mt-3 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-gradient-to-r from-[#4cd7f6] to-[#06b6d4] rounded-full animate-pulse w-3/4 shadow-[0_0_8px_#4cd7f6]" />
        </div>
      )}
    </div>
  )
}

export default TaskStatusCard
