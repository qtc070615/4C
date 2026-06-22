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
            "buildingCount": 0,
            
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
                    "name": "福建土楼",
                    "province": "福建",
                    "period": "宋元"
                }
                // 可以继续添加更多建筑...
            ],
            
            // 【必填】图表数据（用于类型大厅页的 ECharts 图表）
            "charts": {
                // 饼图：建筑地区分布（替代原来的"建筑用途分布"）
                // value = 数量，name = 省份名称
                "region": [
                    { "value": 1, "name": "安徽" },
                    { "value": 1, "name": "福建" }
                    // 按省份聚合该类型建筑数量
                ],
                
                // 折线图：建筑年代分布（不变）
                "period": {
                    // X 轴：朝代名称（顺序从左到右：古→今）
                    "categories": ["唐代", "宋代", "元代", "明代", "清代"],
                    // Y 轴：对应朝代的建筑数量
                    "values": [0, 2, 0, 0, 0]
                }
            }
        },

        {
            "name": "官府",
            "enName": "Government Offices",
            "buildingCount": 0,
            "desc": "中国古代官府建筑包括衙署、府邸、学宫等，是封建礼制与行政权力的空间载体，布局严谨、等级森严，体现了传统政治文化中的秩序观念。",
            "buildings": [
                {
                    "name": "内乡县衙",
                    "province": "河南",
                    "period": "元代"
                },
                {
                    "name": "黑龙江将军府",
                    "province": "黑龙江",
                    "period": "清代"
                }
            ],
            "charts": {
                "region": [
                    { "value": 1, "name": "河南" },
                    { "value": 1, "name": "黑龙江" }
                ],
                "period": {
                    "categories": ["唐代", "宋代", "元代", "明代", "清代"],
                    "values": [0, 0, 1, 0, 1]
                }
            }
        },

        {
            "name": "皇宫",
            "enName": "Imperial Palaces",
            "buildingCount": 1,
            "desc": "皇宫建筑是中国古代最高等级的建筑类型，代表传统建筑技艺的巅峰。以北京故宫为典型，中轴对称、前朝后寝，集政治、礼仪、居住功能于一体，彰显皇权至上与天人合一的哲学思想。",
            "buildings": [
                {
                    "name": "故宫",
                    "province": "北京",
                    "period": "明代"
                }
            ],
            "charts": {
                "region": [
                    { "value": 1, "name": "北京" }
                ],
                "period": {
                    "categories": ["唐代", "宋代", "元代", "明代", "清代"],
                    "values": [0, 0, 0, 1, 0]
                }
            }
        },

        {
            "name": "桥梁",
            "enName": "Bridges",
            "buildingCount": 2,
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
                }
            ],
            "charts": {
                "region": [
                    { "value": 1, "name": "北京" },
                    { "value": 1, "name": "河北" }
                ],
                "period": {
                    "categories": ["唐代", "宋代", "元代", "明代", "清代"],
                    "values": [1, 0, 0, 0, 0]
                    // 注：隋代在唐代之前，实际使用时建议 categories 包含"隋代"
                }
            }
        },

        {
            "name": "遗址",
            "enName": "Ruins",
            "buildingCount": 0,
            "desc": "古代建筑遗址是历史层积的实物见证，包括宫殿基址、寺庙遗址、园林遗迹等。虽然地面建筑已湮没，但夯土台基、柱础石等遗存仍能还原昔日格局。",
            "buildings": [
                {
                    "name": "圆明园遗址",
                    "province": "北京",
                    "period": "清代"
                },
                {
                    "name": "大明宫遗址",
                    "province": "陕西",
                    "period": "唐代"
                }
            ],
            "charts": {
                "region": [
                    { "value": 1, "name": "北京" },
                    { "value": 1, "name": "陕西" }
                ],
                "period": {
                    "categories": ["唐代", "宋代", "元代", "明代", "清代"],
                    "values": [1, 0, 0, 0, 1]
                }
            }
        },

        {
            "name": "陵墓",
            "enName": "Tombs",
            "buildingCount": 0,
            "desc": "中国古代陵墓建筑体现了'事死如事生'的丧葬观念，从秦始皇陵的封土高台到明十三陵的宝城宝顶，陵寝布局仿照宫殿规制，形成庄严肃穆的纪念性空间。",
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
                }
            ],
            "charts": {
                "region": [
                    { "value": 1, "name": "河北" },
                    { "value": 1, "name": "陕西" }
                ],
                "period": {
                    "categories": ["唐代", "宋代", "元代", "明代", "清代"],
                    "values": [0, 0, 0, 0, 1]
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