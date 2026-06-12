// 华夏营造 - 省份大厅主逻辑（带调试版本）
const App = {
    charts: { usage: null, period: null },
    resizeObserver: null,
    lastWidth: window.innerWidth,
    currentProvince: null,

    init() {
        console.log('【调试】App.init() 开始执行');
        
        // 检查 PROFILE_DB 是否存在
        if (typeof PROFILE_DB === 'undefined') {
            console.error('【错误】PROFILE_DB 未定义！请检查：');
            console.error('1. profile-data.js 是否正确引入');
            console.error('2. profile-data.js 路径是否正确');
            console.error('3. profile-data.js 是否有语法错误');
            alert('数据加载失败：请检查控制台错误信息');
            return;
        }
        console.log('【调试】PROFILE_DB 加载成功，包含省份数：', PROFILE_DB.provinces.length);

        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';

        const provinceName = this.getUrlParam('province');
        console.log('【调试】URL 参数 province =', provinceName);
        
        if (!provinceName) {
            console.error('【错误】缺少省份参数，URL应为: profile.html?province=北京市');
            alert('缺少省份参数，URL应为: profile.html?province=北京市');
            return;
        }

        this.loadProvinceData(provinceName);
        
        this.lastWidth = window.innerWidth;
        this.initBuildingList();
        this.initParticles();
        setTimeout(() => this.initCharts(), 100);
        this.initMap();
        this.initCompactNav();
        this.initElasticPull();
        this.bindEvents();
        this.initResizeObserver();
        this.initOrientationListener();

        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
        
        console.log('【调试】App.init() 执行完成');
    },

    getUrlParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    },

    loadProvinceData(provinceName) {
        console.log('【调试】开始加载省份数据：', provinceName);
        
        try {
            const data = PROFILE_DB;
            this.currentProvince = data.provinces.find(p => p.name === provinceName);
            
            if (!this.currentProvince) {
                console.error('【错误】未找到省份:', provinceName);
                console.log('【调试】可用省份列表：', data.provinces.map(p => p.name));
                alert('未找到省份：' + provinceName);
                return;
            }
            
            console.log('【调试】找到省份数据：', this.currentProvince.name);

            // 1. 侧边栏省份名
            const provinceNameEl = document.getElementById('provinceName');
            if (provinceNameEl) {
                provinceNameEl.textContent = this.currentProvince.name;
                console.log('【调试】已更新 provinceName');
            } else {
                console.warn('【警告】未找到元素 #provinceName');
            }

            // 2. 页面标题
            const pageTitleEl = document.getElementById('pageTitle');
            if (pageTitleEl) {
                pageTitleEl.textContent = this.currentProvince.name;
                console.log('【调试】已更新 pageTitle');
            }

            // 3. 英文名
            const pageEnNameEl = document.getElementById('pageEnName');
            if (pageEnNameEl) {
                pageEnNameEl.textContent = this.currentProvince.enName;
            }

            // 4. 省情描述
            const provinceDescEl = document.getElementById('provinceDesc');
            if (provinceDescEl) {
                provinceDescEl.innerHTML = this.currentProvince.desc.replace(/\n/g, '<br>');
            }

            // 5. 建筑数量（顶部）
            const buildingNumEl = document.getElementById('buildingNum');
            if (buildingNumEl) {
                buildingNumEl.textContent = this.currentProvince.buildingCount;
            }

            // 6. 导航栏省份名
            const navProvinceNameEl = document.getElementById('navProvinceName');
            if (navProvinceNameEl) {
                navProvinceNameEl.textContent = this.currentProvince.name;
            }

            // 7. 导航栏建筑数量
            const navBuildingCountEl = document.getElementById('navBuildingCount');
            if (navBuildingCountEl) {
                navBuildingCountEl.textContent = `现存 ${this.currentProvince.buildingCount} 处`;
            }

            // 8. 大厅链接更新
            const hallLinkEl = document.getElementById('hallLink');
            if (hallLinkEl) {
                hallLinkEl.href = `./profile.html?province=${encodeURIComponent(this.currentProvince.name)}`;
            }

            // 9. 地图文件
            const provinceMapEl = document.getElementById('provinceMap');
            if (provinceMapEl) {
                provinceMapEl.data = `../map/${this.currentProvince.mapFile}`;
                console.log('【调试】地图文件路径：', provinceMapEl.data);
            }

            // 10. 审图号
            const mapCreditEl = document.getElementById('mapCredit');
            if (mapCreditEl) {
                if (this.currentProvince.mapCredit) {
                    mapCreditEl.textContent = this.currentProvince.mapCredit;
                    console.log('【调试】已更新审图号：', this.currentProvince.mapCredit);
                } else {
                    console.warn('【警告】该省份没有 mapCredit 字段');
                }
            }

            console.log('【调试】省份数据加载完成');

        } catch (error) {
            console.error('【错误】加载省份数据失败:', error);
            alert('加载数据失败：' + error.message);
        }
    },

    initBuildingList() {
        console.log('【调试】初始化建筑列表');
        const container = document.getElementById('buildingListContainer');
        if (!container) {
            console.warn('【警告】未找到 buildingListContainer');
            return;
        }
        if (!this.currentProvince) {
            console.warn('【警告】currentProvince 为空，无法加载建筑列表');
            return;
        }
        
        container.innerHTML = '';
        
        if (!this.currentProvince.buildings || this.currentProvince.buildings.length === 0) {
            console.warn('【警告】该省份没有建筑数据');
            return;
        }
        
        console.log('【调试】加载建筑数量：', this.currentProvince.buildings.length);
        
        this.currentProvince.buildings.forEach(b => {
            const li = document.createElement('li');
            li.className = 'building-item';
            li.innerHTML = `<a href="./building.html?name=${encodeURIComponent(b.name)}&province=${encodeURIComponent(this.currentProvince.name)}" class="building-link">${b.name}</a>`;
            container.appendChild(li);
        });
    },

    initParticles() {
        const container = document.getElementById('particleLayer');
        if (!container) return;
        container.innerHTML = '';
        const particleCount = window.innerWidth < 1000 ? 15 : 30;
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = (Math.random() * 12) + 's';
            p.style.animationDuration = (10 + Math.random() * 4) + 's';
            container.appendChild(p);
        }
    },

    initCharts() {
        console.log('【调试】初始化图表');
        if (!this.currentProvince) {
            console.warn('【警告】currentProvince 为空，无法加载图表');
            return;
        }
        if (!this.currentProvince.charts) {
            console.warn('【警告】该省份没有 charts 数据');
            return;
        }

        const chartData = this.currentProvince.charts;

        const usageDom = document.getElementById('usageChart');
        if (usageDom) {
            usageDom.style.width = '100%';
            usageDom.style.height = '100%';
            
            const rect = usageDom.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                setTimeout(() => this.initCharts(), 500);
                return;
            }

            if (this.charts.usage) this.charts.usage.dispose();
            this.charts.usage = echarts.init(usageDom, 'dark');
            
            this.charts.usage.setOption({
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
                    textStyle: { color: '#a0a0a0', fontSize: 10 },
                    itemWidth: 10,
                    itemHeight: 10,
                    itemGap: 10
                },
                series: [{
                    name: '建筑用途',
                    type: 'pie',
                    radius: ['32%', '52%'],
                    center: ['50%', '42%'],
                    avoidLabelOverlap: true,
                    itemStyle: {
                        borderRadius: 3,
                        borderColor: '#161616',
                        borderWidth: 2
                    },
                    label: { show: false },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 12,
                            fontWeight: 'bold',
                            color: '#D4AF37'
                        }
                    },
                    data: chartData.usage,
                    color: ['#D4AF37', '#B8941F', '#9A7B18', '#7D6212', '#8B7355', '#C4B9C2', '#A69B8D'],
                    minAngle: 5,
                    minShowLabelAngle: 10
                }]
            });
        }

        const periodDom = document.getElementById('periodChart');
        if (periodDom) {
            periodDom.style.width = '100%';
            periodDom.style.height = '100%';
            
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
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '12%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: chartData.period.categories,
                    axisLine: { lineStyle: { color: '#8B7355' } },
                    axisLabel: { color: '#a0a0a0', fontSize: 11 },
                    axisTick: { show: false }
                },
                yAxis: {
                    type: 'value',
                    splitLine: { 
                        lineStyle: { 
                            color: 'rgba(212, 175, 55, 0.1)',
                            type: 'dashed'
                        } 
                    },
                    axisLabel: { color: '#a0a0a0', fontSize: 10 }
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

    initMap() {
        console.log('【调试】初始化地图');
        const mapObj = document.getElementById('provinceMap');
        const loading = document.getElementById('mapLoading');
        
        if (!mapObj) {
            console.warn('【警告】未找到 provinceMap 元素');
            return;
        }

        MapController.init(mapObj);

        setTimeout(() => {
            if (loading) {
                loading.classList.add('hidden');
                setTimeout(() => loading.remove(), 500);
            }
        }, 3000);
    },

    initElasticPull() {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;
        if (window.innerWidth <= 1000) return;

        let startY = 0;
        let isPulling = false;
        const maxPull = 100;
        const resistance = 0.4;

        mainContent.addEventListener('touchstart', (e) => {
            if (mainContent.scrollTop > 0) return;
            startY = e.touches[0].clientY;
            isPulling = true;
            mainContent.classList.add('elastic-pulling');
        }, { passive: true });

        mainContent.addEventListener('touchmove', (e) => {
            if (!isPulling) return;
            if (mainContent.scrollTop > 0) {
                isPulling = false;
                mainContent.classList.remove('elastic-pulling');
                return;
            }

            const deltaY = e.touches[0].clientY - startY;
            if (deltaY > 0) {
                e.preventDefault();
                const pullDistance = Math.min(deltaY * resistance, maxPull);
                mainContent.style.transform = `translateY(${pullDistance}px)`;
            }
        }, { passive: false });

        const endPull = () => {
            if (!isPulling) return;
            isPulling = false;
            mainContent.classList.remove('elastic-pulling');

            mainContent.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            mainContent.style.transform = 'translateY(0)';

            setTimeout(() => {
                mainContent.style.transition = '';
                mainContent.style.transform = '';
            }, 400);
        };

        mainContent.addEventListener('touchend', endPull);
        mainContent.addEventListener('touchcancel', endPull);
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
    },

    initResizeObserver() {
        const usageDom = document.getElementById('usageChart');
        const periodDom = document.getElementById('periodChart');
        
        if (!usageDom || !periodDom) return;

        setTimeout(() => {
            if (typeof ResizeObserver !== 'undefined') {
                this.resizeObserver = new ResizeObserver(() => {
                    window.requestAnimationFrame(() => this.handleResize());
                });
                
                this.resizeObserver.observe(usageDom.parentElement);
                this.resizeObserver.observe(periodDom.parentElement);
            } else {
                let resizeTimer;
                window.addEventListener('resize', () => {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(() => this.handleResize(), 300);
                });
            }
        }, 500);
    },

    initOrientationListener() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.forceRedrawCharts(), 600);
        });
    },

    forceRedrawCharts() {
        if (this.charts.usage) {
            this.charts.usage.dispose();
            this.charts.usage = null;
        }
        if (this.charts.period) {
            this.charts.period.dispose();
            this.charts.period = null;
        }
        this.initCharts();
        this.initParticles();
    },

    handleResize() {
        const currentWidth = window.innerWidth;
        const isLayoutChange = Math.abs(currentWidth - this.lastWidth) > 200;
        
        if (isLayoutChange) {
            this.forceRedrawCharts();
        } else {
            if (this.charts.usage) this.charts.usage.resize();
            if (this.charts.period) this.charts.period.resize();
        }
        this.lastWidth = currentWidth;
    },

    destroy() {
        if (this.resizeObserver) this.resizeObserver.disconnect();
        if (this.charts.usage) this.charts.usage.dispose();
        if (this.charts.period) this.charts.period.dispose();
    }
};

// ==========================================
// 地图控制器
// ==========================================
const MapController = {
    mapObj: null,
    wrapper: null,
    scale: 1,
    translateX: 0,
    translateY: 0,
    isDragging: false,
    startX: 0,
    startY: 0,

    init(mapElement) {
        this.mapObj = mapElement;
        this.wrapper = document.getElementById('mapWrapper');
        
        if (!this.mapObj || !this.wrapper) return;

        this.mapObj.style.transformOrigin = 'center center';
        this.mapObj.style.transition = 'transform 0.2s ease-out';
        
        this.updateTransform();
        this.bindEvents();
    },

    bindEvents() {
        if (!this.wrapper) return;

        this.wrapper.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.isDragging = true;
            this.startX = e.clientX - this.translateX;
            this.startY = e.clientY - this.translateY;
            this.wrapper.style.cursor = 'grabbing';
            this.mapObj.style.transition = 'none';
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            this.translateX = e.clientX - this.startX;
            this.translateY = e.clientY - this.startY;
            this.updateTransform();
        });

        window.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.wrapper.style.cursor = 'grab';
                this.mapObj.style.transition = 'transform 0.2s ease-out';
            }
        });
        
        this.wrapper.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.startX = e.touches[0].clientX - this.translateX;
                this.startY = e.touches[0].clientY - this.translateY;
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!this.isDragging || e.touches.length !== 1) return;
            this.translateX = e.touches[0].clientX - this.startX;
            this.translateY = e.touches[0].clientY - this.startY;
            this.updateTransform();
        }, { passive: true });

        window.addEventListener('touchend', () => {
            this.isDragging = false;
        });
        
        this.wrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            this.scale = Math.max(0.5, Math.min(4, this.scale * delta));
            this.updateTransform();
        }, { passive: false });
    },

    updateTransform() {
        if (!this.mapObj) return;
        this.mapObj.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    },

    zoomIn() {
        this.scale = Math.min(this.scale * 1.3, 4);
        this.updateTransform();
    },

    zoomOut() {
        this.scale = Math.max(this.scale * 0.7, 0.5);
        this.updateTransform();
    },
    
    reset() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('【调试】DOM 加载完成，2秒后初始化 App');
    setTimeout(() => App.init(), 100);
});

window.addEventListener('beforeunload', () => {
    App.destroy();
});