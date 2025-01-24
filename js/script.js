window.addEventListener('DOMContentLoaded', () => {
    new ScrollInteraction();
    new FadeInterection();
    new TextAnimation();
    new LoadingScreen();
    new swiperControl();
})

class ScrollInteraction {
    constructor() {
        this.images = Array.from(document.querySelectorAll('.floatImage'));

        this.config = {
            strength: 0.2,
            maxMove: 800,
            ease: 'ease-out',
            isReverse: true,
            duration: 1000
        };

        // 各要素にアニメーションを準備
        this.animations = this.images.map(image => 
            image.animate(
                [
                    { transform: 'translateY(0px)' },
                    { transform: 'translateY(0px)' }
                ],
                {
                    duration: this.config.duration,
                    easing: this.config.ease,
                    fill: 'forwards'
                }
            )
        );

        // さぁ、始めよう！
        this.init();
    }

    init() {
        // スクロールを見張る（賢く効率よく）
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        const direction = this.config.isReverse ? -1 : 1;
        const moveY = Math.min(
            Math.max(window.scrollY * this.config.strength * direction,-this.config.maxMove),
            this.config.maxMove
        );
        this.animations.forEach(animation => {
            animation.effect.setKeyframes([
                { transform: 'translateY(0px)' },
                { transform: `translateY(${moveY}px)` }
            ]);
        });
    }
}

class FadeInterection{
    constructor(){
        this.images = Array.from(document.querySelectorAll('.floatImage'));
        this.images.forEach(image => {
            image.style.opacity = 0
        });
        this.config = {
            ease: 'ease-in',
            duration: 1000,
            threshold: 0.2
        }
        this.init()
    }

    init(){
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    entry.target.animate(
                    [
                        { opacity: 0},
                        { opacity: 1}
                    ],
                    {
                        duration: this.config.duration,
                        easing: this.config.ease,
                        fill: 'forwards'
                    }
                )
                    observer.unobserve(entry.target)
                }
            });
        },{
            threshold:this.config.threshold
        })
        
        this.images.forEach(image => observer.observe(image));
    }
}




class TextAnimation {
    constructor() {
        this.element = document.querySelector('.mainvisual__header');
        
        this.config = {
            duration: 800,
            easing: 'ease-out',
            threshold: 1,
            startDelay: 3000
        }

        this.chars = this.element.textContent.split('');
        this.element.innerHTML = this.chars.map(char => 
            `<span class="sText" style="opacity: 0">${char}</span>`
        ).join('');

        this.elements = document.querySelectorAll('.sText');

        window.addEventListener('load', () => {
            setTimeout(() => {
                this.init();
            }, this.config.startDelay);
        });
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    this.animate();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: this.config.threshold
        });

        observer.observe(this.element);
    }

    animate() {
        this.elements.forEach(element => {
            const delay = Math.random() * 1000;

            element.animate(
                [
                    { opacity: 0 },
                    { opacity: 1 }
                ],
                {
                    duration: this.config.duration,
                    easing: this.config.easing,
                    delay: delay,
                    fill: 'forwards'
                }
            );
        });
    }
}

class LoadingScreen {
    constructor() {
        this.screens = document.querySelectorAll('.loadingScreen');
        document.body.style.overflow = 'hidden';
        
        this.config = {
            duration: 1000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            delay: 200,
            startDelay: 2000
        }

        this.animationScreens = Array.from(this.screens).slice(1);

        window.addEventListener('load', () => {
            setTimeout(() => {
            this.animate();
            }, this.config.startDelay);
        });
    }

    animate() {
        // 最後のスクリーンを取得
        const lastScreen = this.animationScreens[this.animationScreens.length - 1];

        this.animationScreens.forEach((screen, index) => {
            const animation = screen.animate(
                [
                    { transform: 'translateY(0%)' },
                    { transform: 'translateY(-100%)' }
                ],
                {
                    duration: this.config.duration,
                    easing: this.config.easing,
                    delay: index * this.config.delay,
                    fill: "forwards"
                }
            );

            // 最後のスクリーンの場合のみonfinishを設定
            if(screen === lastScreen) {
                animation.onfinish = () => {
                    document.body.style.overflow = 'auto';
                    this.screens.forEach(screen => {
                        screen.style.display = 'none';
                    })
                };
            }
        });
    }
}

class swiperControl {
    constructor(){
        this.swiper = new Swiper('.mainvisual__slider', {
            loop: true,
            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
    }

    next(){ this.swiper.slideNext(); }
    prev(){ this.swiper.slidePrev(); }
}

gsap.registerPlugin(ScrollTrigger);
        
const slides = document.querySelectorAll('.slide');
const slideCount = slides.length;

const slideTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".slide-section",
        pin: true,
        start: "top top",
        end: `+=${(slideCount - 1) * 100}%`,
        scrub: 1,
    }
});

slides.forEach((slide, index) => {
    if (index === 0) return;
    let slideProgress = 0;
    
    slideTl.to(slide, {
        y: 0,
        delay: 0.2,
        duration: 1,
        ease: "power1.inOut",
        onUpdate: () => {
            const prevSlide = slides[index - 1];
            if (prevSlide) {
                const totalProgress = Math.max(0, slideTl.progress() - 0.2);
                const progressPerSlide = 1 / (slideCount - 1);
                const currentSlideProgress = (totalProgress - (index - 1) * progressPerSlide) / progressPerSlide;
                
                slideProgress = Math.max(0, Math.min(1, currentSlideProgress));
                
                // エフェクトを適用
                prevSlide.style.setProperty('--darkness', slideProgress * 0.8);
                prevSlide.style.setProperty('--blur', slideProgress * 10);
            }
        }
    });
});