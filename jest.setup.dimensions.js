/**
 * Jest global setup - runs BEFORE any module loading.
 * Provides React Native Dimensions mock for TV platform.
 *
 * RN 0.83 doesn't auto-initialize Dimensions in Jest.
 * Multiple source files call Dimensions.get() at module load time.
 */

const RN = require('react-native');

// Initialize Dimensions with TV values before any source modules load
RN.Dimensions.set({
  window: { width: 1920, height: 1080, scale: 1, fontScale: 1 },
  screen: { width: 1920, height: 1080, scale: 1, fontScale: 1 },
});
