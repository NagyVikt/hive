interface QueuedIndicatorProps {
  count: number
  steeredCount?: number
}

export function QueuedIndicator({ count, steeredCount = 0 }: QueuedIndicatorProps): React.JSX.Element | null {
  if (count === 0 && steeredCount === 0) return null
  const parts: string[] = []
  if (steeredCount > 0) parts.push(`${steeredCount} steered`)
  if (count > 0) parts.push(`${count} queued`)
  return (
    <div className="text-xs text-muted-foreground px-3 py-1">
      {parts.join(', ')}
    </div>
  )
}
