// Utility to handle errors from asynchronous route handlers.
const asyncHandler = (requestHandler) => {
  // Execute the route handler and forward errors to Express.
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export default asyncHandler;
