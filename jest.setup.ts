global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    },
    getManifest: jest.fn(() => ({
      name: 'Test Extension',
      version: '1.0'
    }))
  },
  storage: {
    local: {
      get: jest.fn((_keys, callback) => callback({})),
      set: jest.fn((_items, callback) => callback())
    }
  }
} as unknown as typeof chrome;
