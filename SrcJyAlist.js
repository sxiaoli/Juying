//本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
var Alistfile = "hiker://files/rules/Src/Juying/Alist.json";
var AlistData = fetch(Alistfile);
if (AlistData != "") {
  eval("var datalist=" + AlistData + ";");
} else {
  var datalist = [
    {
      "name": "小雅",
      "server": "http://alist.xiaoya.pro"
    },
    {
      "name": "杜比",
      "server": "https://dubi.tk"
    }
  ];
}
function gethtml(api,path,password) {
  try{
    log(api);
    path = path || "";
    password = password || "";
    let html = fetch(api, {body: {"path":"","password":""},method:'POST'});
    log(html);
    return html;
  }catch(e){
    return "";
  }
}
function getlist(data) {
  try{
    let list = data.filter(item => {
        return item.is_dir || /\.mp4|\.avi|\.mkv|\.rmvb|\.flv|\.mov|\.wmv|\.3gp|\.mp3|\.wma|\.wav/.test(item.name);
    })
    return list;
  }catch(e){
    return [];
  }
}

function yiji() {
  let d = [];
  datalist.forEach(item => {
    d.push({
      title: item.name,
      url: $('#noLoading#').lazyRule((item) => {
        putMyVar('Alistapi', item.server);
        refreshPage(false);
        return "hiker://empty";
      }, item),
      col_type: 'scroll_button',
    })
  })
  if (datalist.length > 0) {
    let listapi = getMyVar('Alistapi', datalist[0].server) + "/api/fs/list";
    try{
      let json = JSON.parse(gethtml(listapi,"",""));
      if(json.code==200){
        let list = getlist(json.data.content);
      }
    }catch(e){

    }
    

  }
  setResult(d);
}