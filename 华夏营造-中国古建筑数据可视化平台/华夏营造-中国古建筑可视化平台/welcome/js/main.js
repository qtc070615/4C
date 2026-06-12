// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('hidden');
            }
        }, 2200);
    });

    const initParticles = () => {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) {
            return;
        }
        
        particlesContainer.innerHTML = '';
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 水平随机分布
            particle.style.left = Math.random() * 100 + '%';
            
            // 【大厅风格】从底部出生
            particle.style.bottom = '-10px';
            particle.style.top = 'auto';
            
            // 【关键】更大尺寸 3-6px，像大厅那样是明显的光点
            const size = 3 + Math.random() * 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // 随机时长 12-20秒缓慢上升
            particle.style.animationDuration = (12 + Math.random() * 8) + 's';
            
            // 随机延迟 0-5秒
            particle.style.animationDelay = Math.random() * 5 + 's';
            
            particlesContainer.appendChild(particle);
        }
    };

    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) {
                startTimestamp = timestamp;
            }
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            obj.innerHTML = current.toLocaleString() + (end > 100 ? '+' : '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    };

    const initStatsAnimation = () => {
        const stats = document.querySelectorAll('.stat-number');
        
        setTimeout(() => {
            stats.forEach((stat) => {
                const target = parseInt(stat.getAttribute('data-target')) || 0;
                animateValue(stat, 0, target, 1000);
            });
        }, 2300);
    };

    initParticles();
    initStatsAnimation();
    
});