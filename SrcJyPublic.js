let datapath = "hiker://files/data/"+(MY_RULE._title || MY_RULE.title)+"/"; //数据文件路径
let rulepath = "hiker://files/rules/Src/Juying2/"; //规则文件路径
let cachepath = "hiker://files/_cache/Juying2/"; //缓存文件路径
let jkfile = rulepath + "jiekou.json";
let jxfile = rulepath + "jiexi.json";
let ypfile = rulepath + "yundisk.json";
let tvfile = rulepath + "live.txt";
let cfgfile = rulepath + "config.json";
let sortfile = rulepath + "jksort.json";
let codepath = config.依赖?config.依赖.match(/http(s)?:\/\/.*\//)[0]:module.modulePath.slice(0, module.modulePath.lastIndexOf("/")+1);
let gzip = $.require(codepath + "plugins/gzip.js");

if(fileExist(datapath + "jiexi.json")){
    if(!fileExist(jxfile)){
        writeFile(jxfile, fetch(datapath + "jiexi.json"));
    }
    deleteFile(datapath + "jiexi.json");
}
if(fileExist(datapath + "jiekou.json")){
    if(!fileExist(jkfile)){
        writeFile(jkfile, fetch(datapath + "jiekou.json"));
    }
    deleteFile(datapath + "jiekou.json");
}
if(fileExist(datapath + "yundisk.json")){
    if(!fileExist(ypfile)){
        writeFile(ypfile, fetch(datapath + "yundisk.json"));
    }
    deleteFile(datapath + "yundisk.json");
}
if(fileExist(datapath + "live.txt")){
    if(!fileExist(tvfile)){
        writeFile(tvfile, fetch(datapath + "live.txt"));
    }
    deleteFile(datapath + "live.txt");
}

let Juconfig= {};
let Jucfg=fetch(cfgfile);
if(Jucfg != ""){
    eval("Juconfig=" + Jucfg+ ";");
}

let timeout = 15000;
let homeSource = Juconfig['homeSource'] || {};
let sourceType = homeSource.type;
let sourceName = homeSource.name;
let sourceGroup = homeSource.group || homeSource.type;
let sourceUrl = homeSource.url;


function getFile(lx) {
    let file = lx=='jk'?jkfile:lx=='jx'?jxfile:lx=='yp'?ypfile:'';
    return file;
}
//获取所有接口或解析
function getDatas(lx, isyx) {
    let datalist = [];
    if(getItem('sourceMode','1')=='1'){
        let sourcefile = getFile(lx);
        let sourcedata = fetch(sourcefile);
        if(sourcedata != ""){
            try{
                eval("datalist=" + sourcedata+ ";");
            }catch(e){
                datalist = [];
            }
        }
    }else if(getItem('sourceMode','1')=='2'){
        if(Juconfig['dySource']){
            let boxSource = getBoxSource(Juconfig['dySource'], 2, {jk:lx=="jk"?1:0,jx:lx=="jx"?1:0});
            if(boxSource.message){
                toast(boxSource.message);
            }else{
                datalist = lx=="jk"?boxSource.jklist:boxSource.jxlist;
            }
        }
    }
    if (lx=="jx") {
        datalist.sort((a, b) => {
            let aa = a.sort||0;
            let bb = b.sort||0;
            return aa - bb;
        })
    }else if (getItem("sourceListSort") == "接口名称") {
        datalist = sortByPinyin(datalist);
    }else if (getItem("sourceListSort") == "使用频率") {
        let sort = {};
        if(fetch(sortfile)){
            eval("sort = " + fetch(sortfile));
        }
        datalist.forEach(it=>{
            it.sort = sort[it.url] || 0;
        })
        datalist.sort((a, b) => {
            return b.sort - a.sort
        })
    }else{
        datalist.reverse();
    }
    
    // 禁用的放到最后
    let withoutStop = datalist.filter(item => !item.stop);
    if(isyx){
        return withoutStop;
    }
    let withStop = datalist.filter(item => item.stop);
    // 合并数组
    let result = withoutStop.concat(withStop);
    return result;
}
// 较验box配置文件
function checkBoxUrl(input) {
    let html;
    try{
        if(input.startsWith('/')){input = "file://" + input}
        if(input.startsWith('http')){
            let tmpFile = cachepath + md5(input) + ".json";
            if(!fileExist(tmpFile)){
                showLoading('检测在线文件有效性');
                html = getContnet(input);
                //log(html);
                if(html){
                    writeFile(tmpFile, html);
                }
            }else{
                html = fetch(tmpFile);
            }
        }else if(input.startsWith('file')){
            html = fetch(input);
        }else{
            html = "";
        }
        if(html.includes('LuUPraez**')){
            html = base64Decode(html.split('LuUPraez**')[1]);
        }
        eval('let data = ' + html)
        if(data.urls){
            hideLoading();
            return {urls: data.urls};
        }
    } catch (e) {
        hideLoading();
        log("box配置文件检测失败>" + e.message + " 错误行#" + e.lineNumber); 
        return {
            message: "失败：链接文件无效或内容有错"
        };
    }
    hideLoading();
    return {html: html}
}

// 从box配置文件获取
function getBoxSource(input, mode, imports){
    //input配置文件地址，mode模式1为导入，2为订阅，3为较验
    let html,data;
    let checkUrl = checkBoxUrl(input);
    if(checkUrl.message){
        return checkUrl;
    }else if(checkUrl.urls){
        return {
            message: "失败：此为多仓配置文件"
        };
    }else if(checkUrl.html){
        html = checkUrl.html;
        eval('data = ' + html);
    }else{
        return {
            message: "异常：为啥会没有获取到html"
        };
    }
    
    if(mode==3){//订阅较验完成
        Juconfig['dySource'] = input;
        writeFile(cfgfile, JSON.stringify(Juconfig));
        let dyJkTmpFile = cachepath + md5(input) + ".json";
        writeFile(dyJkTmpFile, html);
        back();
        return {
            message: "已订阅，站源改为订阅模式下生效"
        };
    }

    let result = {};
    if(mode==1){
        showLoading('正在多线程获取数据中');
    }
    let jiekous = data.sites||[];
    if(imports.jk && jiekous.length>0){
        let urls= [];
        //多线程处理
        let task = function(obj) {
            let arr;
            if(/^csp_AppYs/.test(obj.api)){
                arr = { "name": obj.name, "url": obj.ext, "type": getapitype(obj.ext)};
            }else if((obj.type==1||obj.type==0)&&obj.api.indexOf('cms.nokia.press')==-1){
                arr = { "name": obj.name, "url": obj.api, "type": "cms"};
                if(obj.categories){
                    arr["categories"] = obj.categories;
                }
            }else{
                let extfile = obj.ext;
                if($.type(extfile)=='string'){
                    if(/^clan:/.test(extfile)){
                        extfile = extfile.replace("clan://TVBox/", input.match(/file.*\//)[0]);
                    }else if(extfile.startsWith('./')){
                        let urlpath = input.substr(0, input.lastIndexOf('/')+1);
                        extfile = extfile.replace("../", urlpath).replace(/\.\//g, urlpath);
                    }
                }

                if(/^csp_XBiubiu/.test(obj.api)){
                    arr = { "name": obj.name, "type": "biubiu", "ext": extfile};
                }else if(/^csp_XPath/.test(obj.api)){
                    arr = { "name": obj.name, "type": "XPath", "ext": extfile};
                }else if(obj.api=="csp_XBPQ"){
                    arr = { "name": obj.name, "type": "XBPQ", "ext": extfile};
                }else if(/^csp_XYQHiker/.test(obj.api)){
                    arr = { "name": obj.name, "type": "XYQ", "ext": extfile};
                }else if(/drpy2/.test(obj.api) && obj.type==3 && !obj.ext.includes('drpy.js')){
                    arr = { "name": obj.name.includes('|')?obj.name.split('|')[1].trim():obj.name, "type": "hipy_t3", "ext": extfile};
                    if(arr.name.includes('[搜]')){
                        arr['onlysearch'] = 1;
                    }
                }

                if(arr){
                    let urlfile;
                    let filepath = cachepath + 'libs_jk/' + arr.type;
                    if($.type(extfile)=='object'){
                        urlfile = filepath + '_' + arr.name + '.json';
                        writeFile(urlfile, JSON.stringify(extfile));
                    }else if(/^file/.test(extfile)){
                        if(mode==1){
                            urlfile = filepath + '_' + (extfile.includes('?')?obj.key:"")+extfile.split('?')[0].substr(extfile.split('?')[0].lastIndexOf('/')+1);
                            writeFile(urlfile, fetch(extfile.split("?")[0]));
                        }else{
                            urlfile = extfile.split('?')[0];
                        }
                    }else if(/^http/.test(extfile)){
                        urlfile = filepath + '_' + (extfile.includes('?')?obj.key:"")+extfile.split('?')[0].substr(extfile.split('?')[0].lastIndexOf('/')+1);
                        if(mode==1){
                            try{
                                let content = getContnet(extfile);
                                if (!content) {
                                    urlfile = '';
                                }else{
                                    if(arr.type=="XYQ" && !/分类片单标题/.test(content)){
                                        arr['onlysearch'] = 1;
                                    }
                                    if(arr.type=="XBPQ"){
                                        if(!/数组/.test(content)){
                                            urlfile = '';
                                        }else if(!/搜索url/.test(content)){
                                            obj.searchable = 0;
                                        }
                                    }
                                    if(urlfile){
                                        writeFile(urlfile, content);
                                    }
                                }
                            }catch(e){
                                log(obj.name + 'ext文件缓存失败>' + e.message);
                            }
                        }
                    }
                    if(urlfile){
                        arr['url'] = urlfile;
                    }
                }
            }
            if(arr && arr.url){
                arr['searchable'] = obj.searchable;
                return {data: arr};
            }
            return {};
        }
        
        let jiekoutask = jiekous.map((list)=>{
            return {
                func: task,
                param: list,
                id: list.key
            }
        });

        be(jiekoutask, {
            func: function(obj, id, error, taskResult) {  
                if(taskResult.data){
                    urls.push(taskResult.data);
                }
            },
            param: {
            }
        });
        result.jklist = urls;
    }
    let jiexis = data.parses||[];
    if(imports.jx && jiexis.length>0){
        let urls = jiexis.filter(it=>{
            return /^http/.test(it.url);
        })
        result.jxlist = urls;
    }
    hideLoading(); 
    return result;     
}
// 获取接口tags
function getJkTags(datas){
    datas = datas || getDatas('jk', 1);
    let tags = [];
    datas.forEach(it=>{
        let str = it.name;
        let regex = /\[(.*?)\]/;
        let match = str.match(regex);
        if (match && match[1].trim()) {
            let tag = '[' + match[1].trim() + ']';
            if(tags.indexOf(tag)==-1){
                tags.push(tag);
            }
        }
    })
    return tags;
}
//乱序方法
function shuffleArray(array) {
    array.sort(() => Math.random() - 0.5);
    return array;
}
//获取在线文件内容
function getContnet(url) {
    if(url.startsWith('file')){
        return fetch(url);
    }else if(!url.startsWith('http')){
        return '';
    }
    if(url.startsWith('https://raw.githubusercontent.com')){
        let proxys = $.require('ghproxy').getproxy();
        shuffleArray(proxys);
        for(let i=0;i<proxys.length;i++){
            let content = fetch(proxys[i]+url, {timeout:6000});
            if (content && !content.trim().startsWith('<!DOCTYPE html>') && !content.startsWith('<html>') && !/502 Bad Gateway/.test(content)) {
                return content;
            }
        }
    }
    let headers = { 'User-Agent': MOBILE_UA };
    if(!url.endsWith('.json') && !url.endsWith('.js') && !url.endsWith('.txt') && !url.endsWith('.m3u') && !url.endsWith('.m3u8')){
        headers['User-Agent'] = 'okhttp/4.12.0';
    }
    return fetch(url, {headers: headers, timeout:20000});
}
//获取分组接口列表
function getGroupLists(datas, k) {
    k = k=="全部"?"":k;
    datas = datas.filter(it=>{
        let group = it.group||it.type;
        return !k || (k==group);
    })

    return datas;
}
//获取搜索接口列表
function getSearchLists(group) {
    //group为true则取指定分组接口，为false时先取优选，没有则取前50
    let datalist = getDatas('jk', 1).filter(it=>{
        return it.searchable!=0;
    });
    if (getItem("sourceListSort") != "使用频率") {
        let sort = {};
        if(fetch(sortfile)){
            eval("sort = " + fetch(sortfile));
        }
        datalist.forEach(it=>{
            it.sort = sort[it.url] || 0;
        })
        datalist.sort((a, b) => {
            return b.sort - a.sort
        })
    }
    if(group){
        return datalist.filter(it=>{
            return group==(it.group||it.type);
        });
    }else{
        let filter = getItem('主页搜索接口范围', '');
        if(filter){
            datalist = datalist.filter(it=>{
                return filter.includes('[') ? it.name.includes(filter) : filter==(it.group||it.type);
            })
        }
        return datalist;
    }
}
//获取接口分组名arry
function getJiekouGroups(datas) {
    let groupNams = [];
    datas.forEach(it => {
        let group = it.group||it.type;
        if (groupNams.indexOf(group)==-1){
            groupNams.push(group);
        }
    })
    return groupNams;
}
//删除统一入口
function deleteData(lx, data){
    let sourcefile = getFile(lx);
    let sourcedata = fetch(sourcefile);
    eval("let datalist=" + sourcedata + ";");
    let dellist= [];
    if(!data){
        dellist = Object.assign(dellist, datalist);
    }else if($.type(data)=='object'){
        dellist.push(data);
    }else if($.type(data)=='array'){
        dellist = data;
    }

    dellist.forEach(it => {
        if(lx=='jk' && it.url.includes(datapath)){
            deleteFile(it.url);
        }
        let index = datalist.indexOf(datalist.filter(d => it.url==d.url )[0]);
        datalist.splice(index, 1);
    })

    writeFile(sourcefile, JSON.stringify(datalist));
    if(lx=='jk'){
        clearMyVar('SrcJu_searchMark');
    }
    clearMyVar('SrcJu_duoselect');
}
// 接口/解析处理公共方法
function dataHandle(lx, data, input) {
    let sourcefile = getFile(lx);
    let sourcedata = fetch(sourcefile);
    eval("let datalist=" + sourcedata + ";");

    let waitlist= [];
    if($.type(data)=='object'){
        waitlist.push(data);
    }else if($.type(data)=='array'){
        waitlist = data;
    }
    
    waitlist.forEach(it => {
        let index = datalist.findIndex(item => item.url === it.url);
        if(lx=="jx" && input=="重置排序"){
            datalist[index].sort = 0;
        }else if(input == "禁用"){
            datalist[index].stop = 1;
        }else if(input == "启用"){
            delete datalist[index].stop;
        }else if(lx=="jx" && input == "置顶"){
            const [target] = datalist.splice(index, 1);
            datalist.unshift(target);
        }
    })
    writeFile(sourcefile, JSON.stringify(datalist));
    if(lx='jk'){
        clearMyVar('SrcJu_searchMark');
    }
    clearMyVar('SrcJu_duoselect');
    return input + '：已处理' + waitlist.length + '个';
}

// 设置接口顺序
function setJkSort(data, k) {
    let waitlist= [];
    if($.type(data)=='string'){
        waitlist.push(data);
    }else if($.type(data)=='array'){
        waitlist = data;
    }
    let sort = {};
    if(fetch(sortfile)){
        eval("sort = " + fetch(sortfile));
    }
    waitlist.forEach(it=>{
        sort[it] = sort[it] || 0;
        if(k){
             sort[it] = sort[it] + 1;
        }else{
             sort[it] = sort[it] - 1;
        }
    })
    
    writeFile(sortfile, JSON.stringify(sort));
}
// 清理接口排序
function clearJkSort() {
    let datalist = getDatas("jk");
    let sort = {};
    if(fetch(sortfile)){
        eval("sort = " + fetch(sortfile));
    }
    Object.keys(sort).forEach(it=>{
        if(!datalist.some(item => item.url==it)){
            delete sort[it];
        }
    })
    writeFile(sortfile, JSON.stringify(sort));
}
// 读取目录路径下文件输入数组
function readDir(path) {
    let names = [];
    let file = new java.io.File(path.replace("file://", ""));

    if (!(file.exists() && file.isDirectory())) return names;
    for (let it of file.listFiles()) {
        names.push(String(it.getName()));
    }
    return names;
}
// 清理接口残留过期文件
function clearJkFiles() {
    /*
    let datalist = getDatas("jk");
    readDir("libs_jk/")
    Object.keys(sort).forEach(it=>{
        if(!datalist.some(item => item.url==it)){
            delete sort[it];
        }
    })
    writeFile(sortfile, JSON.stringify(sort));
    */
}
// 获取接口对应的显示标题
function getDataTitle(data) {
    if($.type(data.type)=="string"){
        return data.name + '  ““””<small><font color=grey>('+data.type+')' + (data.group&&data.group!=data.type?' [' + data.group + ']':'') + '</font></small>';
    }else{
        return (data.sort||0) + '-'+data.name + '-' + data.url;
    }
}
//接口管理多选方法
function duoselect(datas){
    let datalist = [];
    if($.type(datas)=="array"){
        datalist = datalist.concat(datas);
    }else if($.type(datas)=="object"){
        datalist.push(datas);
    }
    let duoselect = storage0.getMyVar('SrcJu_duoselect') || [];
    datalist.forEach(data=>{
        if(!duoselect.some(item => data.url==item.url)){
            duoselect.push(data);
            updateItem(data.url, {title: colorTitle(getDataTitle(data),'#3CB371')});
        }else{
            for(var i = 0; i < duoselect.length; i++) {
                if(data.url == duoselect[i].url) {
                    duoselect.splice(i, 1);
                    break;
                }
            }
            updateItem(data.url, {title:data.stop?colorTitle(getDataTitle(data),'#f20c00'):getDataTitle(data)});
        }
    })
    storage0.putMyVar('SrcJu_duoselect',duoselect);
}
// 点播主页选择源接口
function selectSource() {
    const hikerPop = $.require("http://hiker.nokia.press/hikerule/rulelist.json?id=6966");
    let sourceAllList = getDatas("jk", 1).filter(x=> !x.onlysearch);
    let sourceListGroup = Juconfig["sourceListGroup"] || sourceGroup || "全部";
    let sourceList = getGroupLists(sourceAllList, sourceListGroup);
    let tmpList = sourceList;

    hikerPop.setUseStartActivity(false);

    function getnames(list) {
        let index = 0;
        let names = list.map((v,i) => {
            let vname = v.name;
            if(v.url == sourceUrl && v.name==sourceName){
                index = i;
                vname = `‘‘’’<strong><font color="`+getItem('主题颜色','#6dc9ff')+`">`+v.name+`</front></strong>`;
            }
            return vname;
        });
        return {names:names,index:index};
    }
    let index_names = getnames(sourceList);
    let index = index_names.index;
    let names = index_names.names;
    let spen = 3;
    let inputBox;
    let pop = hikerPop.selectBottomRes({
        options: names,
        columns: spen,
        title: "当前:" + (sourceName||"") + "  合计:" + sourceAllList.length,
        noAutoDismiss: true,
        toPosition: index,
        extraInputBox: (inputBox = new hikerPop.ResExtraInputBox({
            hint: "源关键字筛选，右边切换分组",
            title: sourceListGroup,
            onChange(s, manage) {
                putMyVar("sourceListFilter", s);
                tmpList = sourceList.filter(x => x.name.toLowerCase().includes(s.toLowerCase()));
                let flist = getnames(tmpList).names;
                manage.list.length = 0;
                flist.forEach(x => {
                    manage.list.push(x);
                });
                manage.change();
            },
            defaultValue: getMyVar("sourceListFilter", ""),
            click(s, manage) {
                let groupnames = getJiekouGroups(sourceAllList);
                let tags = getJkTags(sourceAllList);
                let selects = ['全部'].concat(groupnames).concat(tags);
                //inputBox.setHint("提示");
                hikerPop.selectCenter({
                    options: selects, 
                    columns: 3, 
                    title: "切换源分组/TAG快速筛选", 
                    //position: groupnames.indexOf(sourceName),
                    click(s) {
                        if(s.startsWith('[')){
                            inputBox.setDefaultValue(s);
                        }else{
                            inputBox.setTitle(s);
                            inputBox.setDefaultValue("");
                            Juconfig["sourceListGroup"] = s;
                            writeFile(cfgfile, JSON.stringify(Juconfig));
                            
                            sourceList = getGroupLists(sourceAllList, s);
                            tmpList = sourceList;
                            names = getnames(tmpList).names;
                            manage.list.length = 0;
                            names.forEach(x => {
                                manage.list.push(x);
                            });
                            manage.change();
                        }
                    }
                });
            },
            titleVisible: true
        })),
        longClick(s, i, manage) {

        },
        click(s, i, manage) {
            pop.dismiss();

            let input = s.replace(/[’‘]|<[^>]*>/g, "");
            if(tmpList[i].name==input){
                Juconfig["homeSource"] = tmpList[i];
                writeFile(cfgfile, JSON.stringify(Juconfig));
                
                clearMyVar('SrcJu_dianbo$分类');
                clearMyVar('SrcJu_dianbo$fold');
                clearMyVar('SrcJu_dianbo$classCache');
                clearMyVar('SrcJu_dianbo$flCache');
                clearMyVar('点播动态加载loading');
                clearMyVar('点播一级jkdata');
                
                let key = tmpList[i].url;
                setJkSort(key, 1);
                refreshPage(true);
                
                return 'toast://' + '主页源已设置为：' + input;
            }else{
                return 'toast://源列表索引异常'
            }
        },
        menuClick(manage) {
            hikerPop.selectCenter({
                options: ["改变样式", "列表倒序", getItem("sourceListSort", "更新时间")],
                columns: 2,
                title: "请选择",
                click(s, i) {
                    if (i === 0) {
                        spen = spen == 3 ? 2 : 3;
                        manage.changeColumns(spen);
                        manage.scrollToPosition(index, false);
                    } else if (i === 1) {
                        manage.list.reverse();
                        manage.change();
                        manage.scrollToPosition(index, true);
                    } else if (i === 2) {
                        showSelectOptions({
                            "title": "选择排序方式", 
                            "options" : ["更新时间","接口名称","使用频率"], 
                            "col": 1, 
                            "js": `setItem('sourceListSort', input);'toast://排序方式在下次生效：' + input`
                        })
                    }
                }
            });
        }
    });
    return 'hiker://empty';

}
/*
function selectSource(group, k) {
    let datalist = getDatas('jk');
    let yxdatalist = datalist.filter(it=>{
        return !it.stop;
    });
    let jkdatalist = getGroupLists(yxdatalist, group);
    let sitenames = jkdatalist.map(it=>{
        return it.name;
    })
    if(k){
        sitenames = sitenames.filter(it => {
            return it.indexOf(k)>-1;
        })
    }

    return $(sitenames, 2, "选择主页源").select((group, cfgfile, Juconfig) => {
        Juconfig['indexSource'] = group+'_'+input;
        writeFile(cfgfile, JSON.stringify(Juconfig));
        clearMyVar('SrcJu_dianbo$分类');
        clearMyVar('SrcJu_dianbo$fold');
        clearMyVar('SrcJu_dianbo$classCache');
        clearMyVar('SrcJu_dianbo$flCache');
        refreshPage(true);
        return 'toast://' + input;
    }, group, cfgfile, Juconfig)
}
*/
// 按拼音排序
function sortByPinyin(arr) {
    var arrNew = arr.sort((a, b) => a.name.localeCompare(b.name));
    for (var m in arrNew) {
        var mm = /^[\u4e00-\u9fa5]/.test(arrNew[m].name) ? m : '-1';
        if (mm > -1) {
            break;
        }
    }
    for (var n = arrNew.length - 1; n >= 0; n--) {
        var nn = /^[\u4e00-\u9fa5]/.test(arrNew[n].name) ? n : '-1';
        if (nn > -1) {
            break;
        }
    }
    if (mm > -1) {
        var arrTmp = arrNew.splice(m, parseInt(n - m) + 1);
        arrNew = arrNew.concat(arrTmp);
    }
    return arrNew
}
// app类接口类型自动
function getapitype(apiurl) {
    if(apiurl){
        if(apiurl.includes('.vod')){
            return "v1";
        }else if(apiurl.includes('/app/')){
            return "app";
        }else if(apiurl.includes('app.php')){
            return "v2";
        }else if(/iptv|Chengcheng/.test(apiurl)){
            return "iptv";
        }else if(apiurl.includes('provide/vod/')){
            return "cms";
        }else{
            return "";
        }
    }else{
        return "";
    }
}
// 文字上色
function colorTitle(title, Color) {
    return '““””<font color="' + Color + '">' + title + '</font>';
}
// 选中状态标识
function getide(is) {
    if(is==1){
        return '‘‘’’<strong><font color="#f13b66a">◉ </front></strong>';
    }else{
        return '‘‘’’<strong><font color="#F54343">◉ </front></strong>';
    }
}
// 取前三历史记录
function getHistory(i){
    let h = [];
    let ruleTitle = MY_RULE._title || MY_RULE.title;
    i = i ? i*3 : 0;
    let items = JSON.parse(fetch('hiker://history')).filter(v=> v.type!="网页浏览" && JSON.parse(v.params).title==ruleTitle);
    if(i+3 > items.length){
        i = 0;
        clearMyVar('SrcJu_homeHistory');
    }
    items.slice(i, i+3).forEach(item=>{
        try{
            let extra = JSON.parse(JSON.parse(item.params).params) || {};
            extra["cls"] = "historylist";
            h.push({
                title: item.title,
                url: item.ruleBaseUrl + '@rule=' + JSON.parse(item.params).find_rule,
                pic_url: item.picUrl,
                desc: item.lastClick?"足迹："+item.lastClick.split('@@')[0]:"足迹：无",
                col_type: "movie_3",
                extra: extra
            });
        }catch(e){
            log('加载观看记录异常>'+e.message + " 错误行#" + e.lineNumber);
        }
    })
    return h;
}
// 获取图标地址
function getIcon(icon, nochange) {
    if(!icon.includes('.svg')){
        return codepath + 'img/' + icon;
    }
    let color = getItem('主题颜色','');
    return codepath + 'img/' + icon + ((!color||nochange)?'':'?s='+color+'@js=' + $.toString((color) => {
        let javaImport = new JavaImporter();
        javaImport.importPackage(Packages.com.example.hikerview.utils);
        with(javaImport) {
            let bytes = FileUtil.toBytes(input);
            let str = new java.lang.String(bytes, "UTF-8") + "";
            str = str.replace(/#feb833|#6dc9ff|#2ec99d|#587bff|#ff7772|#a88efa|#FD9173/gi, color);
            bytes = new java.lang.String(str).getBytes();
            return FileUtil.toInputStream(bytes);
        }
    },color))
}

// 重定义打印日志
let rulelog = getItem('规则日志打印','0');
if (rulelog != "1") {
    log = function () {
        return;
    };
}

let gmParams = {
    datapath: datapath,
    rulepath: rulepath,
    codepath: codepath,
    jkfile: jkfile,
    jxfile: jxfile,
    cfgfile: cfgfile,
    getIcon: getIcon,
    getContnet: getContnet,
    zip: gzip.zip,
    unzip: gzip.unzip
}
if(!globalMap0.getVar('Jy_gmParams')){
    log("写入全局对象变量gmParams");
    globalMap0.putVar('Jy_gmParams', gmParams);
}
