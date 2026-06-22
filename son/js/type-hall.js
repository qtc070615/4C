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
        setTimeout(() => this.initCharts(), 100);
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

    groupByProvince() {
        const buildings = this.currentType.buildings || [];
        const map = {};
        buildings.forEach(b => {
            if (!map[b.province]) map[b.province] = [];
            map[b.province].push(b);
        });
        return Object.keys(map).map(name => ({
            name: name,
            buildings: map[name]
        }));
    },

    initSidebarMenu() {
        const container = document.getElementById('menuAccordion');
        const searchInput = document.getElementById('menuSearch');
        if (!container || !searchInput || !this.currentType) return;

        const provinces = this.groupByProvince();
        const originalTexts = new Map();

        const buildHtml = (items) => {
            return items.map((province, pIdx) => {
                const links = province.buildings.map(b => {
                    const href = `./building.html?name=${encodeURIComponent(b.name)}&province=${encodeURIComponent(province.name)}`;
                    return `<a href="${href}" class="accordion-link" data-pidx="${pIdx}" data-name="${b.name}">${b.name}</a>`;
                }).join('');

                return `
                    <div class="accordion-item" data-pidx="${pIdx}" data-pname="${province.name}">
                        <div class="accordion-header" data-pidx="${pIdx}">
                            <span class="header-text">${province.name}</span>
                        </div>
                        <div class="accordion-body">${links}</div>
                    </div>
                `;
            }).join('');
        };

        const render = (items) => {
            if (!items || items.length === 0) {
                container.innerHTML = '<div class="menu-no-result">未找到匹配结果</div>';
                return;
            }
            container.innerHTML = buildHtml(items);
            container.querySelectorAll('.header-text, .accordion-link').forEach(el => {
                originalTexts.set(el, el.textContent);
            });
            bindAccordion();
        };

        const bindAccordion = () => {
            container.querySelectorAll('.accordion-header').forEach(header => {
                header.addEventListener('click', (e) => {
                    e.preventDefault();
                    const item = header.closest('.accordion-item');
                    item.classList.toggle('active');
                });
            });
        };

        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const filter = (keyword) => {
            if (!keyword) {
                render(provinces);
                container.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
                const noResult = container.querySelector('.menu-no-result');
                if (noResult) noResult.remove();
                return;
            }

            const lowerK = keyword.toLowerCase();
            let hasAnyMatch = false;

            provinces.forEach((province, pIdx) => {
                const item = container.querySelector(`.accordion-item[data-pidx="${pIdx}"]`);
                if (!item) return;

                const headerText = item.querySelector('.header-text');
                const links = item.querySelectorAll('.accordion-link');
                const pMatch = province.name.toLowerCase().includes(lowerK);
                let bMatchCount = 0;

                links.forEach(link => {
                    const bName = link.dataset.name.toLowerCase();
                    if (bName.includes(lowerK)) {
                        link.style.display = '';
                        bMatchCount++;
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

                if (pMatch || bMatchCount > 0) {
                    item.style.display = '';
                    item.classList.add('active');
                    hasAnyMatch = true;
                    if (pMatch) {
                        const orig = originalTexts.get(headerText);
                        if (orig) {
                            const regex = new RegExp(`(${escapeRegex(keyword)})`, 'gi');
                            headerText.innerHTML = orig.replace(regex, '<span class="highlight-text">$1</span>');
                        }
                    } else {
                        if (originalTexts.has(headerText)) headerText.textContent = originalTexts.get(headerText);
                    }
                } else {
                    item.style.display = 'none';
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

        render(provinces);
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
        if (regionDom && chartData.region) {
            const rect = regionDom.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                setTimeout(() => this.initCharts(), 500);
                return;
            }
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
        }

        const periodDom = document.getElementById('periodChart');
        if (periodDom && chartData.period) {
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