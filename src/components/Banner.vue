<template>
    <section>
        <div
            class="banner d-flex align-items-center"
            :style="{ backgroundImage: 'url(\'' + L2.Img + '\')' }"
        >
            <div class="nkg__container w-100 text-white">
                <div v-if="this.$route.params.dyna == 'news' && this.$route.params.hasOwnProperty('subdyna')" class="h1 banner__title fw-bold mb-4">
                    {{ L2.Title }}
                </div>
                <h1 v-else class="banner__title fw-bold mb-4">
                    {{ L2.Title }}
                </h1>
                <ul v-if="deviceMode !== 'mobile'" class="position-relative px-0 mb-lg-0">
                    <li
						v-for="(a, i) in L2.Data"
						class="anchor__item h5 btn rounded-pill"
                        :class="{'active':a.Title==nowSec}"
						:key="i"
						:data-nav-scroll="a.Title"
                        :lang="this.$route.params.lang"
						@click.prevent="scrollSec(a.Title); addHashtag(a.Title);isLock=true;nowSecIdx=i"
                    >
                        {{ $filters.removeHtml(a.Title) }}
                    </li>
                </ul>
            </div>
            <div
                v-if="deviceMode !== 'deskTop'"
                class="nkg__container position-absolute bottom-0"
            >
                <Breadcrumb v-if="$route.name !== 'home'" />
            </div>
        </div>

        <!-- 浮動 -->
        <div
            v-if="L2.Data.length>0"
            class="anchor__wrap"
            :class="{ fixed: anchorSticky }"
        >
            <div
                class="nkg__container d-flex align-items-center justify-content-between text-white"
                :class="{'show':navToggle}"
            >
                <transition name="fade">
                    <div
                        v-show="navToggle"
                        class="banner__title small flex-shrink-0 fw-bold mb-0 my-sm-2"
                    >
                        {{ L2.Title }}
                    </div>
                </transition>
                <transition name="fade">
                    <div
                        v-show="!navToggle"
                        class="anchor--scroll"
                        :class="{
                            'overflow-auto': isNavScroll,
                            'opacitymask--r': nowSecIdx !== L2.Data.length,
                        }"
                    >
                        <ul class="position-relative text-nowrap px-0 mb-0">
                            <li
                                v-for="(a, i) in L2.Data"
                                class="
                                    anchor__item 
                                    smallest
                                    btn
                                    rounded-pill
                                    mb-0
                                    me-2 me-md-3
                                "
                                :class="{'active':a.Title==nowSec}"
                                :key="i"
                                :data-nav-scroll="a.Title"
                                @click.prevent="scrollSec(a.Title);addHashtag(a.Title);isLock=true;nowSecIdx=i"
                            >
                                {{ $filters.removeHtml(a.Title) }}
                            </li>
                        </ul>
                    </div>
                </transition>
                <svg-icon
                    v-if="isNavScroll"
                    name="arrow-down"
                    size="24"
                    class="order-5 ms-auto"
                    @click="navToggle = !navToggle"
                />
            </div>
            <transition name="toggle">
                <div v-if="navToggle" class="nkg__container anchor--toggle">
                    <ul class="px-0 pt-3 mb-0">
                        <li
                            v-for="(a, i) in L2.Data"
                            class="
                                anchor__item
                                btn
                                rounded-pill
                                mb-2 mb-md-3
                                me-2 me-md-3
                            "
                            :class="{'active':a.Title==nowSec}"
                            :key="i"
                            :data-nav-scroll="a.Title"
                            @click.prevent="
                                scrollSec(a.Title);
                                addHashtag(a.Title);
                                isLock=true;nowSecIdx=i;
                                navToggle = !navToggle;
                            "
                        >
                            {{ a.Title }}
                        </li>
                    </ul>
                </div>
            </transition>
        </div>
    </section>
</template>

<script>
import Breadcrumb from "@/components/lib/Breadcrumb.vue";
import $ from "jquery";
import _ from "lodash";
import { inject } from "vue";

export default {
    props: {
        pageindex: [Number, String],
        L2: Object
    },
    components: {
        Breadcrumb,
    },
    data() {
        return {
            anchorSticky: false,
            isNavShow: false,
            isNavScroll: false,
            isLock: false,
            navToggle: false,
            nowSecIdx: 0,
            nowSec:'',
            bannerTitleList:[],
            bannerTitleListTmp:[],
        };
    },
    setup() {
        const deviceMode = inject("deviceMode");
        const secTitleList = inject("secTitleList");
        return {
            deviceMode,
            secTitleList
        };
    },
    created() {
        this.secTitleList.length = 0;
    },
    mounted() {
        $(".anchor--scroll").width() > $(".nkg__container").width()
            ? (this.isNavScroll = true)
            : (this.isNavScroll = false);

        setTimeout(() => {
            // 頁面所有section標題
            let secTitle = document.querySelectorAll('[data-sec-scroll]');
            let _t = this;
            secTitle.forEach(function (e,i) {
                let text = secTitle[i];
                _t.secTitleList.push(text.getAttribute('data-sec-scroll'));
            })
            _t.secTitleList = _.uniq(_t.secTitleList.filter(el => el));
    
            // banner所有錨點標題
            if (this.L2.Data!==null) {
                this.L2.Data.forEach(function (e) {_t.bannerTitleList.push(e.Title);})
                this.nowSec = this.bannerTitleList[0];
            }
            this.secTitleList.forEach((v,k) => { // 給錨點 key, value
                if(this.bannerTitleList.includes(v)){
                    this.bannerTitleListTmp[k]=v;
                }
            });
        }, 300);

        // 網址有#的話捲動至...
        if(this.$route.hash){
            setTimeout(() => {
                this.nowSec = this.$route.hash.replace(/#/, '');
                this.nowSecIdx = this.bannerTitleList.indexOf(this.nowSec);
                this.isLock = true;
                this.scrollSec(this.nowSec);
            }, 1000);
        }

        window.addEventListener("scroll", this.isAnchorSticky, { passive: true });
        
        if (this.L2.Data!==null) {
            // window.addEventListener("scroll", _.debounce(this.ListenSec, 100));
            window.addEventListener("scroll", this.ListenSec);
        }
    },
    beforeUnmount() {
        window.removeEventListener("scroll", this.isAnchorSticky);
        window.removeEventListener("scroll", this.ListenSec);
    },
    methods: {
        // 監聽目前section
        ListenSec() {
            let viewH = $(window).height() * 0.25; // 可視範圍定位
            let scrollY = $(window).scrollTop(); // Y軸位置
            let el = $('[data-sec-scroll="' + this.secTitleList[this.nowSecIdx] + '"]');
            let elLen = this.secTitleList.length;     
            let fineTitle;       
            if(el.length !== 0 && !this.isLock){                
                if (el.offset().top - scrollY < viewH && this.nowSecIdx+1 < elLen) {
                    if ($('[data-sec-scroll="' + this.secTitleList[this.nowSecIdx+1] + '"]').offset().top - scrollY < viewH) {
                        this.nowSecIdx+1 < elLen ? this.nowSecIdx++ : this.nowSecIdx;
                    }
                } else if(el.offset().top - scrollY >= viewH){
                    this.nowSecIdx > 0 ? this.nowSecIdx-- : this.nowSecIdx;
                }
                
                // 計算當前錨點標題
                let titleKeyIdx=0;
                Object.keys(this.bannerTitleListTmp).forEach(v => {
                    if(v<=this.nowSecIdx){titleKeyIdx=v;}
                });
                fineTitle = this.nowSec = this.bannerTitleListTmp[titleKeyIdx];

                // 更新path hash
                // const location = window.location.toString().split('#')[0];
                // history.replaceState(null, null, location + '#' + this.nowSec);

                // 手機版nav橫向捲動
                let isFound = this.L2.Data.some(function(item){
                    return item.Title == fineTitle
                });
                if(isFound){
                    this.scrolltoItem(this.nowSec);
                }
            }       
        },
        // 捲動至section
        scrollSec(sec) {
            this.nowSec = sec;
            let $page = $('[data-sec-scroll="' + sec + '"]');
            $("html, body")
                .stop(true)
                .animate(
                    {
                        scrollTop: $page.offset().top - ($(window).height() * 0.25),
                    },
                    300
                );
            setTimeout(() => {
                this.isLock=false;
                this.scrolltoItem(this.nowSec);
            }, 500);
        },
        //nav橫向捲動
        scrolltoItem(sec) { 
            let $nav = $('.anchor__wrap li[data-nav-scroll="' + sec + '"]');
            let scrollTo = $nav.position().left;
            $(".anchor__wrap .anchor--scroll")
                .stop(true)
                .animate(
                    {
                        scrollLeft: scrollTo - 50,
                    },
                    300
                );
        },
        // 網址加#hashtag
        addHashtag(tag) {
            this.$router.push({ hash: '#'+tag});
        },
        // banner錨點按鈕位置固定
        isAnchorSticky() {
            let banenr = $(".banner").height();
            if(this.deviceMode !== 'mobile'){
                banenr = $(".banner").outerHeight() - $("header .navbar").outerHeight();
            }
            banenr < window.scrollY ? (this.anchorSticky = true) : (this.anchorSticky = false);
        },
    },
};
</script>

<style lang="scss" scoped>
.banner {
    position: relative;
    min-height: 32.6vw;
    // padding-top: $header-height; // 80px
    padding-top: 120px;
    padding-bottom: 50px;
    transition: $sec ease-in-out;
    @include bgFillCenter;
    @include media-breakpoint-down(xl) {
        min-height: 45vw;
    }
    @include media-breakpoint-down(lg) {
        min-height: 61.2vw;
    }
    @include media-breakpoint-down(sm) {
        min-height: 67.5vw;
        padding-top: $header-height-sm;
    }
    &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.3),
            rgba(0, 0, 0, 0.5)
        );
        z-index: 1;
    }
    .nkg__container {
        position: relative;
        z-index: 2;
        @include media-breakpoint-down(sm) {
            position: initial;
        }
    }
}
.anchor__item {
    display: inline-block;
    padding: 0.615rem 1.5rem;
    margin-bottom: 1rem;
    margin-right: 1rem;
    border-color: #fff;
    background-color: rgba($gray-800, 0.6);
    color: #fff;
    line-height: 1.46;
    &.active {
        border-color: $yellow;
        color: $yellow;
    }
    @include media-breakpoint-up(xxl) {
        &:hover {
            border-color: $yellow;
            color: $yellow;
        }
    }
    @include media-breakpoint-down(lg) {
        &:lang(en-US){
            padding: 0.615rem 1rem;
            margin-bottom: .5rem;
            margin-right: .5rem;
            font-size: 1rem;
        }
    }
    @include media-breakpoint-down(sm) {
        padding: 0.438rem 1rem;
        margin-bottom: 0;
        margin-right: .5rem;
    }
}
.anchor__wrap {
    @include layoutPadding-y(0);
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(10, 10, 10, 0.7);
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: $sec ease-in-out;
    .banner__title{
        line-height: 1.75;
    }
    .anchor--scroll {
        flex-grow: 0;
    }
    .anchor__item {
        // font-size: 0.75rem;
        @include media-breakpoint-down(xl) {
            font-size: 0.875rem;
        }
        @include media-breakpoint-down(sm) {
            font-size: 0.75rem;
        }
        @include media-breakpoint-up(md) {
            min-height: 40px;
        }
    }
    .nkg__ic--svg {
        margin: 0.25rem 0;
    }
    &.fixed {
        @include layoutPadding-y(10px);
        top: $header-height;
        max-height: 600px;
        opacity: 1;
        z-index: 1000;
        @include media-breakpoint-down(sm) {
            top: $header-height-sm;
            z-index: 1030;
        }
    }
    @include media-breakpoint-down(sm) {
        @include layoutPadding-y(10px);
        position: initial;
        top: auto;
        max-height: initial;
        opacity: 1;
        &.fixed {
            position: fixed;
        }
    }
}
</style>