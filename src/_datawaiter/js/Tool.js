//检查是否数据
var checkIsDouble = function (value) {
  var patrn = /^(-)?\d+(\.\d+)?$/;
  return !(patrn.exec(value) == null);
};


function number_format(number, decimals, dec_point, thousands_sep) {

  if (number == 0 || number == 0.00) {
    return 0;
  }
  /*
  * 参数说明：
  * number：要格式化的数字
  * decimals：保留几位小数
  * dec_point：小数点符号
  * thousands_sep：千分位符号
  * */
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {

      return parseFloat(n).toFixed(prec);
    };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}


exports.number_format = number_format;

//金额符号
function moneySymbol(money, bit) {
  if (!money) {
    return money;
  }
  if (bit !== undefined) {
    return number_format(money, bit, '.', ',');
  } else {
    let lastpointindex = (money + "").indexOf(".");
    if (lastpointindex > 0) {
      return number_format(money, (money + "").length - lastpointindex - 1, '.', ',');
    } else {
      return number_format(money, 0, '.', ',');
    }
  }
}

exports.moneySymbol = moneySymbol;


//通过属性来分组
var groupByAttribute = function (array, attribute) {
  let map = {};
  if (array) {
    for (let item of array) {
      let key = item[attribute];
      let group = map[key];
      if (group) {
        group.push(item);
      } else {
        let list = [item];
        map[key] = list;
      }
    }
  }

  return map;
};
exports.groupByAttribute = groupByAttribute;

//通过属性来
var groupByAttributeSingle = function (array, attribute='id') {
  let map = {};
  if (array) {
    for (let item of array) {
      let key = item[attribute];
      map[key] = item;
    }
  }

  return map;
};
exports.groupByAttributeSingle = groupByAttributeSingle;

/**
 *文字小数 或者 小数 保留小数位数
 * @param value 计算的值
 * @param bit 保留的位数 ，如果没有就保留2位
 * @param defalut 结果异常时，返回的值
 * @returns {number}
 */
var toFixed = function (value, bit, defalut) {


  if (value) {
    value = parseFloat(value);
    if (value !== 0) {
      bit = bit === undefined ? 2 : bit;
      return parseFloat(value.toFixed(bit));
    }
  }
  return defalut ? defalut : 0;
};
exports.toFixed = toFixed;


var sumValue = function (v1, v2, bit) {
  let value = (v1.toFixed(bit)) * 1 + (v2.toFixed(bit)) * 1;
  return value.toFixed(2)*1;
};
exports.sumValue = sumValue;


/**
 * 复制对象
 * @param po
 */
var copyPo = function (po) {
      if(po){
        return JSON.parse(JSON.stringify(po));
      }
};
exports.copyPo = copyPo;

/**
 * 替换数组中的对象
 * @param array
 * @param po
 * @param key
 * @returns {boolean}
 */
var replaceModel= function (array,po,key="id") {

  if(array && array.length >0 && po  && po[key] ){
      let id = po[key];
    for (let i = 0; i < array.length; i++) {
      let item = array[i];
      if(item[key] === id){
          array.splice(i,1,po);
          return true;
      }
    }
  }else{
    return false;
  }
};
exports.replaceModel = replaceModel;
