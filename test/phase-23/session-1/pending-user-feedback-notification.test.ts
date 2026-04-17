import { vi, describe, test, expect, beforeEach } from 'vitest'

// Mock electron + logger BEFORE importing notificationService (pattern copied
// from test/phase-23/session-1/notification-queued-suppression.test.ts).
const mockSetBadge = vi.fn()
const mockNotificationShow = vi.fn()
const mockNotificationOn = vi.fn()
const notificationCtorSpy = vi.fn()
let notificationsSupported = true

vi.mock('electron', () => ({
  Notification: class MockNotification {
    static isSupported(): boolean {
      return notificationsSupported
    }
    constructor(opts: Record<string, unknown>) {
      notificationCtorSpy(opts)
    }
    on = mockNotificationOn
    show = mockNotificationShow
  },
  BrowserWindow: vi.fn(),
  app: {
    getPath: () => '/tmp/test-home',
    dock: {
      setBadge: (...args: string[]) => mockSetBadge(...args)
    }
  }
}))

vi.mock('../../../src/main/services/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  })
}))

import { notificationService } from '../../../src/main/services/notification-service'
import type { BrowserWindow } from 'electron'

const baseData = {
  projectName: 'my-project',
  sessionName: 'implement auth',
  projectId: 'p-1',
  worktreeId: 'wt-1',
  sessionId: 's-1'
}

function createMockWindow(): { window: BrowserWindow; triggerFocus: () => void } {
  let focusHandler: (() => void) | undefined
  const mockWindow = {
    on: vi.fn((event: string, handler: () => void) => {
      if (event === 'focus') focusHandler = handler
    })
  } as unknown as BrowserWindow
  return {
    window: mockWindow,
    triggerFocus: () => focusHandler?.()
  }
}

function resetState(): void {
  const { window, triggerFocus } = createMockWindow()
  notificationService.setMainWindow(window)
  triggerFocus() // clear unreadCount accumulated across tests
  vi.clearAllMocks()
}

describe('Phase 23 · Session 1: showPendingUserFeedback', () => {
  beforeEach(() => {
    notificationsSupported = true
    resetState()
  })

  test('kind="question" uses "needs your answer" body', () => {
    notificationService.showPendingUserFeedback(baseData, 'question')
    expect(notificationCtorSpy).toHaveBeenCalledTimes(1)
    const opts = notificationCtorSpy.mock.calls[0][0]
    expect(opts.title).toBe('my-project')
    expect(opts.body).toBe('"implement auth" needs your answer')
    expect(opts.silent).toBe(false)
    expect(mockNotificationShow).toHaveBeenCalledTimes(1)
  })

  test('kind="permission" uses "needs your permission" body', () => {
    notificationService.showPendingUserFeedback(baseData, 'permission')
    const opts = notificationCtorSpy.mock.calls[0][0]
    expect(opts.body).toBe('"implement auth" needs your permission')
  })

  test('increments dock badge on macOS', () => {
    const originalPlatform = process.platform
    Object.defineProperty(process, 'platform', { value: 'darwin', configurable: true })
    try {
      notificationService.showPendingUserFeedback(baseData, 'question')
      expect(mockSetBadge).toHaveBeenCalledWith('1')
    } finally {
      Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true })
    }
  })

  test('no-op when Notification.isSupported() returns false', () => {
    notificationsSupported = false
    notificationService.showPendingUserFeedback(baseData, 'question')
    expect(mockNotificationShow).not.toHaveBeenCalled()
    expect(mockSetBadge).not.toHaveBeenCalled()
  })

  test('does NOT apply queued-message suppression (feedback must always fire)', () => {
    notificationService.setSessionQueuedState(baseData.sessionId, true)
    notificationService.showPendingUserFeedback(baseData, 'question')
    expect(mockNotificationShow).toHaveBeenCalledTimes(1)
    notificationService.setSessionQueuedState(baseData.sessionId, false)
  })
})
