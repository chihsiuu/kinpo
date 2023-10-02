<template>   
    <header class="header" :class="deviceMode == 'deskTop' ? 'sticky-top' : 'fixed-top'">
        <!-- 主選單 -->
        <nav class="nkg__lo__container navbar navbar-expand-xl flex-wrap py-xl-0"> 
            <div v-if="deviceMode!=='deskTop'" class="nkg__ic hamburger" :class="{'collapsed':!isCollapse}" @click="isCollapse=!isCollapse">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <router-link class="navbar-brand" :to="'/'+this.$route.params.lang+'/home/'" @click="isCollapse=false">
                <img src="@/assets/images/logo_hd.png" alt="" />
            </router-link>
            <div class="collapse navbar-collapse align-self-stretch" :class="{'show':isCollapse}">
                <ul class="navbar__main navbar-nav flex-xl-row align-self-stretch">
                    <li class="nav-item" v-for="i in MenuData" :key="i.ID" @mouseover="deviceMode=='deskTop' ? isHovering = i.ID : false" @mouseleave="deviceMode=='deskTop' ? isHovering = '' : false">
                        <!-- 無子選單 -->
                        <template v-if="i.Children == undefined">
                            <a v-if="urlCheck(i.Link)==1" :href="i.Link" :target="i.Target"
                                class="nav-link small">
                                {{ i.Title }}
                            </a>
                            <router-link
                                v-if="urlCheck(i.Link)==2"
                                :to="'/'+this.$route.params.lang+i.Link"
                                class="nav-link small"
                                :class="{'active':this.$route.href.split('/')[2] == i.Link.split('/')[1]}"
                                :target="i.Target"
                                @click="isCollapse=false"
                                >{{ i.Title }}
                            </router-link>
                        </template>

                        <!-- 有子選單 -->
                        <template v-else>
                            <span
                                class="nav-link small"
                                :id="'mainNavDropdown'+i.ID"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                :class="{'show': isHovering == i.ID, 'active': deviceMode == 'deskTop' && this.$route.href.split('/')[2] == i.Link}"
                            >
                                {{ i.Title }}
                                <svg-icon class="ms-auto ms-xl-1" name="arrow-down"/>
                            </span>
                            <ul
                                class="dropdown-menu border-0 rounded-0"
                                aria-labelledby="mainNavDropdown"
                                :class="{'show': isHovering == i.ID}"
                            >
                                <li v-for="j in i.Children" :key="j.ID">
                                    <a v-if="urlCheck(j.Link)==1" :href="j.Link" :target="j.Target"
                                    class="dropdown-item"
                                    :class="{'small':deviceMode!=='pad'}">
                                        {{ j.Title }}
                                    </a>
                                    <router-link
                                        v-if="urlCheck(j.Link)==2"
                                        class="dropdown-item"
                                        :class="{'small':deviceMode!=='pad'}"
                                        :to="'/'+this.$route.params.lang+j.Link"
                                        :target="j.Target"
                                        @click="isCollapse=false"
                                        >{{ j.Title }}</router-link
                                    >
                                </li>
                            </ul>
                        </template>
                    </li>
                </ul>
                <div v-if="deviceMode!=='deskTop'" class="nkg__lo__container">
                    <hr class="bg-light">
                </div>
                <!-- 次選單 -->
                <div class="navbar__sub"
                    :class="{'position-absolute top-0 end-0':deviceMode=='deskTop'}">    
                    <nav class="nkg__lo__container d-xl-block">        
                        <ul class="navbar-nav" :class="{'flex-row bg-primary':deviceMode=='deskTop', 'smallest':deviceMode!=='pad'}">
                            <li class="nav-item">
                                <router-link class="nav-link" :to="'/'+this.$route.params.lang+'/contact-us/'" @click="isCollapse=false" v-i18n="'Contact us'"></router-link>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="subNavDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <svg-icon v-if="deviceMode=='deskTop'" name="global" size="16"/>
                                    <div class="me-auto mx-xl-1">{{ChLangData(getLang)}}</div>                            
                                    <svg-icon name="arrow-down" size="12"/>
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="subNavDropdown">
                                    <li><router-link :to="{ path: getThisPath('en-US',this.$route) }" class="dropdown-item" @click="BaseService('en-US'); isCollapse=false" v-i18n="'English'"></router-link></li>
                                    <li><router-link :to="{ path: getThisPath('zh-TW',this.$route) }" class="dropdown-item" @click="BaseService('zh-TW'); isCollapse=false" v-i18n="'繁體中文'"></router-link></li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>

            </div>
        </nav>
    </header>
    <!-- scroll hint -->
    <figure v-if="deviceMode == 'deskTop' && (this.$route.params.dyna=='home' || this.$route.params.dyna=='products')" class="scroll-hint position-fixed m-0" @click="scrollOverBanner()"></figure>

    <router-view @updateParent="handleUpdate"></router-view>

    <footer v-show="renderFooter || this.$route.name == 'ErrPage'" class="footer mt-auto">
        <transition name="fade">
            <span v-if="isTop" class="gotop position-fixed smallest rounded-circle text-white" @click="scrollTop()">Top</span>
        </transition>
        <!-- 頁尾快速選單 -->
        <section class="bg-gray py-3 py-md-4">
            <div :class="deviceMode !== 'deskTop' ? 'container-fluid p-0' : 'nkg__container'">
                <div class="resource__wrap row g-0">
                    <div v-for="i in FooterFast" :key="i.ID" class="col-4 d-flex justify-content-center align-items-start">
                        <!-- 無子選單 -->
                        <template v-if="i.Children == undefined">
                            <a v-if="urlCheck(i.Link)==1" :href="i.Link" :target="i.Target"
                                class="resource__item text-warning">
                                <component :is="headers" class="resource__text h5 fw-bold mb-0">{{i.Title}}</component>
                                <svg-icon v-if="i.Link.includes('/document-center/')" name="download" size="24"/>
                                <svg-icon v-else name="csr" size="24"/>
                                <!-- <svg-icon v-if="i.Link.includes('csr')" name="csr" size="24"/> -->
                            </a>
                            <router-link
                                v-if="urlCheck(i.Link)==2"
                                :to="'/'+this.$route.params.lang+i.Link"
                                class="resource__item text-warning"
                                :target="i.Target"
                                >
                                <component :is="headers" class="resource__text h5 fw-bold mb-0">{{i.Title}}</component>
                                <svg-icon v-if="i.Link.includes('/document-center/')" name="download" size="24"/>
                                <svg-icon v-else name="csr" size="24"/>
                                <!-- <svg-icon v-if="i.Link.includes('csr')" name="csr" size="24"/> -->
                            </router-link>
                        </template>
                        <!-- 有子選單 -->
                        <template v-else>
                            <div class="resource__item text-warning" @click="deviceMode !== 'deskTop' ? isClick = !isClick : false">
                                <component :is="headers" class="resource__text h5 fw-bold mb-0">{{i.Title}}</component>
                                <svg-icon name="investors" size="24"/>
                                <transition name="fadeInDown">
                                    <ul v-if="deviceMode == 'deskTop'" class="resource__subitem  list-inline mb-0">
                                        <li v-for="j in i.Children" :key="j.ID" class="list-inline-item">
                                            <router-link :to="'/'+this.$route.params.lang+j.Link" class="small">{{j.Title}}</router-link>
                                        </li>
                                    </ul>
                                </transition>
                            </div>
                        </template>
                    </div>
                    <!-- 投資人專區子選單 手機版 -->
                    <transition name="fadeInDown">
                        <span v-if="deviceMode !== 'deskTop' &&　isClick" class="col">
                            <ul class="resource__subitem list-inline mt-2 mb-0">
                                <li v-for="i in FooterInvestor" :key="i.ID" class="list-inline-item">
                                    <router-link :to="'/'+this.$route.params.lang+i.Link" class="small">{{i.Title}}</router-link>
                                </li>
                            </ul>
                        </span>
                    </transition>
                </div>
            </div>
        </section>

        <section class="nkg__lo__container bg-darkgray pt-3 pb-4 pt-xl-4">
            <div class="link__wrap row row-cols-1 row-cols-xl-auto justify-content-between align-items-center">
                <div class="col text-center">
                    <router-link class="navbar-brand me-0" :to="'/'+this.$route.params.lang+'/home/'">
                        <img src="@/assets/images/logo_ft.png" alt="" />
                    </router-link>
                </div>
                
                <!-- 頁尾主選單 -->
                <div class="col">
                    <nav class="navbar navbar-expand-xl">
                        <div class="navbar-collapse">
                            <ul class="navbar-nav">                        
                                <li v-for="(i, idx) in FooterData" :key="idx" class="nav-item dropdown">
                                    <template v-if="i.Children == undefined">
                                        <router-link class="nav-link small" :to="'/'+this.$route.params.lang+'/contact-us/'" :target="i.Target">{{i.Title}}</router-link>
                                    </template>
                                    <template v-else>
                                        <a class="nav-link dropdown-toggle pe-2 small" href="#" :id="'footerDropdown'+idx" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {{i.Title}}<svg-icon name="arrow-down" size="20"/>
                                        </a>
                                        <ul class="dropdown-menu" :aria-labelledby="'footerDropdown'+idx">
                                            <li v-for="j in i.Children" :key="j">
                                                <a class="dropdown-item" :class="deviceMode!=='pad'?'smallest':'small'" :href="j.Link" :target="j.Target">{{j.Title}}</a>
                                            </li>
                                        </ul>
                                    </template>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
                
                <!-- 頁尾社群 -->
                <div class="col">
                    <ul class="list-unstyled list-inline text-center mt-3 mt-xl-0 mb-3">
                        <li v-for="i in FooterIcon" :key="i" class="list-inline-item">
                            <a :href="i.Link" :target="i.Target" class="nkg__ic nkg__ic--lg" :class="i.Img"></a>
                        </li>
                    </ul>
                </div>
            </div>
        </section>   
        
        <section class="bg-dark text-center py-2">
            <span class="smallest" v-i18n="'Copyright'"></span>
        </section>
    </footer> 
    <div v-if="isCollapse" class="modal-backdrop show" @click="isCollapse=!isCollapse"></div>
</template>

<script>
import { provide, reactive, ref, onMounted, onUnmounted } from 'vue';
import kernel from "./plugins/kernel";
import $ from "jquery";
import _ from "lodash";

export default {
    data() {
        return {
            isCollapse: false,
            isHovering: '',
            isClick: false,
            isTop: false, //是否顯示回到頂部按鈕
            scrollNum: 0, //滾動距離
            renderFooter: false,
            headers: ''
        };
    },
    setup() {
        // https://v3.cn.vuejs.org/guide/composition-api-provide-inject.html
        const { 
            deviceMode, 
            thisDevice, 
            MenuData, 
            BaseService, 
            FooterData, 
            FooterFast, 
            FooterInvestor, 
            FooterIcon,
            getLang,
            LangData,
            ChLangData
        } = kernel();
        const secTitleList = [];
        
        provide('getLang', getLang);        

        thisDevice();
        onMounted(() => {
            window.addEventListener('resize', thisDevice);
        })
        onUnmounted(() => {
            window.removeEventListener('resize', thisDevice);
        }) 
        provide('deviceMode', deviceMode);

        provide('MenuData', MenuData);
        provide('secTitleList', secTitleList);
        // provide('FooterFast', FooterFast);
        BaseService(getLang.value);

        return {
            deviceMode,
            MenuData,
            FooterData,
            FooterFast,
            FooterInvestor,
            FooterIcon,
            getLang,
            BaseService,
            LangData,
            ChLangData
        }
    },
    created() {
        this.$watch(
            () => this.$route.params,
            () => {
                this.$route.params.dyna == "home" ? this.headers = 'h4' : this.headers = 'div';
                this.BaseService(this.$route.params.lang);
                this.LangData(this.$route.params.lang);// 觸發單次語系讀取 
                if(this.getLang == "zh-TW"){
                    document.querySelector('meta[property="og:site_name"]').setAttribute("content", "金寶電子");
                } else if (this.getLang == "en-US") {
                    document.querySelector('meta[property="og:site_name"]').setAttribute("content", "Kinpo Electronics");
                }
            }
        )
    },
    updated() {
        this.isCollapse ? document.body.classList.add("overflow-hidden") : document.body.classList.remove("overflow-hidden");
        this.isClick = false;
    },
    mounted() {
        window.addEventListener("scroll", () => {
            let top =
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                window.pageYOffset;
            this.scrollNum = top;
            if (top >= 500) {
                this.isTop = true;
            } else {
                this.isTop = false;
            }
            $(".scroll-hint").css("opacity", 1 - $(window).scrollTop() / 250);
            if($('.bgimg-fixed').length > 0 && this.deviceMode == 'deskTop'){
                this.scrollParallax();
            }
        });
        document.documentElement.style.setProperty('--bgHeight', `${window.screen.height}px`);
        window.addEventListener("scroll", this.showGotop, { passive: true });
        window.addEventListener("scroll", this.isParallax, { passive: true });
    },
    methods: {
        handleUpdate (value) {
            this.renderFooter = value;
            document.body.scrollIntoView();
        },
        urlCheck (url){
            if(url.indexOf('http')!==-1){
                return 1;
            } else {
                return 2;
            }
        },
        scrollTop() {
            $('html,body').animate({ scrollTop: 0 }, 'slow');
        },
        scrollOverBanner() {
            let banner_h = $('.mainbanner').outerHeight();
            let header_h = $('.header .navbar').outerHeight();
            $('html,body').animate({ scrollTop: banner_h - header_h }, 'slow');
        },
        getThisPath(L,to) {
            let Tmp=[];
            Object.keys(to.params).forEach((k,i) => {if(i>0){Tmp=Tmp+to.params[k]+'/';}});
            return '/'+L+'/'+Tmp;
        },
        scrollParallax(){
            let h = $(window).height();
            let scrollY = $(window).scrollTop();
            for(let i=0; i<$('.bgimg-fixed').length; i++){
                let el_top = $('.bgimg-fixed:eq('+i+')').position().top;
                $('.bgimg-fixed:eq('+i+')').css('background-position','center '+parseInt(-1*((scrollY + h)-el_top)/8+80)+'px');
            }
        }
    }
};
</script>

<style lang="scss">
// header
.header {    
    z-index: 1051 !important;
    // 漢堡icon
    .hamburger {
        width: 1.875rem;
        height: 1.875rem;
        span {
            display: block;
            position: absolute;
            height: 2px;
            width: 75%;
            background: #fff;
            border-radius: 2px;
            opacity: 1;
            left: 10%;
            transform: rotate(0deg);
            transition: .25s ease-in-out;
            &:nth-child(1) {
                top: 6px;
            }
            &:nth-child(2), &:nth-child(3) {
                top: 14px;
            }
            &:nth-child(4) {
                top: 22px;
            }
        }
        &:not(.collapsed) span{
            &:nth-child(1) {
                top: 14px;
                width: 0%;
                left: 50%;
            }
            &:nth-child(2) {
                transform: rotate(45deg);
            }
            &:nth-child(3) {
                transform: rotate(-45deg);
            }
            &:nth-child(4) {
                top: 14px;
                width: 0%;
                left: 50%;
            }
        }
        @include media-breakpoint-down(sm) {
            span {
                width: 60%;
                left: 20%;
                &:nth-child(1) {
                    top: 8px;
                }
                &:nth-child(4) {
                    top: 20px;
                }
            }
        }
    }
    .navbar {
        margin-bottom: $header-height * -1;
        min-height: $header-height;
        width: 100%;
        justify-content: start;
        background-color: rgba(0, 0, 0, 0.9);
        @include media-breakpoint-down(sm) {
            @include layoutPadding-y(.3125rem);
            margin-bottom: $header-height-sm * -1;
            min-height: $header-height-sm;
        }
        &-brand {
            margin-right: 30px;
            img {
                display: inherit;
                height: 42px;
            }
            @include media-breakpoint-down(xl) {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                margin-right: 0;
            }
            @include media-breakpoint-down(sm) {
                img {
                    height: 28px;
                }
            }
        }        
        &-collapse {
            @include media-breakpoint-down(xl) {
                display: block !important;
                position: fixed;
                left: -100%;
                top: $header-height;
                width: 70vw;
                height: calc(100vh - #{$header-height});
                background-color: rgba($dark, .9);
                transition: $sec ease-in-out;
                overflow: auto;
                &.show {
                    left: 0;
                }
            }
            @include media-breakpoint-down(sm) {
                top: $header-height-sm;
                height: calc(100vh - #{$header-height-sm});
                padding-bottom: 150px;
            }
        }
    }
    .navbar__main{
        &.navbar{
            &-nav {
                .nav {
                    &-item {
                        display: flex;
                        position: initial;
                        @include media-breakpoint-down(xl) {
                            flex-direction: column;
                        }
                    }
                    &-link {
                        display: flex;
                        align-items: flex-end;
                        position: relative;
                        padding: 0 0 1.25rem;
                        margin: 0 2.1vw;
                        color: #fff;
                        line-height: 1;
                        white-space: nowrap;
                        .nkg__ic {
                            transition: .15s ease-in-out;
                        }
                        &:hover {
                            color: $warning;
                        }
                        @include media-breakpoint-up(xl) {
                            &::after {
                                @include pseudoBlock;
                                width: 0;
                                height: 3px;
                                bottom: 0;
                                left: 50%;
                                transform: translateX(-50%);
                                transition: $sec cubic-bezier(.21, .61, .35, 1) .1s;
                                background-color: $warning;
                            }
                            &.active {
                                color: $warning;
                                &::after {
                                    width: 100%;
                                }
                            }
                        }
                        @media (max-width: 1460px) {
                            margin: 0 1.1vw;
                        }
                        @include media-breakpoint-down(xl) {
                            @include layoutPadding-x(3.125rem);
                            @include layoutPadding-y(1rem);
                            margin: 0;
                            font-size: 1.125rem;
                        }
                        @include media-breakpoint-down(sm) {
                            @include layoutPadding-x(1.5rem);
                            font-size: 1rem;
                        }
                    }
                }
                .dropdown {
                    &-toggle::after {
                        display: none;
                    }
                    &-menu {
                        display: block;
                        top: 100%;
                        left: 0;
                        padding: 0;
                        margin: 0;
                        width: 100%;
                        max-height: 0;
                        overflow: hidden;
                        background-color: rgba(10, 10, 10, 0.85);
                        text-align: center;
                        transition: .1s ease-in-out;
                        li {
                            position: relative;
                            display: inline-block;
                            padding: 0;
                        }
                        &.show {
                            max-height: 180px;
                            box-shadow: 0 1px 0 $gray-300 inset;
                            transition: $sec ease-in-out;
                            .dropdown-item {
                                padding: 1.5rem 2.5vw;
                                opacity: 1;
                            }
                            @include media-breakpoint-up(xl) {
                                li+li {
                                    &::after {
                                        @include pseudoBlock;
                                        height: 1.5rem;
                                        width: 1px;
                                        top: 50%;
                                        left: 0;
                                        transform: translateY(-50%);
                                        background-color: $gray-300;
                                    }
                                }
                            }
                        }
                        @include media-breakpoint-down(xl) {
                            @include layoutPadding-x(3.125rem);
                            position: relative;
                            max-height: 0;
                            text-align: left;
                            transition: $sec ease-in-out;
                            background-color: transparent;
                            li {
                                display: block;
                            }
                            li+li {
                                &::after {
                                    display: none;
                                }
                            }
                            &.show {
                                @include layoutPadding-y(.25rem);
                                max-height: 700px;
                                box-shadow: none;
                                .dropdown-item {
                                    padding: .625rem 1.125rem;
                                }
                            }
                            &::after {
                                @include pseudoBlock;
                                height: calc(100% - 30px);
                                width: 1px;
                                top: 15px;
                                left: 3.25rem;
                                background-color: $gray-500;
                            }
                        }
                        @include media-breakpoint-down(sm) {
                            @include layoutPadding-x(1.5rem);
                            &::after {
                                left: 1.75rem;
                            }
                        }
                    }
                    &-item {
                        color: #fff;
                        padding: 0 2.5vw;
                        opacity: 0;
                        transition: padding .3s ease-in-out;
                        &:hover, &:active, &:focus {
                            background-color: transparent;
                            color: $warning;
                        }
                        @include media-breakpoint-down(xl) {
                            padding: .625rem 1.125rem;
                            color: $gray-300;
                            opacity: 1;
                        }
                    }
                }
            }
        }
    }
    
    .navbar__sub{
        a{
            color: #fff;
            &:hover, &:focus{
                color: $warning;
            }
        }
        .navbar-nav{
            border-radius: 0 0 $border-radius $border-radius;
            .nav-link{
                position: relative;
                padding: .25rem 1.25rem;
                z-index: 2;
            }
        }
        .dropdown{
            &-toggle{
                display: flex;
                flex-direction: row;
                align-items: center;
                &::after{
                    display: none;
                }
                &:focus {
                    @include removeOutline;
                }
            }
            &-menu{
                display: block;
                position: absolute;
                top: 0;
                padding: 1.5rem 0 0;
                margin: 0;
                width: 100%;
                min-width: auto;
                max-height: 0;
                overflow: hidden;
                font-size: inherit;
                text-align: center;
                border: none;
                background: $blue;
                z-index: 1;
                transition: $sec ease-in-out;
                &.show{
                    padding-top: 1.75rem;
                    max-height: 300px;
                }
            }
            &-item:hover, &-item:focus{
                background-color: transparent;
            }
        }
        @include media-breakpoint-down(xl) {
            a{
                color: $gray-300;
            }
            .navbar-nav{
                .nav-link{
                    padding: .5rem 0;
                }
            }
            .dropdown{
                &-menu{
                    position: relative;
                    padding-top: 0;
                    background-color: transparent;
                    text-align: left;
                    &.show {
                        @include layoutPadding-y(.25rem);
                    }
                    &::after{
                        @include pseudoBlock;
                        height: calc(100% - 30px);
                        width: 1px;
                        top: 15px;
                        left: .1rem;
                        background-color: $gray-500;
                    }
                }
                &-item{
                    padding: .5rem 1.125rem;
                }
            }
        }
        @include media-breakpoint-down(sm) {
            .dropdown{
                &-menu{
                    &::after{
                        left: .25rem;
                    }
                }
            }
        }
    }
}
// footer
.footer {
    position: relative;
    z-index: 1020;
    .navbar-brand {
        img {
            width: 100px;
        }
        @include media-breakpoint-down(md) {
            img {
                width: 70px;
            }
        }
    }
    a {
        color: #fff;
        &:hover,
        &:focus {
            color: $warning;
        }
    }
    .resource {
        &__wrap {
            height: 60px;
            div {
                position: relative;
            }
            div+div::after {
                @include pseudoBlock;
                left: 0;
                top: 0;
                width: 1px;
                background-color: rgba(#fff, 0.5);
            }
        }
        &__item {
            @include xyCenter-f;
            position: relative;
            cursor: pointer;
            .nkg__ic--svg {
                margin-left: .5rem;
            }
            @include media-breakpoint-up(xl) {
                &:hover {
                    .resource__text::after {
                        width: 100%;
                    }
                    .resource__subitem{
                        opacity: 1;
                        transform: translateY(0);
                        @include media-breakpoint-down(xxl) {
                            transform: translateX(-29%) translateY(0);
                        }
                        @include media-breakpoint-down(xl) {
                            transform: translateX(0) translateY(0);
                        }
                    }
                }
            }
        }
        &__subitem {
            position: absolute;
            align-items: center;
            top: 36px;
            left: 0;
            white-space: nowrap;
            opacity: 0;
            transform: translateY(-.5rem);
            transition: $sec ease-in-out;
            li {
                margin-right: 2rem;
            }
        }
        &__text {
            position: relative;
            text-align: center;
            &::after {
                @include pseudoBlock;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 2px;
                background-color: $warning;
                bottom: -5px;
                transition: $sec ease-in-out;
            }
        }
        @include media-breakpoint-down(xxl) {
            &__wrap {
                div+div::after {
                    height: 28px;
                }
            }
            &__subitem {
                transform: translateX(-29%) translateY(-.5rem);
            }
        }
        @include media-breakpoint-down(xl) {
            &__subitem {
                position: initial;
                display: flex;
                justify-content: flex-end;
                opacity: 1;
                transform: translate(0, 0);               
            }
        }
        @include media-breakpoint-down(md) {
            &__wrap {
                height: 80px;
                div+div::after {
                    height: 52px;
                }
            }
            &__item {
                flex-direction: column-reverse;
                .nkg__ic--svg {
                    margin-left: 0;
                    margin-bottom: .5rem;
                }
            }
            &__subitem {
                position: relative;
                display: flex;
                justify-content: space-around;
                padding: 0 .5rem;
                top: 0;
                left: 0;
                li {
                    margin-left: 0;
                    margin-right: 0;
                }
            }
            &__text {
                font-size: 0.875rem;
            }
        }
    }
    .navbar-expand-xl .navbar-nav {
        white-space: nowrap;
        .dropdown-menu {
            position: relative;
        }
        .nav-link {
            @include layoutPadding-x(0);
            font-weight: bold;
            @include media-breakpoint-down(xl) {
                @include layoutPadding-y(0);
            }            
        }
    }
    .nav-item {
        margin-right: 4vw;
        .nkg__ic--svg {
            display: none;
        }
        @include media-breakpoint-down(xl) {
            @include layoutPadding-y(.8rem);
            margin: 0;
            border-bottom: 1px solid $gray-500;
            a {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .nkg__ic--svg {
                display: inline-block;
            }
        }
        @include media-breakpoint-down(sm) {
            font-size: 0.875rem;

        }
        .dropdown {
            &-toggle {
                pointer-events: none;
                &::after {
                    display: none;
                }
                @include media-breakpoint-down(xl) {
                    pointer-events: initial;
                }
            }
            &-menu {
                display: block;
                padding: 0;
                border: none;
                background-color: transparent;
                li {
                    margin-right: 2rem;
                }
                @include media-breakpoint-up(xl) {
                    display: flex;
                }
                @include media-breakpoint-down(xl) {
                    flex-direction: column;
                    padding-left: 1rem;
                    margin-top: 0;
                    max-height: 0;
                    overflow: hidden;
                    transition: $sec ease-in-out;
                    &.show {
                        max-height: 200px;
                        margin-top: .5rem;
                    }
                }
            }
            &-item {
                @include layoutPadding-x(0);
                color: $gray-300;
                &:hover,
                &:focus {
                    color: $warning;
                    background-color: transparent;
                }
                @include media-breakpoint-down(xl) {
                    @include layoutPadding-y(.4rem);
                }
            }
        }
    }
    .nkg__ic {
        width: 1.5rem;
        height: 1.5rem;
        @include media-breakpoint-down(xl) {
            width: 2.5rem;
            height: 2.5rem;
        }
        @include media-breakpoint-down(sm) {
            width: 1.875rem;
            height: 1.875rem;
        }
    }
}
</style>
