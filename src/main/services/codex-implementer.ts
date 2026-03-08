import type { BrowserWindow } from 'electron'

import type { AgentSdkCapabilities, AgentSdkImplementer } from './agent-sdk-types'
import { CODEX_CAPABILITIES } from './agent-sdk-types'
import { getAvailableCodexModels, getCodexModelInfo, CODEX_DEFAULT_MODEL } from './codex-models'
import { createLogger } from './logger'

const log = createLogger({ component: 'CodexImplementer' })

export class CodexImplementer implements AgentSdkImplementer {
  readonly id = 'codex' as const
  readonly capabilities: AgentSdkCapabilities = CODEX_CAPABILITIES

  private mainWindow: BrowserWindow | null = null
  private selectedModel: string = CODEX_DEFAULT_MODEL
  private selectedVariant: string | undefined

  // ── Window binding ───────────────────────────────────────────────

  setMainWindow(window: BrowserWindow): void {
    this.mainWindow = window
  }

  // ── Lifecycle ────────────────────────────────────────────────────

  async connect(_worktreePath: string, _hiveSessionId: string): Promise<{ sessionId: string }> {
    throw new Error('CodexImplementer.connect() not yet implemented')
  }

  async reconnect(
    _worktreePath: string,
    _agentSessionId: string,
    _hiveSessionId: string
  ): Promise<{
    success: boolean
    sessionStatus?: 'idle' | 'busy' | 'retry'
    revertMessageID?: string | null
  }> {
    throw new Error('CodexImplementer.reconnect() not yet implemented')
  }

  async disconnect(_worktreePath: string, _agentSessionId: string): Promise<void> {
    throw new Error('CodexImplementer.disconnect() not yet implemented')
  }

  async cleanup(): Promise<void> {
    log.info('Cleaning up CodexImplementer state')
    this.mainWindow = null
    this.selectedModel = CODEX_DEFAULT_MODEL
    this.selectedVariant = undefined
  }

  // ── Messaging ────────────────────────────────────────────────────

  async prompt(
    _worktreePath: string,
    _agentSessionId: string,
    _message:
      | string
      | Array<
          | { type: 'text'; text: string }
          | { type: 'file'; mime: string; url: string; filename?: string }
        >,
    _modelOverride?: { providerID: string; modelID: string; variant?: string }
  ): Promise<void> {
    throw new Error('CodexImplementer.prompt() not yet implemented')
  }

  async abort(_worktreePath: string, _agentSessionId: string): Promise<boolean> {
    throw new Error('CodexImplementer.abort() not yet implemented')
  }

  async getMessages(_worktreePath: string, _agentSessionId: string): Promise<unknown[]> {
    throw new Error('CodexImplementer.getMessages() not yet implemented')
  }

  // ── Models ───────────────────────────────────────────────────────

  async getAvailableModels(): Promise<unknown> {
    return getAvailableCodexModels()
  }

  async getModelInfo(
    _worktreePath: string,
    modelId: string
  ): Promise<{
    id: string
    name: string
    limit: { context: number; input?: number; output: number }
  } | null> {
    return getCodexModelInfo(modelId)
  }

  setSelectedModel(model: { providerID: string; modelID: string; variant?: string }): void {
    this.selectedModel = model.modelID
    this.selectedVariant = model.variant
    log.info('Selected model set', { model: model.modelID, variant: model.variant })
  }

  // ── Session info ─────────────────────────────────────────────────

  async getSessionInfo(
    _worktreePath: string,
    _agentSessionId: string
  ): Promise<{
    revertMessageID: string | null
    revertDiff: string | null
  }> {
    throw new Error('CodexImplementer.getSessionInfo() not yet implemented')
  }

  // ── Human-in-the-loop ────────────────────────────────────────────

  async questionReply(
    _requestId: string,
    _answers: string[][],
    _worktreePath?: string
  ): Promise<void> {
    throw new Error('CodexImplementer.questionReply() not yet implemented')
  }

  async questionReject(_requestId: string, _worktreePath?: string): Promise<void> {
    throw new Error('CodexImplementer.questionReject() not yet implemented')
  }

  async permissionReply(
    _requestId: string,
    _decision: 'once' | 'always' | 'reject',
    _worktreePath?: string
  ): Promise<void> {
    throw new Error('CodexImplementer.permissionReply() not yet implemented')
  }

  async permissionList(_worktreePath?: string): Promise<unknown[]> {
    throw new Error('CodexImplementer.permissionList() not yet implemented')
  }

  // ── Undo/Redo ────────────────────────────────────────────────────

  async undo(
    _worktreePath: string,
    _agentSessionId: string,
    _hiveSessionId: string
  ): Promise<unknown> {
    throw new Error('CodexImplementer.undo() not yet implemented')
  }

  async redo(
    _worktreePath: string,
    _agentSessionId: string,
    _hiveSessionId: string
  ): Promise<unknown> {
    throw new Error('CodexImplementer.redo() not yet implemented')
  }

  // ── Commands ─────────────────────────────────────────────────────

  async listCommands(_worktreePath: string): Promise<unknown[]> {
    throw new Error('CodexImplementer.listCommands() not yet implemented')
  }

  async sendCommand(
    _worktreePath: string,
    _agentSessionId: string,
    _command: string,
    _args?: string
  ): Promise<void> {
    throw new Error('CodexImplementer.sendCommand() not yet implemented')
  }

  // ── Session management ───────────────────────────────────────────

  async renameSession(
    _worktreePath: string,
    _agentSessionId: string,
    _name: string
  ): Promise<void> {
    throw new Error('CodexImplementer.renameSession() not yet implemented')
  }

  // ── Internal helpers (exposed for testing) ───────────────────────

  /** @internal */
  getSelectedModel(): string {
    return this.selectedModel
  }

  /** @internal */
  getSelectedVariant(): string | undefined {
    return this.selectedVariant
  }

  /** @internal */
  getMainWindow(): BrowserWindow | null {
    return this.mainWindow
  }
}
