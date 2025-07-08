// A wrapper for async route handlers to automatically catch errors and forward them to Express's built-in error handling middleware.
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
