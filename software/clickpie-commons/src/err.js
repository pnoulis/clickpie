class CustomError extends Error {
  constructor({ msg, cause, ...props } = {}) {
    super(msg, { cause });
    Object.assign(this, props);
  }
}

class ERR_INVALID_ARG_TYPE extends CustomError {
  constructor({ arg, type, status, statusText } = {}) {
    super({
      status,
      statusText,
      msg: `Invalid type: '${type}' for argument: '${arg}'`,
    });
  }
}

class ERR_INVALID_ARG_VALUE extends CustomError {
  constructor({ arg, value, status, statusText } = {}) {
    super({
      status,
      statusText,
      msg: `Invalid value: '${value}' for argument: '${arg}'`,
    });
  }
}

class ERR_MISSING_ARGS extends CustomError {
  constructor({ fname, status, statusText } = {}) {
    super({
      status,
      statusText,
      msg: `Missing arguments for function: '${fname}'`,
    });
  }
}

class ERR_HTTP_RESPONSE extends CustomError {
  constructor({ status, statusText, cause } = {}) {
    super({
      status,
      statusText,
      msg: `${status} ${statusText}`,
      cause,
    });
  }
}

export {
  CustomError,
  ERR_INVALID_ARG_TYPE,
  ERR_INVALID_ARG_VALUE,
  ERR_MISSING_ARGS,
  ERR_HTTP_RESPONSE,
};
