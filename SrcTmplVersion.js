var newVersion = {
    "SrcJuying":"2.0",
    "hint": "可能需要重进一次软件",
    "codeDownload": "https://src48597962.lanzouo.com/iaO1p2c6buyb",
    "JYUpdateRecords": [{
        title: "beta V2.1",
        records: [
            "优化：点播接口文件从data目录转移至rule目录",
            "升级：增加切换本地依赖代码库，留接口随时转本地",
            "升级：小程序配合升级版本，允许开局使用本地包"
        ]
    },{
        title: "2024/10/06 V2.0",
        records: [
            "修复：聚合代理搜索导致GM环境异常问题",
            "新增：点播二级切换站源长按可指定接口源",
            "新增：点播接口管理增加批量检测限24小时",
            "优化：点播接口管理显示样式微调",
            "优化：点播XBPQ接口支持跳过二级直接播放",
            "优化：点播去除基本不用的接口优先设置",
            "优化：主页搜索接口支持指定全部/分组/TAG",
            "优化：点播一级样式优化，长按管理设置可切换"
        ]
    },{
        title: "2024/09/17 V1.9",
        records: [
            "优化：点播接口排序在导入时自动清理",
            "优化：直播订阅管理界面及逻辑调整调优",
            "优化：资源导入非json文件以壳子ua导入",
            "优化：点播cms源保存时统一修正奇怪链接",
            "优化：主页观看记录组件增加翻页功能",
            "修复：点播XBPQ、XYQ兼容性优化提升",
            "修复：点播接口管理，新增时清空事件"
        ]
    },{
        title: "2024/09/06 V1.8",
        records: [
            "优化：点播接口编辑，分组快捷选择",
            "优化：点播接口页面增加测试、标签选择",
            "优化：点播更换主页源长按增加便捷编辑",
            "优化：导入确认页增加改名改组及测试",
            "优化：drpy环境优化处理，尽量避免失败",
            "优化：点播二级选集强制修正排序方法",
            "修复：点播一级调用Quark.简报错问题",
            "修复：其他一些小bug"
        ]
    },{
        title: "2024/09/01 V1.7",
        records: [
            "新增：点播资源增加js文件夹扫描添加t3",
            "优化：点播解析优化、hipy的ali类型",
            "优化：点播解析管理排序优先级完善",
            "优化：点播解析管理增加批量重置排序",
            "优化：点播hipy_t3类型无二级逻辑",
            "更新：点播hipy_t3类型drpy模板.js",
            "小程序：版本7配合软件新版本js导入子页面"
        ]
    },{
        title: "2024/08/23 V1.6",
        records: [
            "修复：app、cms类型源搜索无翻页",
            "修复：点播接口增加保存出错问题",
            "优化：搜索结果内容描述显示完善",
            "优化：搜索调用避免使用my私有方法",
            "优化：点播二级图片取值优先级完善",
            "优化：点播接口分享及本地选择逻辑",
            "优化：点播主页换源筛选关键字记忆",
            "优化：点播小说类型适配\n换行符"
        ]
    },{
        title: "2024/08/17 V1.5",
        records: [
            "修复：点播二级观看设置报错问题",
            "修复：管理检测版本更新显示错误",
            "优化：收藏获取最新章节显示站源",
            "优化：规则日志是否打印方法调整"
        ]
    },{
        title: "2024/08/17 V1.4",
        records: [
            "升级：小程序升级版本6",
            "修复：点播t3源获取分类列表fl传值调整",
            "修复：点播二级切源中getItem导致卡慢问题",
            "优化：点播二级切源加载速度提升优化",
            "优化：点播搜索图片兜底逻辑调整"
        ]
    },{
        title: "2024/08/10 V1.3",
        records: [
            "优化：点播资源管理输入地址去除前后空白",
            "优化：点播解析缓存m3u8索引逻辑调整",
            "修复：软件新版本点播切换主页源bug"
        ]
    },{
        title: "2024/08/09 V1.2",
        records: [
            "新增：软件新版本支持选中的分类按钮背景色",
            "新增：点播长按切换主页源，增加分享当前源",
            "新增：点播接口管理加入分类筛选，参考cms源",
            "修复：资源保存git代理失败导致抓取内容为502",
            "修复：点播cms源主页获取分类逻辑不完善bug",
            "优化：点播去除公共GM引用，减少依赖性",
            "优化：点播观看解析设置改用本地配置文件",
            "优化：点播片源为iqiyi统一修正为qiyi",
            "优化：点播二级图片优先取一级，二级后补"
        ]
    },{
        title: "2024/08/06 V1.1",
        records: [
            "新增：点播接口管理分享时本地接口携带数据",
            "修复：点播本地包导入存在bug导致一级空白",
            "优化：点播资源管理多仓导入链接处理逻辑",
            "优化：点播接口分享逻辑调整，限制本地包",
            "优化：点播接口导入处理代码，调整完善逻辑",
            "优化：公共文件引入GM，避免其他程序调用报错",
            "优化：点播站源切换改为直接切换不弹窗",
            "优化：点播资源管理调整界面显示，历史长按删除"
        ]
    },{
        title: "2024/07/30 V1.0",
        records: [
            "新增：点播资源管理box导入订阅支持多仓链接地址",
            "优化：增强点播二级补偿模板匹配、AI识片能力",
            "优化：点播二级获取数据时，有选集时才做缓存",
            "优化：重构整合点播接口导入和订阅逻辑代码",
            "优化：点播接口、解析等接口文件转移规则目录",
            "优化：点播解析逻辑优化，夸克、uc调用Quark.简",
            "修复：点播hipy_t3接口一些特殊情况做单独处理",
            "修复：点播解析接口编辑页代码调整，避免出错",
            "修复：点播二级选集列表排序倒序在分页时bug",
            "修复：点播导入和订阅支持软件目录外本地包",
            "修复：点播接口新增时非ext接口保存时处理bug",
            "修复：点播cms有站无一级分类时不显示问题",
            "修复：点播官网解析异常失败的问题"
        ]
    },{
        title: "2024/07/24 V0.9",
        records: [
            "修复：点播播放解析判断dataObj.sname错误",
            "修复：点播解析管理删除错误的bug",
            "修复：点播切源从云盘切其他分类时不删除问题",
            "修复：点播接口和解析页导入失败的问题",
            "优化：点播主页换源分组由接口分类改为固化选择",
            "优化：点播解析优化，增强三类地址判断接入",
            "优化：点播增强XBPQ和XYQ接口的兼容性",
            "优化：云盘支持音乐播放，图片查看，其他下载"
        ]
    },{
        title: "2024/07/23 V0.8",
        records: [
            "优化：点播选集样式自动化判断逻辑",
            "优化：点播解析逻辑微调整，观看设置微调",
            "优化：云盘图标调整，解析逻辑调整",
            "修复：小程序版本小于3，增加提示升级"
        ]
    },{
        title: "2024/07/21 V0.7",
        records: [
            "新增：增加云口令导入确认页(小程序版本3+)",
            "新增：切换主页源和接口管理加增快速筛选",
            "优化：云盘、点播加强全局统一ui颜色",
            "优化：适配hipy播放弹窗选项，无二级直接播放",
            "优化：统一入口，适配hipy_t3接口传参访问ext",
            "优化：导入本地接口，统一去除emoji",
            "优化：cms类型支持推荐列表，避免默认分类列表为空",
            "修复：接口新增、解析显示等残留的几个小bug",
            "修复：其他细节代码"
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
        title: "2024/07/03 V0.2",
        records: [
            "新增：接口管理支持批量启用",
            "修复：hipy_t4链接入参漏传问题",
            "修复：hipy_t3/t4播放带header",
            "修复：订阅文件部份逻辑，支持本地t3",
            "重构：因缓存等原因无法隔离环境，hipy_t3执行引擎采用L佬独创的代码"
        ]
    },{
        title: "2024/07/01 V0.1",
        records: [
            "重构：聚影2.0，重新起航",
            "重构：app、cms、biubiu、xpath、XYQ、XBPQ、hipy",
            "重构：支持本地接口或订阅文件",
            "重构：保留云盘、直播、alist等原聚影融合模块",
            "重构：二级切换站源全新设计",
            "重构：资源导入更加丰富"
        ]
    }]
};
