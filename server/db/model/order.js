//商家模型(数据表结构)
const Sequelize = require('sequelize');

let Model = Sequelize.Model;

//Order模型继承Model
class Order extends Model {

}

//创建order数据表结构
Order.init({
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

    oredrId: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '订单号'
    },
    businessId: {
        type: Sequelize.STRING(30),
        allowNull: false,
        //默认值
        defaultValue: '',
        comment: '商家id'
    },
    userId: {
        type: Sequelize.STRING(30),
        allowNull: false,
        //默认值
        defaultValue: '',
        comment: '用户id'
    },

    pid: {
        type: Sequelize.STRING(30),
        allowNull: false,
        //默认值
        defaultValue: '',
        comment: '商品id'
    },

    count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '商品数量'
    },

    price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: '订单余额'
    },

    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
        comment: '订单状态: 1待支付 2待发货 3待收货 4订单完成 0订单关闭'
    },

    consignee:{
        type: Sequelize.STRING(20),
        allowNull: false,
        //默认值
        defaultValue: '',
        comment: '收货人'
    },

    consigneePhone:{
        type: Sequelize.STRING(11),
        allowNull: false,
        //默认值
        defaultValue: '',
        comment: '收货人手机号'
    },
    
    consigneeAddress:{
        type: Sequelize.STRING(20),
        allowNull: false,
        //默认值
        defaultValue: '',
        comment: '收货人地址'
    },

    paymentMethod:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        //默认值
        defaultValue: 0,
        comment: '支付方式：0未支付,1现金，2余额，3网银，4支付宝，5微信'
    },

    desc: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comment: '备注'
    }

}, {
    //配置
    // 默认为类的名称，即在这种情况下为`Order`。 这将控制自动生成的`foreignKey`（外键）的名称和关联命名
    modelName: 'order',

    //是否添加时间戳属性 (updatedAt, createdAt)
    timestamps: true,

    //是否开启假删除
    //不实际删除数据库记录，而是设置一个新 deletedAt 属性，其值为当前日期
    paranoid: false,

    //自动设置字段为蛇型（以_方式命名）命名规则
    underscored: true,

    //是否禁止修改表名
    //默认情况下，sequelize 会自动将所有传递的模型名称转换为复数形式。
    freezeTableName: true,

    //定义表名
    tableName: 'order',

    //连接实例
    sequelize

})

//force: true, 如果存在该表，则先删除该表，再创建新表，否则直接创建新表
//force: false, 如果存在该表，则不创建新表，否则创建新表
Order.sync({
    force: false
});

//导出模型
module.exports = Order;