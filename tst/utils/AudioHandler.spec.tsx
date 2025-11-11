import { ImageSourcePropType } from '@amazon-devices/react-native-kepler';
import { AudioPlayer } from '@amazon-devices/react-native-w3cmedia';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { MUSIC_ICON } from '../../src/Constants';
import { AudioContext } from '../../src/store/AudioProvider';
import { TrackInfo } from '../../src/types/AudioDataTypes';
import { useAudioHandler } from '../../src/utils/AudioHandler';
import { ShakaPlayer } from '../../src/w3cmedia/shakaplayer/ShakaPlayer';

export enum MediaFileTypes {
  ADAPTIVE = 'adaptive',
  NON_ADAPTIVE = 'nonAdaptive',
}

jest.mock('@amazon-devices/react-native-kepler', () => ({
  useKeplerAppStateManager: jest.fn(() => ({
    getComponentInstance: jest.fn(() => ({})),
    addAppStateListener: jest.fn(() => ({ remove: jest.fn() })),
  })),
  useComponentInstance: jest.fn(() => ({})),
}));

jest.mock('@amazon-devices/react-native-w3cmedia', () => ({
  AudioPlayer: jest.fn().mockImplementation(() => ({
    initialize: jest.fn().mockResolvedValue(undefined),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    pause: jest.fn(),
    deinitialize: jest.fn().mockResolvedValue(undefined),
    setMediaControlFocus: jest.fn(),
    currentTime: 0,
  })),
  KeplerMediaControlHandler: class MockKeplerMediaControlHandler {
    handlePlay = jest.fn();
    handlePause = jest.fn();
    handleStop = jest.fn();
    handleTogglePlayPause = jest.fn();
    handleRewind = jest.fn();
    handleSeek = jest.fn();
  },
}));

jest.mock('../../src/w3cmedia/shakaplayer/ShakaPlayer', () => {
  const mockLoad = jest.fn().mockResolvedValue(undefined);
  const mockUnload = jest.fn();

  return {
    ShakaPlayer: jest.fn().mockImplementation(() => ({
      load: mockLoad,
      unload: mockUnload,
    })),
  };
});

const mockOnTimeChange = jest.fn();
const mockOnLoadedMetadata = jest.fn();
const mockOnAudioInitialize = jest.fn();

const createMockTrackInfo = (type: string): TrackInfo => ({
  id: 1,
  title: 'Test Track',
  description: 'A test audio track',
  duration: '180',
  type: type,
  audioURL: `http://example.com/audio.${type}`,
  thumbURL: { uri: 'http://example.com/thumb.jpg' } as ImageSourcePropType,
});
const mockAudioContext = {
  isAudioStarted: false,
  audioThumbnail: MUSIC_ICON,
  isSongEnded: false,
  setIsSongEnded: jest.fn(),
  setIsAudioStarted: jest.fn(),
  setAudioThumbnail: jest.fn(),
};

describe('useAudioHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAudioContext.isAudioStarted = false;
    mockAudioContext.isSongEnded = false;
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AudioContext.Provider value={mockAudioContext}>
      {children}
    </AudioContext.Provider>
  );

  it('should initialize player instance correctly for non-adaptive media', async () => {
    const { result } = renderHook(
      () =>
        useAudioHandler({
          onTimeChange: mockOnTimeChange,
          onLoadedMetadata: mockOnLoadedMetadata,
          onAudioInitialize: mockOnAudioInitialize,
        }),
      { wrapper },
    );

    const mockAudioInfo = createMockTrackInfo('mp3');

    await act(async () => {
      await result.current.initializePlayerInstance(mockAudioInfo);
    });

    expect(AudioPlayer).toHaveBeenCalled();
    expect(result.current.mediaType).toBe(MediaFileTypes.NON_ADAPTIVE);
    expect(mockOnAudioInitialize).toHaveBeenCalledWith(true);
  });

  it('should handle adaptive media correctly', async () => {
    const { result } = renderHook(
      () =>
        useAudioHandler({
          onTimeChange: mockOnTimeChange,
          onLoadedMetadata: mockOnLoadedMetadata,
          onAudioInitialize: mockOnAudioInitialize,
        }),
      { wrapper },
    );

    act(() => {
      result.current.audioRef.current = new AudioPlayer();
    });

    const mockAdaptiveAudioInfo = createMockTrackInfo('dash');

    await result.current.initializePlayerInstance(mockAdaptiveAudioInfo);

    await waitFor(() => {
      expect(result.current.mediaType).toBe(MediaFileTypes.ADAPTIVE);
    });
  });

  it('should handle non-adaptive media correctly', async () => {
    const { result } = renderHook(
      () =>
        useAudioHandler({
          onTimeChange: mockOnTimeChange,
          onLoadedMetadata: mockOnLoadedMetadata,
          onAudioInitialize: mockOnAudioInitialize,
        }),
      { wrapper },
    );

    const mockNonAdaptiveAudioInfo = createMockTrackInfo('mp3');

    await act(async () => {
      await result.current.initializePlayerInstance(mockNonAdaptiveAudioInfo);
    });

    expect(result.current.mediaType).toBe(MediaFileTypes.NON_ADAPTIVE);
    expect(AudioPlayer).toHaveBeenCalled();
  });

  it('should set up media type correctly for various formats', () => {
    const { result } = renderHook(
      () =>
        useAudioHandler({
          onTimeChange: mockOnTimeChange,
          onLoadedMetadata: mockOnLoadedMetadata,
          onAudioInitialize: mockOnAudioInitialize,
        }),
      { wrapper },
    );

    const testCases = [
      { type: 'mp3', expected: MediaFileTypes.NON_ADAPTIVE },
      { type: 'mp4', expected: MediaFileTypes.NON_ADAPTIVE },
      { type: 'dash', expected: MediaFileTypes.ADAPTIVE },
      { type: 'hls', expected: MediaFileTypes.ADAPTIVE },
    ];

    testCases.forEach(({ type, expected }) => {
      const mockAudioInfo = createMockTrackInfo(type);
      act(() => {
        result.current.initializePlayerInstance(mockAudioInfo);
      });
      expect(result.current.mediaType).toBe(expected);
    });
  });

  it('should handle audio ending correctly', () => {
    const { result } = renderHook(
      () =>
        useAudioHandler({
          onTimeChange: mockOnTimeChange,
          onLoadedMetadata: mockOnLoadedMetadata,
          onAudioInitialize: mockOnAudioInitialize,
        }),
      { wrapper },
    );

    act(() => {
      result.current.audioRef.current = new AudioPlayer();
    });

    act(() => {
      result.current.endCurrentSong();
    });

    expect(result.current.audioRef.current?.currentTime).toBe(0);
    expect(mockAudioContext.setIsSongEnded).toHaveBeenCalledWith(true);
    expect(mockAudioContext.setIsAudioStarted).toHaveBeenCalledWith(false);
  });

  it('should clean up resources on unmount', async () => {
    const { result } = renderHook(
      () =>
        useAudioHandler({
          onTimeChange: mockOnTimeChange,
          onLoadedMetadata: mockOnLoadedMetadata,
          onAudioInitialize: mockOnAudioInitialize,
        }),
      { wrapper },
    );

    act(() => {
      result.current.audioRef.current = new AudioPlayer();
    });

    await act(async () => {
      await result.current.destroyAudioElements();
    });

    expect(mockAudioContext.setIsAudioStarted).toHaveBeenCalledWith(false);
    expect(result.current.audioRef.current).toBeNull();
  });

  it('should handle onNextPreviousClick correctly', async () => {
    const { result } = renderHook(
      () =>
        useAudioHandler({
          onTimeChange: mockOnTimeChange,
          onLoadedMetadata: mockOnLoadedMetadata,
          onAudioInitialize: mockOnAudioInitialize,
        }),
      { wrapper },
    );

    const mockAudioInfo = createMockTrackInfo('mp3');

    await act(async () => {
      await result.current.onNextPreviousClick(mockAudioInfo);
    });

    expect(AudioPlayer).toHaveBeenCalled();
    expect(result.current.mediaType).toBe(MediaFileTypes.NON_ADAPTIVE);
    expect(mockOnAudioInitialize).toHaveBeenCalledWith(true);
  });

  it('should set up event listeners correctly on initialization', async () => {
    const { result } = renderHook(
      () =>
        useAudioHandler({
          onTimeChange: mockOnTimeChange,
          onLoadedMetadata: mockOnLoadedMetadata,
          onAudioInitialize: mockOnAudioInitialize,
        }),
      { wrapper },
    );

    act(() => {
      result.current.audioRef.current = new AudioPlayer();
    });

    await act(async () => {
      await result.current.initializePlayerInstance(createMockTrackInfo('mp3'));
    });

    expect(
      result.current.audioRef.current?.addEventListener,
    ).toHaveBeenCalledWith('seeking', expect.any(Function));
    expect(
      result.current.audioRef.current?.addEventListener,
    ).toHaveBeenCalledWith('ended', expect.any(Function));
    expect(
      result.current.audioRef.current?.addEventListener,
    ).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('should handle error during adaptive player destruction', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const mockUnloadError = new Error('Unload error');
    const mockUnload = jest.fn().mockRejectedValueOnce(mockUnloadError);

    (ShakaPlayer as unknown as jest.Mock).mockImplementationOnce(() => ({
      load: jest.fn(),
      unload: mockUnload,
    }));

    (AudioPlayer as unknown as jest.Mock).mockImplementation(() => ({
      pause: jest.fn().mockResolvedValue(undefined),
      deinitialize: jest.fn().mockResolvedValue(undefined),
      removeEventListener: jest.fn(),
    }));

    const { result } = renderHook(() =>
      useAudioHandler({
        onTimeChange: mockOnTimeChange,
        onLoadedMetadata: mockOnLoadedMetadata,
        onAudioInitialize: mockOnAudioInitialize,
      }),
    );

    await act(async () => {
      result.current.audioRef.current = new AudioPlayer();
      result.current.player.current = new ShakaPlayer(
        result.current.audioRef.current,
        {
          secure: false,
          abrEnabled: false,
        },
      );
    });

    await act(async () => {
      await result.current.destroyAudioElements();
    });

    expect(mockUnload).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[AudioHandler.ts] - clearAudioInstance : Error unloading Shaka player:',
      mockUnloadError,
    );

    expect(result.current.player.current).toBeNull();

    expect(result.current.audioRef.current).toBeNull();
    consoleErrorSpy.mockRestore();
  });

  it('should initialize non-adaptive media using AudioPlayer', async () => {
    const { result } = renderHook(
      () =>
        useAudioHandler({
          onTimeChange: mockOnTimeChange,
          onLoadedMetadata: mockOnLoadedMetadata,
          onAudioInitialize: mockOnAudioInitialize,
        }),
      { wrapper },
    );

    const mockNonAdaptiveAudioInfo = createMockTrackInfo('mp3');

    await act(async () => {
      await result.current.initializePlayerInstance(mockNonAdaptiveAudioInfo);
    });

    expect(AudioPlayer).toHaveBeenCalled();
    expect(result.current.mediaType).toBe(MediaFileTypes.NON_ADAPTIVE);
  });
});
