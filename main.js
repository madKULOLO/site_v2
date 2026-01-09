console.log('Liquid Glass Design System initialized');

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupThemeToggle();
        this.updateThemeIcon(this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.updateThemeIcon(theme);
    }

    setupThemeToggle() {
        const toggleButton = document.getElementById('themeToggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
                this.applyTheme(newTheme);
            });
        }
    }

    updateThemeIcon(theme) {
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.getElementById('themeText');
        
        if (themeIcon && themeText) {
            if (theme === 'light') {
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Ариец';
            } else {
                themeIcon.textContent = '🌑';
                themeText.textContent = 'Негр';
            }
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

class LoadingManager {
    static hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            setTimeout(() => {
                loading.classList.add('hidden');
            }, 800);
        }
    }
}

class BannerManager {
    static initCloseBanner() {
        const closeBannerBtn = document.getElementById('closeBannerBtn');
        if (closeBannerBtn) {
            closeBannerBtn.addEventListener('click', function() {
                const streamBanner = document.getElementById('streamBanner');
                if (streamBanner) {
                    streamBanner.classList.remove('active');
                }
            });
        }
    }
}

class StreamStatus {
    static async checkStatus() {
        try {
            const response = await fetch('https://api.twitch.tv/helix/streams?user_login=madkulolo', {
                headers: {
                    'Client-ID': 'gp762nuuoqcoxypju8c569th9wz7q5',
                    'Authorization': 'Bearer nicnpw2xfm36f0fewnz1dtzww9i3hj'
                }
            });
            const data = await response.json();
            const isLive = data.data && data.data.length > 0 && data.data[0].type === 'live';
            
            const streamBanner = document.getElementById('streamBanner');
            if (streamBanner && isLive) {
                streamBanner.classList.add('active');
            }
            
            const backBtn = document.getElementById('backBtn');
            const backText = document.getElementById('backText');
            if (backBtn && backText && isLive) {
                backBtn.href = 'https://www.twitch.tv/madkulolo';
                backText.textContent = '🔴 Назад на стрим';
                backBtn.classList.add('live');
            }
            
            const eyesBackBtn = document.querySelector('.back-btn:not(#backBtn)');
            if (eyesBackBtn && isLive && !backBtn) {
                eyesBackBtn.href = 'https://www.twitch.tv/madkulolo';
                eyesBackBtn.textContent = '🔴 Назад на стрим';
                eyesBackBtn.classList.add('live');
            }
        } catch (error) {
            console.error('Stream check failed:', error);
        }
    }
}

class PlayerManager {
    constructor() {
        this.channels = [
            {
                id: 'madkulolo',
                title: 'С ДЕДОМ<br>НЕ СКУФИСЬ',
                subtitle: 'ПОДЕЛИСЬ',
                playerUrl: 'https://stream.deduso.su/b4f30518-04f7-4a78-a3a3-5ce0b836a160.html#hide-scrollbars',
                channelTitle: '🎮 ДЕД',
                donateButtons: [
                    { href: 'https://www.donationalerts.com/r/madkulolo', text: '💸 Донатируй деду' },
                    { href: 'https://boosty.to/madkulolo', text: '⭐ Батя гордился бы тобой?' },
                    { href: 'https://memealerts.com/madkulolo', text: '🎭 Мемный алёрт' }
                ],
                socialLinks: [
                    { href: 'https://vk.com/kulologame_s', icon: '🎮' },
                    { href: 'https://www.youtube.com/channel/UCVaL-dYvw-xIWv8sogeDylg', icon: '📺' },
                    { href: 'https://www.twitch.tv/madkulolo', icon: '📡' },
                    { href: 'https://t.me/+tl9RiWcbMVw5NzAy', icon: '✈️' },
                    { href: 'mailto:ads@mikhail.one', icon: '✉️' },
                    { href: 'https://www.tiktok.com/@madkulolo', icon: '🎵' },
                    { href: './commands.html', icon: '⌨️' }
                ]
            },
            {
                id: 'mrrmaikl',
                title: 'выход есть',
                subtitle: 'вскрываемся!',
                playerUrl: 'https://stream.deduso.su/9f3dda91-feed-452d-aec7-9171d404109e.html#hide-scrollbars',
                channelTitle: '💀 Кабина',
                donateButtons: [
                    { href: 'https://memealerts.com/mrrmaikl', text: 'помощь' },
                    { href: 'https://www.donationalerts.com/r/mrrmaikl', text: 'донат на лезвие' }
                ],
                socialLinks: [
                    { href: this.isMobile() ? 'tel:8-800-2000-122' : 'https://telefon-doveriya.ru', icon: '📞', title: this.isMobile() ? 'Позвонить' : 'Перейти' },
                    { href: 'https://t.me/mrrmaikl', icon: '✈️' },
                    { href: 'https://www.twitch.tv/mrrmaikl', icon: '📡' }
                ]
            }
        ];
        this.init();
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        const channelSelect = document.getElementById('channelSelect');
        const streamPlayer = document.getElementById('streamPlayer');
        if (channelSelect && streamPlayer) {
            channelSelect.addEventListener('change', (e) => {
                this.switchChannel(e.target.value);
            });
            
            this.hideIframeScrollbars();
            
            streamPlayer.addEventListener('load', () => {
                this.hideIframeScrollbars();
            });
            
            channelSelect.addEventListener('change', () => {
                setTimeout(() => {
                    this.hideIframeScrollbars();
                }, 100);
            });
            
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.hideIframeScrollbars();
                }, 500);
            });
            
            setInterval(() => {
                this.hideIframeScrollbars();
            }, 2000);
            
            this.switchChannel('madkulolo');
        }
    }

    switchChannel(channelId) {
        const channel = this.channels.find(ch => ch.id === channelId);
        if (channel) {
            const streamPlayer = document.getElementById('streamPlayer');
            const mainTitle = document.getElementById('mainTitle');
            const mainSubtitle = document.getElementById('mainSubtitle');
            const channelTitle = document.getElementById('channelTitle');
            const btnGroup = document.getElementById('btnGroup');
            const socialLinks = document.getElementById('socialLinks');
            
            if (streamPlayer) streamPlayer.src = channel.playerUrl;
            if (mainTitle) mainTitle.innerHTML = channel.title;
            if (mainSubtitle) mainSubtitle.textContent = channel.subtitle;
            if (channelTitle) channelTitle.textContent = channel.channelTitle;
            
            if (btnGroup) {
                btnGroup.innerHTML = '';
                const isDangerousCabin = channel.id === 'mrrmaikl';
                
                channel.donateButtons.forEach((btn, index) => {
                    const a = document.createElement('a');
                    a.href = btn.href;
                    a.target = '_blank';
                    a.id = `donation-btn-${index}`;
                    
                    if (isDangerousCabin) {
                        a.className = 'glass-btn danger';
                    } else {
                        if (index === 0) {
                            a.className = 'glass-btn white';
                        } else if (index === 1) {
                            a.className = 'glass-btn primary';
                        } else {
                            a.className = 'glass-btn danger';
                        }
                    }
                    
                    if (btn.href.includes('donationalerts') || btn.href.includes('memealerts')) {
                        a.innerHTML = `<span>${btn.text}</span>`;
                    } else {
                        a.innerHTML = `<span>${btn.text}</span>`;
                    }
                    
                    btnGroup.appendChild(a);
                });
                
                setTimeout(() => {
                    channel.donateButtons.forEach((btn, index) => {
                        if (btn.href.includes('donationalerts') || btn.href.includes('memealerts')) {
                            const buttonElement = document.getElementById(`donation-btn-${index}`);
                            if (buttonElement) {
                                buttonElement.addEventListener('click', function(e) {
                                    e.preventDefault();
                                    if (btn.text === '💸 Донатируй деду') {
                                        showDonationModal(btn.href);
                                    } else {
                                        window.open(btn.href, '_blank');
                                    }
                                });
                            }
                        }
                    });
                }, 0);
            }
            
            if (socialLinks) {
                socialLinks.innerHTML = '';
                channel.socialLinks.forEach(soc => {
                    const a = document.createElement('a');
                    a.href = soc.href;
                    a.target = soc.href.startsWith('tel:') ? '_self' : '_blank';
                    a.className = 'social-link';
                    a.title = soc.icon === '🎮' ? 'VK' : 
                              soc.icon === '📺' ? 'YouTube' : 
                              soc.icon === '📡' ? 'Twitch' : 
                              soc.icon === '✈️' ? 'Telegram' : 
                              soc.icon === '✉️' ? 'Email' : 
                              soc.icon === '📞' ? 'Телефон' : 
                              soc.icon === '🎵' ? 'TikTok' : 
                              soc.icon === '⌨️' ? 'Команды' : 
                              soc.icon === '👁' ? 'Узри' : '';
                    a.textContent = soc.icon;
                    socialLinks.appendChild(a);
                });
            }
        }
    }
    
    hideIframeScrollbars() {
        const streamPlayer = document.getElementById('streamPlayer');
        if (!streamPlayer) return;
        
        const iframe = streamPlayer;
        
        iframe.scrolling = "no";
        iframe.frameBorder = "0";    
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.overflow = 'hidden';
        iframe.style.overflowX = 'hidden';
        iframe.style.overflowY = 'hidden';
        iframe.style.scrollbarWidth = 'none';
        iframe.style.msOverflowStyle = 'none';
        iframe.style.transform = 'translateZ(0)';
        iframe.style.webkitTransform = 'translateZ(0)';
        iframe.style.willChange = 'transform';
        iframe.style.overscrollBehavior = 'contain';
        iframe.style.maxWidth = '100%';
        iframe.style.maxHeight = '100%';
        
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc) {
                iframeDoc.documentElement.style.overflow = 'hidden';
                iframeDoc.body.style.overflow = 'hidden';
                iframeDoc.documentElement.style.overflowX = 'hidden';
                iframeDoc.body.style.overflowX = 'hidden';
                iframeDoc.documentElement.style.overflowY = 'hidden';
                iframeDoc.body.style.overflowY = 'hidden';
                iframeDoc.documentElement.style.margin = '0';
                iframeDoc.body.style.margin = '0';
                iframeDoc.documentElement.style.padding = '0';
                iframeDoc.body.style.padding = '0';
                iframeDoc.documentElement.style.height = '100%';
                iframeDoc.body.style.height = '100%';
                iframeDoc.documentElement.style.width = '100%';
                iframeDoc.body.style.width = '100%';
                iframeDoc.documentElement.style.overscrollBehavior = 'contain';
                iframeDoc.body.style.overscrollBehavior = 'contain';
                iframeDoc.documentElement.style.maxWidth = '100%';
                iframeDoc.body.style.maxWidth = '100%';
                iframeDoc.documentElement.style.maxHeight = '100%';
                iframeDoc.body.style.maxHeight = '100%';
                
                const allElements = iframeDoc.querySelectorAll('*');
                allElements.forEach(element => {
                    element.style.overflow = 'hidden';
                    element.style.overflowX = 'hidden';
                    element.style.overflowY = 'hidden';
                    element.style.overscrollBehavior = 'contain';
                    element.style.maxWidth = '100%';
                    element.style.maxHeight = '100%';
                });
                
                const style = iframeDoc.createElement('style');
                style.textContent = `
                    html, body { 
                        overflow: hidden !important; 
                        overflow-x: hidden !important; 
                        overflow-y: hidden !important; 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        height: 100% !important; 
                        width: 100% !important; 
                        overscroll-behavior: contain !important;
                        max-width: 100% !important;
                        max-height: 100% !important;
                    }
                    * { 
                        overflow: hidden !important; 
                        overflow-x: hidden !important; 
                        overflow-y: hidden !important; 
                        scrollbar-width: none !important; 
                        overscroll-behavior: contain !important;
                        max-width: 100% !important;
                        max-height: 100% !important;
                    }
                    *::-webkit-scrollbar { 
                        display: none !important; 
                        width: 0 !important; 
                        height: 0 !important; 
                    }
                    .video-js, .vjs-tech, .vjs-poster { 
                        overflow: hidden !important; 
                        overflow-x: hidden !important; 
                        overflow-y: hidden !important; 
                        width: 100% !important;
                        height: 100% !important;
                        max-width: 100% !important;
                        max-height: 100% !important;
                        min-width: 100% !important;
                        min-height: 100% !important;
                    }
                `;
                iframeDoc.head.appendChild(style);
            }
        } catch (e) {
            console.log('Cannot access iframe content due to cross-origin policy');
        }
    }
}

class CommandUtils {
    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showCopyNotification();
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    static showCopyNotification() {
        const notification = document.getElementById('copiedNotification');
        if (notification) {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
        }
    }

    static handleEasterEggs(term) {
        const easterEggs = {
            'нигер': () => {
                alert('Дед говорит: не шути так, а то бан прилетит!');
            },
            'яйцо': () => {
                this.createFloatingElement('🥚', '5em', 2500);
            },
            'mrrmaikl': () => {
                this.createFloatingElement('💖 MrrMaikl — ЛУЧШАЯ ЖЕНА ДЕДА! 💖', '2.5em', 3000);
            },
            'alonerus': () => {
                this.createImageElement('./images/neko-8.jpg', 'neko', 3500);
            },
            'kessidi': () => {
                this.createFloatingElement('🦵<b>Kessidi</b>, дедовик ждёт твои ножки уже много лет... <br>Когда же деда дождётся? 😭🦵', '2em', 4000);
            }
        };

        if (easterEggs[term]) {
            easterEggs[term]();
            return true;
        }
        return false;
    }

    static createFloatingElement(content, fontSize, duration) {
        const element = document.createElement('div');
        element.style.position = 'fixed';
        element.style.left = '50%';
        element.style.top = '50%';
        element.style.transform = 'translate(-50%, -50%)';
        element.style.zIndex = 99999;
        element.style.fontSize = fontSize;
        element.style.background = 'var(--glass-bg)';
        element.style.color = 'var(--text-primary)';
        element.style.border = '2px solid var(--glass-border)';
        element.style.borderRadius = '50%';
        element.style.padding = '40px 60px';
        element.style.boxShadow = 'var(--glass-shadow)';
        element.style.backdropFilter = 'blur(var(--backdrop-blur))';
        element.style.textAlign = 'center';
        element.innerHTML = content;
        document.body.appendChild(element);
        setTimeout(() => element.remove(), duration);
    }

    static createImageElement(src, alt, duration) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.position = 'fixed';
        img.style.left = '50%';
        img.style.top = '50%';
        img.style.transform = 'translate(-50%, -50%)';
        img.style.zIndex = 99999;
        img.style.maxWidth = '60vw';
        img.style.maxHeight = '60vh';
        img.style.border = '2px solid var(--glass-border)';
        img.style.borderRadius = '20px';
        img.style.boxShadow = 'var(--glass-shadow)';
        img.style.backdropFilter = 'blur(var(--backdrop-blur))';
        document.body.appendChild(img);
        setTimeout(() => img.remove(), duration);
    }
}

class CommandUI {
    static initCategoryToggles() {
        const categories = document.querySelectorAll('.command-category');
        categories.forEach(category => {
            const header = category.querySelector('.category-header');
            if (header) {
                header.addEventListener('click', () => {
                    category.classList.toggle('expanded');
                });
            }
        });
    }

    static initCommandCopying() {
        const commands = document.querySelectorAll('.command');
        commands.forEach(cmd => {
            cmd.addEventListener('click', function() {
                const text = this.getAttribute('data-cmd');
                CommandUtils.copyToClipboard(text);
            });
        });
    }

    static initSearchFunctionality() {
        const searchBox = document.getElementById('searchBox');
        if (searchBox) {
            searchBox.addEventListener('input', function() {
                const term = this.value.toLowerCase().trim();
                
                if (CommandUtils.handleEasterEggs(term)) {
                    this.value = 'сломали поиск...'; 
                    return;
                }
                
                if (!term) {
                    CommandUI.resetSearch();
                    return;
                }

                CommandUI.filterCommands(term);
            });
        }
    }

    static resetSearch() {
        const categories = document.querySelectorAll('.command-category');
        categories.forEach(cat => {
            cat.style.display = '';
            cat.classList.remove('expanded');
            cat.querySelectorAll('li').forEach(li => li.style.display = '');
        });
    }

    static filterCommands(term) {
        const categories = document.querySelectorAll('.command-category');
        categories.forEach(cat => {
            let hasMatch = false;
            cat.querySelectorAll('li').forEach(li => {
                if (li.textContent.toLowerCase().includes(term)) {
                    li.style.display = '';
                    hasMatch = true;
                } else {
                    li.style.display = 'none';
                }
            });

            if (hasMatch) {
                cat.style.display = '';
                cat.classList.add('expanded');
            } else {
                cat.style.display = 'none';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.themeManager = new ThemeManager();
    
    LoadingManager.hideLoading();
    
    if (document.getElementById('commandsGrid')) {
        CommandUI.initCategoryToggles();
        CommandUI.initCommandCopying();
        CommandUI.initSearchFunctionality();
    }
    
    if (document.getElementById('channelSelect')) {
        window.playerManager = new PlayerManager();
    }
    
    if (document.querySelector('.eye-table')) {
        EyesPageManager.init();
    }
    
    BannerManager.initCloseBanner();
    
    StreamStatus.checkStatus();
    
    const modal = document.getElementById('donationModal');
    if (modal) {
        const closeModal = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelDonation');
        const confirmBtn = document.getElementById('confirmDonation');
        
        modal.dataset.donationUrl = '';
        
        function closeModalFunc() {
            modal.classList.remove('active');
        }
        
        if (closeModal) {
            closeModal.addEventListener('click', closeModalFunc);
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModalFunc);
        }
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModalFunc();
            }
        });
        
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                const donationUrl = modal.dataset.donationUrl;
                if (donationUrl) {
                    window.open(donationUrl, '_blank');
                }
                closeModalFunc();
            });
        }
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModalFunc();
            }
        });
    }
});

class EyesPageManager {
    static init() {
    }
}

window.copyToClipboard = CommandUtils.copyToClipboard;

function showDonationModal(donationUrl) {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.dataset.donationUrl = donationUrl;
        modal.classList.add('active');
    }
}