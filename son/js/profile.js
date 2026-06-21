// 华夏营造 - 省份大厅主逻辑（带调试版本）
const App = {
    charts: { usage: null, period: null },
    resizeObserver: null,
    lastWidth: window.innerWidth,
    currentProvince: null,

    init() {
        console.log('【调试】App.init() 开始执行');
        
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
        
        // Turbo 导航后菜单已存在（permanent），只更新高亮
        const menuContainer = document.getElementById('menuAccordion');
        const isMenuReady = menuContainer && menuContainer.children.length > 0 && !menuContainer.querySelector('.menu-no-result');
        if (isMenuReady) {
            this.updateMenuHighlight();
        } else {
            this.initSidebarMenu();
        }
        
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

            const pageTitleEl = document.getElementById('pageTitle');
            if (pageTitleEl) {
                pageTitleEl.textContent = this.currentProvince.name;
                console.log('【调试】已更新 pageTitle');
            }

            const pageEnNameEl = document.getElementById('pageEnName');
            if (pageEnNameEl) {
                pageEnNameEl.textContent = this.currentProvince.enName;
            }

            const provinceDescEl = document.getElementById('provinceDesc');
            if (provinceDescEl) {
                provinceDescEl.innerHTML = this.currentProvince.desc.replace(/\n/g, '<br>');
            }

            const buildingNumEl = document.getElementById('buildingNum');
            if (buildingNumEl) {
                buildingNumEl.textContent = this.currentProvince.buildingCount;
            }

            const navProvinceNameEl = document.getElementById('navProvinceName');
            if (navProvinceNameEl) {
                navProvinceNameEl.textContent = this.currentProvince.name;
            }

            const navBuildingCountEl = document.getElementById('navBuildingCount');
            if (navBuildingCountEl) {
                navBuildingCountEl.textContent = `现存 ${this.currentProvince.buildingCount} 处`;
            }

            const provinceMapEl = document.getElementById('provinceMap');
            if (provinceMapEl) {
                provinceMapEl.data = `../map/${this.currentProvince.mapFile}`;
                console.log('【调试】地图文件路径：', provinceMapEl.data);
            }

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

    updateMenuHighlight() {
        const container = document.getElementById('menuAccordion');
        if (!container || !this.currentProvince) return;
        const currentProvinceName = this.currentProvince.name;
        
        container.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
        container.querySelectorAll(`[data-pname="${currentProvinceName}"]`).forEach(i => {
            i.classList.add('active');
        });
    },

    initSidebarMenu() {
        const container = document.getElementById('menuAccordion');
        const searchInput = document.getElementById('menuSearch');
        if (!container || !searchInput || typeof PROFILE_DB === 'undefined') return;

        const allProvinces = PROFILE_DB.provinces;
        const currentProvinceName = this.currentProvince?.name || '';
        const originalTexts = new Map();
        let loopEnabled = false;
        let originalHeight = 0;

        const buildHtml = (provinces, isClone) => {
            return provinces.map((province, pIdx) => {
                const isActive = province.name === currentProvinceName ? 'active' : '';
                const buildings = province.buildings || [];
                const loopAttr = isClone ? 'data-loop="clone"' : '';

                const links = buildings.map(b => {
                    const href = `./building.html?name=${encodeURIComponent(b.name)}&province=${encodeURIComponent(province.name)}`;
                    return `<a href="${href}" class="accordion-link" data-pidx="${pIdx}" data-name="${b.name}">${b.name}</a>`;
                }).join('');

                return `
                    <div class="accordion-item ${isActive}" data-pidx="${pIdx}" data-pname="${province.name}" ${loopAttr}>
                        <a href="./profile.html?province=${encodeURIComponent(province.name)}" class="accordion-header" data-pidx="${pIdx}">
                            <span class="header-text">${province.name}</span>
                        </a>
                        <div class="accordion-body">${links}</div>
                    </div>
                `;
            }).join('');
        };

        const render = (items, isSearch = false) => {
            if (!items || items.length === 0) {
                container.innerHTML = '<div class="menu-no-result">未找到匹配结果</div>';
                loopEnabled = false;
                return;
            }

            if (!isSearch && items.length === allProvinces.length) {
                container.innerHTML = buildHtml(items, false) + buildHtml(items, true);
                loopEnabled = true;
                requestAnimationFrame(() => {
                    originalHeight = container.scrollHeight / 2;
                });
            } else {
                container.innerHTML = buildHtml(items, false);
                loopEnabled = false;
            }

            container.querySelectorAll('.header-text, .accordion-link').forEach(el => {
                originalTexts.set(el, el.textContent);
            });

            bindAccordion();
        };

        const doExpand = (pname, willBeActive) => {
            if (!searchInput.value.trim()) {
                container.querySelectorAll('.accordion-item').forEach(i => {
                    if (i.dataset.pname !== pname) i.classList.remove('active');
                });
            }
            container.querySelectorAll(`[data-pname="${pname}"]`).forEach(i => {
                i.classList.toggle('active', willBeActive);
            });
            if (loopEnabled) {
                requestAnimationFrame(() => {
                    originalHeight = container.scrollHeight / 2;
                });
            }
        };

        const bindAccordion = () => {
            container.querySelectorAll('.accordion-header').forEach(header => {
                header.addEventListener('click', (e) => {
                    e.preventDefault();
                    const href = header.getAttribute('href');
                    const pname = header.closest('.accordion-item').dataset.pname;
                    const item = header.closest('.accordion-item');
                    const isActive = item.classList.contains('active');
                    const willBeActive = !isActive;

                    const urlParams = new URLSearchParams(window.location.search);
                    const currentPageProvince = urlParams.get('province');
                    const isProfilePage = window.location.pathname.includes('profile.html');
                    const isCurrentProvince = isProfilePage && currentPageProvince === pname;

                    const allItems = container.querySelectorAll(`[data-pname="${pname}"]`);
                    const containerRect = container.getBoundingClientRect();
                    let targetEl = null;
                    let minDist = Infinity;

                    allItems.forEach(el => {
                        const rect = el.getBoundingClientRect();
                        const dist = rect.top - containerRect.top;
                        if (dist >= -2 && dist < minDist) {
                            minDist = dist;
                            targetEl = el;
                        }
                    });
                    if (!targetEl) targetEl = allItems[allItems.length - 1];

                    const scrollOffset = targetEl.getBoundingClientRect().top - containerRect.top + container.scrollTop;

                    container.removeEventListener('scroll', handleLoopScroll, { passive: true });
                    container.scrollTo({ top: scrollOffset, behavior: 'smooth' });

                    setTimeout(() => {
                        doExpand(pname, willBeActive);
                        container.addEventListener('scroll', handleLoopScroll, { passive: true });

                        if (!isCurrentProvince) {
                            window.location.href = href;
                        }
                    }, 350);
                });
            });
        };

        const handleLoopScroll = () => {
            if (!loopEnabled || !originalHeight) return;
            const st = container.scrollTop;
            if (st >= originalHeight) {
                container.scrollTop = st - originalHeight;
            } else if (st < 0) {
                container.scrollTop = st + originalHeight;
            }
        };

        container.addEventListener('scroll', handleLoopScroll, { passive: true });

        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const filter = (keyword) => {
            if (!keyword) {
                render(allProvinces, false);
                const current = container.querySelector(`[data-pname="${currentProvinceName}"]:not([data-loop])`);
                if (current) current.classList.add('active');
                const noResult = container.querySelector('.menu-no-result');
                if (noResult) noResult.remove();
                return;
            }

            const lowerK = keyword.toLowerCase();
            let hasAnyMatch = false;

            allProvinces.forEach((province, pIdx) => {
                const item = container.querySelector(`.accordion-item[data-pidx="${pIdx}"]:not([data-loop])`);
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

        render(allProvinces, false);
        searchInput.addEventListener('input', (e) => filter(e.target.value.trim()));

        const current = container.querySelector(`[data-pname="${currentProvinceName}"]:not([data-loop])`);
        if (current) current.classList.add('active');
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

const init = () => {
    setTimeout(() => App.init(), 100);
};
document.addEventListener('DOMContentLoaded', init);
document.addEventListener('turbo:load', init);

window.addEventListener('beforeunload', () => {
    App.destroy();
});