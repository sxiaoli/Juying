//本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyPublic.js');//加载公共文件
//点播
function dianbo() {
    addListener("onClose", $.toString(() => {
        //clearMyVar('zsjiekou');
    }));
    let d = [];
    let datalist = getDatas('jk');
    let yxdatalist = datalist.filter(it=>{
        return !it.stop;
    });
    let indexSource = Juconfig['indexSource'] || '_';
    let sourceType = indexSource.split('_')[0];
    let sourceNmae = indexSource.split('_')[1];
    let index = yxdatalist.indexOf(yxdatalist.filter(d => d.type==sourceType && d.name==sourceNmae )[0]);
    let sourceData = yxdatalist[index] || {};
    let selectGroup = sourceData.group || sourceData.type;
    
    
    let groupNames = getJiekouGroups(yxdatalist);
    groupNames.forEach(it =>{
        let obj = {
            title: selectGroup==it?`““””<b><span style="color: #3399cc">`+it+`</span></b>`:it,
            url: $('#noLoading#').lazyRule((it) => {
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyPublic.js');
                let datalist = getDatas('jk');
                let yxdatalist = datalist.filter(it=>{
                    return !it.stop;
                });
                let jkdatalist = getGroupLists(yxdatalist, it);
                let sitenames = jkdatalist.map(it=>{
                    return it.name;
                })
                return $(sitenames, 2, "选择主页源").select((type, cfgfile, Juconfig) => {
                    Juconfig['indexSource'] = type+'_'+input;
                    writeFile(cfgfile, JSON.stringify(Juconfig));
                    refreshPage(true);
                    return 'toast://' + input;
                }, it, cfgfile, Juconfig)
            }, it),
            col_type: 'scroll_button'
        }
        
      /*
            obj.extra = {
                longClick: [{
                    title: "列表排序：" + getItem("sourceListSort", "update"),
                    js: $.toString(() => {
                        return $(["更新时间","接口名称"], 1).select(() => {
                            if(input=='接口名称'){
                                setItem("sourceListSort","name");
                            }else{
                                clearItem("sourceListSort");
                            }
                            refreshPage(false);
                        })
                    })
                }]
            }
        */
        
        d.push(obj);
    })
/*
    d.push({
        title: Juconfig['sitename'] || '选择主页源',
        url: $(['选择源'], 2).select((sitenames, cfgfile, Juconfig) => {
            if(input=='选择源'){
                return $(sitenames, 2).select((cfgfile, Juconfig) => {
                    Juconfig['sitename'] = input;
                    writeFile(cfgfile, JSON.stringify(Juconfig));
                    refreshPage(true);
                    return 'toast://选择主页源：' + input;
                }, cfgfile, Juconfig)
            }
        }, sitenames, cfgfile, Juconfig),
        desc: '管理',
        img: "https://hikerfans.com/tubiao/ke/31.png",
        col_type: "avatar"
    })
    */
    setResult(d);
}
//接口一级
function jiekouyiji() {
    addListener("onClose", $.toString(() => {
        clearMyVar('zsjiekou');
        clearMyVar('zsdatalist');
    }));
    clearMyVar('SrcJy$back');
    setPageTitle('接口独立展示');
    var d = [];
    var cfgfile = "hiker://files/rules/Src/Juying/config.json";
    var Juyingcfg=fetch(cfgfile);
    if(Juyingcfg != ""){
        eval("var JYconfig=" + Juyingcfg+ ";");
    }else{
        var JYconfig= {};
    }
    if(!storage0.getMyVar('zsjiekou')){
        var filepath = "hiker://files/rules/Src/Juying/jiekou.json";
        var datafile = fetch(filepath);
        if(datafile != ""){
            eval("var datalist=" + datafile+ ";");
        }else{
            var datalist = [];
        }
        storage0.putMyVar('zsdatalist',datalist);
        if(JYconfig.zsjiekou){
            var zslist = datalist.filter(item => {
                return item.name==JYconfig.zsjiekou.api_name;
            })
        }else{
            var zslist = [];
        }
        zslist = zslist.length>0?zslist:[{}];
        storage0.putMyVar('zsjiekou',zslist[0]);
    }
    let zsjiekou = storage0.getMyVar('zsjiekou',{});
    let api_name = zsjiekou.name||"";
    let api_type = zsjiekou.type||"";
    let api_url = zsjiekou.url||"";
    let api_ua = zsjiekou.ua||"MOBILE_UA";
    api_ua = api_ua=="MOBILE_UA"?MOBILE_UA:api_ua=="PC_UA"?PC_UA:api_ua;
    let xunmitimeout = JYconfig.xunmitimeout||5;
    let selectgroup = JYconfig.zsjiekou?JYconfig.zsjiekou.selectgroup||"":"";

    if(api_name){setPageTitle(api_name);}
    if(api_name&&api_type&&api_url){
        if (api_type=="v1") {
            let date = new Date();
            let mm = date.getMonth()+1;
            let dd = date.getDate();
            let key = (mm<10?"0"+mm:mm)+""+(dd<10?"0"+dd:dd);
            var url = api_url + '/detail?&key='+key+'&vod_id=';
            var typeurl = api_url + "/types";
            var listurl = api_url + '?key='+key+'&page=';
            var lists = "html.data.list";
        } else if (api_type=="app") {
            var url = api_url + 'video_detail?id=';
            var typeurl = api_url + "nav";
            var listurl = api_url + 'video?tid=@type_id&pg=';
            var lists = "html.list";
        } else if (api_type=="v2") {
            var url = api_url + 'video_detail?id=';
            var typeurl = api_url + "nav";
            var listurl = api_url + 'video?tid=@type_id&pg=';
            var lists = "html.data";
        } else if (api_type=="iptv") {
            var url = api_url + '?ac=detail&ids=';
            var typeurl = api_url + "?ac=flitter";
            var listurl = api_url + '?ac=list&page=';
            var lists = "html.data";
        } else if (api_type=="cms") {
            var url = api_url + '?ac=videolist&ids=';
            var typeurl = api_url + "?ac=list";
            var listurl = api_url + '?ac=videolist&pg=';
            var lists = "html.list";
        }  else if (api_type=="XBPQ") {
            var jsondata = zsjiekou.data;
            if(jsondata&&jsondata.ext){
                let apihtml = request(jsondata.ext, { headers: { 'User-Agent': api_ua }, timeout:xunmitimeout*1000 });
                try{
                    eval("var jkdata = " + apihtml);
                }catch(e){
                    var jkdata = {};
                }
                var url = jkdata["主页url"];
                var typeurl = jkdata["分类"];
                jkdata["分类url"] = /^http/.test(jkdata["分类url"])?jkdata["分类url"]:url + jkdata["分类url"];
                var listurl = jkdata["分类url"].replace(/class\/\{class\}|\{class\}|year\/\{year\}|\{year\}|area\/\{area\}|\{area\}|by\/\{by\}|\{by\}|\{act\}/g,'');
            }
        } else {
            log('api类型错误')
        }
    }
    
    if(MY_PAGE==1){
        let datalist = storage0.getMyVar('zsdatalist',[]);
        let grouplist = [];
        datalist.forEach(item=>{
            let groupname = item.group||item.type;
            if(/app|v1|v2|iptv|cms|XBPQ/.test(item.type)&&grouplist.indexOf(groupname)==-1&&item.group!="失败待处理"){
                grouplist.push(groupname);
            }
        })

        datalist = datalist.filter(item => {
            if(selectgroup&&grouplist.indexOf(selectgroup)>-1){
                return /app|v1|v2|iptv|cms|XBPQ/.test(item.type) && (item.group==selectgroup || !item.group&&item.type==selectgroup) && item.group!="失败待处理"
            }else{
                return /app|v1|v2|iptv|cms|XBPQ/.test(item.type) && item.group!="失败待处理";
            }
        })

        for (let i = 0; i < 9; i++) {
            d.push({
                col_type: "blank_block"
            })
        }
        
        d.push({
            title: selectgroup&&grouplist.indexOf(selectgroup)>-1?'👉'+selectgroup:'🆙选择分组',
            url: $(grouplist,2).select((cfgfile,JYconfig,selectgroup)=>{
                if(selectgroup!=input){
                    JYconfig['zsjiekou'].selectgroup = input;
                    writeFile(cfgfile, JSON.stringify(JYconfig));
                    refreshPage(true);
                }
                return "hiker://empty";
            },cfgfile,JYconfig,selectgroup),
            col_type: "scroll_button"
        });
        if(datalist.length>0){
            for(let i in datalist){
                if(api_url==datalist[i].url){
                    var Srczsjiekousousuodata = [];
                    Srczsjiekousousuodata.push(datalist[i]);
                }
                let zsdata = {api_name:datalist[i].name};
                if(selectgroup){
                    zsdata.selectgroup = selectgroup;
                }
                d.push({
                    title: api_url==datalist[i].url?'““””<b><span style="color:#3CB371">' + datalist[i].name + '</span></b>':datalist[i].name,
                    col_type: 'scroll_button',
                    url: $('#noLoading#').lazyRule((zsjiekou,cfgfile,JYconfig,jkdata) => {
                        clearMyVar('Srczsjiekou$type_id');
                        JYconfig['zsjiekou'] = zsjiekou;
                        writeFile(cfgfile, JSON.stringify(JYconfig));
                        storage0.putMyVar('zsjiekou',jkdata);
                        refreshPage(true);
                        return "hiker://empty";
                    }, zsdata,cfgfile,JYconfig,datalist[i]),
                    extra: {
                        longClick: [{
                        title: "删除接口",
                            js: $.toString((dataurl,filepath) => {
                                let datalist = storage0.getMyVar('zsdatalist',[]);
                                for(var i=0;i<datalist.length;i++){
                                    if(datalist[i].url==dataurl){
                                        datalist.splice(i,1);
                                        break;
                                    }
                                }
                                storage0.putMyVar('zsdatalist',datalist);
                                writeFile(filepath, JSON.stringify(datalist));

                                refreshPage(true);
                            }, datalist[i].url,filepath)
                        }]
                    }
                });
            }
            d.push({
                col_type: "blank_block"
            });
        }
        if(typeof(typeurl) != "undefined"){
            const Color = "#3399cc";
            try{
                if(api_type=="XBPQ"){
                    if(jkdata["分类"].indexOf('$')>-1){
                        let jktype = jkdata["分类"].split('#');
                        var typeclass = jktype.map((type)=>{
                            return {
                                "type_id": type.split('$')[1],
                                "type_pid": 0,
                                "type_name": type.split('$')[0]
                            }
                        })
                    }else if(jkdata["分类"].indexOf('&')>-1&&jkdata["分类值"]){
                        let jktypename = jkdata["分类"].split('&');
                        let jktypeid = jkdata["分类值"].split('&');
                        var typeclass = [];
                        for(let i in jktypeid){
                            typeclass.push({
                                "type_id": jktypeid[i],
                                "type_pid": 0,
                                "type_name": jktypename[i]
                            })
                        }
                    }
                }else{
                    let gethtml = request(typeurl, { headers: { 'User-Agent': api_ua }, timeout:xunmitimeout*1000 });
                    if (api_type=="v1") {
                        let typehtml = JSON.parse(gethtml);
                        let typelist = typehtml.data.list||typehtml.data.typelist;
                        var typeclass = typelist.map((list)=>{
                            return {
                                "type_id": list.type_id,
                                "type_pid": list.type_pid,
                                "type_name": list.type_name
                            }
                        })
                    } else if (/app|v2/.test(api_type)) {
                        let typehtml = JSON.parse(gethtml);
                        let typelist = typehtml.list||typehtml.data;
                        var typeclass = typelist.map((list)=>{
                            return {
                                "type_id": list.type_id,
                                "type_pid": 0,
                                "type_name": list.type_name
                            }
                        })
                    } else if (api_type=="iptv") {
                        let type_dict = {
                            comic: '动漫',
                            movie: '电影',
                            tvplay: '电视剧',
                            tvshow: '综艺',
                            movie_4k: '4k',
                            hanguoju: '韩剧',
                            oumeiju: '欧美剧',
                            tiyu: '体育'
                        };
                        let typehtml = JSON.parse(gethtml);
                        var typeclass = typehtml.map((list)=>{
                            if(type_dict[list]){
                                return {
                                    "type_id": list,
                                    "type_pid": 0,
                                    "type_name": type_dict[list]
                                }
                            }
                        })
                        typeclass = typeclass.filter(n => n);
                    } else if (api_type=="cms") {
                        if(/<\?xml/.test(gethtml)){
                            let typelist = pdfa(gethtml,'class&&ty');
                            var typeclass = typelist.map((list)=>{
                                return {
                                    "type_id": String(xpath(list,`//ty/@id`)).trim(),
                                    "type_pid": 0,
                                    "type_name": String(xpath(list,`//ty/text()`)).trim()
                                }
                            })
                        }else{
                            let typehtml = JSON.parse(gethtml);
                            var typeclass = typehtml.class;
                        }
                    } else {
                        log('api类型错误')
                    }
                }
            }catch(e){
                log(api_name+' 接口访问异常，请更换接口！获取分类失败>'+e.message);
                var typeclass = [];
            }

            if(typeclass&&typeclass.length>0){
                let type_pids = [];
                let type_ids = [];
                for(let i in typeclass){
                    if(type_pids.indexOf(typeclass[i].type_pid)==-1){type_pids.push(typeclass[i].type_pid)}
                    if(type_ids.indexOf(typeclass[i].type_id)==-1){type_ids.push(typeclass[i].type_id)}
                }
                if(type_pids.length > 0){
                    type_pids.sort((a, b) => {
                        return a - b
                    })
                };
                if(/v2|app|XBPQ/.test(api_type)&&!getMyVar('Srczsjiekou$type_id')){
                    putMyVar('Srczsjiekou$type_id',type_ids[0]);
                }
                for (var j in type_pids) {
                    for (var i in typeclass) {
                        if(typeclass[i].type_pid==type_pids[j]){
                            d.push({
                                title: getMyVar('Srczsjiekou$type_id')==typeclass[i].type_id?'““””<b><span style="color:' + Color + '">' + typeclass[i].type_name + '</span></b>':typeclass[i].type_name,
                                url: $('#noLoading#').lazyRule((type_id) => {
                                    putMyVar('Srczsjiekou$type_id', type_id);
                                    refreshPage(true);
                                    return "hiker://empty";
                                }, typeclass[i].type_id),
                                col_type: 'scroll_button'
                            });
                        }
                    }
                    d.push({
                        col_type: "blank_block"
                    });
                }
            }
            
            var searchurl = $('').lazyRule((data) => {
                if(data){
                    return $('hiker://empty#noRecordHistory##noHistory#').rule((name,data) => {
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyXunmi.js');
                        xunmi(name,data);
                    }, input,data);
                }else{
                    return 'toast://未找到接口数据'
                }
            },Srczsjiekousousuodata);
            d.push({
                title: "🔍",
                url: $.toString((searchurl) => {
                        return input + searchurl;
                    },searchurl),
                desc: "搜你想看的...",
                col_type: "input",
                extra: {
                    titleVisible: true
                }
            });
        }
    }
    if(typeof(listurl) != "undefined"){
        try{
            if(api_type=="XBPQ"){
                MY_URL = listurl.replace('{catePg}',jkdata["起始页"]?MY_PAGE>jkdata["起始页"]?MY_PAGE:"":MY_PAGE).replace('{cateId}',getMyVar('Srczsjiekou$type_id','1'));
            }else{
                MY_URL = listurl + MY_PAGE;
                if(api_type=="v2"||api_type=="app"){
                    MY_URL = MY_URL.replace('@type_id',getMyVar('Srczsjiekou$type_id','1'));
                }else if(getMyVar('Srczsjiekou$type_id')){
                    if (api_type=="v1") {
                        MY_URL = MY_URL + '&type=' + getMyVar('Srczsjiekou$type_id');
                    } else if (api_type=="iptv") {
                        MY_URL = MY_URL + '&class=' + getMyVar('Srczsjiekou$type_id');
                    } else {
                        MY_URL = MY_URL + '&t=' + getMyVar('Srczsjiekou$type_id');
                    }
                }
            }

            try {
                var gethtml = request(MY_URL, { headers: { 'User-Agent': api_ua }, timeout:xunmitimeout*1000 });
                if(api_type=="XBPQ"){
                    jkdata["二次截取"] = jkdata["二次截取"] || (gethtml.indexOf(`<ul class="stui-vodlist`)>-1?`<ul class="stui-vodlist&&</ul>`:gethtml.indexOf(`<ul class="myui-vodlist`)>-1?`<ul class="myui-vodlist&&</ul>`:"");
                    if(jkdata["二次截取"]){
                        gethtml = gethtml.split(jkdata["二次截取"].split('&&')[0])[1].split(jkdata["二次截取"].split('&&')[1])[0];
                    }
                    var list = [];
                    jkdata["链接"] = jkdata["链接"] || `href="&&"`;
                    jkdata["标题"] = jkdata["标题"] || `title="&&"`;
                    jkdata["数组"] = jkdata["数组"] || `<a &&</a>`;
                    let jklist = gethtml.match(new RegExp(jkdata["数组"].replace('&&','((?:.|[\r\n])*?)'), 'g'));
                    jklist.forEach(item=>{
                        if(!jkdata["图片"]){
                            if(item.indexOf('original=')>-1){
                                jkdata["图片"] = `original="&&"`;
                            }else if(item.indexOf('<img src=')>-1){
                                jkdata["图片"] = `<img src="&&"`;
                            }
                        };
                        if(jkdata["图片"]&&item.indexOf(jkdata["图片"].split("&&")[0])>-1){
                            let id = item.split(jkdata["链接"].split('&&')[0])[1].split(jkdata["链接"].split('&&')[1])[0];
                            let name = item.split(jkdata["标题"].split('&&')[0])[1].split(jkdata["标题"].split('&&')[1])[0];
                            let pic = "";
                            try{
                                pic = item.split(jkdata["图片"].split('&&')[0])[1].split(jkdata["图片"].split('&&')[1])[0];
                            }catch(e){}
                            let note = "";
                            try{
                                note = item.split(jkdata["副标题"].split('&&')[0])[1].split(jkdata["副标题"].split('&&')[1])[0];
                            }catch(e){}
                            let arr = {"vod_id":id,"vod_name":name,"vod_remarks":note,"vod_pic":pic};
                            list.push(arr);
                        }
                    })
                }else{
                    if(/cms/.test(api_type)&&/<\?xml/.test(gethtml)){
                        gethtml = gethtml.replace(/&lt;!\[CDATA\[|\]\]&gt;|<!\[CDATA\[|\]\]>/g,'');
                        let xmllist = [];
                        let videos = pdfa(gethtml,'list&&video');
                        for(let i in videos){
                            let id = String(xpath(videos[i],`//video/id/text()`)).trim();
                            let name = String(xpath(videos[i],`//video/name/text()`)).trim();
                            let pic = String(xpath(videos[i],`//video/pic/text()`)).trim();
                            let note = String(xpath(videos[i],`//video/note/text()`)).trim();
                            let arr = {"vod_id":id,"vod_name":name,"vod_remarks":note,"vod_pic":pic};
                            let plays = xpathArray(videos[i],`//video/dl/dd/text()`);
                            if(plays.length==1){
                                let play = plays[0];
                                if(play.indexOf('$')==-1&&play.indexOf('m3u8')>-1){
                                    arr['play'] = play.trim();
                                }
                            }
                            xmllist.push(arr)
                        }
                        var html = {"list":xmllist};
                    }else if(!/{|}/.test(gethtml)&&gethtml!=""){
                        var decfile = "hiker://files/rules/Src/Juying/appdec.js";
                        var Juyingdec=fetch(decfile);
                        if(Juyingdec != ""){
                            eval(Juyingdec);
                            var html = JSON.parse(xgdec(gethtml));
                        }
                    }else{
                        var html = JSON.parse(gethtml);
                    }
                    try{
                        var list = eval(lists)||html.list||html.data.list||html.data||[];
                    } catch (e) {
                        var list = html.list||html.data.list||html.data||[];
                    }
                }
            } catch (e) {
                var list = [];
            }
            
            let videolist = list.map((list)=>{
                let vodname = list.vod_name||list.title;
                if(vodname){
                    let vodpic = list.vod_pic||list.pic;
                    let voddesc = list.vod_remarks||list.state||"";
                    let vodurl = list.vod_id?url&&!/^http/.test(list.vod_id)?url+list.vod_id:list.vod_id:list.nextlink;
                    vodpic = vodpic?vodpic.replace('/img.php?url=','').replace('/tu.php?tu=','') + "@Referer=":"https://www.xawqxh.net/mxtheme/images/loading.gif";
                    if(/^\/upload|^upload/.test(vodpic)){
                        vodpic = vodurl.match(/http(s)?:\/\/(.*?)\//)[0] + vodpic;
                    }
                    if(/^\/\//.test(vodpic)){
                        vodpic = "https:" + vodpic;
                    }
                    if(api_type=='cms'&&list.vod_play_url){
                        if(list.vod_play_url.indexOf('$')==-1&&list.vod_play_url.indexOf('m3u8')>-1){
                            list['play'] = list.vod_play_url;
                        }
                    }
                    return {
                        title: vodname,
                        desc: voddesc,
                        pic_url: vodpic,
                        url: list.play?list.play:$("hiker://empty##" + vodurl + "#immersiveTheme#").rule((type,ua) => {
                                require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyXunmi.js');
                                xunmierji(type,ua)
                            },api_type, api_ua),
                        col_type: 'movie_3',
                        extra: {
                            pic: vodpic,
                            name: vodname,
                            title: vodname+'-'+api_name,
                            data: typeof(jsondata) =="undefined"|| jsondata ==null?{}:jsondata
                        }
                    }
                }
            });
            videolist = videolist.filter(n => n);
            d = d.concat(videolist);
        }catch(e){
            if(!list){
                d.push({
                    title: '接口访问异常，请更换接口！',
                    url: '#noHistory#hiker://empty',
                    col_type: 'text_center_1'
                }); 
            }
            log(api_name+' 接口访问异常，请更换接口！获取影片失败>'+e.message)
        }
    }else{
        d.push({
            title: '先选择一个接口，做为默认展示站！',
            url: 'hiker://empty',
            col_type: 'text_center_1'
        }); 
    }    
    setResult(d);
}

//一级
function yiji() {
    /*
    addListener("onClose", $.toString(() => {
        clearMyVar('isverifyA');
    }));
    */
    //require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyData.js');
    
    if(getMyVar('SrcJuying-VersionCheck', '0') == '0'){
        let programversion = 0;
        try{
            programversion = $.require("config").version || 0;
        }catch(e){}
        if(programversion<11){
            confirm({
                title: "温馨提示",
                content: "发现小程序新版本",
                confirm: $.toString(() => {
                    return "海阔视界首页频道规则【聚影√】￥home_rule_url￥http://hiker.nokia.press/hikerule/rulelist.json?id=6629"
                }),
                cancel: $.toString(() => {
                    return "toast://不升级小程序，功能不全或有异常"
                })
            });
        }
        Version();
        downloadicon();//下载图标
    }

    let d = [];
    if(MY_PAGE==1){
        require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyMenu.js');
        if($.type(storage0.getItem('buttonmenu1'))=="object"){
            setItem('buttonmenu1',storage0.getItem('buttonmenu1').name);
        }
        if($.type(storage0.getItem('buttonmenu2'))=="object"){
            setItem('buttonmenu2',storage0.getItem('buttonmenu2').name);
        }
        if($.type(storage0.getItem('buttonmenu3'))=="object"){
            setItem('buttonmenu3',storage0.getItem('buttonmenu3').name);
        }
        if($.type(storage0.getItem('buttonmenu4'))=="object"){
            setItem('buttonmenu4',storage0.getItem('buttonmenu4').name);
        }
        if($.type(storage0.getItem('buttonmenu5'))=="object"){
            setItem('buttonmenu5',storage0.getItem('buttonmenu5').name);
        }
        let btnmn1 = getItem('buttonmenu1',"管理");
        let btnmn2 = getItem('buttonmenu2',"收藏");
        let btnmn3 = getItem('buttonmenu3',"搜索");
        let btnmn4 = getItem('buttonmenu4',"点播");
        let btnmn5 = getItem('buttonmenu5',"直播");
        let yijimenu = [
            {
                title: btnmn1,
                url: buttonmenu[btnmn1].url,
                pic_url: buttonmenu[btnmn1].img,
                col_type: 'icon_5',
                extra: {
                    id: 'buttonmenu1',
                    longClick: [{
                        title: "♥️管理",
                        js: $.toString(() => {
                            return $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
                                require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJySet.js');
                                SRCSet();
                            })
                        })
                    },{
                        title: "💠扩展中心",
                        js: $.toString(() => {
                            return $('hiker://empty#noRecordHistory##noHistory#').rule(() => {
                                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJySet.js');
                                extension();
                            })
                        })
                    },{
                        title: "💡切换按钮",
                        js: $.toString((menubtns) => {
                            return $(menubtns,2,"自定义第1个按钮功能").select(() => {
                                setItem('buttonmenu1',input);
                                refreshPage(false);
                                return 'toast://第1按钮已设置为'+input;
                            })
                        },menubtns)
                    }]
                }
            },
            {
                title: btnmn2,
                url: buttonmenu[btnmn2].url,
                pic_url: buttonmenu[btnmn2].img,
                col_type: 'icon_5',
                extra: {
                    id: 'buttonmenu2',
                    longClick: [{
                        title: "💡切换按钮",
                        js: $.toString((menubtns) => {
                            return $(menubtns,2,"自定义第2个按钮功能").select(() => {
                                setItem('buttonmenu2',input);
                                refreshPage(false);
                                return 'toast://第2按钮已设置为'+input;
                            })
                        },menubtns)
                    }]
                }
            },
            {
                title: btnmn3,
                url: buttonmenu[btnmn3].url,
                pic_url: buttonmenu[btnmn3].img,
                col_type: 'icon_5',
                extra: {
                    id: 'buttonmenu3',
                    longClick: [{
                        title: "💡切换按钮",
                        js: $.toString((menubtns) => {
                            return $(menubtns,2,"自定义第3个按钮功能").select(() => {
                                setItem('buttonmenu3',input);
                                refreshPage(false);
                                return 'toast://第3按钮已设置为'+input;
                            })
                        },menubtns)
                    }]
                }
            },
            {
                title: btnmn4,
                url: buttonmenu[btnmn4].url,
                pic_url: buttonmenu[btnmn4].img,
                col_type: 'icon_5',
                extra: {
                    id: 'buttonmenu4',
                    longClick: [{
                        title: "💡切换按钮",
                        js: $.toString((menubtns) => {
                            return $(menubtns,2,"自定义第4个按钮功能").select(() => {
                                setItem('buttonmenu4',input);
                                refreshPage(false);
                                return 'toast://第4按钮已设置为'+input;
                            })
                        },menubtns)
                    }]
                }
            },
            {
                title: btnmn5,
                url: buttonmenu[btnmn5].url,
                pic_url: buttonmenu[btnmn5].img,
                col_type: 'icon_5',
                extra: {
                    id: 'buttonmenu5',
                    longClick: [{
                        title: "💡切换按钮",
                        js: $.toString((menubtns) => {
                            return $(menubtns,2,"自定义第5个按钮功能").select(() => {
                                setItem('buttonmenu5',input);
                                refreshPage(false);
                                return 'toast://第5按钮已设置为'+input;
                            })
                        },menubtns)
                    }]
                }
            },
            {
                col_type: 'line'
            }
        ]
        yijimenu.forEach((item)=>{
            d.push(item);
        })
        for (let i = 0; i < 10; i++) {
            d.push({
                col_type: "blank_block"
            })
        }
        if (typeof(setPreResult)!="undefined" && getMyVar('动态加载loading')!='1') {
            d.push({
                title: "",
                url: "hiker://empty",
                col_type: "text_1",
                extra: {
                    lineVisible: false,
                    cls: "loading_gif"
                }
            })
            d.push({
                pic_url: "https://hikerfans.com/weisyr/img/Loading1.gif",
                col_type: "pic_1_center",
                url: "hiker://empty",
                extra: {
                    cls: "loading_gif"
                }
            })
            setPreResult(d);
            d = [];
            putMyVar('动态加载loading', '1');
        }
    }

    //d = d.concat(getDataList('yiji'));
    deleteItemByCls("loading_gif");
    setResult(d);
}

//获取数据
function getDataList(type) {
    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyData.js');
    if(type=='yiji'){
        return JYyiji();
    }
}

//搜索页
function sousuo2(d, disk) {
    addListener("onClose", $.toString(() => {
        clearMyVar('sousuo$input');
    }));
    var searchurl = $('').lazyRule((disk) => {
        let recordlist = storage0.getItem('searchrecord') || [];
        if(recordlist.indexOf(input)>-1){
            recordlist = recordlist.filter((item) => item !== input);
        }
        recordlist.unshift(input);
        if(recordlist.length>20){
            recordlist.splice(recordlist.length-1,1);
        }
        storage0.setItem('searchrecord', recordlist);
        if(disk){
            return $('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
                setPageTitle('云盘搜索 | 聚影√');
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
            }, input)
        }else{
            if(getItem('searchmode')=="hiker" || (getItem('searchsource')=="360"||getItem('searchsource')=="搜狗")){
                return "hiker://search?rule=" + MY_RULE.title + "&s=" + input;
            }else{
                return $('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyXunmi.js');
                    xunmi(name);
                }, input);
            }
        }
    }, disk||0);
    var d = d || [];
    d.push({
        title: "🔍",
        url: $.toString((searchurl) => {
                if(/www\.aliyundrive\.com|www\.alipan\.com/.test(input)){
                    input = input.replace('http','\nhttp');
                    return $("hiker://empty#noRecordHistory##noHistory#").rule((input) => {
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAliDisk.js');
                        aliShareUrl(input);
                    },input);
                }else{
                    return input + searchurl;
                }
            },searchurl),
        desc: "搜你想看的...",
        col_type: "input",
        extra: {
            titleVisible: true,
            id: "searchinput",
            onChange: $.toString((searchurl) => {
                if(input.indexOf('https://www.aliyundrive.com/s/')==-1){
                    if(input.length==1){deleteItemByCls('suggest');}
                    if(input.length>1&&input!=getMyVar('sousuo$input', '')){
                        putMyVar('sousuo$input', input);
                        deleteItemByCls('suggest');
                        var html = request("https://movie.douban.com/j/subject_suggest?q=" + input, {timeout: 3000});
                        var list = JSON.parse(html)||[];
                        let suggest = list.map((sug)=>{
                            try {
                                let sugitem = {
                                    url: sug.title + searchurl,
                                    extra: {
                                        cls: 'suggest',
                                        longClick: [{
                                            title: "🔍快速聚搜",
                                            js: $.toString((name) => {
                                                return $('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
                                                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyXunmi.js');
                                                    xunmi(name);
                                                }, name)
                                            },sug.title)
                                        },{
                                            title: "🔎云盘搜索",
                                            js: $.toString((name) => {
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
                                            },sug.title)
                                        },{
                                            title: "🔎Alist搜索",
                                            js: $.toString((name) => {
                                                return $('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
                                                    let d = [];
                                                    d.push({
                                                        title: name+"-Alist聚合搜索",
                                                        url: "hiker://empty",
                                                        col_type: "text_center_1",
                                                        extra: {
                                                            id: "listloading",
                                                            lineVisible: false
                                                        }
                                                    })
                                                    setResult(d);
                                                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAlist.js');
                                                    alistSearch2(name,1);
                                                }, name)
                                            },sug.title)
                                        }]
                                    }
                                }
                                if(sug.img!=""){
                                    sugitem.title = sug.title;
                                    sugitem.img = sug.img + '@Referer=https://www.douban.com';
                                    sugitem.desc = "年份：" + sug.year;
                                    sugitem.col_type = "movie_1_vertical_pic";
                                }else{
                                    sugitem.title = "⚡" + sug.title;
                                    sugitem.col_type = "text_1";
                                }
                                return sugitem;
                            } catch (e) {  }
                        });
                        if(suggest.length>0){
                            addItemAfter('searchinput', suggest);
                        }
                    }
                }
            }, searchurl)
        }
    });
    if(!disk){
        d.push({
            title: "♻"+(getItem('searchsource')=="360"?"源：360":getItem('searchsource')=="sougou"?"源：搜狗":"源：接口"),
            url: $(["接口","sougou","360"],1,"选择搜索数据源").select(()=>{
                if(input!="接口"){
                    setItem('searchmode','hiker');
                }
                setItem('searchsource',input);
                refreshPage(false);
                return "toast://已切换"
            }),
            col_type: 'scroll_button'
        });
        d.push({
            title: "💡"+(getItem('searchmode')=="hiker"?"软件层搜索":"新窗口搜索"),
            url: $('#noLoading#').lazyRule(() => {
                if(getItem('searchmode')=='hiker'){
                    clearItem('searchmode');
                    setItem('searchsource',"接口");
                }else{
                    setItem('searchmode','hiker');
                }
                refreshPage(false);
                return "toast://已切换"
            }),
            col_type: 'scroll_button'
        });
    }
    d.push({
        title: "📑"+(getItem('searchrecordide')=='1'?"关闭":"开启")+"记录",
        url: $('#noLoading#').lazyRule(() => {
            if(getItem('searchrecordide')=='1'){
                clearItem('searchrecordide');
            }else{
                setItem('searchrecordide','1');
            }
            refreshPage(false);
            return "toast://已切换"
        }),
        col_type: 'scroll_button'
    });
    if(!disk){
        d.push({
            title: "🍭模式："+(typeof(getSearchMode)!="undefined"&&getSearchMode()==1?"精准":"默认"),
            url: $('#noLoading#').lazyRule(() => {
                try{
                    let sm;
                    if(getSearchMode()==1){
                        setSearchMode(0);
                        sm = "为默认模式，结果包含关键字";
                    }else{
                        setSearchMode(1);
                        sm = "为精准模式，结果等于关键字";
                    }
                    refreshPage(false);
                    return "toast://已切换"+sm;
                }catch(e){
                    return "toast://软件版本过低，不支持此方法";
                }
            }),
            col_type: 'scroll_button'
        });
    }
    d.push({
        col_type: "blank_block"
    });
    if(getItem('searchrecordide','0')=='1'){
        let recordlist = storage0.getItem('searchrecord') || [];
        if(recordlist.length>0){
            d.push({
                title: '🗑清空',
                url: $('#noLoading#').lazyRule(() => {
                    clearItem('searchrecord');
                    deleteItemByCls('searchrecord');
                    return "toast://已清空";
                }),
                col_type: 'scroll_button'
            });
        }else{
            d.push({
                title: '↻无记录',
                url: "hiker://empty",
                col_type: 'scroll_button'
            });
        }
        recordlist.forEach(item=>{
            d.push({
                title: item,
                url: item + searchurl,
                col_type: 'scroll_button',
                extra: {
                    cls: 'searchrecord',
                    longClick: [{
                        title: "🔍快速聚搜",
                        js: $.toString((name) => {
                            return $('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
                                require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyXunmi.js');
                                xunmi(name);
                            }, name)
                        },item)
                    },{
                        title: "🔎云盘搜索",
                        js: $.toString((name) => {
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
                        },item)
                    },{
                        title: "🔎Alist搜索",
                        js: $.toString((name) => {
                            return $('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
                                let d = [];
                                d.push({
                                    title: name+"-Alist聚合搜索",
                                    url: "hiker://empty",
                                    col_type: "text_center_1",
                                    extra: {
                                        id: "listloading",
                                        lineVisible: false
                                    }
                                })
                                setResult(d);
                                require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAlist.js');
                                alistSearch2(name,1);
                            }, name)
                        },item)
                    }]
                }
            });
        })
    }
    
    let resoufile = "hiker://files/rules/Src/Juying/resou.json";
    let Juyingresou = fetch(resoufile);
    let JYresou = {};
    if(Juyingresou != ""){
        try{
            eval("JYresou=" + Juyingresou+ ";");
            delete JYresou['resoulist'];
        }catch(e){
            log("加载热搜缓存出错>"+e.message);
        }
    }
    let resoudata = JYresou['data'] || {};
    let fenlei = ["电视剧","电影","动漫","综艺"];
    let fenleiid = ["3","2","5","4"];
    let ids = getMyVar("热榜分类","0");
    let list = resoudata[fenlei[ids]] || [];

    let nowtime = Date.now();
    let oldtime = JYresou.updatetime || 0;
    if(list.length==0 || nowtime > (oldtime+24*60*60*1000)){
        try{
            let html = request("https://api.web.360kan.com/v1/rank?cat="+fenleiid[ids], {timeout: 3000});
            list = JSON.parse(html).data;
            resoudata[fenlei[ids]] = list;
            JYresou['data'] = resoudata;
            JYresou['updatetime'] = nowtime;
            writeFile(resoufile, JSON.stringify(JYresou));
        }catch(e){
            log("获取热搜榜出错>"+e.message);
        }
    }
    d.push({
        title: '<span style="color:#ff6600"><b>\t热搜榜\t\t\t</b></span>',
        desc: '✅'+fenlei[ids],
        url: $(fenlei, 2, '选择热榜分类').select((fenlei) => {
            putMyVar("热榜分类",fenlei.indexOf(input));
            refreshPage(false);
            return "hiker://empty";
        },fenlei),
        pic_url: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3779990328,1416553241&fm=179&app=35&f=PNG?w=60&h=70&s=E7951B62A4639D153293A4E90300401B',
        col_type: 'avatar'
    });

    list.forEach((item,i)=>{
        d.push({
            title: (i=="0"?'““””<span style="color:#ff3300">' + (parseInt(i)+1).toString() + '</span>\t\t' + item.title:i=="1"?'““””<span style="color:#ff6600">' + (parseInt(i)+1).toString() + '</span>\t\t' + item.title:i=="2"?'““””<span style="color:#ff9900">' + (parseInt(i)+1).toString() + '</span>\t\t' + item.title:'““””<span>' + (parseInt(i)+1).toString() + '</span>\t\t' + item.title)+'\n<small><span style="color:#00ba99">'+item.comment+'</small>',
            url: item.title + searchurl,
            pic_url: item.cover,
            desc: item.description,
            col_type: "movie_1_vertical_pic",
            extra: {
                longClick: [{
                    title: "🔍快速聚搜",
                    js: $.toString((name) => {
                        return $('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
                            require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyXunmi.js');
                            xunmi(name);
                        }, name)
                    },item.title)
                },{
                    title: "🔎云盘搜索",
                    js: $.toString((name) => {
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
                    },item.title)
                },{
                    title: "🔎Alist搜索",
                    js: $.toString((name) => {
                        return $('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
                            let d = [];
                            d.push({
                                title: name+"-Alist聚合搜索",
                                url: "hiker://empty",
                                col_type: "text_center_1",
                                extra: {
                                    id: "listloading",
                                    lineVisible: false
                                }
                            })
                            setResult(d);
                            require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyAlist.js');
                            alistSearch2(name,1);
                        }, name)
                    },item.title)
                }]
            }
        });
    })

    setResult(d);
}

//搜索
function sousuo() {
    let sousuoms;
    let cfgfile = "hiker://files/rules/Src/Juying/config.json";
    let Juyingcfg=fetch(cfgfile);
    if(Juyingcfg != ""){
        try{
            eval("var JYconfig=" + Juyingcfg+ ";");
            sousuoms = JYconfig.sousuoms;
        }catch(e){
            var JYconfig= {};
            sousuoms==1
        }
    }

    if((!fileExist('hiker://files/rules/Src/Juying/jiekou.json')||sousuoms==1) && getItem('searchsource')!="接口"){
        require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyData.js');
        JYsousuo();
    }else{
        if(MY_PAGE==1){
            let name = MY_URL.split('##')[1];
            if(name == undefined){
                setResult([{
                    title: "当前小程序版本过低，需升级新版本",
                    url: "hiker://empty",
                    col_type: "text_1"
                }]);
            }else if(name.trim()){
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcJyXunmi.js');
                xunmi(name,false,true);
            }else{
                setResult([{
                    title: "搜索关键词不能为空",
                    url: "hiker://empty",
                    col_type: "text_1"
                }]);
            }
        }else{
            setResult([]);
        }
    }
}

//版本检测
function Version() {
    var nowVersion = getItem('Version', "7.9");//现在版本 
    var nowtime = Date.now();
    var oldtime = parseInt(getItem('VersionChecktime','0').replace('time',''));
    if (getMyVar('SrcJuying-VersionCheck', '0') == '0' && nowtime > (oldtime+12*60*60*1000)) {
        try {
            eval(request(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace('/Ju/','/master/') + 'SrcTmplVersion.js'))
            if (parseFloat(newVersion.SrcJuying) > parseFloat(nowVersion)) {
                //随版本更新依赖代理地址
                let delquirelist = ['https://cdn.staticaly.com/gh/', 'https://ghproxy.com/https://raw.githubusercontent.com/','https://ghps.cc/https://raw.githubusercontent.com/'];
                let requirelist = ['https://ghproxy.net/https://raw.githubusercontent.com/','https://gh.con.sh/https://raw.githubusercontent.com/','https://mirror.ghproxy.com/https://raw.githubusercontent.com/','https://github.jevons.vip/https://raw.githubusercontent.com/'];
                let requirefile = "hiker://files/rules/Src/require.json";
                if (fetch(requirefile)) {
                    try {
                        let requirelist_tmp;
                        eval("requirelist_tmp = " + fetch(requirefile) + ";");
                        requirelist.forEach(it=>{
                            let index = requirelist_tmp.indexOf(requirelist_tmp.filter(d=>d.url == it)[0]);
                            if(index==-1){
                                requirelist_tmp.push({'url': it, 'sort': 0});
                            }
                        })
                        for (let i = 0; i < requirelist_tmp.length; i++) {
                            if(delquirelist.includes(requirelist_tmp[i].url)){
                                requirelist_tmp.splice(i,1);
                                i = i - 1;
                            }
                        }
                        writeFile(requirefile, JSON.stringify(requirelist_tmp));
                    } catch (e) {
                        log("错误信息>" + e.toString() + " 错误行>" + e.lineNumber);
                    }
                }

                confirm({
                    title:'发现新版本，是否更新？', 
                    content:nowVersion+'=>'+newVersion.SrcJuying+'\n'+newVersion.SrcJuyingdesc[newVersion.SrcJuying], 
                    confirm: $.toString((nowtime,newVersion) => {
                        setItem('Version', newVersion);
                        setItem('VersionChecktime', nowtime+'time');
                        deleteCache();
                        delete config.依赖;
                        refreshPage();
                    },nowtime, newVersion.SrcJuying),
                    cancel:''
                })
                log('检测到新版本！\nV'+newVersion.SrcJuying+'版本》'+newVersion.SrcJuyingdesc[newVersion.SrcJuying]);
            }
            putMyVar('SrcJuying-Version', '-V'+newVersion.SrcJuying);
        } catch (e) { }
        putMyVar('SrcJuying-VersionCheck', '1');
    }else{
        putMyVar('SrcJuying-Version', '-V'+nowVersion);
    }
}
