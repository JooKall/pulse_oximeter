const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.name, error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === "MongoServerError" && error.code === 11000) {
    return response.status(400).json({ error: "duplicate key error" });
  }

  if (error.name === "SyntaxError" && error.type === "entity.parse.failed") {
    return response.status(400).json({ error: "invalid JSON payload" });
  }

  // Default case – unhandled errors
  logger.error("Unhandled error:", error);
  return response.status(500).json({ error: "internal server error" });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
