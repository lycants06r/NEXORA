/*
  PostCard.jsx
  ------------
  Displays a single collected social media post with NEXORA glassmorphic intelligence styling.
*/

import React from 'react'
import Badge from '../common/Badge.jsx'
import PlatformLogo from '../common/PlatformLogo.jsx'

const PLATFORM_CONFIG = {
  twitter:   { color: 'blue',   label: 'X / Twitter' },
  telegram:  { color: 'cyan',   label: 'Telegram'    },
  reddit:    { color: 'yellow', label: 'Reddit'      },
  youtube:   { color: 'red',    label: 'YouTube'     },
  instagram: { color: 'pink',   label: 'Instagram'   },
  facebook:  { color: 'blue',   label: 'Facebook'    },
}

function PostCard({ post }) {
  const platformConfig = PLATFORM_CONFIG[post.platform] ||
    { color: 'gray', label: post.platform }

  return (
    <div className="
      bg-[#0a1329]/75 backdrop-blur-xl border border-cyan-500/15
      hover:border-cyan-500/40 transition-all duration-200
      rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]
      animate-slide-up
    ">
      {/* Header: platform + time */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center p-1 flex-shrink-0">
            <PlatformLogo platform={post.platform} className="w-4 h-4" colored={true} />
          </div>
          <Badge
            label={platformConfig.label || post.platform}
            color={platformConfig.color}
          />
        </div>
        <span className="text-xs font-mono text-[#8ea0b5]">
          {post.collected_at
            ? new Date(post.collected_at).toLocaleTimeString()
            : 'Live'
          }
        </span>
      </div>

      {/* Post content */}
      <p className="text-[#dae2fd] text-sm leading-relaxed mb-3 line-clamp-3 font-normal">
        {post.content}
      </p>

      {/* Hashtags */}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.hashtags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-[#4cd7f6] bg-cyan-500/10 border border-cyan-500/20
                         px-2 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Engagement metrics */}
      <div className="flex items-center gap-4 text-xs font-mono text-[#8ea0b5] pt-2 border-t border-white/5">
        {post.engagement?.likes  > 0 && (
          <span className="flex items-center gap-1">❤️ {post.engagement.likes}</span>
        )}
        {post.engagement?.shares > 0 && (
          <span className="flex items-center gap-1">🔁 {post.engagement.shares}</span>
        )}
        {post.engagement?.replies > 0 && (
          <span className="flex items-center gap-1">💬 {post.engagement.replies}</span>
        )}
        {post.language && (
          <span className="ml-auto text-[#4cd7f6] bg-black/40 px-2 py-0.5 rounded border border-white/5">
            LANG: {post.language.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  )
}

export default PostCard
