// 路由控制层

//导入api(服务)层
let api = require(__basename + '/api/api.js');

//导入工具库
let utils = require(__basename + '/utils/utils.js');

//导入moment模块，用于处理日期时间
const moment = require('moment');

//导入文件系统模块
const fs = require('fs');

//导入sequelize模块
const Sequelize = require('sequelize');

//获取sequelize操作符模块
let Op = Sequelize.Op;

class RouterController {

    //验证邮箱验证码, 中间件
    validMailCode(req, res, next) {

        if (whileList.mailList.indexOf(req.url) > -1) {

            //获取当前时间减去邮箱验证的过期时间
            let currentTime = new Date().getTime() - 5 * 60 * 1000;

            //使用moment处理日期时间
            let date = moment(currentTime).format('YYYY-MM-DD HH:mm:ss');

            api.findData('Code', {
                email: req.body.email,
                code: req.body.code,
                createdAt: {
                    [Op.gte]: date
                }
            }).then(result => {
                // console.log('result ==> ', result);
                if (result.length == 0) {
                    res.send({
                        msg: '验证码已失效或者不正确',
                        code: 1013
                    });
                } else {
                    //验证码验证通过
                    next();
                }

            }).catch(err => {
                console.log('err ==> ', err);
                res.send({
                    msg: '邮箱验证码验证失败',
                    code: 1012
                });
            })
        } else {
            //不需要验证邮箱验证码
            next();
        }

    }

    //验证token,登录验证
    validToken(req, res, next) {
        // console.log('req.url ==> ', req.url);
        // console.log('req.headers ==> ', req.headers);
        // res.send('token')
        // return;
        let url = req.url.split('?')[0];

        if (whileList.tokenList.indexOf(url) > -1) {

            console.log('需要验证token');

            // console.log('req.headers ==> ', req.headers);
            let token = req.headers.cookie || req.headers.Authorization
            let cookies = utils.transformCookie(token);
            // console.log('cookies._abc ==> ', cookies._abc);

            //解析token
            utils.verifyString({
                value: cookies._abc,
                salt: config.tokenOptions.tokenSalt,
                fn: (err, decoded) => {
                    console.log('err ==> ', err);
                    if (err) {
                        //如果解析失败
                        res.send({
                            msg: '请先登录',
                            code: 1031
                        });
                    } else {
                        //token验证通过

                        console.log('token验证通过', decoded);

                        //将userId传递给下一个中间件或者路由的req请求对象
                        req.userId = decoded.data;
                        next();
                    }
                }
            })
        } else {
            //不需要验证token，直接通过
            console.log('不需要验证token，直接通过');
            next();
        }
    }
    //注册
    registerController(req, res) {
        //截取请求参数 req.body

        //查询该邮箱是否被注册
        api.findData('Business', {
            email: req.body.email
        }).then(result => {
            console.log('result ==> ', result);

            if (result.length == 0) {
                //该邮箱没有被注册

                //生成userId
                let userId = '_b' + new Date().getTime();

                //密码加盐加密
                let password = utils.encodeString(config.saltOptions.passwordSalt + req.body.password);

                //添加数据
                api.createData('Business', {
                    userId,
                    nickname: req.body.nickname,
                    password,
                    email: req.body.email
                }).then(result => {
                    res.send({
                        msg: '注册成功',
                        code: 1000
                    });
                }).catch(err => {
                    console.log('err ==> ', err);
                    res.send({
                        msg: '注册失败',
                        code: 1001
                    });
                })

            } else {
                res.send({
                    msg: '该邮箱已经被注册',
                    code: 1002
                });
            }

        }).catch(err => {
            res.send({
                msg: '注册失败',
                code: 1001
            });
        })

    }

    //发送邮箱验证码
    sendMailCode(req, res) {
        //存储验证码
        //取随机数后面六位数字
        let code = Math.random().toString().slice(-6);
        console.log('code ==> ', code);

        api.createData('Code', {
            email: req.body.email,
            code
        }).then(result => {
            res.send({
                msg: '验证码已发至您邮箱',
                code: 1010
            });
            return;
            // 开发测试阶段不发邮件
            utils.sendMail(req.body.email, code, (err, info) => {
                if (err) {
                    res.send({
                        msg: '发送邮箱验证码失败',
                        code: 1011
                    });
                } else {
                    console.log('info==>', info);
                    res.send({
                        msg: '验证码已发至您邮箱',
                        code: 1010
                    });
                }
            })
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '发送邮箱验证码失败',
                code: 1011
            })
        })


    }

    //登录
    login(req, res) {
        //根据邮箱查询
        api.findData('Business', {
            email: req.body.email,
            isDestroy: 0
        }, ['userId', 'password']).then(result => {

            //如果没有查询到数据
            if (result.length == 0) {
                res.send({
                    msg: '用户不存在',
                    code: 1022
                });
            } else {
                //如果存在用户，则需要验证密码是否正确
                let password = utils.encodeString(config.saltOptions.passwordSalt + req.body.password);
                // console.log('password ==> ', password);
                // console.log('result[0].dataValues.password ==> ', result[0].dataValues.password);

                if (password == result[0].dataValues.password) {
                    //如果密码正确
                    //生成token
                    let token = utils.signString({
                        value: result[0].dataValues.userId,
                        salt: config.tokenOptions.tokenSalt,
                        expires: config.tokenOptions.expires
                    });
                    res.send({
                        msg: '登录成功',
                        code: 1020,
                        token
                    });
                } else {
                    res.send({
                        msg: '邮箱或者密码不正确',
                        code: 1023
                    });
                }
            }
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '登录失败',
                code: 1021
            });
        })

    }

    //添加商品类型
    addType(req, res) {
        //生成类型id
        let typeId = '_ty' + new Date().getTime();
        console.log(req.body)
        api.findData('Type', {
            type: req.body.type,
            userId: req.userId
        }).then(result => {
            console.log('result 商品类型存在==> ', result);
            if (result.length == 0) {
                api.createData('Type', {
                    typeId,
                    type: req.body.type,
                    userId: req.userId
                }).then(result => {
                    console.log('result ==> ', result);
                    res.send({
                        msg: '添加商品类型成功',
                        code: 1040
                    });
                }).catch(err => {
                    console.log('err ==> ', err);
                    res.send({
                        msg: '添加商品类型失败',
                        code: 1041
                    });
                })
            } else {
                res.send({
                    msg: '商品类型已存在',
                    code: 1042
                });
            }

        }).catch(err => {

        })

    }

    //获取商品类型数据
    getTypeData(req, res) {
        api.findDataByLimit('Type', {
            userId: req.userId
        }, null, ['updatedAt', 'DESC'], Number(req.query.offset), Number(req.query.limit)).then(result => {
            res.send({
                msg: '查询商品类型成功',
                code: 1042,
                result
            });
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '查询商品类型失败',
                code: 1043
            });
        })
    }

    //搜索商品类型
    searchType(req, res) {
        api.findDataByLimit('Type', {
            userId: req.userId,
            type: {
                [Op.like]: `%${req.query.type}%`
            }
        }, null, ['updatedAt', 'DESC'], Number(req.query.offset), Number(req.query.limit)).then(result => {
            console.log('搜索商品类型result =>', result, result.length == 0)
            if (result.length != 0) {
                res.send({
                    msg: '搜索商品类型成功',
                    code: 1044,
                    result
                });
            } else {
                res.send({
                    msg: '搜索商品类型失败',
                    code: 1045
                });

            }

        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '搜索商品类型失败',
                code: 1045
            });
        })
    }

    //禁用和启用
    toggleTypeStatus(req, res) {
        api.updateData('Type', {
            isEnable: Number(req.body.status)
        }, {
            typeId: req.body.typeId
        }).then(result => {
            //  console.log('result ==> ', result);
            res.send({
                msg: '操作成功',
                code: 1046,
                result
            })
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '操作失败',
                code: 1047
            })
        })
    }

    //修改类型
    updateType(req, res) {
        api.updateData('Type', {
            type: req.body.type
        }, {
            typeId: req.body.typeId
        }).then(result => {
            res.send({
                msg: '更新商品类型成功',
                code: 1048,
                result
            });
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '更新商品类型失败',
                code: 1049
            });
        })
    }

    //获取数据表的记录数
    typeRows(req, res) {
        api.count('Type', {
            userId: req.userId
        }).then(result => {
            res.send({
                msg: '获取商品类型数量成功',
                code: 1050,
                result
            });
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '获取商品类型数量失败',
                code: 1051
            });
        })
    }

    //搜索商品类型数据量
    searchRows(req, res) {
        api.count('Type', {
            userId: req.userId,
            type: {
                [Op.like]: `%${req.query.type}%`
            }
        }).then(result => {
            res.send({
                msg: '搜索商品类型成功',
                code: 1044,
                result
            });
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '搜索商品类型失败',
                code: 1045
            });
        })
    }

    //获取用户信息
    getUserInfo(req, res) {
        api.findData('Business', {
            userId: req.userId,
            isDestroy: 0
        }, ['userId', 'nickname', 'email', 'userImg', 'isDestroy', 'createdAt']).then(result => {
            console.log('result ==> ', result);
            res.send({
                msg: '查询用户信息成功',
                code: 1060,
                result
            });
        }).catch(err => {
            console.log('err => ', err);
            res.send({
                msg: '查询用户信息失败',
                code: 1061
            });
        })
    }

    //获取商品类型
    proType(req, res) {
        api.findData('Type', {
            userId: req.userId,
            isEnable: 1
        }, ['typeId', 'type']).then(result => {
            res.send({
                msg: '获取商品类型成功',
                code: 1052,
                result
            });
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '获取商品类型失败',
                code: 1053
            });
        })
    }

    //发布商品
    postProduct(req, res) {
        // console.log('req.body ==> ', req.body);
        //先上传完毕图片，再将数据写入到数据库
        let imgs = ['img', 'imgDetail'];

        let count = 0;

        let isUpload = true;

        for (let i = 0; i < imgs.length; i++) {

            if (!isUpload) {
                return res.send({
                    msg: '发布商品失败',
                    code: 1071
                });
            }

            //获取图片base64
            let base64 = req.body[imgs[i]].replace(/ /g, '+');

            //将base64转换成buffer, 类似二进制文件
            let buffer = new Buffer(base64, 'base64');

            //生成文件名  xxx.png, xxx.jpeg
            let filename = Math.random().toString().slice(2) + '.' + req.body[imgs[i] + 'Type'];

            //使用文件系统图片base64写入服务器
            fs.writeFile(__basename + '/upload/' + filename, buffer, err => {
                if (err) {
                    //如果上传失败
                    isUpload = false;

                    if (i == imgs.length - 1) {
                        res.send({
                            msg: '发布商品失败',
                            code: 1071
                        });
                    }

                } else {

                    req.body[imgs[i]] = filename;

                    delete req.body[imgs[i] + 'Type'];

                    //上传图片成功
                    count++;

                    //已经上传完毕
                    if (count == imgs.length) {
                        //生成商品id
                        req.body.pid = '_pro' + new Date().getTime();

                        //关联用户
                        req.body.userId = req.userId;

                        // console.log('req.body ==> ', req.body);

                        //将数据写入数据库中
                        api.createData('Product', req.body).then(result => {
                            res.send({
                                msg: '发布商品成功',
                                code: 1070,
                                result
                            });
                        }).catch(err => {
                            res.send({
                                msg: '发布商品失败',
                                code: 1071
                            });
                        })
                    }
                }
            })

        }

    }


    //获取商品列表
    productList(req, res) {
        console.log('req.query ==> ', req.query);

        //查询条件
        let condition = {
            userId: req.userId,
            // offset: Number(req.query.offset),
            // limit: Number(req.query.limit)
        };

        //sql语句
        let sql = "SELECT `p`.`user_id`, `p`.`pid`, `p`.`name`, `p`.`status`,`p`.`count`, `p`.`created_at`, `p`.`updated_at`, `t`.`type` FROM `product` AS `p` INNER JOIN `type` AS `t` ON `p`.`type` = `t`.`type_id` AND `p`.`user_id` = :userId";

        //商品名称需要进模糊查询 %商品名称%
        if (req.query.name) {
            condition.name = '%' + req.query.name + '%';
            sql += " AND `p`.`name` LIKE :name";
        }

        if (req.query.date) {
            condition.date = req.query.date;
            sql += " AND `p`.`created_at` >= :date";
        }

        if (req.query.type) {
            condition.type = req.query.type;
            sql += " AND `p`.`type` = :type";
        }

        if (req.query.status !== undefined) {
            condition.status = req.query.status;
            sql += " AND `p`.`status` = :status";
        }

        //按照更新时间排序, 分页查询
        if (req.query.offset) {
            condition.offset = Number(req.query.offset);
            condition.limit = Number(req.query.limit);
            sql += " ORDER BY `p`.`updated_at` DESC LIMIT :offset, :limit";
        }



        console.log('condition ==> ', condition);

        console.log('sql ==> ', sql);

        api.query(sql, condition).then(result => {
            res.send({
                msg: '查询商品列表数据成功',
                code: 1080,
                result
            });
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '查询商品列表数据失败',
                code: 1081
            });
        })


    }

    //获取商品列表记录数量, 用于分页
    productListRows(req, res) {
        let condition = {
            userId: req.userId
        }

        //商品名称需要进模糊查询 %商品名称%
        if (req.query.name) {
            condition.name = {
                [Op.like]: '%' + req.query.name + '%'
            };
        }

        if (req.query.date) {
            condition.createdAt = {
                [Op.gte]: req.query.date
            };
        }

        if (req.query.type) {
            condition.type = req.query.type;
        }

        if (req.query.status !== undefined) {
            condition.status = req.query.status;
        }

        api.count('Product', condition).then(result => {
            res.send({
                msg: '获取商品列表记录数量成功',
                code: 1072,
                result
            });
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '获取商品列表记录数量失败',
                code: 1073
            });
        })

    }

    //上下架
    upDown(req, res) {
        api.updateData('Product', {
            status: req.body.status
        }, {
            pid: req.body.pid
        }).then(result => {
            res.send({
                msg: '更新商品状态成功',
                code: 1090,
                result
            });
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '更新商品状态失败',
                code: 1091
            });
        })
    }

    //删除商品
    removeProduct(req, res) {
        api.destroyData('Product', {
            pid: req.body.pid
        }).then(result => {
            res.send({
                msg: '删除商品列表的数据成功',
                code: 1074,
                result
            });
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '删除商品列表的数据失败',
                code: 1075
            });
        })
    }

    //根据商品pid获取商品数据
    productByPid(req, res) {
        api.findData('Product', {
            pid: req.query.pid
        }, ['name', 'type', 'price', 'count', 'img', 'imgDetail', 'status', 'desc']).then(result => {
            res.send({
                msg: '查询商品数据成功',
                code: 1076,
                result
            });
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '查询商品数据失败',
                code: 1077
            });
        })
    }

    //编辑商品
    editProduct(req, res) {

        //获取图片数据
        let imgs = [];
        if (req.body.img) {
            imgs.push('img');
        }

        if (req.body.imgDetail) {
            imgs.push('imgDetail');
        }

        console.log('imgs ==> ', imgs);

        //修改数据方法
        function updateProduct() {
            //获取商品pid
            let pid = req.body.pid;

            delete req.body.pid;

            api.updateData('Product', req.body, {
                pid
            }).then(result => {
                res.send({
                    msg: '修改商品数据成功',
                    code: 1078,
                    result
                });
            }).catch(err => {
                console.log('err ==> ', err);
                res.send({
                    msg: '修改商品数据失败',
                    code: 1079
                });
            })
        }


        //如果存在图片，则必须先上传完毕图片之后，再跟更改数据
        if (imgs.length > 0) {
            let count = 0;

            let isUpload = true;

            for (let i = 0; i < imgs.length; i++) {

                if (!isUpload) {
                    return res.send({
                        msg: '发布商品失败',
                        code: 1071
                    });
                }

                //获取图片base64
                let base64 = req.body[imgs[i]].replace(/ /g, '+');

                //将base64转换成buffer, 类似二进制文件
                let buffer = new Buffer(base64, 'base64');

                //生成文件名  xxx.png, xxx.jpeg
                let filename = Math.random().toString().slice(2) + '.' + req.body[imgs[i] + 'Type'];

                //使用文件系统图片base64写入服务器
                fs.writeFile(__basename + '/upload/' + filename, buffer, err => {
                    if (err) {
                        //如果上传失败
                        isUpload = false;

                        if (i == imgs.length - 1) {
                            res.send({
                                msg: '发布商品失败',
                                code: 1071
                            });
                        }

                    } else {

                        req.body[imgs[i]] = filename;

                        delete req.body[imgs[i] + 'Type'];

                        //上传图片成功
                        count++;

                        //已经上传完毕
                        if (count == imgs.length) {

                            //根据商品pid更改数据库数据
                            updateProduct();
                        }
                    }
                })

            }
        } else {
            //直接修改数据库数据
            // console.log('req.body ==> ', req.body);

            updateProduct();
        }
    }

    //编辑用户信息
    editUserInfo(req, res) {

        //获取图片数据
        let imgs = [];
        if (req.body.userImg) {
            imgs.push('userImg');
        }


        console.log('imgs ==> ', imgs);

        //修改数据方法
        function updateUserInfo() {
            //获取商品pid
            let userId = req.body.userId;

            delete req.body.userId;

            api.updateData('Business', req.body, {
                userId
            }).then(result => {
                res.send({
                    msg: '修改用户数据成功',
                    code: 1078,
                    result
                });
            }).catch(err => {
                // console.log('err ==> ', err);
                res.send({
                    msg: '修改用户数据失败',
                    code: 1079
                });
            })
        }


        //如果存在图片，则必须先上传完毕图片之后，再跟更改数据
        if (imgs.length > 0) {
            //获取图片base64
            let base64 = req.body[imgs[0]].replace(/ /g, '+');

            //将base64转换成buffer, 类似二进制文件
            let buffer = new Buffer(base64, 'base64');

            //生成文件名  xxx.png, xxx.jpeg
            let filename = Math.random().toString().slice(2) + '.' + req.body[imgs[0] + 'Type'];

            //使用文件系统图片base64写入服务器
            fs.writeFile(__basename + '/upload/' + filename, buffer, err => {
                if (err) {
                    //如果上传失败
                    isUpload = false;
                    res.send({
                        msg: '图片上传失败',
                        code: 1071
                    });

                } else {
                    req.body[imgs[0]] = filename;
                    delete req.body[imgs[0] + 'Type'];
                    //上传图片成功
                    //根据商品pid更改数据库数据
                    updateUserInfo();

                }
            })

        } else {
            //直接修改数据库数据
            // console.log('req.body ==> ', req.body);

            updateUserInfo();
        }
    }

    //获取订单列表
    ordersList(req, res) {
        console.log('获取商品列表req.query ==> ', req.query);

        /*
            SELECT `o`.`oredr_id`, `o`.`business_id`, `o`.`user_id`,`o`.`pid`, `o`.`count`, `o`.`price`, `o`.`status`, `o`.`consignee`,`o`.`consignee_phone`,`o`.`consignee_address`,`o`.`payment_method`, `o`.`desc`, `o`.`created_at`,`o`.`updated_at`,`u`.`nickname` FROM `order` AS `o` INNER JOIN `user` AS `u` ON `o`.`user_id` = `u`.`user_id` AND `o`.`business_id` = '_b1591104015758'
        */
        //查询条件
        let condition = {
            userId: req.userId,
            offset: Number(req.query.offset),
            limit: Number(req.query.limit)
        };

        //sql语句
        let sql = " SELECT `o`.`oredr_id`, `o`.`business_id`, `o`.`user_id`,`o`.`pid`, `o`.`count`, `o`.`price`, `o`.`status`, `o`.`consignee`,`o`.`consignee_phone`,`o`.`consignee_address`,`o`.`payment_method`, `o`.`desc`, `o`.`created_at`,`o`.`updated_at`,`u`.`nickname`,`p`.`name`,`p`.`img` FROM `order` AS `o` INNER JOIN `user` AS `u` ON `o`.`user_id` = `u`.`user_id` INNER JOIN `product` AS `p` ON `o`.`pid` = `p`.`pid` AND `o`.`business_id` = :userId";

        //需要进模糊查询 
        if (req.query.orderId) {
            condition.orderId = '%' + req.query.orderId + '%';
            sql += " AND `o`.`oredr_id` LIKE :OrderNo";
        }

        if (req.query.userName) {
            condition.userName = req.query.userName;
            sql += " AND `u`.`nickname` >= :userName";
        }


        if (req.query.status !== undefined) {
            condition.status = req.query.status;
            sql += " AND `o`.`status` = :status";
        }

        if (req.query.data) {
            condition.data = req.query.data;
            sql += " AND `o`.`created_at` = :orderDate";
        }

        //按照更新时间排序, 分页查询
        sql += " ORDER BY `o`.`updated_at` DESC LIMIT :offset, :limit";


        console.log('condition ==> ', condition);

        console.log('sql ==> ', sql);

        api.query(sql, condition).then(result => {
            console.log('查询订单列表', result)
            res.send({
                msg: '查询订单列表数据成功',
                code: 1100,
                result
            });
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '查询订单列表数据失败',
                code: 1101
            });
        })
    }


    //获取订单列表记录数量, 用于分页
    orderListRows(req, res) {
        console.log('记录数量', req.query);

        let condition = {
            businessId: req.userId
        }

        //商品名称需要进模糊查询 %商品名称%
        if (req.query.userName) {
            condition.nickname = req.query.userName;
        }

        if (req.query.date) {
            condition.createdAt = {
                [Op.gte]: req.query.date
            };
        }

        if (req.query.orderId) {
            condition.orderId = req.query.orderId;
        }

        if (req.query.status !== undefined) {
            condition.status = req.query.status;
        }
        api.count('Order', condition).then(result => {
            res.send({
                msg: '获取订单列表记录数量成功',
                code: 1102,
                result
            });
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '获取订单列表记录数量失败',
                code: 1103
            });
        })

    }

    // 获取订单状态数据
    orderStatus(req,res){
        //查询条件
        let condition = {
            userId: req.userId,
        };
        /*
            SELECT sum(CASE `o`.`status` WHEN 1 THEN 1 ELSE 0 END) AS 'status1',sum(CASE `o`.`status` WHEN 2 THEN 1 ELSE 0 END) AS 'status2',sum(CASE `o`.`status` WHEN 3 THEN 1 ELSE 0 END) AS 'status3',sum(CASE `o`.`status` WHEN 4 THEN 1 ELSE 0 END) AS 'status4',sum(CASE `o`.`status` WHEN 0 THEN 1 ELSE 0 END) AS 'status0' FROM `order` AS `o` WHERE `o`.`business_id` = :userId
        */
        let sql = "SELECT sum(CASE `o`.`status` WHEN 1 THEN 1 ELSE 0 END) AS 'status1',sum(CASE `o`.`status` WHEN 2 THEN 1 ELSE 0 END) AS 'status2',sum(CASE `o`.`status` WHEN 3 THEN 1 ELSE 0 END) AS 'status3',sum(CASE `o`.`status` WHEN 4 THEN 1 ELSE 0 END) AS 'status4',sum(CASE `o`.`status` WHEN 0 THEN 1 ELSE 0 END) AS 'status0' FROM `order` AS `o` WHERE `o`.`business_id` = :userId";

        api.query(sql, condition).then(result => {
            console.log('查询订单状态', result)
            res.send({
                msg: '查询订单状态数据成功',
                code: 1200,
                result
            });
        }).catch(err => {
            console.log('err ==> ', err);
            res.send({
                msg: '查询订单状态数据失败',
                code: 1201
            });
        })
    }
}
//导出
module.exports = new RouterController();