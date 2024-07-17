var newVersion = {
    "SrcJuying":"0.6",
    "JYUpdateRecords": [{
        title: "2024/07/01 V0.1",
        records: [
            "重构：聚影2.0，重新起航",
            "重构：app、cms、biubiu、xpath、XYQ、XBPQ、hipy",
            "重构：支持本地接口或订阅文件",
            "重构：保留云盘、直播、alist等原聚影融合模块",
            "重构：二级切换站源全新设计",
            "重构：资源导入更加丰富"
        ]
    },{
        title: "2024/07/03 V0.2",
        records: [
            "新增：接口管理支持批量启用",
            "修复：hipy_t4链接入参漏传问题",
            "修复：hipy_t3/t4播放带header",
            "修复：订阅文件部份逻辑，支持本地t3",
            "重构：因缓存等原因无法隔离环境，hipy_t3执行引擎采用L佬独创的代码"
        ]
    },{
        title: "2024/07/06 V0.3",
        records: [
            "新增：接口管理支持批量启用",
            "修复：接口分享列表错误问题",
            "修复：hipy_t3/t4无法二级无法切源问题",
            "修复：选集标题判断错误问题",
            "优化：管理界面美化，加上日志控件、手工更新等",
            "优化：二级切源逻辑完善动态更新id"
        ]
    },{
        title: "2024/07/07 V0.4",
        records: [
            "新增：接口管理支持设置优选",
            "修复：接口和解析管理乱序问题",
            "优化：搜索方式支持分组接口，其他细节",
            "优化：搜索接口分组>优选>前50",
            "优化：二级切源搜索每次20进行手工确认",
            "优化：二级切源我的云盘置顶，其他细节"
        ]
    },{
        title: "2024/07/08 V0.5",
        records: [
            "新增：接口排序方式全局管理，换源菜单中切换",
            "新增：管理中增加规则内全局日志打印开关",
            "新增：二级收藏支持更新提示最新章节",
            "修复：主页选源切换分组后筛选报错问题",
            "优化：搜索结果匹配关键字改用searchContains",
            "优化：二级切源搜索失败的自动调整搜索排序",
            "停用：遵循大佬意见，停用hipy_t3，需口令开启"
        ]
    },{
        title: "2024/07/15 V0.6",
        records: [
            "新增：管理中增加主题颜色设置",
            "优化：点播订阅文件运行模式支持t3",
            "优化：点播资源管理导入类型提示",
            "优化：接口保存处理逻辑，更加严谨",
            "修复：点播主页选源切换分组后点选报错问题",
            "修复：点播解析管理切换是否web解析逻辑错误",
            "鸣谢：特别感谢彩佬及顺佬对新聚影全局ui美化提供的帮助"
        ]
    },{
        title: "待发布 V0.7",
        records: [
            "修复：残留的几个小bug",
            "优化：云盘、点播加强全局统一ui颜色",
            "优化：适配hipy播放弹窗选项",
            "优化：导入本地接口，统一去除emoji"
        ]
    }]
};
