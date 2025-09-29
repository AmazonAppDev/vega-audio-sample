// jest.setup.js or setupTests.js

// Add spyOn here
jest.spyOn(console, 'error').mockImplementation(() => {});
export const consoleInfoSpy = jest
  .spyOn(console, 'info')
  .mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

// Add mocks of libraries here
jest.mock('@amazon-devices/react-native-vector-icons/MaterialIcons', () =>
  jest.requireMock('./tst/helperMocks/MockMaterialIcons'),
);

jest.mock('@amazon-devices/react-native-w3cmedia', () => ({
  __esModule: true,
  KeplerCaptionsView: ({
    onCaptionViewCreated,
  }: {
    onCaptionViewCreated: ((captionsViewHandle: string) => void) | undefined;
  }) => {
    onCaptionViewCreated?.('CaptionViewCreated');
    return null;
  },
}));

// requires a global navigator to be available to remove this mock
jest.mock('./src/w3cmedia/shakaplayer/ShakaPlayer', () => ({
  ShakaPlayer: jest.fn(),
}));

jest.mock('@amazon-devices/react-linear-gradient', () => 'LinearGradient');
