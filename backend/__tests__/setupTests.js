jest.mock('winston', () => {
  const originalModule = jest.requireActual('winston');
  return {
    ...originalModule,
    info: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
    createLogger: jest.fn().mockReturnValue({
      debug: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
    }),
    transports: {
      Console: jest.fn(),
      File: jest.fn(),
    },
  };
});
