var jyfile = {
    "csp_xpath_jbb":{//接口标识不能重复
        "name": "剧白白",//接口名称
        "type": "tvbox",//接口类型，tvbox或biubiu
        "filter": "",//过虑字符，使用正则表达式/过虑1|过虑2/g
        "ua": "",
        "dtUrl": "https://www.jubaibai.cc/vod/{vid}.html",//视频地址
        "dtNode": "//body",//xpath最顶层节点
        "dtImg": "//div[contains(@class,'stui-content__thumb')]/a/img/@data-original",//图片
        "dtCate": "//p[contains(@class,'data')][1]/text()",
        "dtYear": "//p[contains(@class,'data')][5]/text()",//年份
        "dtArea": "//p[contains(@class,'data')][3]/text()",//地区
        "dtMark": "//p[contains(@class,'data')][8]/span/text()",//状态、备注
        "dtDirector": "//p[contains(@class,'data')][6]/a/text()",//导演
        "dtActor": "//p[contains(@class,'data')][7]/a/text()",//主演
        "dtDesc": "//span[@class='detail-content']/text()",//简介
        "dtFromNode": "//div[@class='stui-vodlist__head']/h3[@class='title']",//线路列表
        "dtFromName": "/text()",//线路名称
        "dtUrlNode": "//div[contains(@class,'stui-vodlist__head')]",//选集列表
        "dtUrlSubNode": "/ul/li/a",//单集
        "dtUrlId": "/@href",//单集链接
        "dtUrlName": "/text()",//单集名称
        "playUrl": "https://www.jubaibai.cc{playUrl}",//播放地址
        "searchUrl": "https://www.jubaibai.cc/index.php/ajax/suggest?mid=1&wd={wd}&limit=10",//搜索地址
        "scVodNode": "json:list",//搜索数据类型
        "scVodName": "name",//搜索数据-影片名
        "scVodId": "id",//搜索数据-影片id
        "scVodImg": "pic",//搜索数据-影片图片
        "scVodMark": ""//搜索数据-影片备注
    },
    "csp_xpath_ddg":{
        "name": "达达龟",
        "type": "tvbox",
        "filter": "",
        "ua": "",
        "dtUrl": "http://www.dadagui.com/voddetail/{vid}.html",
        "dtNode": "//body",
        "dtImg": "//div[contains(@class,'stui-content__thumb')]/a/img/@data-original",
        "dtCate": "//p[contains(@class,'data')][4]/text()",
        "dtYear": "//p[contains(@class,'data')][3]/text()",
        "dtArea": "//p[contains(@class,'data')][1]/text()",
        "dtMark": "//p[contains(@class,'data')][7]/text()",
        "dtDirector": "//p[contains(@class,'data')][6]/text()",
        "dtActor": "//p[contains(@class,'data')][5]/text()",
        "dtDesc": "//span[@class='detail-content']/text()",
        "dtFromNode": "//h3[contains(text(), '播')]",
        "dtFromName": "/text()",
        "dtUrlNode": "//ul[contains(@class,'stui-content__playlist')]",
        "dtUrlSubNode": "/li/a",
        "dtUrlId": "/@href",
        "dtUrlName": "/text()",
        "playUrl": "http://www.dadagui.com{playUrl}",
        "searchUrl": "http://www.dadagui.com/index.php/ajax/suggest?mid=1&wd={wd}&limit=10",
        "scVodNode": "json:list",
        "scVodName": "name",
        "scVodId": "id",
        "scVodImg": "pic",
        "scVodMark": ""
    },
    "csp_biubiu_libvio":{//接口标识不能重复
        "name": "LIBVIO",//接口名称
        "type": "biubiu",//接口类型，tvbox或biubiu
        "filter": "",
        "url": "https://www.libvio.com",
        "jiequshuzuqian": "data",
        "jiequshuzuhou": "</h4>",
        "tupianqian": "original=\"",
        "tupianhou": "\"",
        "biaotiqian": "title=\"",
        "biaotihou": "\"",
        "lianjieqian": "href=\"",
        "lianjiehou": "\"",
        "sousuoqian": "/index.php/ajax/suggest?mid=1&wd=",
        "sousuohou": "&limit=500",
        "sousuohouzhui": "/detail/",
        "ssmoshi": "0",
        "sousuoshifouercijiequ": "0",
        "jspic": "pic",
        "jsname": "name",
        "jsid": "id",
        "ssjiequqian": "空",
        "ssjiequhou": "空",
        "ssjiequshuzuqian": "空",
        "ssjiequshuzuhou": "空",
        "sstupianqian": "空",
        "sstupianhou": "空",
        "ssbiaotiqian": "空",
        "ssbiaotihou": "空",
        "sslianjieqian": "空",
        "sslianjiehou": "空",
        "bfshifouercijiequ": "0",
        "bfjiequqian": "空",
        "bfjiequhou": "空",
        "bfjiequshuzuqian": "class=\"stui-content__playlist",
        "bfjiequshuzuhou": "</ul>",
        "zhuangtaiqian": "类型：",
        "zhuangtaihou": " \/",
        "daoyanqian": "导演：",
        "daoyanhou": "</p>",
        "zhuyanqian": "class=\"data\">主演：",
        "zhuyanhou": "</p>",
        "diquqian": "地区：",
        "diquhouhou": " \/",
        "nianfenqian": "年份：",
        "nianfenhou": " \/",
        "genxinqian": "最后更新：<a style=.*?>",
        "genxinhou": "</a>",
        "juqingqian": "class=\"detail-content\"",
        "juqinghou": "</span>",
        "bfyshifouercijiequ": "0",
        "bfyjiequqian": "空",
        "bfyjiequhou": "空",
        "bfyjiequshuzuqian": "<a",
        "bfyjiequshuzuhou": "/a>",
        "bfbiaotiqian": ">",
        "bfbiaotihou": "<",
        "bflianjieqian": "href=\"",
        "bflianjiehou": "\""
    }
}