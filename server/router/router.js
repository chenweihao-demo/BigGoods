// 路由层

// 导入路由控制器
const routerController = require(__basename + '/router_controller/routerController.js');

module.exports = app => {
    //验证邮箱验证码
    app.use(routerController.validMailCode);

    //验证token，验证登录
    app.use(routerController.validToken);

    //注册
    app.post('/register', routerController.registerController);

    //发送邮箱验证码
    app.post('/sendmail', routerController.sendMailCode);

    //登录
    app.post('/login', routerController.login);

    //添加商品类型
    app.post('/addType', routerController.addType);

    //获取商品类型
    app.get('/getType', routerController.getTypeData);

    //搜索商品类型
    app.get('/searchType', routerController.searchType);

    //禁用和启用
    app.post('/typeStatus', routerController.toggleTypeStatus);

    //修改商品类型
    app.post('/type', routerController.updateType);

    //获取数据表的记录数
    app.get('/typeRows', routerController.typeRows);

    //获取数据表的记录数
    app.get('/searchRows', routerController.searchRows);

    //获取用户信息
    app.get('/userInfo', routerController.getUserInfo);

    //获取商品类型
    app.get('/proType', routerController.proType);

    //发布商品
    app.post('/postProduct', routerController.postProduct);

    //获取商品列表数据
    app.get('/productList', routerController.productList);

    //获取商品列表记录数量
    app.get('/productListRows', routerController.productListRows);

    //上下架
    app.post('/status', routerController.upDown);

    //删除商品
    app.post('/removeProduct', routerController.removeProduct);

    //根据商品pid获取商品数据
    app.get('/productByPid', routerController.productByPid);

    //根据商品pid更改商品数据
    app.post('/editProduct', routerController.editProduct);

    //修改用户数据
    app.post('/editUserInfo', routerController.editUserInfo);

    //获取订单列表数据
    app.get('/ordersList', routerController.ordersList);

    //获取订单列表记录数量
    app.get('/orderListRows', routerController.orderListRows);

    // 获取订单状态数据
    app.get('/orderStatus',routerController.orderStatus);
}