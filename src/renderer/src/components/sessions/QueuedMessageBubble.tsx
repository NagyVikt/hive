import { cn } from '@/lib/utils'
import { Navigation } from 'lucide-react'

interface QueuedMessageBubbleProps {
  content: string
  steered?: boolean
  canSteer?: boolean
  onSteer?: () => void
}

export function QueuedMessageBubble({ content, steered, canSteer, onSteer }: QueuedMessageBubbleProps): React.JSX.Element {
  return (
    <div className="flex justify-end px-6 py-4 opacity-70" data-testid="queued-message-bubble">
      <div className={cn('max-w-[80%] rounded-2xl px-4 py-3', 'bg-primary/10 text-foreground')}>
        <div className="flex items-center gap-2 mb-1">
          {steered ? (
            <span className="text-[10px] font-medium bg-emerald-500/20 text-emerald-400 rounded px-1.5 py-0.5">
              STEERED
            </span>
          ) : (
            <>
              <span className="text-[10px] font-medium bg-primary-foreground/20 rounded px-1.5 py-0.5">
                QUEUED
              </span>
              {canSteer && (
                <button
                  onClick={onSteer}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Steer — inject into active turn"
                >
                  <Navigation className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{content}</p>
      </div>
    </div>
  )
}
