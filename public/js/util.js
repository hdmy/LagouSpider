var Util = {};

Util.fetchCookie = function (cookies, key) {
  if (Array.isArray(cookies)) {
    key = Array.isArray(key) ? key.join('|') : key;
    for (var cookie of cookies) {
      if (cookie.match(new RegExp(key))) {
        global.Cookie += cookie.split(';')[0] + ';';
      }
    }
    console.log(`the global cookie is ${global.Cookie}`);
  } else {
    throw new error('please sure the arg[0] is a array!');
  }
}

Util.formatFloat = function (arr, key) {
  if(arr instanceof Error){
    throw arr;
    return ;
  }
  if(!key) return arr;
  for (var item of arr) {
    item[key] = parseFloat(item[key].toFixed(2));    // 保持浮点数类型不变
  }
  return arr;
}

module.exports = Util;