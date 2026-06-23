/**
 * ============================================================
 * 华夏营造 - 建筑类型数据库（JS 版本）
 * 文件位置：son/json/type-data.js
 * ============================================================
 * 
 * 【使用说明】
 * 1. 此文件只存数据，不写交互逻辑
 * 2. 变量名 TYPE_DB 是固定的，type-hall.js 会读取这个变量
 * 3. 每个类型是一个对象，放在 types 数组里
 * 4. 添加新类型：复制一个类型对象，修改内容即可
 * 5. 注意：JSON 格式严格，最后一个字段后面不能有逗号
 */

var TYPE_DB = typeof TYPE_DB !== 'undefined' ? TYPE_DB : {
    "types": [

        {
            // 【必填】类型中文名（唯一标识）
            // URL 参数 type=xxx 必须和这里完全一致
            "name": "民居",
            
            // 【必填】类型英文名（显示在中文名下方）
            "enName": "Folk Houses",
            
            // 【必填】该类型建筑总数（显示在右上角统计）
            "buildingCount": 556000,
            
            // 【必填】类型概述（支持 <br> 换行）
            // 建议字数：50-150字
            "desc": "中国传统民居建筑因地制宜、因材致用，形成了四合院、窑洞、土楼、吊脚楼等丰富多样的建筑形式，体现了人与自然和谐共生的营造智慧。",
            
            // 【必填】该类型下的建筑列表（用于侧边栏导航）
            // 【重要】这里的 name 必须和 building-data.js 中的 name 完全一致！
            // province 用于生成跳转链接和统计地区分布
            "buildings": [
                {
                    "name": "西递宏村",      // 建筑名称
                    "province": "安徽",       // 所属省份
                    "period": "宋代"         // 年代
                },
                {
                     "name": "呈坎",
                     "province": "安徽",
                    "period": "唐代"
                },
                {
                    "name": "唐模村",
                    "province": "安徽",
                    "period": "唐代"
                },
                {
                    "name": "苏州古典园林",
                    "province": "江苏",
                    "period": "春秋"
                },
                {
                    "name": "徽州古城",
                    "province": "安徽",
                    "period": "秦朝"
                },
                {
                    "name": "山塘街",
                    "province": "江苏",
                    "period": "唐代"
                },
                {
                    "name": "周庄古镇",
                    "province": "江苏",
                    "type": "民居",
                    "period": "春秋战国"
                },
                {
            "name": "乌拉街清代建筑群",
            "province": "吉林",
            "period": "清代"
        },
        {
            "name": "兴城古城",
            "province": "辽宁",
            "period": "明代"
        },
        {
            "name": "东京城",
            "province": "辽宁",
            "period": "后金"
        },
        {
            "name": "山海关",
            "province": "河北",
            "period": "唐代"
        },
        {
            "name": "平遥古城",
            "province": "山西",
            "period": "西周"
        },
        {
            "name": "丁村民居",
            "province": "山西",
            "period": "明代"
        },
        {
            "name": "张壁古堡",
            "province": "山西",
            "period": "十六国时期"
        },
        {
            "name": "台儿庄古城",
            "province": "山东",
            "period": "秦汉时期"
        },
        {
            "name": "青州古城",
            "province": "山东",
            "period": "汉代"
        },
        {
            "name": "门源古城",
            "province": "青海",
            "period": "宋代"
        },
        {
            "name": "交河故城",
            "province": "新疆",
            "period": "汉代"
        },
        {
            "name": "喀什古城",
            "province": "新疆",
            "period": "汉代"
        },
        {
            "name": "古阁王朝",
            "province": "西藏",
            "period": "公元10世纪至17世纪"
        },
        {
            "name": "八廓街",
            "province": "西藏自治区",
            "period": "唐代"
        },
        {
            "name": "杜甫草堂",
            "province": "四川",
            "period": "唐代"
        },
        {
            "name": "李庄古镇",
            "province": "四川",
            "period": "南朝"
        },
        {
            "name": "龚滩古镇",
            "province": "重庆市",
            "period": "唐代"
        },
        {
            "name": "襄阳古城",
            "province": "湖北",
            "period": "汉代"
        },
        {
            "name": "荆州古城",
            "province": "湖北",
            "period": "春秋战国"
        },
        {
            "name": "韶山毛泽东故居",
            "province": "湖南",
            "period": "清代"
        },
        {
            "name": "富厚堂",
            "province": "湖南",
            "period": "清代"
        },
        {
            "name": "棠阴古镇",
            "province": "江西",
            "period": "宋代"
        },
        {
            "name": "流坑古村",
            "province": "江西",
            "period": "五代"
        },
        {
            "name": "河坊街",
            "province": "浙江",
            "period": "宋代"
        },
        {
            "name": "西塘镇",
            "province": "浙江",
            "period": "唐代"
        },
        {
            "name": "古堰画乡",
            "province": "浙江",
            "period": "南朝"
        },
        {
            "name": "豫园",
            "province": "上海市",
            "period": "明代"
        },
        {
            "name": "枫泾古镇",
            "province": "上海市",
            "period": "南朝"
        },
        {
            "name": "新场古镇",
            "province": "上海市",
            "period": "宋代"
        },
        {
            "name": "福建土楼",
            "province": "福建",
            "period": "宋元"
        },
        {
            "name": "崇武古城",
            "province": "福建",
            "period": "明代"
        },
        {
            "name": "泰宁古城",
            "province": "福建",
            "period": "唐代"
        },
        {
            "name": "安平古堡",
            "province": "台湾",
            "period": "明代"
        },
        {
            "name": "九份老街",
            "province": "台湾",
            "period": "清代"
        },
        {
            "name": "恒春古城",
            "province": "台湾",
            "period": "清代"
        },
        {
            "name": "雾峰林家花园",
            "province": "台湾",
            "period": "清代"
        },
        {
            "name": "陈家祠堂",
            "province": "广东",
            "period": "清代"
        },
        {
            "name": "赤坎镇",
            "province": "广东",
            "period": "清代"
        },
        {
            "name": "潮州古城",
            "province": "广东",
            "period": "东晋"
        },
        {
            "name": "珠玑巷",
            "province": "广东",
            "period": "唐代"
        },
        {
            "name": "丹洲古镇",
            "province": "广西",
            "period": "明代"
        },
        {
            "name": "扬美古镇",
            "province": "广西",
            "period": "宋代"
        },
        {
            "name": "中和古镇",
            "province": "海南",
            "period": "南朝"
        },
        {
            "name": "定安古城",
            "province": "海南",
            "period": "明代"
        },
        {
            "name": "丽江古城",
            "province": "云南",
            "period": "宋代"
        },
        {
            "name": "大理古城",
            "province": "云南",
            "period": "唐代"
        },
        {
            "name": "喜洲古镇",
            "province": "云南",
            "period": "唐代"
        },
        {
            "name": "青岩古镇",
            "province": "贵州",
            "period": "明代"
        },
        {
            "name": "西江千户苗寨",
            "province": "贵州",
            "period": "古代"
        }
                // 可以继续添加更多建筑...
            ],
            
            // 【必填】图表数据（用于类型大厅页的 ECharts 图表）
            "charts": {
                // 饼图：建筑地区分布（替代原来的"建筑用途分布"）
                // value = 数量，name = 省份名称
                "region": [
                    { "value": 2000, "name": "北京" },
                    { "value": 8000, "name": "安徽" },
                    { "value": 200, "name": "黑龙江" },
                    { "value": 400, "name": "江苏" },
                    { "value": 200, "name": "吉林" },
                    { "value": 300, "name": "辽宁" },
                    { "value": 100, "name": "天津" },
                    { "value": 5000, "name": "河北" },
                    { "value": 15000, "name": "山西" },
                    { "value": 500, "name": "内蒙古" },
                    { "value": 3500, "name": "山东" },
                    { "value": 6000, "name": "河南" },
                    { "value": 5000, "name": "陕西" },
                    { "value": 2500, "name": "甘肃" },
                    { "value": 450, "name": "宁夏" },
                    { "value": 3000, "name": "青海" },
                    { "value": 2000, "name": "新疆" },
                    { "value": 1250, "name": "西藏" },
                    { "value": 7500, "name": "四川" },
                    { "value": 3500, "name": "重庆" },
                    { "value": 3700, "name": "湖北" },
                    { "value": 9000, "name": "湖南" },
                    { "value": 11000, "name": "江西" },
                    { "value": 10000, "name": "浙江" },
                    { "value": 100, "name": "上海" },
                    { "value": 3500, "name": "福建" },
                    { "value": 3000, "name": "台湾" },
                    { "value": 7000, "name": "广东" },
                    { "value": 5500, "name": "广西" },
                    { "value": 700, "name": "海南" },
                    { "value": 30000, "name": "云南" },
                    { "value": 20000, "name": "贵州" }
                    // 按省份聚合该类型建筑数量
                ],
                
                // 折线图：建筑年代分布（不变）
                "period": {
                    // X 轴：朝代名称（顺序从左到右：古→今）
                    "categories": ["唐代", "宋代", "元代", "明代", "清代"],
                    // Y 轴：对应朝代的建筑数量
                    "values": [1, 3, 20, 5000, 40000]
                }
            }
        },

        {
            "name": "官府",
            "enName": "Government Offices",
            "buildingCount": 440,
            "desc": "中国古代官府建筑包括衙署、府邸、学宫等，是封建礼制与行政权力的空间载体，布局严谨、等级森严，体现了传统政治文化中的秩序观念。",
            "buildings": [
                {
            "name": "天坛",
            "province": "北京",
            "period": "明代"
        },
        {
            "name": "黑龙江将军府",
            "province": "黑龙江",
            "period": "清代"
        },
        {
            "name": "望江楼",
            "province": "黑龙江",
            "period": "清代"
        },
        {
            "name": "南京明城墙",
            "province": "江苏",
            "period": "明代"
        },
        {
            "name": "朝阳北塔",
            "province": "辽宁",
            "period": "北魏"
        },
        {
            "name": "天津府城",
            "province": "天津",
            "period": "清代"
        },
        {
            "name": "天津鼓楼",
            "province": "天津",
            "period": "明代"
        },
        {
            "name": "大同城墙",
            "province": "山西",
            "period": "明代"
        },
        {
            "name": "绥远城墙和将军衙署",
            "province": "内蒙古",
            "period": "清代"
        },
        {
            "name": "蓬莱阁",
            "province": "山东",
            "period": "宋代"
        },
        {
            "name": "太白楼",
            "province": "山东",
            "period": "唐代"
        },
        {
            "name": "观星台",
            "province": "河南",
            "period": "元代"
        },
        {
            "name": "内乡县衙",
            "province": "河南",
            "period": "元代"
        },
        {
            "name": "社旗山陕会馆",
            "province": "河南",
            "period": "清代"
        },
        {
            "name": "望京楼",
            "province": "河南",
            "period": "明代"
        },
        {
            "name": "西安城墙",
            "province": "陕西",
            "period": "隋唐"
        },
        {
            "name": "西安钟楼、鼓楼",
            "province": "陕西",
            "period": "明代"
        },
        {
            "name": "嘉峪关",
            "province": "甘肃",
            "period": "明代"
        },
        {
            "name": "玉门关",
            "province": "甘肃",
            "period": "汉代"
        },
        {
            "name": "张掖鼓楼",
            "province": "甘肃",
            "period": "明代"
        },
        {
            "name": "银川玉皇阁",
            "province": "宁夏",
            "period": "明代"
        },
        {
            "name": "一百零八塔",
            "province": "宁夏",
            "period": "西夏"
        },
        {
            "name": "银川鼓楼",
            "province": "宁夏",
            "period": "明代"
        },
        {
            "name": "郭麻日古寨",
            "province": "青海",
            "period": "公元7世纪"
        },
        {
            "name": "伊犁将军府",
            "province": "新疆",
            "period": "清朝"
        },
        {
            "name": "江孜古堡",
            "province": "西藏",
            "period": "元代"
        },
        {
            "name": "都江堰",
            "province": "四川",
            "period": "战国"
        },
        {
            "name": "白帝城",
            "province": "重庆市",
            "period": "汉代"
        },
        {
            "name": "大足石刻",
            "province": "重庆市",
            "period": "唐至清代"
        },
        {
            "name": "石宝寨",
            "province": "重庆市",
            "period": "明代"
        },
        {
            "name": "黄鹤楼",
            "province": "湖北",
            "period": "三国"
        },
        {
            "name": "古琴台",
            "province": "湖北",
            "period": "宋代"
        },
        {
            "name": "岳阳楼",
            "province": "湖南",
            "period": "东汉"
        },
        {
            "name": "岳麓书院",
            "province": "湖南",
            "period": "宋代"
        },
        {
            "name": "天心阁",
            "province": "湖南",
            "period": "汉代"
        },
        {
            "name": "滕王阁",
            "province": "江西",
            "period": "唐代"
        },
        {
            "name": "浔阳楼",
            "province": "江西",
            "period": "唐代"
        },
        {
            "name": "方塔园",
            "province": "上海市",
            "period": "宋代"
        },
        {
            "name": "赤崁楼",
            "province": "台湾",
            "period": "清代"
        },
        {
            "name": "柳州东门城楼",
            "province": "广西",
            "period": "明代"
        },
        {
            "name": "琼台书院",
            "province": "海南",
            "period": "清代"
        },
        {
            "name": "东坡书院",
            "province": "海南",
            "period": "宋代"
        },
        {
            "name": "甲秀楼",
            "province": "贵州",
            "period": "明代"
        },
        {
            "name": "镇远青龙洞",
            "province": "贵州",
            "period": "明代"
        },
        {
            "name": "遵义海龙屯",
            "province": "贵州",
            "period": "宋代"
        },
        {
            "name": "天后宫",
            "province": "天津",
            "period": "明代"
        }
            ],
            "charts": {
                "region": [
                    { "value": 12, "name": "北京" },
                    { "value": 16, "name": "安徽" },
                    { "value": 5, "name": "黑龙江" },
                    { "value": 24, "name": "江苏" },
                    { "value": 6, "name": "吉林" },
                    { "value": 8, "name": "辽宁" },
                    { "value": 4, "name": "天津" },
                    { "value": 22, "name": "河北" },
                    { "value": 36, "name": "山西" },
                    { "value": 7, "name": "内蒙古" },
                    { "value": 20, "name": "山东" },
                    { "value": 28, "name": "河南" },
                    { "value": 19, "name": "陕西" },
                    { "value": 11, "name": "甘肃" },
                    { "value": 4, "name": "宁夏" },
                    { "value": 5, "name": "青海" },
                    { "value": 8, "name": "新疆" },
                    { "value": 4, "name": "西藏" },
                    { "value": 18, "name": "四川" },
                    { "value": 7, "name": "重庆" },
                    { "value": 15, "name": "湖北" },
                    { "value": 14, "name": "湖南" },
                    { "value": 17, "name": "江西" },
                    { "value": 21, "name": "浙江" },
                    { "value": 5, "name": "上海" },
                    { "value": 15, "name": "福建" },
                    { "value": 5, "name": "台湾" },
                    { "value": 17, "name": "广东" },
                    { "value": 10, "name": "广西" },
                    { "value": 5, "name": "海南" },
                    { "value": 14, "name": "云南" },
                    { "value": 12, "name": "贵州" }
                ],
                "period": {
                    "categories": ["唐代", "宋代", "元代", "明代", "清代"],
                    "values": [1, 2, 8, 80, 350]
                }
            }
        },

        {
            "name": "皇宫",
            "enName": "Imperial Palaces",
            "buildingCount": 51,
            "desc": "皇宫建筑是中国古代最高等级的建筑类型，代表传统建筑技艺的巅峰。以北京故宫为典型，中轴对称、前朝后寝，集政治、礼仪、居住功能于一体，彰显皇权至上与天人合一的哲学思想。",
            "buildings": [
                {
            "name": "故宫",
            "province": "北京",
            "period": "明代"
        },
        {
            "name": "颐和园",
            "province": "北京",
            "period": "清代"
        },
        {
            "name": "沈阳故宫",
            "province": "辽宁",
            "period": "清代"
        },
        {
            "name": "承德避暑山庄",
            "province": "河北",
            "period": "清代"
        },
        {
            "name": "皇城相府",
            "province": "山西",
            "period": "清代"
        },
        {
            "name": "奈曼王府",
            "province": "内蒙古",
            "period": "清代"
        },
        {
            "name": "和硕恪靖公主府",
            "province": "内蒙古",
            "period": "清代"
        },
        {
            "name": "罗布林卡",
            "province": "西藏",
            "period": "清代"
        },
        {
            "name": "靖江王府",
            "province": "广西",
            "period": "明代"
        },
        {
            "name": "木府",
            "province": "云南",
            "period": "元代"
        }
            ],
            "charts": {
                "region": [
                    { "value": 12, "name": "北京" },
                    { "value": 0, "name": "安徽" },
                    { "value": 1, "name": "黑龙江" },
                    { "value": 1, "name": "江苏" },
                    { "value": 1, "name": "吉林" },
                    { "value": 3, "name": "辽宁" },
                    { "value": 0, "name": "天津" },
                    { "value": 4, "name": "河北" },
                    { "value": 2, "name": "山西" },
                    { "value": 2, "name": "内蒙古" },
                    { "value": 1, "name": "山东" },
                    { "value": 4, "name": "河南" },
                    { "value": 5, "name": "陕西" },
                    { "value": 1, "name": "甘肃" },
                    { "value": 0, "name": "宁夏" },
                    { "value": 0, "name": "青海" },
                    { "value": 1, "name": "新疆" },
                    { "value": 2, "name": "西藏" },
                    { "value": 2, "name": "四川" },
                    { "value": 0, "name": "重庆" },
                    { "value": 1, "name": "湖北" },
                    { "value": 1, "name": "湖南" },
                    { "value": 1, "name": "江西" },
                    { "value": 3, "name": "浙江" },
                    { "value": 0, "name": "上海" },
                    { "value": 1, "name": "福建" },
                    { "value": 0, "name": "台湾" },
                    { "value": 1, "name": "广东" },
                    { "value": 0, "name": "广西" },
                    { "value": 0, "name": "海南" },
                    { "value": 2, "name": "云南" },
                    { "value": 0, "name": "贵州" }
                ],
                "period": {
                    "categories": ["唐代", "宋代", "元代", "明代", "清代"],
                    "values": [1, 2, 4, 12, 32]
                }
            }
        },

        {
            "name": "桥梁",
            "enName": "Bridges",
            "buildingCount": 9000,
            "desc": "中国古桥建筑历史悠久，技艺精湛。从赵州桥的单孔敞肩拱到卢沟桥的多孔联拱，古桥不仅解决了交通问题，更成为地域文化与工程智慧的永恒见证。",
            "buildings": [
                {
            "name": "卢沟桥",
            "province": "北京",
            "period": "金代"
        },
        {
            "name": "安济桥",
            "province": "河北",
            "period": "隋代"
        },
        {
            "name": "泰顺廊桥",
            "province": "浙江",
            "period": "唐代"
        },
        {
            "name": "洛阳桥",
            "province": "福建",
            "period": "宋代"
        },
        {
            "name": "安平桥",
            "province": "福建",
            "period": "宋代"
        },
        {
            "name": "广济桥",
            "province": "广东",
            "period": "宋代"
        }
            ],
            "charts": {
                "region": [
                    { "value": 80, "name": "北京" },
    { "value": 350, "name": "安徽" },
    { "value": 40, "name": "黑龙江" },
    { "value": 600, "name": "江苏" },
    { "value": 50, "name": "吉林" },
    { "value": 120, "name": "辽宁" },
    { "value": 30, "name": "天津" },
    { "value": 400, "name": "河北" },
    { "value": 300, "name": "山西" },
    { "value": 80, "name": "内蒙古" },
    { "value": 500, "name": "山东" },
    { "value": 450, "name": "河南" },
    { "value": 220, "name": "陕西" },
    { "value": 120, "name": "甘肃" },
    { "value": 40, "name": "宁夏" },
    { "value": 30, "name": "青海" },
    { "value": 60, "name": "新疆" },
    { "value": 20, "name": "西藏" },
    { "value": 500, "name": "四川" },
    { "value": 180, "name": "重庆" },
    { "value": 400, "name": "湖北" },
    { "value": 600, "name": "湖南" },
    { "value": 800, "name": "江西" },
    { "value": 1300, "name": "浙江" },
    { "value": 20, "name": "上海" },
    { "value": 1200, "name": "福建" },
    { "value": 250, "name": "台湾" },
    { "value": 600, "name": "广东" },
    { "value": 450, "name": "广西" },
    { "value": 40, "name": "海南" },
    { "value": 280, "name": "云南" },
    { "value": 250, "name": "贵州" }
                ],
                "period": {
                    "categories": ["唐代", "宋代", "元代", "明代", "清代"],
                    "values": [30, 220, 450, 2500, 5800]
                    // 注：隋代在唐代之前，实际使用时建议 categories 包含"隋代"
                }
            }
        },

        {
            "name": "遗址",
            "enName": "Ruins",
            "buildingCount": 60000,
            "desc": "古代建筑遗址是历史层积的实物见证，包括宫殿基址、寺庙遗址、园林遗迹等。虽然地面建筑已湮没，但夯土台基、柱础石等遗存仍能还原昔日格局。",
            "buildings": [
                {
            "name": "清西陵",
            "province": "河北",
            "period": "清代"
        },
        {
            "name": "秦始皇陵",
            "province": "陕西",
            "period": "秦代"
        },
        {
            "name": "雷台汉墓",
            "province": "甘肃",
            "period": "汉代"
        },
        {
            "name": "西夏陵",
            "province": "宁夏回族自治区",
            "period": "西夏"
        },
        {
            "name": "热水墓群",
            "province": "青海",
            "period": "唐代"
        }
            ],
            "charts": {
                "region": [
                    { "value": 1800, "name": "北京" },
    { "value": 2200, "name": "安徽" },
    { "value": 1200, "name": "黑龙江" },
    { "value": 2500, "name": "江苏" },
    { "value": 1000, "name": "吉林" },
    { "value": 2800, "name": "辽宁" },
    { "value": 600, "name": "天津" },
    { "value": 3200, "name": "河北" },
    { "value": 3500, "name": "山西" },
    { "value": 2200, "name": "内蒙古" },
    { "value": 3000, "name": "山东" },
    { "value": 4200, "name": "河南" },
    { "value": 4500, "name": "陕西" },
    { "value": 2500, "name": "甘肃" },
    { "value": 800, "name": "宁夏" },
    { "value": 1200, "name": "青海" },
    { "value": 1800, "name": "新疆" },
    { "value": 1000, "name": "西藏" },
    { "value": 3500, "name": "四川" },
    { "value": 1200, "name": "重庆" },
    { "value": 2800, "name": "湖北" },
    { "value": 2500, "name": "湖南" },
    { "value": 2200, "name": "江西" },
    { "value": 1800, "name": "浙江" },
    { "value": 200, "name": "上海" },
    { "value": 1800, "name": "福建" },
    { "value": 1200, "name": "台湾" },
    { "value": 2200, "name": "广东" },
    { "value": 1800, "name": "广西" },
    { "value": 600, "name": "海南" },
    { "value": 3200, "name": "云南" },
    { "value": 2200, "name": "贵州" }
                ],
                "period": {
                    "categories": ["唐代", "宋代", "元代", "明代", "清代"],
                    "values": [6000, 10000, 7000, 12000, 15000]
                }
            }
        },

        {
            "name": "陵墓",
            "enName": "Tombs",
            "buildingCount": 30000,
            "desc": "中国古代陵墓建筑体现了'事死如事生'的丧葬观念，从秦始皇陵的封土高台到明十三陵的宝城宝顶，陵寝布局仿照宫殿规制，形成庄严肃穆的纪念性空间。",
            "buildings": [
                {
            "name": "圆明园遗址",
            "province": "北京",
            "period": "清代"
        },
        {
            "name": "渤海国上京龙泉府遗址",
            "province": "黑龙江",
            "period": "唐代"
        },
        {
            "name": "金上京会宁府遗址",
            "province": "黑龙江",
            "period": "金朝"
        },
        {
            "name": "辉发城址",
            "province": "吉林",
            "period": "明代"
        },
        {
            "name": "高句丽遗址",
            "province": "吉林",
            "period": "公元3-427年"
        },
        {
            "name": "叶赫部城址",
            "province": "吉林",
            "period": "明代"
        },
        {
            "name": "元上都遗址",
            "province": "内蒙古",
            "period": "元代"
        },
        {
            "name": "殷墟",
            "province": "河南",
            "period": "商朝"
        },
        {
            "name": "大明宫遗址",
            "province": "陕西",
            "period": "唐代"
        },
        {
            "name": "伏俟城遗址",
            "province": "青海",
            "period": "南北朝"
        },
        {
            "name": "楼兰故城遗址",
            "province": "新疆",
            "period": "汉代"
        },
        {
            "name": "三星堆遗址",
            "province": "四川",
            "period": "新石器时代晚期至夏代"
        },
        {
            "name": "嘉定城墙遗址",
            "province": "上海市",
            "period": "明代"
        },
        {
            "name": "大沽口炮台",
            "province": "天津",
            "period": "清代"
        }
            ],
            "charts": {
                "region": [
                    { "value": 800, "name": "北京" },
    { "value": 900, "name": "安徽" },
    { "value": 600, "name": "黑龙江" },
    { "value": 1000, "name": "江苏" },
    { "value": 500, "name": "吉林" },
    { "value": 1200, "name": "辽宁" },
    { "value": 200, "name": "天津" },
    { "value": 1500, "name": "河北" },
    { "value": 2200, "name": "山西" },
    { "value": 1200, "name": "内蒙古" },
    { "value": 1800, "name": "山东" },
    { "value": 2600, "name": "河南" },
    { "value": 3200, "name": "陕西" },
    { "value": 1200, "name": "甘肃" },
    { "value": 400, "name": "宁夏" },
    { "value": 600, "name": "青海" },
    { "value": 800, "name": "新疆" },
    { "value": 500, "name": "西藏" },
    { "value": 1800, "name": "四川" },
    { "value": 700, "name": "重庆" },
    { "value": 1200, "name": "湖北" },
    { "value": 1200, "name": "湖南" },
    { "value": 1000, "name": "江西" },
    { "value": 900, "name": "浙江" },
    { "value": 100, "name": "上海" },
    { "value": 900, "name": "福建" },
    { "value": 500, "name": "台湾" },
    { "value": 1200, "name": "广东" },
    { "value": 1000, "name": "广西" },
    { "value": 300, "name": "海南" },
    { "value": 1800, "name": "云南" },
    { "value": 1400, "name": "贵州" }
                ],
                "period": {
                    "categories": ["唐代", "宋代", "元代", "明代", "清代"],
                    "values": [2500, 5000, 2500, 8000, 12000]
                    // 注：秦代在唐代之前，实际使用时建议 categories 包含"秦代"
                }
            }
        }

    ]
};

// 【此行勿删】兼容处理，确保在其他环境中也能使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TYPE_DB;
}