const ChartConfigs = {
    chart1: {
        option: {
            backgroundColor: 'transparent',
            title: { 
                text: '历年游客数据', 
                left: 'center', 
                top: '2%', 
                textStyle: { color: '#D4AF37' } 
            },
            tooltip: { 
                trigger: 'axis',
                backgroundColor: 'rgba(22, 22, 22, 0.95)',
                borderColor: '#D4AF37',
                borderWidth: 1,
                textStyle: { color: '#e8e8e8' },
                formatter: '{b}年: {c}亿人次'
            },
            grid: { top: '25%', right: '5%', bottom: '15%', left: '12%' },
            xAxis: { 
                type: 'category', 
                data: ['2017','2018','2020','2023'], 
                axisLabel: { color: '#a0a0a0' } 
            },
            yAxis: { 
                type: 'value', 
                splitLine: { lineStyle: { color: '#222' } }, 
                axisLabel: { color: '#a0a0a0' } 
            },
            series: [{
                data: [0.67,4.89,1.71,5.32],
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { color: '#D4AF37', width: 2 },
                itemStyle: { color: '#D4AF37', borderColor: '#fff', borderWidth: 1 },
                areaStyle: { 
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(212,175,55,0.4)' },
                            { offset: 1, color: 'rgba(212,175,55,0.05)' }
                        ]
                    }
                }
            }]
        }
    },
    
    chart2: {
        option: {
            backgroundColor: 'transparent',
            title: { 
                text: '建筑类型分布', 
                left: 'center', 
                top: '2%', 
                textStyle: { color: '#D4AF37' } 
            },
            tooltip: { 
                trigger: 'item',
                backgroundColor: 'rgba(22, 22, 22, 0.95)',
                borderColor: '#D4AF37',
                borderWidth: 1,
                textStyle: { color: '#e8e8e8' },
                formatter: '{b}: {c}%'
            },
            series: [{
                type: 'pie',
                radius: ['35%', '60%'],
                center: ['50%', '55%'],
                data: [
                    { value: 8, name: '宫殿', itemStyle: { color: '#D4AF37' } },
                    { value: 6, name: '园林', itemStyle: { color: '#00d4ff' } },
                    { value: 5, name: '桥梁', itemStyle: { color: '#ff6b6b' } },
                    { value: 22, name: '民居', itemStyle: { color: '#4ecdc4' } },
                    { value: 59, name: '其他', itemStyle: { color: '#95e1d3' } }
                ],
                label: { color: '#e8e8e8' },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        }
    },
    
    chart3: {
        option: {
            backgroundColor: 'transparent',
            title: { 
                text: '世界遗产增长', 
                left: 'center', 
                top: '2%', 
                textStyle: { color: '#D4AF37' } 
            },
            tooltip: { 
                trigger: 'axis',
                backgroundColor: 'rgba(22, 22, 22, 0.95)',
                borderColor: '#D4AF37',
                borderWidth: 1,
                textStyle: { color: '#e8e8e8' },
                formatter: '{b}: {c}处'
            },
            grid: { top: '25%', right: '5%', bottom: '15%', left: '12%' },
            xAxis: { 
                type: 'category', 
                data: ['1987','1990','1994','1996','1997','1998','1999','2000','2001','2004','2005','2006','2007','2008','2012','2014','2019','2021','2024'], 
                axisLabel: { color: '#a0a0a0' } 
            },
            yAxis: { 
                type: 'value', 
                splitLine: { lineStyle: { color: '#222' } }, 
                axisLabel: { color: '#a0a0a0' } 
            },
            series: [{
                data: [6,1,3,4,2,3,2,2,5,1,1,1,2,2,1,1,1,1,1,1],
                type: 'bar',
                barWidth: '40%',
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#00d4ff' },
                            { offset: 1, color: 'rgba(0,212,255,0.1)' }
                        ]
                    },
                    borderRadius: [3, 3, 0, 0]
                }
            }]
        }
    },
    
    chart4: {
        option: {
            backgroundColor: 'transparent',
            title: { 
                text: '各省建筑数量TOP5', 
                left: 'center', 
                top: '2%', 
                textStyle: { color: '#D4AF37' } 
            },
            tooltip: { 
                trigger: 'axis',
                backgroundColor: 'rgba(22, 22, 22, 0.95)',
                borderColor: '#D4AF37',
                borderWidth: 1,
                textStyle: { color: '#e8e8e8' },
                axisPointer: { type: 'shadow' },
                formatter: '{b}: {c}处'
            },
            grid: { top: '22%', right: '15%', bottom: '10%', left: '20%' },
            xAxis: { 
                type: 'value', 
                splitLine: { show: false }, 
                axisLabel: { color: '#a0a0a0' } 
            },
            yAxis: { 
                type: 'category', 
                data: ['山西','河南','浙江','四川','河北'], 
                axisLabel: { color: '#e8e8e8' }, 
                inverse: true,
                axisLine: { show: false },
                axisTick: { show: false }
            },
            series: [{
                data: [420, 200, 150,130,120],
                type: 'bar',
                barWidth: '50%',
                itemStyle: { 
                    color: '#D4AF37', 
                    borderRadius: [0, 3, 3, 0] 
                },
                label: { 
                    show: true, 
                    position: 'right', 
                    color: '#e8e8e8' 
                },
                emphasis: {
                    itemStyle: {
                        color: '#F0E68C',
                        shadowBlur: 10,
                        shadowColor: 'rgba(212,175,55,0.5)'
                    }
                }
            }]
        }
    },
    
chart5: {
    option: {
        backgroundColor: 'transparent',
        title: { 
            text: '保护等级分布', 
            left: 'center', 
            top: '0%', 
            textStyle: { color: '#D4AF37' } 
        },
        tooltip: { 
            trigger: 'item',
            backgroundColor: 'rgba(22, 22, 22, 0.95)',
            borderColor: '#D4AF37',
            borderWidth: 1,
            textStyle: { color: '#e8e8e8' },
            confine: true  // 限制在容器内，不跑出去
            // 移除 position: 'inside'，让它跟随鼠标，不挡住固定位置
        },
        radar: { 
            indicator: [
                { name: '一级', max: 100},
                { name: '二级', max: 100},
                { name: '三级', max: 100},
                { name: '未定', max: 100}
            ], 
            center: ['50%', '55%'],
            radius: '55%',
            axisName: { 
                color: '#a0a0a0',
                fontSize: 10
            },
            splitLine: { lineStyle: { color: '#333' } },
            splitArea: { show: false },
            axisLine: { lineStyle: { color: '#444' } }
        },
        series: [{ 
            type: 'radar', 
            data: [{ 
                value: [0.3, 1.2, 4.5, 94], 
                name: '分布',
                areaStyle: { color: 'rgba(0,212,255,0.25)' }, 
                lineStyle: { color: '#00d4ff', width: 2 },
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: { color: '#00d4ff' },
                emphasis: {
                    areaStyle: { color: 'rgba(0,212,255,0.5)' }
                }
            }] 
        }]
    }
},
    
    chart6: {
        option: {
            backgroundColor: 'transparent',
            title: { 
                text: '建筑年代分布', 
                left: 'center', 
                top: '2%', 
                textStyle: { color: '#D4AF37' } 
            },
            tooltip: { 
                trigger: 'axis',
                backgroundColor: 'rgba(22, 22, 22, 0.95)',
                borderColor: '#D4AF37',
                borderWidth: 1,
                textStyle: { color: '#e8e8e8' },
                formatter: '{b}: {c}处'
            },
            grid: { top: '25%', right: '5%', bottom: '15%', left: '12%' },
            xAxis: { 
                type: 'category', 
                data: ['唐代','五代','宋代','元代','明代','清代'], 
                axisLabel: { color: '#a0a0a0' } 
            },
            yAxis: { 
                type: 'value', 
                splitLine: { lineStyle: { color: '#222' } }, 
                axisLabel: { color: '#a0a0a0' } 
            },
            series: [{
                data: [4,8,90,350, 1500, 23000],
                type: 'line',
                smooth: true,
                lineStyle: { color: '#ff6b6b', width: 3 },
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: { 
                    color: '#ff6b6b',
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis: {
                    scale: 1.5,
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: '#ff6b6b'
                    }
                }
            }]
        }
    }
};