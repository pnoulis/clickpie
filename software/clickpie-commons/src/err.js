class CustomError extends Error {
  constructor({ msg, cause, ...props } = {}) {
    super(msg, { cause });
    Object.assign(this, props);
  }
}

class ERR_INVALID_ARG_TYPE extends CustomError {
  constructor({ arg, type, code } = {}) {
    super({
      code,
      msg: `Invalid type: '${type}' for argument: '${arg}'`,
    });
  }
}

class ERR_INVALID_ARG_VALUE extends CustomError {
  constructor({ arg, value, code } = {}) {
    super({
      code,
      msg: `Invalid value: '${value}' for argument: '${arg}'`,
    });
  }
}

class ERR_MISSING_ARGS extends CustomError {
  constructor({ fname, code } = {}) {
    super({
      code,
      msg: `Missing arguments for function: '${fname}'`,
    });
  }
}

class ERR_HTTP_RESPONSE extends CustomError {
  constructor({ req, res, code } = {}) {
    super({
      code,
      msg: `${res.status} ${res.statusText}`,
      req,
      res: {
        code: res.status,
        text: res.statusText,
      },
    });
  }
}

export {
  ERR_INVALID_ARG_TYPE,
  ERR_INVALID_ARG_VALUE,
  ERR_MISSING_ARGS,
  ERR_HTTP_RESPONSE,
};
