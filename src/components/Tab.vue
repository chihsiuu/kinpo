<template>
    <section :class="L2.Styles">
        <div :id="ID" class="carousel">
            <div class="carousel__control position-relative" :class="{'icontab':isWithIcon}">
                <Splide :options="thumbsOptions" ref="thumbs" @splide:click="onSplideClick"
                class="carousel--scroll list-inline mb-0">
                    <SplideSlide v-for="(item, idx) in L2.Data" :key="idx" class="list-inline-item border-0 m-0">
                        <span v-if="isWithIcon" class="nkg__ic mb-1 mb-md-2" :style="{ backgroundImage: 'url(\'' + (idx == nowCarouselItem ? item.HIcon : item.Icon) + '\')' }"></span>
                        <span class="small mx-3 text-center flex-grow-1 d-flex align-items-center justify-content-center" v-html="item.Title"></span>
                    </SplideSlide>
                </Splide>
            </div>
            <Splide
                :options="mainOptions"
                ref="main"
                @splide:mounted="onSplideMounted"
                @splide:move="onSplideMove"
                class="mx-0"
            >
                <SplideSlide v-for="(item, idx) in L2.Data" :key="idx" class="carousel__item">
                    <div class="row g-0" :class="{'position-absolute': nowCarouselItem !== idx && deviceMode !== 'deskTop'}">
                        <div class="col-md-6 col-xl-5">
                            <div class="nkg__section nkg__lo__container carousel__des">
                                <div> 
                                    <component :is="headers" class="h2 text-center fw-bold mt-4" :lang="this.$route.params.lang">{{ $filters.removeHtml(item.Title) }}</component>
                                    <hr class="flex-shrink-0"/>
                                    <div v-html="item.SubTitle" class="lh-lg mb-4"></div>
                                    <div v-if="item.Url!==''" class="text-center">
                                        <router-link :to="'/'+this.$route.params.lang+item.Url" class="btn btn-outline-light rounded-pill mt-2" v-i18n="'Details'"
                                        ></router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <transition name="fade">
                        <div v-if="nowCarouselItem == idx">
                            <img class="carousel__img w-100 h-100" :src="item.Img" alt="" />
                        </div>
                    </transition>
                </SplideSlide>
            </Splide>  
        </div>     
    </section>
</template>

<script>
import kernel from "../plugins/kernel";
import { inject, onMounted, ref } from "vue";
import $ from "jquery";
import _ from "lodash";

export default {
    props: {
        pageindex: [Number, String],
        L2: Object
    },
    data() {
        return {
            isOver: false,
            isWithIcon: false,
            isClickable: true,
            ID: '',
            headers: ''
        };
    },
    setup() {
        const {ChLangData, LangData, getLang} = kernel();
        const deviceMode = inject('deviceMode');
        LangData(getLang.value);
        const nowCarouselItem = ref(0);
        const splide = ref();
        const main = ref();
        const thumbs = ref();
        const mainOptions = {
            type: "slide",
            perPage: 1,
            perMove: 1,
            arrows: false,
            pagination: false,
        };
        const thumbsOptions = {
            type: "slide",
            pagination: false,
            autoWidth: true,
            arrowPath: "M22.6,20l-8.8,8.8c-0.6,0.7-0.6,1.7,0,2.4c0.6,0.6,1.7,0.6,2.3,0l10-10c0.7-0.7,0.7-1.7,0-2.4l-10-10c-0.7-0.6-1.7-0.6-2.4,0c-0.6,0.6-0.6,1.7,0,2.3L22.6,20z",
            isNavigation: true,
            updateOnMove: true,
        };

        function onSplideClick(e, splide) {
            // console.log("click", e, splide.index);
        }
        function onSplideMounted(splide) {
            // console.log("mounted", splide.length);
        }
        function onSplideMove(splide, index) {
            nowCarouselItem.value = index;
            // console.log("move to", index);
            if(nowCarouselItem.value == 0){
                $('[class*="--scroll"] .splide__track').removeClass('opacitymask--l').addClass('opacitymask--r');
            } else if(nowCarouselItem.value + 1 == splide.length){
                $('[class*="--scroll"] .splide__track').removeClass('opacitymask--r').addClass('opacitymask--l');
            } else {
                $('[class*="--scroll"] .splide__track').addClass('opacitymask--l opacitymask--r');
            }
        }

        onMounted(() => {
            const thumbsSplide = thumbs.value?.splide;
            if (thumbsSplide) {
                main.value?.sync(thumbsSplide);
            }
            $('[class*="--scroll"] .splide__track').addClass('opacitymask--r');
        });

        return {
            nowCarouselItem,
            splide,
            main,
            thumbs,
            mainOptions,
            thumbsOptions,
            onSplideClick,
            onSplideMounted,
            onSplideMove,
            ChLangData,
            deviceMode
        }; 
    },
    updated(){
        $("td").removeAttr("style");
    },
    created(){
        this.$route.params.dyna == "capabilities" ? this.headers = 'h4' : this.headers = 'h3';
    },
    mounted() {
        if (this.L2.Templates == 'Tab') {
            this.isWithIcon = this.L2.Data.some(function(item){ // 是否帶icon
                return item.Icon !== '';
            });
            this.ID = this.L2.Data[0].ID; 
            if(this.deviceMode=="deskTop"){
                setTimeout(() => {
                    let des_H = $("#" + this.ID + " .carousel__item:eq(0)").height();              
                    $(".carousel__des").attr("style", "height:"+des_H+"px");
                }, 500);
            }
        }
    },
};
</script>

<style lang="scss">
.carousel__des{
    table{
        width: 100%;
    }
}
</style>
<style lang="scss" scoped>
.carousel{    
    &__control{
        margin: 0 5vw;
        overflow: hidden;
        :deep(.splide__track){
            margin: 0 5rem;
            @include media-breakpoint-down(xl) {
                margin: 0 3rem;           
            }
            @include media-breakpoint-down(md) {
                margin: 0 1.5rem;
        
            }
        }
        @include media-breakpoint-down(xl) {
            margin: 0;
        }
        .carousel--scroll {
            overflow-x: auto;
            overflow-y: hidden;
        }           
        &:not(.icontab){
            .list-inline-item{
                padding: 2.5rem;
                position: relative;
                text-align: center;
                flex: 1 1 auto;
                align-self: center;
                font-weight: bold;
                font-size: 1.125rem;
                white-space: nowrap;
                cursor: pointer;
                transition: $sec ease-in-out;
                &::after{
                    @include pseudoBlock;
                    width: 1px;
                    height: 1.25rem;
                    background-color: $light;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }
                &:first-child::after{
                    display: none;
                }
                &:hover, &.is-active{
                    color: $blue-500;
                }
                @include media-breakpoint-down(lg) {
                    @include layoutPadding-y(1.5rem);
                }
                @include media-breakpoint-down(sm) {
                    @include layoutPadding-x(.75rem);
                    &::after{
                        display: none;
                    }
                }
            }
        }
        &.icontab{            
            .list-inline-item{
                display: flex;
                flex-direction: column;
                flex-shrink: 0;
                align-self: stretch;
                align-items: center;
                width: 12vw;
                min-width: 170px;
                padding-top: 2.3rem;
                padding-bottom: 2.3rem;
                cursor: pointer;
                transition: $sec ease-in-out;
                &:hover{
                    @include media-breakpoint-up(lg) {
                        background-color: rgba($dark,.2);
                    }
                }
                &.is-active{
                    color: $warning;
                    background-color: rgba($dark,.2);
                    box-shadow: 0 -1px 0 $warning inset;
                }
                @include media-breakpoint-down(sm) {
                    min-width: auto;
                    width: auto;
                    white-space: nowrap;
                    padding: 1rem 1.5rem;
                }
            }
            .nkg__ic {
                width: 2rem;
                height: 2rem;
            }
        }
        
    }
    &__des{
        position: relative;
        background-color: rgba($dark,.7);
        z-index: 2;
        hr{
            margin-top: 1.875rem;
            margin-bottom: 1.875rem;
            opacity: 1;
        }
        @media (min-width: 1200px) and (max-width: 1439.98px) {
            h4{
                &:lang(en-US){
                    font-size: 1.5rem;
                }
            }
        }
    }
    &__img{
        position: absolute;
        top: 0;
        object-fit: cover;
        object-position: center;
        z-index: 1;
    }
    
}
</style>