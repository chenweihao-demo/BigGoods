//模型集合

//导入商家模型
const Business = require(__basename + '/db/model/business.js');

//导入邮箱验证码模型, 记录邮箱验证码
const Code = require(__basename + '/db/model/code.js');

//导入商品类型模型，保存商品类型数据
const Type = require(__basename + '/db/model/type.js');

//导入商品模型, 保存上传的商品数据
const Product = require(__basename + '/db/model/product.js');

// 导入用户模型
const User = require(__basename + '/db/model/user.js');

// 导入用户模型
const Order = require(__basename + '/db/model/order.js');

module.exports = {
    Business,
    Code,
    Type,
    Product,
    User,
    Order
}