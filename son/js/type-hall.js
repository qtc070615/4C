var App = {
    charts: { region: null, period: null },
    currentType: null,

    init() {
        if (typeof TYPE_DB === 'undefined' || !TYPE_DB.types) {
            alert('数据加载失败：TYPE_DB 未定义');
            return;
        }

        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';

        const typeName = this.getUrlParam('type');
        if (!typeName) {
            alert('缺少类型参数，URL应为: type-hall.html?type=皇宫');
            return;
        }

        this.currentType = TYPE_DB.types.find(t => t.name === typeName);
        if (!this.currentType) {
            alert('未找到类型：' + typeName);
            return;
        }

        this.loadTypeData();
        this.initSidebarMenu();
        this.initParticles();
        // 延迟到布局完成后再初始化图表
        setTimeout(() => this.initCharts(), 300);
        this.initCompactNav();
        this.bindEvents();

        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    },

    getUrlParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    },

    loadTypeData() {
        const t = this.currentType;
        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };
        const setHtml = (id, html) => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = html;
        };

        setText('pageTitle', t.name);
        setText('pageEnName', t.enName);
        setHtml('typeDesc', t.desc.replace(/\n/g, '<br>'));
        
        const count = t.buildingCount || (t.buildings ? t.buildings.length : 0);
        setText('buildingNum', count);
        setText('navTypeName', t.name);
        setText('navBuildingCount', `现存 ${count} 处`);
    },

    initSidebarMenu() {
        const container = document.getElementById('menuAccordion');
        const searchInput = document.getElementById('menuSearch');
        if (!container || !searchInput || !this.currentType) return;

        const buildings = this.currentType.buildings || [];
        const originalTexts = new Map();

        const buildHtml = (items) => {
            return items.map(b => {
                const href = `./building.html?name=${encodeURIComponent(b.name)}&type=${encodeURIComponent(this.currentType.name)}`;
                return `<a href="${href}" class="accordion-link flat-link" data-name="${b.name}">${b.name}</a>`;
            }).join('');
        };

        const render = (items) => {
            if (!items || items.length === 0) {
                container.innerHTML = '<div class="menu-no-result">未找到匹配结果</div>';
                return;
            }
            container.innerHTML = buildHtml(items);
            container.querySelectorAll('.accordion-link').forEach(el => {
                originalTexts.set(el, el.textContent);
            });
        };

        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const filter = (keyword) => {
            if (!keyword) {
                render(buildings);
                const noResult = container.querySelector('.menu-no-result');
                if (noResult) noResult.remove();
                return;
            }

            const lowerK = keyword.toLowerCase();
            let hasAnyMatch = false;

            const links = container.querySelectorAll('.accordion-link');
            links.forEach(link => {
                const bName = link.dataset.name.toLowerCase();
                if (bName.includes(lowerK)) {
                    link.style.display = '';
                    hasAnyMatch = true;
                    const orig = originalTexts.get(link);
                    if (orig) {
                        const regex = new RegExp(`(${escapeRegex(keyword)})`, 'gi');
                        link.innerHTML = orig.replace(regex, '<span class="highlight-text">$1</span>');
                    }
                } else {
                    link.style.display = 'none';
                    if (originalTexts.has(link)) link.textContent = originalTexts.get(link);
                }
            });

            let noResult = container.querySelector('.menu-no-result');
            if (!noResult) {
                noResult = document.createElement('div');
                noResult.className = 'menu-no-result';
                noResult.textContent = '未找到匹配结果';
                container.appendChild(noResult);
            }
            noResult.style.display = hasAnyMatch ? 'none' : 'block';
        };

        render(buildings);
        searchInput.addEventListener('input', (e) => filter(e.target.value.trim()));
    },

    initParticles() {
        const container = document.getElementById('particleLayer');
        if (!container) return;
        container.innerHTML = '';
        const count = window.innerWidth < 1000 ? 15 : 30;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = (Math.random() * 12) + 's';
            p.style.animationDuration = (10 + Math.random() * 4) + 's';
            container.appendChild(p);
        }
    },

    initCharts() {
        if (!this.currentType || !this.currentType.charts) return;
        const chartData = this.currentType.charts;
        const isMobile = window.innerWidth < 1000;
        const axisSize = isMobile ? 10 : 11;

        const regionDom = document.getElementById('regionChart');
        const periodDom = document.getElementById('periodChart');

        // 关键修复：如果容器没撑开，强制设置默认高度，确保 echarts 能渲染
        [regionDom, periodDom].forEach(dom => {
            if (!dom) return;
            const rect = dom.getBoundingClientRect();
            if (rect.height === 0) {
                dom.style.height = '300px';
            }
            if (rect.width === 0) {
                dom.style.width = '100%';
            }
        });

        if (regionDom && chartData.region) {
            try {
                if (this.charts.region) this.charts.region.dispose();
                this.charts.region = echarts.init(regionDom, 'dark');
                this.charts.region.setOption({
                    backgroundColor: 'transparent',
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c}处 ({d}%)',
                        backgroundColor: 'rgba(22,22,22,0.95)',
                        borderColor: '#D4AF37',
                        borderWidth: 1,
                        textStyle: { color: '#e8e8e8', fontSize: 12 }
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: '2%',
                        left: 'center',
                        textStyle: { color: '#a0a0a0', fontSize: axisSize },
                        itemWidth: 10,
                        itemHeight: 10,
                        itemGap: 10
                    },
                    series: [{
                        name: '地区分布',
                        type: 'pie',
                        radius: ['32%', '52%'],
                        center: ['50%', '42%'],
                        avoidLabelOverlap: true,
                        itemStyle: { borderRadius: 3, borderColor: '#161616', borderWidth: 2 },
                        label: { show: false },
                        emphasis: {
                            label: { show: true, fontSize: 12, fontWeight: 'bold', color: '#D4AF37' }
                        },
                        data: chartData.region,
                        color: ['#D4AF37', '#B8941F', '#9A7B18', '#7D6212', '#8B7355', '#C4B9C2', '#A69B8D'],
                        minAngle: 5,
                        minShowLabelAngle: 10
                    }]
                });
            } catch (e) {
                console.error('地区分布图表初始化失败:', e);
            }
        }

        if (periodDom && chartData.period) {
            try {
                if (this.charts.period) this.charts.period.dispose();
                this.charts.period = echarts.init(periodDom, 'dark');
                this.charts.period.setOption({
                    backgroundColor: 'transparent',
                    tooltip: {
                        trigger: 'axis',
                        backgroundColor: 'rgba(22,22,22,0.95)',
                        borderColor: '#D4AF37',
                        borderWidth: 1,
                        textStyle: { color: '#e8e8e8', fontSize: 12 }
                    },
                    grid: { left: '3%', right: '4%', bottom: '3%', top: '12%', containLabel: true },
                    xAxis: {
                        type: 'category',
                        data: chartData.period.categories,
                        axisLine: { lineStyle: { color: '#8B7355' } },
                        axisLabel: { color: '#a0a0a0', fontSize: axisSize },
                        axisTick: { show: false }
                    },
                    yAxis: {
                        type: 'value',
                        splitLine: { lineStyle: { color: 'rgba(212, 175, 55, 0.1)', type: 'dashed' } },
                        axisLabel: { color: '#a0a0a0', fontSize: axisSize - 1 }
                    },
                    series: [{
                        name: '建筑数量',
                        type: 'line',
                        data: chartData.period.values,
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 6,
                        lineStyle: { color: '#D4AF37', width: 2 },
                        itemStyle: { color: '#D4AF37', borderColor: '#fff', borderWidth: 2 },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(212, 175, 55, 0.3)' },
                                { offset: 1, color: 'rgba(212, 175, 55, 0)' }
                            ])
                        }
                    }]
                });
            } catch (e) {
                console.error('年代分布图表初始化失败:', e);
            }
        }
    },

    initCompactNav() {
        const mainContent = document.getElementById('mainContent');
        const compactNav = document.getElementById('compactNav');
        const topBar = document.querySelector('.top-bar');
        if (!mainContent || !compactNav) return;
        mainContent.addEventListener('scroll', () => {
            const scrollTop = mainContent.scrollTop;
            if (scrollTop > 100) {
                compactNav.classList.add('visible');
                if (topBar) topBar.classList.add('fade-out');
            } else {
                compactNav.classList.remove('visible');
                if (topBar) topBar.classList.remove('fade-out');
            }
        });
    },

    bindEvents() {
        const mobileToggle = document.getElementById('mobileToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                mobileToggle.classList.toggle('hidden');
            });
        }
        if (overlay && sidebar && mobileToggle) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                mobileToggle.classList.remove('hidden');
            });
        }

        window.addEventListener('resize', () => {
            if (this.charts.region) this.charts.region.resize();
            if (this.charts.period) this.charts.period.resize();
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => App.init(), 100);
});