var BuildingApp = typeof BuildingApp !== 'undefined' ? BuildingApp : {
    data: {
        isImmersive: false,
        currentBuilding: null,
        currentProvince: null,
        provinceBuildings: []
    },

    init() {
        this.initGlobalLinkInterceptor();

        const saved = sessionStorage.getItem('menuState');
        if (saved) {
            try { this._pendingMenuState = JSON.parse(saved); } catch(e) {}
            sessionStorage.removeItem('menuState');
        }

        const buildingName = this.getUrlParam('name');
        if (!buildingName) {
            console.error('缺少参数，URL应为: building.html?name=故宫');
            return;
        }

        this.loadBuildingData(buildingName);

        let provinceName = this.getUrlParam('province');
        if (!provinceName && this.data.currentBuilding) {
            provinceName = this.data.currentBuilding.province;
        }

        if (provinceName) {
            this.loadProvinceData(provinceName);
        }

        this.initSidebarMenu();
        this.initParticles();
        this.initImmersiveMode();
        this.initCompactNav();
        this.bindEvents();
    },

    getUrlParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    },

    loadBuildingData(buildingName) {
        try {
            if (typeof BUILDING_DB === 'undefined') {
                console.error('BUILDING_DB 未定义，请检查 building-data.js 是否引入');
                return;
            }
            const data = BUILDING_DB;
            this.data.currentBuilding = data.buildings.find(b => b.name === buildingName);
            if (!this.data.currentBuilding) {
                console.error('未找到建筑:', buildingName);
                return;
            }

            const b = this.data.currentBuilding;
            document.title = b.name;

            const setText = (id, text) => {
                const el = document.getElementById(id);
                if (el) el.textContent = text;
            };
            const setHtml = (id, html) => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = html;
            };

            setText('buildingName', b.name);
            setText('buildingEnName', b.enName);
            setText('buildingPeriod', b.period);
            setText('immersiveBuildingName', b.name);
            setText('immersiveBuildingEnName', b.enName);
            setText('immersivePeriod', b.period);
            setText('crumbBuildingName', b.name);
            setText('tagLevel', b.level);
            setText('tagPeriod', b.period);
            setHtml('buildingDesc', b.desc);

            const baiduLink = document.getElementById('baiduLink');
            if (baiduLink) {
                baiduLink.href = b.baiduLink;
                baiduLink.target = '_self';
            }

            const imgPath = '../img/' + b.image;
            const heroImg = document.getElementById('heroImage');
            const immersiveImg = document.getElementById('immersiveImage');
            if (heroImg) { heroImg.src = imgPath; heroImg.alt = b.name; }
            if (immersiveImg) { immersiveImg.src = imgPath; immersiveImg.alt = b.name; }

            const mapPath = '../img/map/' + b.name + '_map.png';
            const mapImg = document.getElementById('mapImage');
            if (mapImg) {
                mapImg.src = mapPath;
                mapImg.alt = b.name + '位置地图';
                mapImg.onerror = function() {
                    this.style.display = 'none';
                    this.parentElement.innerHTML = '<div style="color:#666; text-align:center; padding:20px; font-size:14px;">地图加载中...</div>';
                };
            }

            const featureList = document.getElementById('featureList');
            if (featureList) {
                featureList.innerHTML = b.features.map(f => 
                    '<li><strong>' + f.title + '：</strong>' + f.desc + '</li>'
                ).join('');
            }

            const crumbMiddle = document.getElementById('crumbMiddle');
            const crumbBuildingName = document.getElementById('crumbBuildingName');
            const currentType = this.getUrlParam('type');

            if (crumbMiddle && crumbBuildingName) {
                if (currentType) {
                    crumbMiddle.textContent = currentType;
                    crumbMiddle.href = './type-hall.html?type=' + encodeURIComponent(currentType);
                } else {
                    crumbMiddle.textContent = b.province;
                    crumbMiddle.href = './profile.html?province=' + encodeURIComponent(b.province);
                }
                crumbBuildingName.textContent = b.name;
            }
        } catch (error) {
            console.error('加载建筑数据失败:', error);
        }
    },

    loadProvinceData(provinceName) {
        try {
            if (typeof PROFILE_DB === 'undefined') {
                console.error('PROFILE_DB 未定义');
                return;
            }
            const data = PROFILE_DB;
            const province = data.provinces.find(p => p.name === provinceName);
            if (province) {
                this.data.currentProvince = province;
                this.data.provinceBuildings = province.buildings;
            }
        } catch (error) {
            console.error('加载省份数据失败:', error);
        }
    },

    initGlobalLinkInterceptor() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            if (link.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) {
                e.preventDefault();
                e.stopPropagation();
                const href = link.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('javascript:')) {
                    window.location.href = href;
                }
            }
        }, true);
    },

    initSidebarMenu() {
        const container = document.getElementById('menuAccordion');
        const searchInput = document.getElementById('menuSearch');
        if (!container || !searchInput) return;

        const currentTypeName = this.getUrlParam('type');
        const currentProvinceName = this.data.currentProvince?.name || '';
        const currentBuildingName = this.data.currentBuilding?.name || '';
        const originalTexts = new Map();

        if (currentTypeName && typeof TYPE_DB !== 'undefined') {
            const typeData = TYPE_DB.types.find(t => t.name === currentTypeName);
            if (typeData && typeData.buildings) {
                const buildings = typeData.buildings;

                const buildFlatHtml = (items) => {
                    return items.map(b => {
                        const isCurrent = b.name === currentBuildingName;
                        const href = './building.html?name=' + encodeURIComponent(b.name) + '&type=' + encodeURIComponent(currentTypeName);
                        return '<a href="' + href + '" target="_self" class="accordion-link flat-link ' + (isCurrent ? 'current' : '') + '" data-name="' + b.name + '">' + b.name + '</a>';
                    }).join('');
                };

                const renderFlat = (items) => {
                    if (!items || items.length === 0) {
                        container.innerHTML = '<div class="menu-no-result">暂无数据</div>';
                        return;
                    }
                    container.innerHTML = buildFlatHtml(items);
                    container.querySelectorAll('.accordion-link').forEach(el => {
                        originalTexts.set(el, el.textContent);
                    });
                };

                const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                const filterFlat = (keyword) => {
                    if (!keyword) {
                        renderFlat(buildings);
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
                                const regex = new RegExp('(' + escapeRegex(keyword) + ')', 'gi');
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

                const saveMenuState = () => {
                    sessionStorage.setItem('menuState', JSON.stringify({
                        scrollTop: container.scrollTop,
                        searchValue: searchInput.value
                    }));
                };

                const attachSaveState = () => {
                    container.querySelectorAll('a').forEach(link => {
                        link.addEventListener('click', saveMenuState);
                    });
                };

                renderFlat(buildings);
                attachSaveState();

                if (this._pendingMenuState) {
                    const state = this._pendingMenuState;
                    const doRestore = () => {
                        if (state.searchValue) {
                            searchInput.value = state.searchValue;
                            filterFlat(state.searchValue);
                        }
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                setTimeout(() => {
                                    container.scrollTop = state.scrollTop || 0;
                                }, 200);
                            });
                        });
                        this._pendingMenuState = null;
                    };
                    requestAnimationFrame(doRestore);
                }

                searchInput.addEventListener('input', (e) => filterFlat(e.target.value.trim()));
                container.dataset.initialized = 'true';
                return;
            }
        }

        let allProvinces = [];
        if (typeof PROFILE_DB !== 'undefined') {
            allProvinces = PROFILE_DB.provinces;
        }

        if (allProvinces.length === 0) {
            container.innerHTML = '<div class="menu-no-result">暂无数据</div>';
            return;
        }

        const buildHtml = (provinces) => {
            return provinces.map((province, pIdx) => {
                const isActive = province.name === currentProvinceName ? 'active' : '';
                const buildings = province.buildings || [];
                const links = buildings.map(b => {
                    const isCurrent = b.name === currentBuildingName;
                    const href = './building.html?name=' + encodeURIComponent(b.name) + '&province=' + encodeURIComponent(province.name);
                    return '<a href="' + href + '" target="_self" class="accordion-link ' + (isCurrent ? 'current' : '') + '" data-pidx="' + pIdx + '" data-name="' + b.name + '">' + b.name + '</a>';
                }).join('');

                const headerHref = './profile.html?province=' + encodeURIComponent(province.name);

                return '<div class="accordion-item ' + isActive + '" data-pidx="' + pIdx + '" data-pname="' + province.name + '">' +
                    '<a href="' + headerHref + '" target="_self" class="accordion-header" data-pidx="' + pIdx + '">' +
                    '<span class="header-text">' + province.name + '</span>' +
                    '</a>' +
                    '<div class="accordion-body">' + links + '</div>' +
                    '</div>';
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
            attachSaveState();
        };

        const doExpand = (pname, willBeActive) => {
            if (!searchInput.value.trim()) {
                container.querySelectorAll('.accordion-item').forEach(i => {
                    if (i.dataset.pname !== pname) i.classList.remove('active');
                });
            }
            container.querySelectorAll('[data-pname="' + pname + '"]').forEach(i => {
                i.classList.toggle('active', willBeActive);
            });
        };

        const navigateTo = (href) => {
            window.location.href = href;
        };

        const saveMenuState = () => {
            const activeItem = container.querySelector('.accordion-item.active');
            sessionStorage.setItem('menuState', JSON.stringify({
                activeProvince: activeItem?.dataset.pname || '',
                scrollTop: container.scrollTop,
                searchValue: searchInput.value
            }));
        };

        const attachSaveState = () => {
            container.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', saveMenuState);
            });
        };

        const bindAccordion = () => {
            container.querySelectorAll('.accordion-header').forEach(header => {
                header.addEventListener('click', (e) => {
                    e.preventDefault();
                    const href = header.getAttribute('href');
                    const pname = header.closest('.accordion-item').dataset.pname;
                    const isActive = header.closest('.accordion-item').classList.contains('active');
                    const willBeActive = !isActive;

                    saveMenuState();
                    doExpand(pname, willBeActive);

                    setTimeout(() => navigateTo(href), 80);
                });
            });
        };

        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const filter = (keyword) => {
            if (!keyword) {
                render(allProvinces);
                const current = container.querySelector('[data-pname="' + currentProvinceName + '"]');
                if (current) current.classList.add('active');
                const noResult = container.querySelector('.menu-no-result');
                if (noResult) noResult.remove();
                return;
            }
            const lowerK = keyword.toLowerCase();
            let hasAnyMatch = false;
            allProvinces.forEach((province, pIdx) => {
                const item = container.querySelector('.accordion-item[data-pidx="' + pIdx + '"]');
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
                            const regex = new RegExp('(' + escapeRegex(keyword) + ')', 'gi');
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
                            const regex = new RegExp('(' + escapeRegex(keyword) + ')', 'gi');
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

        render(allProvinces);

        if (this._pendingMenuState) {
            const state = this._pendingMenuState;
            const doRestore = () => {
                if (state.activeProvince) {
                    if (!state.searchValue) {
                        container.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
                    }
                    container.querySelectorAll('[data-pname="' + state.activeProvince + '"]').forEach(i => {
                        i.classList.add('active');
                    });
                }
                if (state.searchValue) {
                    searchInput.value = state.searchValue;
                    filter(state.searchValue);
                }
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            container.scrollTop = state.scrollTop || 0;
                        }, 200);
                    });
                });
                this._pendingMenuState = null;
            };
            requestAnimationFrame(doRestore);
        }

        searchInput.addEventListener('input', (e) => filter(e.target.value.trim()));
        container.dataset.initialized = 'true';
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
        immersiveMode.addEventListener('click', () => {
            if (this.data.isImmersive) this.exitImmersiveMode();
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
            const toggleMenu = (e) => {
                if (e) { e.preventDefault(); e.stopPropagation(); }
                const isOpen = sidebar.classList.toggle('open');
                mobileToggle.classList.toggle('hidden', isOpen);
                if (overlay) overlay.classList.toggle('active', isOpen);
            };

            mobileToggle.addEventListener('click', toggleMenu);
            mobileToggle.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu();
            }, { passive: false });
        }

        if (overlay && sidebar && mobileToggle) {
            const closeMenu = (e) => {
                if (e) { e.preventDefault(); e.stopPropagation(); }
                sidebar.classList.remove('open');
                mobileToggle.classList.remove('hidden');
                overlay.classList.remove('active');
            };
            overlay.addEventListener('click', closeMenu);
            overlay.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            }, { passive: false });
        }
    }
};

var __buildingInitAttached = typeof __buildingInitAttached !== 'undefined' ? __buildingInitAttached : false;
if (!__buildingInitAttached) {
    __buildingInitAttached = true;
    const init = () => { BuildingApp.init(); };
    document.addEventListener('DOMContentLoaded', init);
}