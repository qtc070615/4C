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

        // 直接读取全局变量 BUILDING_DB 和 PROFILE_DB（由 building-data.js 和 profile-data.js 提供）
        this.loadBuildingData(buildingName);
        this.loadProvinceData(provinceName);
        
        this.initBuildingList();
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
            // 直接读取全局变量（无需网络请求）
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

            // 加载地图图片 - 修复：改为.png后缀，添加容错
            const mapPath = `../img/map/${b.name}_map.png`;  // ← 修复：jpg改为png
            const mapImg = document.getElementById('mapImage');
            if (mapImg) {
                mapImg.src = mapPath;
                mapImg.alt = `${b.name}位置地图`;
                // 加载失败时显示提示
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
            // 直接读取全局变量
            const data = PROFILE_DB;
            const province = data.provinces.find(p => p.name === provinceName);
            
            if (province) {
                this.data.currentProvince = province;
                this.data.provinceBuildings = province.buildings;
                
                document.getElementById('sidebarProvince').textContent = province.name;
                document.getElementById('crumbProvince').textContent = province.name;
                
                const hallUrl = `./profile.html?province=${encodeURIComponent(province.name)}`;
                document.getElementById('hallLink').href = hallUrl;
                document.getElementById('backToHall').href = hallUrl;
                document.getElementById('crumbProvince').href = hallUrl;
            }
        } catch (error) {
            console.error('加载省份数据失败:', error);
        }
    },

    initBuildingList() {
        const container = document.getElementById('buildingListContainer');
        if (!container) return;

        const currentName = this.data.currentBuilding?.name;
        const buildings = this.data.provinceBuildings;

        container.innerHTML = '';

        buildings.forEach(b => {
            const li = document.createElement('li');
            li.className = 'building-item';

            const isActive = b.name === currentName;
            const linkClass = isActive ? 'building-link active' : 'building-link';
            const href = isActive ? '#' : `./building.html?name=${encodeURIComponent(b.name)}&province=${encodeURIComponent(this.data.currentProvince.name)}`;

            li.innerHTML = `<a href="${href}" class="${linkClass}" ${isActive ? 'onclick="return false;"' : ''}>${b.name}</a>`;
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

        // 【修改】沉浸模式全屏点击退出（取代原来的仅提示框点击）
        // 提示框本身 pointer-events: none，点击会直接冒泡到 immersiveMode 容器
        immersiveMode.addEventListener('click', (e) => {
            // 无论点击哪里（图片、文字、空白处）都退出沉浸模式
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

document.addEventListener('DOMContentLoaded', () => {
    BuildingApp.init();
});