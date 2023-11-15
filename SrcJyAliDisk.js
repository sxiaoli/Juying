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
            share_pwd = it.replace(/提取码|:| |：/g, '');
        }
        if (it.indexOf("https://www.aliyundrive.com") > -1) {
            it = it.replace('https://www.aliyundrive.com/s/', '').replace('链接：', '');
            share_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[0] : it;
            folder_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[1] : "root";
        }
    })
    if(share_id && share_id!="undefined"){
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

function aliShare(share_id, folder_id, share_pwd) {
    addListener("onClose", $.toString((isback) => {
        if(getMyVar('聚影云盘自动返回')&&isback==1){
            back(false);
        }
    },MY_PARAMS.back||0));
    clearMyVar('聚影云盘自动返回');

    setPageTitle(typeof (MY_PARAMS) != "undefined" && MY_PARAMS.dirname ? MY_PARAMS.dirname : '云盘共享文件 | 聚影√');
    let d = [];
    let orders = {
        名称正序: 'name#ASC',
        名称倒序: 'name#DESC',
        时间正序: 'updated_at#ASC',
        时间倒序: 'updated_at#DESC',
        聚影排序: 'name#DESC'
    };
    let ordersKeys = Object.keys(orders);
    let orderskey = orders[getItem('aliyun_order', '聚影排序')];
    let style = getItem('aliyun_style', 'avatar');
    let filterFiles = [];
    d.push(
        {
            title: "换源",
            url: $().lazyRule((name,isback) => {
                if(isback>0){
                    putMyVar('聚影云盘自动返回','1');
                    back(false);
                    return 'hiker://empty';
                }else if(name){
                    return $('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
                        let d = [];
                        d.push({
                            title: name+"-云盘聚合搜索",
                            url: "hiker://empty",
                            col_type: "text_center_1",
                            extra: {
                                id: "listloading",
                                lineVisible: false
                            }
                        })
                        setResult(d);
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliDisk.js');
                        aliDiskSearch(name);
                    }, name)
                }else{
                    return 'hiker://empty';
                }
            },MY_PARAMS.name||"",MY_PARAMS.back||0),
            col_type: 'icon_5',
            img: 'https://hikerfans.com/tubiao/grey/175.png',
            extra: {
                longClick: [{
                    title: "上级目录",
                    js: $.toString((id) => {
                        if(!id){
                            return "toast://已经是根目录了";
                        }else{
                            let ids = id.split;
                            return $("").rule((ids) => {
                                require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliDisk.js');
                                aliShare(ids[0], ids[1], ids[2]);
                            },ids);
                        }
                    },MY_PARAMS.dirid||"")
                }]
            }
        },
        {
            title: "样式",
            url: $(['text_1', 'movie_2', 'card_pic_3', 'avatar']).select(() => {
                setItem('aliyun_style', input);
                refreshPage();
                return 'toast://已切换';
            }),
            col_type: 'icon_5',//icon_round_small_4
            img: 'https://hikerfans.com/tubiao/grey/168.png',
        },
        {
            title: "排序",
            url: $(ordersKeys, 2).select(() => {
                setItem('aliyun_order', input);
                refreshPage();
                return 'toast://切换成功';
            }),
            col_type: 'icon_5',
            img: 'https://hikerfans.com/tubiao/grey/76.png',
        },
        {
            title: getItem('aliyun_playMode', '智能'),
            url: $(['转码', '原画', '智能']).select(() => {
                setItem('aliyun_playMode', input);
                refreshPage();
                return 'toast://切换成功';
            }),
            col_type: 'icon_5',
            img: 'https://hikerfans.com/tubiao/grey/100.png',
        },
        {
            title: '转存',
            url: `smartdrive://share/browse?shareId=${share_id}&sharePwd=${share_pwd}`,
            col_type: 'icon_5',
            img: 'https://hikerfans.com/tubiao/grey/206.png',
        },
        {
            col_type: 'line_blank',
        }
    )
    try {
        if (!userinfo.refresh_token) {
            d = d.concat(myDiskMenu(0));
        } else {
            share_pwd = share_pwd || "";
            let get_sharetoken = getsharetoken(share_id,share_pwd);
            let sharetoken = get_sharetoken.share_token;
            let getbyshare = {};
            if(errorCode[get_sharetoken.code]){
                d.push({
                    title: errorCode[get_sharetoken.code],
                    url: 'hiker://empty',
                    col_type: "text_center_1"
                })
                setResult(d);
            }else{
                let postdata = { "share_id": share_id, "parent_file_id": folder_id || "root", "limit": 200, "image_thumbnail_process": "image/resize,w_256/format,jpeg", "image_url_process": "image/resize,w_1920/format,jpeg/interlace,1", "video_thumbnail_process": "video/snapshot,t_1000,f_jpg,ar_auto,w_256", "order_by": orderskey.split('#')[0], "order_direction": orderskey.split('#')[1] };
                headers['x-share-token'] = sharetoken;
                getbyshare = JSON.parse(request('https://api.aliyundrive.com/adrive/v2/file/list_by_share', { headers: headers, body: postdata, method: 'POST' }));
                if(errorCode[getbyshare.code]){
                    d.push({
                        title: errorCode[getbyshare.code],
                        url: 'hiker://empty',
                        col_type: "text_center_1"
                    })
                    setResult(d);
                }
            }
            let sharelist = getbyshare.items || [];
            sharelist = sharelist.filter(item => {
                return item.type == "file" || (item.type == "folder" && !folderFilter.test(item.name));
            })
            if(sharelist.length==1 && sharelist[0].type=="folder"){
                setPageTitle(typeof (MY_PARAMS) != "undefined" && MY_PARAMS.dirname ? MY_PARAMS.dirname : sharelist[0].name+' | 聚影√');
                java.lang.Thread.sleep(1000);
                aliShare(share_id, sharelist[0].file_id, share_pwd);
            }else if (sharelist.length > 0) {
                let sublist = sharelist.filter(item => {
                    return item.type == "file" && /srt|vtt|ass/.test(item.file_extension);
                })
                let dirlist = sharelist.filter((item) => {
                    return item.type == "folder";
                })
                dirlist.forEach((item) => {
                    d.push({
                        title: item.name,
                        img: "hiker://files/cache/src/文件夹.svg",//#noRecordHistory##noHistory#
                        url: $("hiker://empty##https://www.aliyundrive.com/s/" + item.share_id + (item.file_id ? "/folder/" + item.file_id : "")).rule((share_id, folder_id, share_pwd) => {
                            require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/', '/master/') + 'SrcJyAliDisk.js');
                            aliShare(share_id, folder_id, share_pwd);
                        }, item.share_id, item.file_id, share_pwd),
                        col_type: style,
                        extra: {
                            dirname: item.name,
                            name: MY_PARAMS.name||"",
                            back: 1,
                            dirid: share_id+'_'+folder_id+'_'+share_pwd
                        }
                    })
                })
                let filelist = sharelist.filter((item) => {
                    return item.type == "file";
                })
                if (getItem('aliyun_order', '聚影排序') == "聚影排序") {
                    filelist.sort(SortList);
                }
                let sharetoken =getsharetoken(share_id,share_pwd).share_token;
                filelist.forEach((item) => {
                    let filesize = item.size / 1024 / 1024;
                    let it = {
                        title: item.name,
                        img: item.thumbnail || (item.category == "video" ? "hiker://files/cache/src/影片.svg" : item.category == "audio" ? "hiker://files/cache/src/音乐.svg" : item.category == "image" ? "hiker://files/cache/src/图片.png" : "https://img.alicdn.com/imgextra/i1/O1CN01mhaPJ21R0UC8s9oik_!!6000000002049-2-tps-80-80.png"),
                        desc: filesize < 1024 ? filesize.toFixed(2) + 'MB' : (filesize / 1024).toFixed(2) + 'GB',
                        col_type: style,
                        extra: {
                            id: item.file_id
                        }
                    }
                    if (item.category == "video") {
                        let sub_file_id;
                        if (sublist.length == 1) {
                            sub_file_id = sublist[0].file_id;
                        } else if (sublist.length > 1) {
                            sublist.forEach(it => {
                                let subnmae = it.name.substring(0, it.name.lastIndexOf(".")).replace(/\.chs|\.eng/g, '');
                                if (item.name.includes(subnmae)) {
                                    sub_file_id = it.file_id;
                                }
                            })
                            if(!sub_file_id){
                                sub_file_id = sublist[0].file_id;
                            }
                        }
                        it.url = $("").lazyRule((share_id, file_id, sub_file_id, share_pwd) => {
                                require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/', '/master/') + 'SrcJyAliPublic.js');
                                let play = getAliUrl(share_id, file_id, share_pwd);
                                if (play.urls && play.urls.length>0) {
                                    let subtitle;
                                    if (sub_file_id) {
                                        subtitle = getSubtitle(share_id, sub_file_id, share_pwd);
                                        if (subtitle) {
                                            play['subtitle'] = subtitle;
                                        }
                                    }
                                    return JSON.stringify(play);
                                } else {
                                    return "toast://获取播放列表失败，看日志有无异常或token无效";
                                }
                            }, item.share_id, item.file_id, sub_file_id || "", share_pwd);
                        d.push(it);
                    }else{
                        it.url = $("").lazyRule((category,file_id,sharedata) => {
                                require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/', '/master/') + 'SrcJyAliPublic.js');
                                let file_url = aliOpenPlayUrl(file_id,sharedata);
                                if(category == "audio"){
                                    return file_url + ";{Referer@https://www.aliyundrive.com/}#isMusic=true#";
                                }else if(category == "image"){
                                    return file_url + "#.jpg@Referer=https://www.aliyundrive.com/";
                                }else{
                                    return "download://" + file_url + ";{Referer@https://www.aliyundrive.com/}";
                                }
                            }, item.category, item.file_id, {sharetoken:sharetoken,share_id:item.share_id});
                        filterFiles.push(it);
                    }
                })
                d.push({
                    title: "““””<small><font color=#f20c00>已开启文件过滤，仅显示视频文件</font></small>",
                    url: filterFiles.length==0?"hiker://empty":$("").lazyRule((filterFiles,folder_id) => {
                        addItemAfter("sharelist_"+folder_id, filterFiles);
                        updateItem("sharelist_"+folder_id,{title:"““””<small><font color=#f20c00>已显示全部文件</font></small>"});
                        return "toast://已加载全部文件";
                    }, filterFiles,folder_id),
                    col_type: "text_center_1",
                    extra: {
                        id: "sharelist_"+folder_id
                    }
                })
            } else {
                toast('列表为空');
            }
        }
    } catch (e) {
        log('获取共享文件列表失败>'+e.message);
        d.push({
            title: '该分享已失效或异常',
            url: 'hiker://empty',
            col_type: "text_center_1"
        })
        toast('该分享已失效或异常，可刷新确认下');
    }
    setResult(d);
    setLastChapterRule('js:' + $.toString(() => {
        setResult('');
    }))
}

function aliMyDisk(folder_id,nofilter) {
    let d = [];
    setPageTitle(typeof(MY_PARAMS)!="undefined" && MY_PARAMS.dirname ? MY_PARAMS.dirname : '我的云盘 | 聚影√');
    if(userinfo&&userinfo.user_id){
        if(folder_id=="root"){
            let mydisk = myDiskMenu(1) || [];
            d = d.concat(mydisk);
            d.push({
                title: getMyVar("selectDisk","1")=="1"?"““””<b>备份盘</b>":"备份盘",
                img: "https://hikerfans.com/tubiao/grey/167.png",
                url: $('#noLoading#').lazyRule(() => {
                    putMyVar("selectDisk","1");
                    refreshPage(false);
                    return "hiker://empty";
                }),
                col_type: 'icon_2'
            })
            d.push({
                title: getMyVar("selectDisk","1")=="2"?"““””<b>资源库</b>":"资源库",
                img: "https://hikerfans.com/tubiao/grey/126.png",
                url: $('#noLoading#').lazyRule(() => {
                    putMyVar("selectDisk","2");
                    refreshPage(false);
                    return "hiker://empty";
                }),
                col_type: 'icon_2'
            })
        }
        try{
            let drive_id = getMyVar("selectDisk","1")=="1"?userinfo.default_drive_id:userinfo2.resource_drive_id;
            let postdata = {"drive_id":drive_id,"parent_file_id":folder_id,"limit":200,"all":false,"url_expire_sec":14400,"image_thumbnail_process":"image/resize,w_256/format,avif","image_url_process":"image/resize,w_1920/format,avif","video_thumbnail_process":"video/snapshot,t_1000,f_jpg,ar_auto,w_256","fields":"*","order_by":"updated_at","order_direction":"DESC"};
            headers['authorization'] = 'Bearer ' + userinfo.access_token;
            headers['x-canary'] = "client=web,app=adrive,version=v4.1.1";
            let getfiles = request('https://api.aliyundrive.com/adrive/v3/file/list', { headers: headers, body: postdata, method: 'POST' });
            let myfilelist = JSON.parse(getfiles).items;
            if(myfilelist.length>0){
                let sublist = myfilelist.filter(item => {
                    return item.type == "file" && /srt|vtt|ass/.test(item.file_extension);
                })
                let dirlist = myfilelist.filter((item) => {
                    return item.type == "folder";
                })
                dirlist.forEach((item) => {
                    d.push({
                        title: item.name,
                        img: "hiker://files/cache/src/文件夹.svg",
                        url: $("hiker://empty").rule((folder_id,nofilter) => {
                            require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliDisk.js');
                            aliMyDisk(folder_id,nofilter);
                        }, item.file_id,nofilter),
                        col_type: 'avatar',
                        extra: {
                            dirname: item.name
                        }
                    })
                })
                let filelist = myfilelist.filter((item) => {
                    return item.type == "file";
                })
                filelist.sort(SortList);
                filelist.forEach((item) => {
                    if (item.category == "video" || nofilter) {
                        let sub_file_url;
                        if (sublist.length == 1) {
                            sub_file_url = sublist[0].url;
                        } else if (sublist.length > 1) {
                            sublist.forEach(it => {
                                let subnmae = it.name.substring(0, it.name.lastIndexOf(".")).replace(/\.chs|\.eng/g,'');
                                if (item.name.includes(subnmae)) {
                                    sub_file_url = it.url;
                                }
                            })
                        }
                        let filesize = item.size/1024/1024;
                        d.push({
                            title: item.name,
                            img: item.thumbnail? item.thumbnail+"@Referer=https://www.aliyundrive.com/" : item.category == "video" ? "hiker://files/cache/src/影片.svg" : item.category == "audio" ? "hiker://files/cache/src/音乐.svg" : item.category == "image" ? "hiker://files/cache/src/图片.png" : "https://img.alicdn.com/imgextra/i1/O1CN01mhaPJ21R0UC8s9oik_!!6000000002049-2-tps-80-80.png@Referer=",
                            url: $("hiker://empty##").lazyRule((category,file_id,file_url,sub_file_url) => {
                                if(category=="video"){
                                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliPublic.js');
                                    if(alitoken){
                                        let play = aliMyPlayUrl(file_id);
                                        if (play.urls) {
                                            if (sub_file_url) {
                                                let subfile = 'hiker://files/_cache/subtitles/'+file_id+'.srt';
                                                downloadFile(sub_file_url, subfile, {"referer": "https://www.aliyundrive.com/"})
                                                if(fetch(subfile)){
                                                    play['subtitle'] = getPath(subfile);
                                                }
                                            }
                                            return JSON.stringify(play);
                                        }else{
                                            return "toast://"+play.message;
                                        }
                                    }else{
                                        return "toast://未获取到阿里token";
                                    }
                                }else if(category == "audio"){
                                    return file_url + ";{Referer@https://www.aliyundrive.com/}#isMusic=true#";
                                }else if(category == "image"){
                                    return file_url + "#.jpg@Referer=https://www.aliyundrive.com/";
                                }else{
                                    return "download://" + file_url + ";{Referer@https://www.aliyundrive.com/}";
                                }
                            }, item.category, item.file_id, item.url||"", sub_file_url||""),
                            desc: filesize < 1024 ? filesize.toFixed(2) + 'MB' : (filesize/1024).toFixed(2) + 'GB',
                            col_type: 'avatar',
                            extra: {
                                id: item.file_id,
                                cls: "playlist " + item.category,
                                inheritTitle: false
                            }
                        })
                    }
                })
                if(!nofilter){
                    d.push({
                        title: "““””<small><font color=#f20c00>已开启文件过滤，仅显示视频文件</font></small>",
                        url: "hiker://empty",
                        col_type: "text_center_1"
                    })
                }
            }else{
                toast('列表为空');
            }
        }catch(e){
            log(e.message);
            toast('有异常查看日志，可刷新确认下');
        }
    }else{
        let mydisk = myDiskMenu(0) || [];
        d = d.concat(mydisk);
    }
    setResult(d);
    setLastChapterRule('js:' + $.toString(()=>{
        setResult('');
    }))
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
            let datalist2 = [];
            try{
                eval('let Parse = '+obj.parse);
                datalist2 = Parse(input);
            }catch(e){
                log(obj.name+'>一解出错>'+e.message);
            }
            
            let searchlist = [];
            datalist2.forEach(item => {
                let arr = {
                    title: item.title,
                    img: "hiker://files/cache/src/文件夹.svg",
                    col_type: "avatar",
                    desc: obj.name,
                    extra: {
                        cls: "loadlist",
                        name: input,
                        dirname: item.title,
                        back: 2
                    }
                };

                if(obj.name=="我的云盘"){
                    arr.url = $(item.url).rule((input) => {
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliDisk.js');
                        aliMyDisk(input);
                    },item.url);
                    searchlist.push(arr);
                }else{
                    if(arr.title.toLowerCase().includes(input.toLowerCase())){//搜索结果包含关键字才行
                        let alihome = "www.aliyundrive.com/s/";
                        let surl = item.url;
                        if(!surl.includes(alihome) && obj.erparse){
                            try{
                                eval('let Parse2 = ' + obj.erparse)
                                surl = Parse2(surl);
                            }catch(e){
                                log(obj.name+'>二解出错>'+e.message);
                            }
                        }
                        if(surl.indexOf(alihome)>-1){
                            arr.url = $(surl.split('\n')[0]).rule((input) => {
                                require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliDisk.js');
                                aliShareUrl(input);
                            },surl);
                            searchlist.push(arr);
                        }
                    }
                }
    /*
                else if(item.url.includes("https://www.aliyundrive.com/s/")){
                    arr.url = $(item.url.split('\n')[0]).rule((input) => {
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
                */
            })
            if(searchlist.length>0){
                hideLoading();
                /*
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
               */
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