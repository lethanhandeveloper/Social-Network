var connection = require('../connection');
  
function Todo() {
    this.create = function(field_data, res) {
        connection.acquire(function(err, con) {
          con.query('insert into account set ?', field_data, function(err, result) {
            con.release();
            if (err) {
              res.send(err.message);
            } else {
              res.send({status: 0, message: 'TODO created successfully'});
            }
          });
        });
      };    
}
module.exports = new Todo();