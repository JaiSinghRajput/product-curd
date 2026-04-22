import { AppError } from "../utils/error.js";

const validate = (schema, target = "body") => (req, res, next) => {
  const { error, value } = schema.validate(req[target], {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.reduce((acc, item) => {
      const key = item.path.join(".") || "field";
      acc[key] = item.message;
      return acc;
    }, {});

    return next(new AppError("Validation failed", 400, "VALIDATION_ERROR", details));
  }

  if (target === "query") {
    req.validatedQuery = value;
  } else {
    req[target] = value;
  }

  return next();
};

export default validate;
