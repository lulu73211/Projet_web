module.exports = {
  beforeRequest: (req, context, next) => {
    console.log('📤 Request:', {
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body,
    });
    return next();
  },

  afterResponse: (req, res, context, next) => {
    console.log('📥 Response:', {
      status: res.statusCode,
      headers: res.headers,
      body: res.body,
    });
    return next();
  },
};
