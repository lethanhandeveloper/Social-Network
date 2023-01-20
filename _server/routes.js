var user = require('./Models/user');
  
module.exports = {
  configure: function(app) {
    app.post('/todo/create', function(req, res) {
      user.create(req.body, res);
    });
  }
};