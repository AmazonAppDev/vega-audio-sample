/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL. USE IS SUBJECT TO LICENSE TERMS.
 */
import {
  hasSeekLanded,
  SEEK_GATE_MS,
  SeekGate,
} from '../../src/utils/SeekGate';

describe('hasSeekLanded', () => {
  it('is false while playback is still at the pre-seek position', () => {
    expect(hasSeekLanded(40, 30)).toBe(false);
    expect(hasSeekLanded(20, 30)).toBe(false);
  });

  it('is true once playback reaches the target', () => {
    expect(hasSeekLanded(40, 40)).toBe(true);
    expect(hasSeekLanded(40, 39.8)).toBe(true);
    expect(hasSeekLanded(40, 41.5)).toBe(true);
  });
});

describe('SeekGate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts open with no pending target', () => {
    const gate = new SeekGate();
    expect(gate.isClosed()).toBe(false);
    expect(gate.getPendingTarget()).toBeNull();
    expect(gate.basePosition(12)).toBe(12);
  });

  it('closes on a seek and reopens after the gate time', () => {
    const gate = new SeekGate();
    gate.begin(40);
    expect(gate.isClosed()).toBe(true);
    expect(gate.getPendingTarget()).toBe(40);

    jest.advanceTimersByTime(SEEK_GATE_MS - 1);
    expect(gate.isClosed()).toBe(true);

    jest.advanceTimersByTime(1);
    expect(gate.isClosed()).toBe(false);
    expect(gate.getPendingTarget()).toBeNull();
  });

  it("does not let an older seek's timer reopen the gate", () => {
    const gate = new SeekGate();
    gate.begin(40);
    jest.advanceTimersByTime(1000);
    gate.begin(50);

    jest.advanceTimersByTime(SEEK_GATE_MS - 1000);
    expect(gate.isClosed()).toBe(true);
    expect(gate.getPendingTarget()).toBe(50);

    jest.advanceTimersByTime(1000);
    expect(gate.isClosed()).toBe(false);
  });

  it('builds a burst of presses on the pending target', () => {
    const gate = new SeekGate();
    let target = gate.basePosition(30) + 10;
    gate.begin(target);
    target = gate.basePosition(30) + 10;
    gate.begin(target);
    target = gate.basePosition(30) + 10;
    expect(target).toBe(60);
  });

  it('builds on the real position once playback reaches the target', () => {
    const gate = new SeekGate();
    gate.begin(40);
    jest.advanceTimersByTime(1000);
    expect(gate.basePosition(41)).toBe(41);
    expect(gate.getPendingTarget()).toBeNull();
    expect(gate.isClosed()).toBe(true);
  });

  it('drops the pending target when a progress tick sees it landed', () => {
    const gate = new SeekGate();
    gate.begin(40);
    gate.noteTime(30);
    expect(gate.getPendingTarget()).toBe(40);
    gate.noteTime(40.2);
    expect(gate.getPendingTarget()).toBeNull();
  });

  it('reset ends an in-flight seek right away', () => {
    const gate = new SeekGate();
    gate.begin(40);
    gate.reset();
    expect(gate.isClosed()).toBe(false);
    expect(gate.getPendingTarget()).toBeNull();

    gate.begin(80);
    gate.reset();
    jest.advanceTimersByTime(SEEK_GATE_MS);
    expect(gate.isClosed()).toBe(false);
  });
});
