const errorHandler = (err, req, res, next) => {
  // Always log the raw error for developers in the console
  console.error('[Error Details]:', err);

  const statusCode = err.statusCode || 500;
  
  // If we are in development, send the raw error back to the client for debugging
  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      rawError: err
    });
  }

  // In production, hide the raw error and send a generic safe message
  return res.status(statusCode).json({
    success: false,
    message: 'An unexpected internal server error occurred.'
  });
};

module.exports = errorHandler;
