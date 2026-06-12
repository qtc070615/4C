function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 50个粒子，4px大小，但发光更强
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.bottom = '-5px';
        
        // 动画时间：6-10秒
        const duration = 6 + Math.random() * 4;
        p.style.animationDuration = duration + 's';
        p.style.animationDelay = Math.random() * 6 + 's';
        
        // 尺寸固定4px
        p.style.width = '4px';
        p.style.height = '4px';
        
        // 发光加强：半径8-12px，透明度0.95，多层发光
        const glowSize = 8 + Math.random() * 4;
        p.style.boxShadow = `
            0 0 ${glowSize}px ${glowSize/2}px rgba(212, 175, 55, 0.95),
            0 0 ${glowSize*2}px ${glowSize}px rgba(212, 175, 55, 0.5)
        `;
        // 更亮的中心颜色
        p.style.background = '#FFD700';
        
        container.appendChild(p);
    }
}

function initCharts() {
    const ids = ['chart1', 'chart2', 'chart3', 'chart4', 'chart5', 'chart6'];
    const keys = ['chart1', 'chart2', 'chart3', 'chart4', 'chart5', 'chart6'];
    const instances = [];
    
    const isMobile = window.innerWidth < 1024;
    const titleSize = isMobile ? 12 : 14;
    const axisSize = isMobile ? 10 : 11;
    
    ids.forEach((id, index) => {
        const dom = document.getElementById(id);
        if (!dom) return;
        
        const chart = echarts.init(dom);
        const config = ChartConfigs[keys[index]].option;
        
        if (config.title) {
            config.title.textStyle.fontSize = titleSize;
        }
        if (config.xAxis && config.xAxis.axisLabel) {
            config.xAxis.axisLabel.fontSize = axisSize;
        }
        if (config.yAxis && config.yAxis.axisLabel) {
            config.yAxis.axisLabel.fontSize = axisSize;
        }
        if (config.series && config.series[0].label) {
            config.series[0].label.fontSize = axisSize;
        }
        
        chart.setOption(config);
        instances.push(chart);
    });
    
    window.addEventListener('resize', () => {
        instances.forEach(chart => chart.resize());
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCharts();
});

window.addEventListener('resize', () => {
    setTimeout(() => {
        initParticles();
    }, 250);
});