/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL. USE IS SUBJECT TO LICENSE TERMS.
 */

export const SEEK_GATE_MS = 1500;

const LANDED_BEHIND_SECONDS = 0.5;
const LANDED_AHEAD_SECONDS = 2;

export const hasSeekLanded = (target: number, currentTime: number): boolean =>
  currentTime >= target - LANDED_BEHIND_SECONDS &&
  currentTime <= target + LANDED_AHEAD_SECONDS;

export class SeekGate {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private pendingTarget: number | null = null;
  private closed = false;

  constructor(private readonly gateMs: number = SEEK_GATE_MS) {}

  isClosed(): boolean {
    return this.closed;
  }

  getPendingTarget(): number | null {
    return this.pendingTarget;
  }

  noteTime(currentTime: number): void {
    if (
      this.pendingTarget !== null &&
      hasSeekLanded(this.pendingTarget, currentTime)
    ) {
      this.pendingTarget = null;
    }
  }

  basePosition(currentTime: number): number {
    this.noteTime(currentTime);
    return this.pendingTarget ?? currentTime;
  }

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

  reset(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.closed = false;
    this.pendingTarget = null;
  }
}
