//引入Ali公用文件
require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/', '/master/') + 'SrcJyAliPublic.js');
let folderFilter = new RegExp("优惠券|头像订阅|购买年超级会员|购买会员享8T|关注公众号|返佣金", "i");//文件夹过滤
let errorCode = {
    'ShareLink.Cancelled': '来晚啦，该分享已失效',
    'ShareLink.Forbidden': '违规资源已被封禁',
    'NotFound.ShareLink': '不存在该链接请核对',
    'AccessTokenInvalid': '访问令牌失效，请重新登陆或稍后再试',
    'ShareLinkTokenInvalid': '分享令牌失效',
    'ParamFlowException': '访问过于频繁，请稍后再试'
}

function aliShareUrl(input) {
    let li = input.split('\n');
    let share_id;
    let folder_id;
    let share_pwd
    li.forEach(it => {
        it = it.trim();
        if (it.indexOf("提取码") > -1) {
            share_pwd = it.replace('提取码: ', '');
        }
        if (it.indexOf("https://www.aliyundrive.com") > -1) {
            it = it.replace('https://www.aliyundrive.com/s/', '').replace('链接：', '');
            share_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[0] : it;
            folder_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[1] : "root";
        }
    })
    if(share_id && share_id!="undefined"){
        addListener("onClose", $.toString(() => {
            putMyVar('SrcJy$back','1');
        }));
        putMyVar('SrcJy$back','1');
        aliShare(share_id, folder_id, share_pwd);
    }else{
        back(false);
        toast("链接地址不正确");
    }
}

function myDiskMenu(islogin) {
    let setalitoken = $().lazyRule((alistfile, alistData) => {
        let alistconfig = alistData.config || {};
        let alitoken = alistconfig.alitoken;
        return $(alitoken || "", "refresh_token").input((alistfile, alistData, alistconfig) => {
            alistconfig.alitoken = input;
            alistData.config = alistconfig;
            writeFile(alistfile, JSON.stringify(alistData));
            clearMyVar('getalitoken');
            refreshPage(false);
            return "toast://已设置";
        }, alistfile, alistData, alistconfig)
    }, alistfile, alistData)

    let onlogin = [{
        title: userinfo.nick_name,
        url: setalitoken,
        img: userinfo.avatar,
        col_type: 'avatar'
    }, {
        col_type: "line"
    }];
    let nologin = [{
        title: "⚡登录获取token⚡",
        url: $("hiker://empty###noRecordHistory##noHistory#").rule(() => {
            let d = [];
            let url = 'https://auth.aliyundrive.com/v2/oauth/authorize?login_type=custom&response_type=code&redirect_uri=https%3A%2F%2Fwww.aliyundrive.com%2Fsign%2Fcallback&client_id=25dzX3vbYqktVxyX&state=%7B%22origin%22%3A%22*%22%7D#/login'
            let js = $.toString(() => {
                const tokenFunction = function () {
                    var token = JSON.parse(localStorage.getItem('token'))
                    if (token && token.user_id) {
                        let alistfile = "hiker://files/rules/Src/Juying/Alist.json";
                        if (fy_bridge_app.fetch(alistfile)) {
                            try{
                                eval("var alistData = " + fy_bridge_app.fetch(alistfile));
                            }catch(e){
                                var alistData = {};
                            }
                        } else {
                            var alistData = {};
                        }
                        let alistconfig = alistData.config || {};
                        alistconfig.alitoken = token.refresh_token;
                        fy_bridge_app.copy(alistconfig.alitoken);
                        fy_bridge_app.log(alistconfig.alitoken);
                        alistData.config = alistconfig;
                        fy_bridge_app.writeFile(alistfile, JSON.stringify(alistData));
                        localStorage.clear();
                        fy_bridge_app.back(true);
                        fy_bridge_app.toast('TOKEN获取成功，请勿泄漏！');
                        return;
                    } else {
                        token_timer();
                    }
                }
                var token_timer = function () {
                    setTimeout(tokenFunction, 500);
                }
                tokenFunction();
            })
            d.push({
                url: url,
                col_type: 'x5_webview_single',
                desc: '100%&&float',
                extra: {
                    canBack: true,
                    js: js,
                    urlInterceptor: $.toString(() => true)
                }
            })
            setResult(d);
        }),
        col_type: 'text_center_1'
    }, {
        title: "⭐手工填写token⭐",
        url: setalitoken,
        col_type: 'text_center_1'
    }]
    if (islogin) {
        return onlogin;
    } else {
        return nologin;
    }
}
function aliDiskSearch(input,data) {
    showLoading('搜索中，请稍后...');
    let datalist = [];
    if(data){
        datalist.push(data);
    }else{
        let filepath = "hiker://files/rules/Src/Juying/yundisk.json";
        let datafile = fetch(filepath);
        if(datafile != ""){
            try{
                eval("datalist=" + datafile+ ";");
            }catch(e){
                datalist = [];
            }
        }
    }
    let diskMark = storage0.getMyVar('diskMark') || {};
    let i = 0;
    let one = "";
    for (var k in diskMark) {
        i++;
        if (i == 1) { one = k }
    }
    if (i > 30) { delete diskMark[one]; }
    let task = function(obj) {
        try{
            eval('let Parse = '+obj.parse)
            let datalist2 = Parse(input) || [];
            let searchlist = [];
            datalist2.forEach(item => {
                let arr = {
                    title: item.title,
                    img: "hiker://files/cache/src/文件夹.svg",
                    col_type: "avatar",
                    extra: {
                        cls: "loadlist",
                        name: input,
                        dirname: item.title
                    }
                };

                let home = "https://www.aliyundrive.com/s/";
                if(obj.name=="我的云盘"){
                    arr.url = $(item.url).rule((input) => {
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliDisk.js');
                        aliMyDisk(input);
                    },item.url);
                }else if(item.url.includes(home)){
                    arr.url = $(item.url).rule((input) => {
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliDisk.js');
                        aliShareUrl(input);
                    },item.url);
                } else if (obj.erparse) {
                    arr.url = $("hiker://empty").lazyRule((url,erparse) => {
                        eval('let Parse = '+erparse)
                        let aurl = Parse(url);
                        if(aurl.indexOf('aliyundrive.com')>-1){
                            return $(aurl).rule((input) => {
                                require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliDisk.js');
                                aliShareUrl(input);
                            },aurl)
                        }else{
                            return "toast://二解云盘共享链接失败";
                        }
                    },item.url,obj.erparse);
                }
                searchlist.push(arr);
            })
            if(searchlist.length>0){
                hideLoading();
                searchlist.unshift({
                    title: obj.name + " 找到" + searchlist.length + "条 “" + input + "” 相关",
                    url: "hiker://empty",
                    col_type: "text_center_1",
                    extra: {
                        cls: "loadlist"
                    }
                });
                searchlist.unshift({
                    col_type: "line_blank",
                    extra: {
                        cls: "loadlist"
                    }
                });
                diskMark[input] = diskMark[input] || [];
                diskMark[input] = diskMark[input].concat(searchlist);
                addItemBefore('listloading', searchlist);
            }
        }catch(e){
            log(obj.name + '>' + e.message);
        }
        return 1;
    }
    let list = datalist.map((item)=>{
        return {
          func: task,
          param: item,
          id: item.name
        }
    });
    if(list.length>0){
        deleteItemByCls('loadlist');
        putMyVar('diskSearch', '1');
        be(list, {
            func: function(obj, id, error, taskResult) {
            },
            param: {
            }
        });
        storage0.putMyVar('diskMark',diskMark);
        clearMyVar('diskSearch');
        toast('搜索完成');
    }else{
        toast('无接口，无法搜索');
    }
    hideLoading();
}
eval(fetch('http://124.221.241.174:13000/src48597962/hkbak/raw/branch/main/SrcJyAliDisk.js'))
//evalPrivateJS('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')
//evalPrivateJS('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')