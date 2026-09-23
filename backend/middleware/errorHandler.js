// Catches any error that wasn't already handled inside a controller's try/catch
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err.stack);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong on the server',
  });
};

// Catches requests to routes that don't exist at all (404)
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };