const BuildingApp = {
    data: {
        isImmersive: false,
        currentBuilding: null,
        currentProvince: null,
        provinceBuildings: []
    },

    init() {
        const buildingName = this.getUrlParam('name');
        const provinceName = this.getUrlParam('province');

        if (!buildingName || !provinceName) {
            console.error('缺少参数，URL应为: building.html?name=故宫&province=北京');
            return;
        }

        this.loadBuildingData(buildingName);
        this.loadProvinceData(provinceName);
        
        const menuContainer = document.getElementById('menuAccordion');
        const isMenuReady = menuContainer && menuContainer.children.length > 0 && !menuContainer.querySelector('.menu-no-result');
        if (isMenuReady) {
            this.updateMenuHighlight();
        } else {
            this.initSidebarMenu();
        }
        
        this.initParticles();
        this.initImmersiveMode();
        this.initCompactNav();
        this.bindEvents();
    },

    getUrlParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    },

    loadBuildingData(buildingName) {
        try {
            const data = BUILDING_DB;
            this.data.currentBuilding = data.buildings.find(b => b.name === buildingName);
            
            if (!this.data.currentBuilding) {
                console.error('未找到建筑:', buildingName);
                return;
            }

            const b = this.data.currentBuilding;

            document.title = b.name;
            document.getElementById('buildingName').textContent = b.name;
            document.getElementById('buildingEnName').textContent = b.enName;
            document.getElementById('buildingPeriod').textContent = b.period;
            document.getElementById('immersiveBuildingName').textContent = b.name;
            document.getElementById('immersiveBuildingEnName').textContent = b.enName;
            document.getElementById('immersivePeriod').textContent = b.period;
            document.getElementById('crumbBuildingName').textContent = b.name;
            document.getElementById('tagLevel').textContent = b.level;
            document.getElementById('tagPeriod').textContent = b.period;
            
            document.getElementById('buildingDesc').innerHTML = b.desc;
            document.getElementById('baiduLink').href = b.baiduLink;
            
            const imgPath = `../img/${b.image}`;
            document.getElementById('heroImage').src = imgPath;
            document.getElementById('heroImage').alt = b.name;
            document.getElementById('immersiveImage').src = imgPath;
            document.getElementById('immersiveImage').alt = b.name;

            const mapPath = `../img/map/${b.name}_map.png`;
            const mapImg = document.getElementById('mapImage');
            if (mapImg) {
                mapImg.src = mapPath;
                mapImg.alt = `${b.name}位置地图`;
                mapImg.onerror = function() {
                    this.style.display = 'none';
                    this.parentElement.innerHTML = '<div style="color:#666; text-align:center; padding:20px; font-size:14px;">地图加载中...</div>';
                };
            }

            const featureList = document.getElementById('featureList');
            featureList.innerHTML = b.features.map(f => 
                `<li><strong>${f.title}：</strong>${f.desc}</li>`
            ).join('');

        } catch (error) {
            console.error('加载建筑数据失败:', error);
        }
    },

    loadProvinceData(provinceName) {
        try {
            const data = PROFILE_DB;
            const province = data.provinces.find(p => p.name === provinceName);
            
            if (province) {
                this.data.currentProvince = province;
                this.data.provinceBuildings = province.buildings;
                
                document.getElementById('crumbProvince').textContent = province.name;
                
                const hallUrl = `./profile.html?province=${encodeURIComponent(province.name)}`;
                document.getElementById('backToHall').href = hallUrl;
                document.getElementById('crumbProvince').href = hallUrl;
            }
        } catch (error) {
            console.error('加载省份数据失败:', error);
        }
    },

    updateMenuHighlight() {
        const container = document.getElementById('menuAccordion');
        if (!container || !this.data.currentProvince) return;
        const currentProvinceName = this.data.currentProvince.name;
        const currentBuildingName = this.data.currentBuilding?.name || '';
        
        container.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
        container.querySelectorAll('.accordion-link').forEach(l => l.classList.remove('current'));
        
        container.querySelectorAll(`[data-pname="${currentProvinceName}"]`).forEach(i => {
            i.classList.add('active');
        });
        container.querySelectorAll('.accordion-link').forEach(l => {
            if (l.dataset.name === currentBuildingName) l.classList.add('current');
        });
    },

    initSidebarMenu() {
        const container = document.getElementById('menuAccordion');
        const searchInput = document.getElementById('menuSearch');
        if (!container || !searchInput || typeof PROFILE_DB === 'undefined') return;

        const allProvinces = PROFILE_DB.provinces;
        const currentProvinceName = this.data.currentProvince?.name || '';
        const currentBuildingName = this.data.currentBuilding?.name || '';
        const originalTexts = new Map();
        let loopEnabled = false;
        let originalHeight = 0;

        const buildHtml = (provinces, isClone) => {
            return provinces.map((province, pIdx) => {
                const isActive = province.name === currentProvinceName ? 'active' : '';
                const buildings = province.buildings || [];
                const loopAttr = isClone ? 'data-loop="clone"' : '';

                const links = buildings.map(b => {
                    const isCurrent = b.name === currentBuildingName;
                    const href = `./building.html?name=${encodeURIComponent(b.name)}&province=${encodeURIComponent(province.name)}`;
                    return `<a href="${href}" class="accordion-link ${isCurrent ? 'current' : ''}" data-pidx="${pIdx}" data-name="${b.name}">${b.name}</a>`;
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
                        window.location.href = href;
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

    initImmersiveMode() {
        if (window.innerWidth <= 1000) return;

        const mainContent = document.getElementById('mainContent');
        const immersiveMode = document.getElementById('immersiveMode');
        const heroContainer = document.getElementById('heroContainer');

        if (!mainContent || !immersiveMode) return;

        if (heroContainer) {
            heroContainer.style.cursor = 'zoom-in';
            heroContainer.addEventListener('dblclick', () => {
                if (window.innerWidth > 1000 && !this.data.isImmersive && mainContent.scrollTop === 0) {
                    this.enterImmersiveMode();
                }
            });
        }

        immersiveMode.addEventListener('click', (e) => {
            if (this.data.isImmersive) {
                this.exitImmersiveMode();
            }
        });
    },

    enterImmersiveMode() {
        if (this.data.isImmersive) return;
        this.data.isImmersive = true;

        const mainContent = document.getElementById('mainContent');
        const immersiveMode = document.getElementById('immersiveMode');
        const sidebar = document.getElementById('sidebar');

        if (sidebar) sidebar.style.transform = 'translateX(-100%)';

        if (mainContent) {
            mainContent.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease';
            mainContent.style.transform = 'scale(0.92) translateY(30px)';
            mainContent.style.opacity = '0';
        }

        if (immersiveMode) {
            immersiveMode.style.display = 'block';
            immersiveMode.style.opacity = '0';
            immersiveMode.style.transform = 'scale(1.08)';
            immersiveMode.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';

            immersiveMode.offsetHeight;

            setTimeout(() => {
                immersiveMode.classList.add('active');
                immersiveMode.style.opacity = '1';
                immersiveMode.style.transform = 'scale(1)';
            }, 50);
        }
    },

    exitImmersiveMode() {
        if (!this.data.isImmersive) return;
        this.data.isImmersive = false;

        const mainContent = document.getElementById('mainContent');
        const immersiveMode = document.getElementById('immersiveMode');
        const sidebar = document.getElementById('sidebar');

        if (immersiveMode) {
            immersiveMode.style.opacity = '0';
            immersiveMode.style.transform = 'scale(1.05)';
            immersiveMode.classList.remove('active');
        }

        setTimeout(() => {
            if (mainContent) {
                mainContent.style.transform = 'scale(1) translateY(0)';
                mainContent.style.opacity = '1';
            }
            if (sidebar) sidebar.style.transform = '';

            setTimeout(() => {
                if (mainContent) {
                    mainContent.style.transition = '';
                    mainContent.style.transform = '';
                    mainContent.style.opacity = '';
                }
                if (immersiveMode) {
                    immersiveMode.style.transition = '';
                    immersiveMode.style.transform = '';
                    immersiveMode.style.display = '';
                }
            }, 600);
        }, 300);
    },

    initCompactNav() {
        const mainContent = document.getElementById('mainContent');
        const heroContainer = document.getElementById('heroContainer');
        const compactNav = document.getElementById('compactNav');
        const topBar = document.querySelector('.top-bar');

        if (!mainContent || !heroContainer || !compactNav) return;

        const buildingName = document.getElementById('buildingName')?.textContent || '';
        const buildingPeriod = document.getElementById('buildingPeriod')?.textContent || '';
        
        const navTitle = compactNav.querySelector('.nav-title');
        const navPeriod = compactNav.querySelector('.nav-period');
        if (navTitle) navTitle.textContent = buildingName;
        if (navPeriod) navPeriod.textContent = buildingPeriod;

        mainContent.addEventListener('scroll', () => {
            const heroHeight = heroContainer.offsetHeight;
            const scrollTop = mainContent.scrollTop;

            if (scrollTop > heroHeight * 0.8) {
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
    }
};

const init = () => {
    BuildingApp.init();
};
document.addEventListener('DOMContentLoaded', init);
document.addEventListener('turbo:load', init);