<template>
    <!-- title -->
    <section v-if="L2.Templates == 'ProductTitle'" class="product__title__wrap position-sticky w-100">
        <div class="nkg__lo__container">
            <h1 class="h5 product__title text-center fw-bold mb-0 active">{{ L2.Title }}</h1>
        </div>
    </section>

    <!-- list -->
    <section v-if="L2.Templates == 'FullSectionFixed'" class="product__sec d-flex bg-gray" :id="L2.ID" :class="{'active':L2.ID==nowSecId}" :data-sec="L2.Templates">  
        <div class="product__info nkg__lo__container position-relative">
            <transition name="fadeInUp">
                <component :is="headers" v-show="deviceMode == 'deskTop'? L2.ID==nowSecId : true" class="product__info__title h3 fw-bold mb-0">{{ L2.Title }}</component>
            </transition>
            <hr class="flex-shrink-0">
            <transition name="fadeInDown">
                <div v-show="deviceMode == 'deskTop'? L2.ID==nowSecId : true" class="product__info__des align-self-stretch">
                    <span v-html="L2.Content"></span>
                </div>
            </transition>
        </div>
        <transition name="fade">
            <div v-if="!isVideo(L2.Img)" v-show="deviceMode == 'deskTop'? L2.ID==nowSecId : true" class="product__image" :class="{'position-absolute': deviceMode == 'deskTop'}" :style="{ backgroundImage: 'url(\'' + (deviceMode=='deskTop'?L2.Img:(L2.MImg==''?L2.Img:L2.MImg)) + '\')' }"></div>
            <div v-else class="product__image" :class="{'position-absolute': deviceMode == 'deskTop'}"> 
                <div :id="'video__'+videoCode" class="pe-none video--cover"></div>
                <transition name="fade">
                    <div v-if="!isVideoLoaded" class="product__image position-absolute" :style="{ backgroundImage: 'url(\'' + L2.PreloadImg + '\')' }"></div>
                </transition>
                    <!-- <img :src="L2.PreloadImg" alt="" class="product__image position-absolute"> -->
                <!-- https://stackoverflow.com/questions/48399390/youtube-embed-autoplay-on-mobile/48442630 -->
            </div>
        </transition>
    </section>

    <!-- list -->
    <section v-if="L2.Templates == 'FullSectionAuto'" class="product__sec d-flex bg-gray" :id="L2.ID" :data-sec="L2.Templates">  
        <div class="product__info nkg__lo__container position-relative">
            <transition name="carousel-prev">
                <component :is="headers" class="product__info__title h3 fw-bold mb-0">{{ L2.Title }}</component>
            </transition>
            <hr class="flex-shrink-0">
            <transition name="carousel-prev">
                <div class="product__info__des align-self-stretch">
                    <span v-html="L2.Content"></span>
                </div>
            </transition>
        </div>
        <transition name="carousel-next">
            <div v-if="!isVideo(L2.Img)" class="product__image" :class="{'position-absolute': deviceMode == 'deskTop'}" :style="{ backgroundImage: 'url(\'' + (deviceMode=='deskTop'?L2.Img:(L2.MImg==''?L2.Img:L2.MImg)) + '\')' }"></div>
            <div v-else v-show="deviceMode == 'deskTop'? L2.ID==nowSecId : true" class="product__image" :class="{'position-absolute': deviceMode == 'deskTop'}" > 
                <div :id="'video__'+videoCode" class="pe-none video--cover"></div>
                <transition name="fade">
                    <img v-if="!isVideoLoaded" :src="L2.PreloadImg" alt="" class="product__image position-absolute">
                </transition>
            </div>
        </transition>
    </section>

    <!-- carousel -->
    <section v-if="L2.Templates == 'ProductCarousel' && showSlide" class="product nkg__section" :class="[L2.Styles, { 'bgimg-fixed': L2.RGBA!=='' && L2.RGBA!=='rgba(0, 0, 0, 0)' }]"
        :style="{ backgroundImage: 'linear-gradient(' + L2.RGBA + ',' + L2.RGBA + '), url(\'' + (deviceMode=='deskTop'?L2.Img:(L2.MImg==''?L2.Img:L2.MImg)) + '\')'}">
        <div class="nkg__lo__container">
            <p v-if="L2.SubTitle!==''" class="h5 text-center">{{L2.SubTitle}}</p>
            <Splide :options="slideCard" class="nkg__wrap">
                <SplideSlide v-for="(p, i) in L2.Data" :key="i" class="product__list text-center">
                    <img :src="p.Img" :alt="p.ImgAlt">
                    <component :is="headers" class="h6 fw-bold mt-3" v-html="p.Title"></component>
                </SplideSlide>
            </Splide>
        </div>
    </section>
</template>

<script>
import $ from "jquery";
import _ from "lodash";
import { inject } from "vue";

export default {
    props: {
        pageindex: [Number, String],
        L2: Object
    },
    data() {
        return {
            scrtmp:0,
            isFixed: false,
            isSecLock: false,
            CkDtLock:true,
            nowSec: 0,
            nowSecLock: 1,
            nowSecId: '',
            showSlide: false,
            nowPerPage: '',
            videoCode: '',
            player: '',
            isVideoLoaded: false,
            slideCard: {
                perPage: 6,
                type: "slide",
                arrowPath: "M22.6,20l-8.8,8.8c-0.6,0.7-0.6,1.7,0,2.4c0.6,0.6,1.7,0.6,2.3,0l10-10c0.7-0.7,0.7-1.7,0-2.4l-10-10c-0.7-0.6-1.7-0.6-2.4,0c-0.6,0.6-0.6,1.7,0,2.3L22.6,20z",
                breakpoints: {
                    1920: {
                        perPage: 6,
                    },
                    1610: {
                        perPage: 5,
                    },
                    1367: {
                        perPage: 4,
                    },
                    992: {
                        perPage: 2,
                    },
                    576: {
                        perPage: 1,
                        gap: "2rem",
                        arrows: true,
                        padding: {
                            left: "2.75rem",
                            right: "2.75rem",
                        },
                    },
                },
            },
            headers: ''
        }
    },
    setup() {
        const deviceMode = inject('deviceMode')
        return {
            deviceMode,
        }
    },
    created(){
        this.$route.params.dyna == "capabilities" ? this.headers = 'h3' : this.headers = 'h2';
    },
    mounted() {
        if(this.L2.Img.includes('youtube')){
            this.videoCode = this.L2.Img.split('/').pop();
        
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScript = document.getElementsByTagName('script')[0];
            firstScript.parentNode.insertBefore(tag, firstScript);

            setTimeout(() => {
                this.startVideo();
            }, 1000);
        }
        if(this.deviceMode == 'deskTop'){
            let h = $(window).height();
            let header_h = $('.product__title').length==1?$('.product__title').outerHeight():$('.header .navbar').outerHeight();
            let elLen = $("[data-sec='FullSectionFixed']").length;
            let product_h = h - header_h;
            // sec滿版
            if(this.L2.Templates == 'FullSectionFixed'){
                if($('.product__wrap').length==0){
                    // 將所有產品sec外層用wrap包起來
                    $("[data-sec='FullSectionFixed']").wrapAll("<div class='product__wrap'></div>");
                    $("[data-sec='FullSectionAuto']").wrapAll("<div class='product__wrap__FSA'></div>");
    
                    // 插入垂直分頁
                    let PG_dot = '';
                    for(let i = 0; i < elLen; i++){
                        PG_dot+=`<li><button data-slide="${i}" class="splide__pagination__page vpg" type="button"></button></li>`;
                    }
                    let PG = `<ul class="splide__pagination position-fixed">${PG_dot}</ul>`;
                    $('.product__wrap').append(PG);
                    $('.product__wrap .splide__pagination').hide(0);//def300 bc

                    //分頁點擊後捲動至對應sec
                    let _t=this;
                    $('.vpg').on( "click", function(e) {
                        let sec = this.nowSec = e.target.getAttribute("data-slide");
                        _t.CkDtLock=false;
                        
                        // 下面兩個重新抓高度，因產品頁捲動title會縮小
                        let new_header_h = $('.product__title').length==1?$('.product__title').outerHeight():$('.header .navbar').outerHeight();
                        let new_product_h = h - new_header_h;
                        if(sec>1){
                            $('html, body').animate({
                                scrollTop: $('.product__wrap').position().top + (new_product_h * sec) - new_header_h + 41
                            }, 300, function() {
                                _t.CkDtLock=true;
                            });
                        }else{
                            $('html, body').animate({
                                scrollTop: $('.product__wrap').position().top + (new_product_h * sec) + 1
                            }, 300, function() {
                                _t.CkDtLock=true;
                            });
                        }
                        $('.vpg').removeClass('is-active');
                        $(this).addClass('is-active');
                    });
                }
                this.nowSecId = $("[data-sec='FullSectionFixed']:eq(0)").attr('id'); // 顯示第一個sec
                $('.vpg:eq(0)').addClass('is-active'); // 第一個分頁按鈕變黃色

                window.addEventListener("scroll", this.ListenSec, { passive: true });
            }
            $(".product__wrap--fixed [data-sec='FullSectionFixed']").css({"top":top});
            $('.product__wrap').css({"height":product_h * elLen});
            $('.product__sec').css({"height":product_h});
        }
        // 產品輪播
        if (this.L2.Templates == 'ProductCarousel'){  
            this.ListenCW();
            window.addEventListener('resize', _.debounce(this.ListenCW, 500));
        }
        // 中文語系文字左右對齊
        document.documentElement.style.setProperty('--textAlign', `${this.$route.params.lang=="zh-TW"?"justify":"left"}`);
    },
    beforeUnmount() {
        window.removeEventListener("scroll", this.ListenSec);
        window.removeEventListener("scroll", this.scaleTitle);
    },
    methods: {
        // 監聽滾動:目前sec
        ListenSec() {
            let h = $(window).height();
            let header_h = $('.product__title').length==1?$('.product__title').outerHeight():$('.header .navbar').outerHeight(); //header高
            let elLen = $("[data-sec='FullSectionFixed']").length; //卡片數量
            let product_h = h - header_h; //卡片高
            let scrollY = $(window).scrollTop()==0 ? 1 : $(window).scrollTop(); // 卷軸Y位置
            
            
            let ST=0;
            if(scrollY>=this.scrtmp){ST=1;}else{ST=0;}
            this.scrtmp=scrollY;//卷軸正反向

            if(elLen > 0){
                this.nowSec = Math.ceil((scrollY-($('.product__wrap').position().top - header_h)) / product_h)-1;
                if(this.nowSecLock!==this.nowSec){
                    this.nowSecLock = this.nowSec;
                    if(this.nowSecLock==-1){ // 預先顯示第一張卡片
                        this.nowSecId = $("[data-sec='FullSectionFixed']:eq(0)").attr('id');
                    }else {
                        this.nowSecId = $("[data-sec='FullSectionFixed']:eq("+this.nowSec+")").attr('id');
                    }
                    if(this.nowSecLock>=0 && this.nowSecLock<elLen-1){
                        this.isFixed = true;
                    }else{
                        this.isFixed = false;
                    }
                }             

                // 滾到從第二個產品時，大標縮小
                if(this.isFixed){
                    $('.product__wrap').addClass('product__wrap--fixed');
                    if(this.nowSec==elLen-2 && this.isSecLock){
                        this.isSecLock=false;                        
                    }
                } else {
                    $('.product__wrap').removeClass('product__wrap--fixed');                 
                    if(this.nowSec==elLen-1 && !this.isSecLock && this.$route.hash==''){
                        this.isSecLock=true;                        
                        $('html,body').animate({ scrollTop: $('.product__wrap').position().top + product_h*(elLen-1)+1 - header_h}, 150);
                    }
                }
                
                if(this.isFixed){ // 點點控制
                    $('.product__wrap .splide__pagination').show(300);
                }else if(!this.isFixed && scrollY > $('.product__wrap').position().top+product_h*(elLen-0.6)){
                    $('.product__wrap .splide__pagination').hide(300); 
                }else if(!this.isFixed && scrollY < $('.product__wrap').position().top){
                    $('.product__wrap .splide__pagination').hide(300); 
                }
                $('.product__wrap').css({"height":product_h * elLen});
                $('.product__sec').css({"height":product_h, "top": this.isFixed ? header_h : "auto"}); // 卡片高
                $('.vpg').removeClass('is-active');
                $('.vpg:eq('+this.nowSec+')').addClass('is-active');
            }            
        },
        // 監聽視窗寬度:重新渲染水平輪播
        ListenCW() {    
            Object.keys(this.slideCard.breakpoints).find(key => {
                if(window.innerWidth < key){
                    if(this.L2.Data.length > this.slideCard.breakpoints[key].perPage){
                        this.slideCard.breakpoints[key].pagination = this.slideCard.breakpoints[key].arrows = true;
                    } else {
                        this.slideCard.breakpoints[key].perPage = this.L2.Data.length;
                        this.slideCard.breakpoints[key].pagination = this.slideCard.breakpoints[key].arrows = false;
                    }
                } else if (window.innerWidth > Math.max(...Object.keys(this.slideCard.breakpoints))) {                    
                    if(this.L2.Data.length > this.slideCard.perPage){
                        this.slideCard.pagination = this.slideCard.arrows = true;
                    } else {
                        this.slideCard.perPage = this.L2.Data.length;
                        this.slideCard.pagination = this.slideCard.arrows = false;                
                    }
                }
            });
            this.forceRerender();
        },
        forceRerender() { 
            this.showSlide = false; 
            this.$nextTick(() => {
                this.showSlide = true; 
            });
        },
        isVideo(url){
            if(url.includes('youtube')){
                this.videoCode = url.split('/').pop();
                return true;
            } else {
                return false;
            }
        },
        startVideo(){
            let _t = this;
            _t.player = new YT.Player(`video__${_t.videoCode}`, {
                    videoId: _t.videoCode,
                    playerVars: {                        
                        playlist: _t.videoCode, // Open the loop function must to be set playlist
                        loop: 1,
                        modestbranding: 1, // Control video branding show/hide
                        controls: 0,
                        disablekb: 1,
                        rel: 0,
                        showinfo: 0,
                        fs: 0,
                        playsinline: 1,
                        mute: 1,
                        origin: window.location.origin
                        // https://developers.google.com/youtube/player_parameters?hl=zh-cn#iv_load_policy
                    },
                    events: {            
                        'onStateChange': _t.onPlayerStateChange.bind(this),
                        'onError': _t.onPlayerError.bind(this),
                        'onReady': _t.onReady.bind(this),
                    }
                });
        },
        onReady() {
            this.player.setPlaybackQuality('hd1080');
            this.player.playVideo();
            this.refreashVideo();
        },
        onPlayerStateChange(event) {
            switch (event.data) {
                case 1:
                    this.isVideoLoaded = true;
                    break;
                case 3:
                    event.target.setPlaybackQuality('hd1080');
                    break;
            }
        },
        onPlayerError(event) {
            switch (event.data) {
                case 2:
                    // console.log('' + this.videoCode);
                    break;
                case 100:
                    break;
                case 101 || 150:
                    break;
            }
        },
        refreashVideo() {
            // Get the duration of the currently playing video
            this.refreashInterval = setInterval(() => {
                const videoDuration = this.player.getDuration();
                const videoCurrentTime = this.player.getCurrentTime();
                const timeDifference = videoDuration - videoCurrentTime;
                if (2 > timeDifference && timeDifference > 0) {
                    this.player.seekTo(0);
                }
            }, 500);
        }
    }
};

</script>

<style lang="scss">
.product{
    @at-root [class*="ytp-"]{
        opacity: 0;
        display: none;
    }
    &__wrap{
        &--fixed{
            .product__sec{
                position: fixed;
            }
        }
        @include media-breakpoint-down(sm) {
            padding-top: 110px;
        }
        .splide__pagination{
            z-index: 9;
            width: auto;
            top: 50%;
            transform: translateY(-50%);
            left: auto;
            right: .5em;
            flex-direction: column;
        }
    }
    &__title{
        &__wrap{
            top: 0;
            background-color: $blue-900;
            color: $gray-300;
            z-index: 1010;
        }
        padding-top: $header-height;
        height: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: $sec ease-in-out;
        &.active{
            height: 140px;
        }
        @include media-breakpoint-down(sm) {
            padding-top: 50px;
            height: 110px;
            font-size: 1.5rem;
            &.active{
                height: 102px;
            }
        }
    }
    &__sec{
        position: relative;
        width: 100%;
        overflow: hidden;
        &:nth-child(even){
            flex-direction: row-reverse;
        }
        &.active{
            z-index: 9;
        }
        @include media-breakpoint-down(xl) {
            flex-direction: column-reverse;
            &:nth-child(even){
                flex-direction: column-reverse;
            }
        }
    }
    &__info{
        padding-top: 3.125rem;
        padding-bottom: 2.125rem;
        width: 41.5vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(0,0,0,.7);
        z-index: 2;
        &__title{
            color: $blue-300;
        }
        &__des{
            text-align: var(--textAlign);
        }
        hr{
            margin-top: 1.875rem;
            margin-bottom: 1.875rem;
            align-self: stretch;
            opacity: 1;
        }
        @include media-breakpoint-down(xxl) {
            hr{
                margin-top: 1.75vw;
                margin-bottom: 1.75vw;
            }
        }
        @include media-breakpoint-down(xl) {
            width: 100vw;
            background-color: $gray-800;
            hr{
                margin-top: 1.875rem;
                margin-bottom: 1.875rem;
            }
        }
    }
    &__image{
        @include bgFillCenter;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        @include media-breakpoint-down(xl) {
            width: 100vw;
            height: 56.5vw;
        }
    }
    &__list{
        img{
            width: 200px;
            height: 200px;
        }
    }
    &[class*="light"], &:not([class*="bg-"]) {
        .splide__arrow svg{
            fill: $gray-800;
        }
    }
}
.video--cover{
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 300%;
    height: 135%;
    margin-left: -100%;
    @include media-breakpoint-down(xl) {
        top: 0;
        -ms-transform: translateY(0);
        transform: translateY(0);
        width: 300vw;
        height: 56.5vw;
    }
}
</style>