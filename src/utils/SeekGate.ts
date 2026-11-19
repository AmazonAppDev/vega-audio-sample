/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL. USE IS SUBJECT TO LICENSE TERMS.
 */

/** How long the gate stays closed after the most recent seek (ms). */
export const SEEK_GATE_MS = 1500;

// A seek counts as landed when playback is within this window of the target.
// Playback keeps moving forward after it lands, so the window is wider ahead
// of the target than behind it. Before landing, playback is still at the
// pre-seek position, which is a full seek step (10 s) away from the target.
const LANDED_BEHIND_SECONDS = 0.5;
const LANDED_AHEAD_SECONDS = 2;

/**
 * Returns true when `currentTime` shows that the player has reached `target`.
 * Both values are in seconds.
 */
export const hasSeekLanded = (target: number, currentTime: number): boolean =>
  currentTime >= target - LANDED_BEHIND_SECONDS &&
  currentTime <= target + LANDED_AHEAD_SECONDS;

/**
 * Tracks an in-flight D-pad seek for the player screen.
 *
 * - While the gate is closed, progress updates from the player are ignored so
 *   a stale position cannot pull the seek bar back.
 * - Only the most recent seek may reopen the gate; each new seek cancels the
 *   previous seek's timer.
 * - During a burst of presses, each seek builds on the last requested target,
 *   because the player's currentTime may not have landed yet. Once the player
 *   reaches the target, the target is dropped and seeks build on the real
 *   position again.
 */
export class SeekGate {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private pendingTarget: number | null = null;
  private closed = false;

  constructor(private readonly gateMs: number = SEEK_GATE_MS) {}

  /** True while progress updates from the player should be ignored. */
  isClosed(): boolean {
    return this.closed;
  }

  /** Last requested seek target in seconds, or null when none is pending. */
  getPendingTarget(): number | null {
    return this.pendingTarget;
  }

  /**
   * Drops the pending target once the player has reached it, so the next seek
   * starts from where playback really is.
   */
  noteTime(currentTime: number): void {
    if (
      this.pendingTarget !== null &&
      hasSeekLanded(this.pendingTarget, currentTime)
    ) {
      this.pendingTarget = null;
    }
  }

  /** Position (seconds) the next seek should be relative to. */
  basePosition(currentTime: number): number {
    this.noteTime(currentTime);
    return this.pendingTarget ?? currentTime;
  }

  /** Closes the gate for a new seek to `target` (seconds). */
  begin(target: number): void {
    this.closed = true;
    this.pendingTarget = target;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.timer = null;
      this.closed = false;
      this.pendingTarget = null;
    }, this.gateMs);
  }

  /** Ends any in-flight seek: cancels the timer, reopens the gate. */
  reset(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.closed = false;
    this.pendingTarget = null;
  }
}
