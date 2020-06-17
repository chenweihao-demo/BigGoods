//商家模型(数据表结构)
const Sequelize = require('sequelize');

let Model = Sequelize.Model;

//Business模型继承Model
class Business extends Model {}

//创建business数据表结构
Business.init({
  //id字段
  id: {
    //数据类型, INTEGER: 整型, UNSIGNED: 无符号
    type: Sequelize.INTEGER.UNSIGNED,

    //是否允许为null
    allowNull: false,

    //主键
    primaryKey: true,

    //自动递增
    autoIncrement: true,

    //备注
    comment: '表id'
  },

  userId: {
    type: Sequelize.STRING(30),
    allowNull: false,
    //默认值
    defaultValue: '',
    comment: '商家id'
  },

  //商家昵称
  nickname: {
    type: Sequelize.STRING(20),
    allowNull: false,
    //默认值
    defaultValue: '',
    comment: '商家昵称'
  },

  email: {
    type: Sequelize.STRING(50),
    allowNull: false,
    //默认值
    defaultValue: '',
    comment: '商家邮箱'
  },

  password: {
    type: Sequelize.STRING(32),
    allowNull: false,
    //默认值
    defaultValue: '',
    comment: '商家密码'
  },

  userImg: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'default.png',
    comment: '商家头像'
  },

  // 是否注销
  isDestroy: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment: '注销: 1, 未注销0'
  }

}, {
  //配置
  // 默认为类的名称，即在这种情况下为`Business`。 这将控制自动生成的`foreignKey`（外键）的名称和关联命名
  modelName: 'business',

  //是否添加时间戳属性 (updatedAt, createdAt)
  timestamps: true,

  //是否开启假删除
  //不实际删除数据库记录，而是设置一个新 deletedAt 属性，其值为当前日期
  paranoid: true,

  //自动设置字段为蛇型（以_方式命名）命名规则
  underscored: true,

  // 是否禁止修改表名
  // 默认情况下，sequelize 会自动将所有传递的模型名称转换为复数形式。
  freezeTableName: true,

  //定义表名
  tableName: 'business',

  //连接实例
  sequelize

})

//force: true, 如果存在该表，则先删除该表，再创建新表，否则直接创建新表
//force: false, 如果存在该表，则不创建新表，否则创建新表
Business.sync({force: false});


//导出模型
module.exports = Business;