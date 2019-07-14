export function GetQueryString (name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
/**
 * 使用test方法实现模糊查询
 * @param  {Array}  list     原数组
 * @param  {String} keyWord  查询的关键词
 * @return {Array}           查询的结果
 */
export function fuzzyQuery(list, keyWord) {
    console.log(list)
     var reg =  new RegExp(keyWord);
     var arr = [];
     for (var i = 0; i < list.length; i++) {
       if (reg.test(list[i].name)) {
         arr.push(list[i]);
       }
     }
     return arr;
   }