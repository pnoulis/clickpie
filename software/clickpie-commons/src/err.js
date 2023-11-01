class CustomError extends Error {
  constructor({ msg, cause, ...props } = {}) {
    super(msg, { cause });
    Object.assign(this, props);
  }
}

class ERR_INVALID_ARG_TYPE extends CustomError {
  static code = 100;
  constructor(arg, type) {
    super({
      code: ERR_INVALID_ARG_TYPE.code,
      msg: `Invalid type: '${type}' for argument: '${arg}'`,
    });
  }
}

class ERR_INVALID_ARG_VALUE extends CustomError {
  static code = 101;
  constructor(arg, value) {
    super({
      code: ERR_INVALID_ARG_VALUE.code,
      msg: `Invalid value: '${value}' for argument: '${arg}'`,
    });
  }
}

class ERR_MISSING_ARGS extends CustomError {
  static code = 102;
  constructor(fname) {
    super({
      code: ERR_MISSING_ARGS.code,
      msg: `Missing arguments for function: '${fname}'`,
    });
  }
}

class ERR_HTTP_RESPONSE extends CustomError {
  static code = 103;
  constructor(req, res) {
    super({
      code: ERR_HTTP_RESPONSE.code,
      msg: `HTTP Error response: ${res.status} ${res.statusText} at '${req.path}'`,
      req,
      res,
    });
  }
}

export {
  ERR_INVALID_ARG_TYPE,
  ERR_INVALID_ARG_VALUE,
  ERR_MISSING_ARGS,
  ERR_HTTP_RESPONSE,
};
