//连接mysql数据， ORM层
const Sequelize = require('sequelize');

//创建连接
module.exports = new Sequelize(config.databaseOptions.database, config.databaseOptions.user, config.databaseOptions.password, {

  //数据库地址
  host: config.databaseOptions.host,

  //连接数据库类型
  dialect: config.databaseOptions.dialect,

  //时区
  timezone: config.databaseOptions.timezone,

  //设置连接池
  pool: config.databaseOptions.pool
})