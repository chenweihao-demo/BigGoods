class Tool {

	  //格式化日期
  formatDate(v, format) {
    //2020+03-09 01:20:12
    //format: yyyy+MM-dd h:mm:s

    //获取年份
    let year = v.getFullYear().toString();

    if (/(y+)/.test(format)) {

      //获取匹配的内容
      let c = RegExp.$1;

      format = format.replace(c, year.slice(year.length - c.length));
    }

    // 

    //构造对象
    let o = {
      M: v.getMonth() + 1,
      d: v.getDate(),
      h: v.getHours(),
      m: v.getMinutes(),
      s: v.getSeconds()
    };

    // 

    for (let k in o) {
      //使用动态正则
      let r = new RegExp(`(${k}{1,2})`);
      // 

      if (r.test(format)) {
        //获取组内容
        let c1 = RegExp.$1;
        // 

        //控制不足十补零
        let content = (o[k] >= 10 || c1.length == 1) ? o[k] : '0' + o[k];

        format = format.replace(c1, content);

        // 
      }

    }

    return format;

  }

}

export const tool = new Tool();