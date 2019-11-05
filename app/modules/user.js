var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = mongoose.model('User',new Schema({//利用模板的方式启动模板，并导出
    name:String,
    password:String,
    admin:Boolean
}))