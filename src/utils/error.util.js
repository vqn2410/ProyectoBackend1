const VALIDATION_ERRORS = ['ValidationError', 'CastError'];

export function resolveError(error, fallbackMessage) {
  if (error.statusCode) {
    return { statusCode: error.statusCode, message: error.message };
  }

  if (VALIDATION_ERRORS.includes(error.name)) {
    return { statusCode: 400, message: error.message };
  }

  return { statusCode: 500, message: fallbackMessage };
}
