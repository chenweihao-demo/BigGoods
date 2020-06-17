//服务层

class API {

  //添加数据
  createData(modelName, o) {

    //modelName: 模型名称, string
    //o: 创建的数据, object
    return model[modelName].create(o);
  }

  //查询数据
  findData(modelName, condition, attrs) {
    //modelName: 模型名称, string
    //condition: 查询条件, object
    //attrs: 查询字段, array
    return model[modelName].findAll({
      where: condition,
      attributes: attrs
    })
  }

  //查询所有数据
  findDataByLimit(modelName, condition, attrs, orderBy, offset, limit) {
    //modelName: 模型名称, string
    //condition: 查询条件, object
    //attrs: 查询字段, array
    //orderBy: 排序, array ==> [排序的字段, 降序或者升序] ASC: 升序排序，DESC： 降序排序
    //offset: 偏移数据量, number
    //limit: 查询数据量, number
    return model[modelName].findAll({
      where: condition,
      attributes: attrs,
      order: [orderBy],
      offset,
      limit
    })
  }

  //更新数据
  updateData(modelName, values, condition) {
    //modelName: 模型名称, string
    //values: 需要设置的数据, object
    //condition: 条件, object
    return model[modelName].update(values, {
      where: condition
    });
  }

  //删除数据
  destroyData(modelName, condition) {
    //modelName: 模型名称, string
    //condition: 条件, object
    return model[modelName].destroy({
      where: condition
    });
  }

  //查询数据表的记录数
  count(modelName, condition) {
    //modelName:  模型名称, string
    //condition: 条件, object
    return model[modelName].count({
      where: condition
    });
  }

  //原始查询
  query(sql, replacements) {
    //sql: 原始sql语句,
    //replacements: sql语句预处理字段
    return sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });
  }
}

module.exports = new API();