// This file is a workaround for the react-refresh import error
// Export a mock implementation of react-refresh
export const runtime = {
  performReactRefresh: () => {},
  register: () => {},
  createSignatureFunctionForTransform: () => () => {}
};

export default runtime;