export function detectTransportMode(): 'electron' | 'web' {
  // If the preload script ran, window.db exists (it's set synchronously by Electron's contextBridge)
  return typeof window !== 'undefined' && window.db !== undefined ? 'electron' : 'web'
}
