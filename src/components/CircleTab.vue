<template>
    <section :data-sec-scroll="L2.Title" :class=" L2.Styles" class="nkg__section">    
        <h2 v-if="L2.Title!==''" class="h3 text-center fw-bold" v-html="L2.Title"></h2>
        <div class="nkg__container">
            <div class="nkg__wrap">
                <div class="nkg__tab__wrap position-relative" style="min-height:170px;">
                    <div v-for="(t, i) in circleTabDisplay" :key="i" class="w-100" :class="{'position-absolute': deviceMode !== 'mobile'}">
                        <transition :name="carouselName">
                            <ul v-show="nowCircleTab == i" class="nav justify-content-center">
                                <li v-for="(tt, ii) in circleTabDisplay[i]" :key="ii"
                                class="mx-md-3"
                                :class="{'mb-5': ii+1 < circleTabDisplay[i].length, 'w-100': deviceMode == 'mobile'}"
                                @mouseover.passive="hover(ii)" @click="hover(ii)">
                                    <div
                                        class="nkg__tab nkg__block--circle mx-auto"
                                        :class="{'active' : this.deviceMode == 'mobile' || nowHover == ii && nowCircleTab == i}"
                                        :style="{ backgroundImage: 'url(\'' + tt.Img + '\')' }"
                                    >
                                        <div class="h4 fw-bold mb-0" v-html="tt.Title"></div>
                                    </div>
                                    <div v-if="deviceMode == 'mobile'">
                                        <div class="nkg__tab__content">
                                            <div class="nkg__tab__inner">
                                                <div class="nkg__list">
                                                    <div v-html="tt.SubTitle"></div>
                                                </div>                                              
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </transition>
                    </div>
                    <div v-if="deviceMode !== 'mobile'" class="arrows">
                        <svg-icon v-if="!(nowCircleTab == 0 && nowHover == 0)"
                            class="splide__arrow splide__arrow--prev"
                            name="arrow-l"
                            size="40"
                            @click.prevent="toPrevItem"
                        />
                        <svg-icon v-if="!(nowCircleTab + 1 == circleTabDisplay.length && nowHover + 1 == circleTabDisplay[nowCircleTab].length)"
                            class="splide__arrow splide__arrow--next"
                            name="arrow-r"
                            size="40"
                            @click.prevent="toNextItem"
                        />
                    </div>
                </div>
                <template v-if="deviceMode !== 'mobile'">
                    <div v-for="(box, i) in circleTabDisplay[nowCircleTab]" :key="i">
                        <transition name="fadeInUp">
                            <div class="nkg__tab__content" v-if="nowHover == i">
                                <div class="nkg__tab__inner">
                                    <div class="nkg__list">
                                        <div v-html="box.SubTitle"></div>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>

<script>
import $ from "jquery";
import { inject } from 'vue';

export default {
    props: {
        pageindex: [Number, String],
        L2: Object
    },    
    data: function() {
        return {
            nowHover: 0,			
			circleTabDisplay: [],
			carouselName: 'carousel-next',
			nowCircleTab: 0,
            perGroupLength: 3,
        };
    },
    setup() {
        const deviceMode = inject('deviceMode');
        return {
            deviceMode,
        }
    },
    mounted() {
        let allItem_W = (170 + 32) * this.L2.Data.length;
        let wrap_w = $(".nkg__container").width();
		if(allItem_W < wrap_w || this.deviceMode == 'mobile'){
            this.perGroupLength = this.L2.Data.length;			
		}
		this.circleTabDisplay = _.chunk(this.L2.Data, this.perGroupLength);
    },
    methods: {
        hover(i) {
            this.nowHover = i;
        },
        toNextItem(){
            if(this.nowHover < this.perGroupLength - 1){
                this.nowHover++;
            } else {
                this.nowHover = 0;
                this.toNextPage();
            }
        },
        toPrevItem(){
            if(this.nowHover > 0){
                this.nowHover--;
            } else {
                this.nowHover = this.perGroupLength - 1;
                this.toPrevPage();
            }
        },
		toNextPage() {
			this.carouselName = 'carousel-next';
            this.nowCircleTab + 1 >= this.L2.Data.length ? this.nowCircleTab = 0 : this.nowCircleTab = this.nowCircleTab + 1;
		},
		toPrevPage() {
			this.carouselName = 'carousel-prev';
            this.nowCircleTab - 1 < 0 ? this.nowCircleTab = this.L2.Data.length - 1 : this.nowCircleTab = this.nowCircleTab - 1;
		},
    },
};
</script>

<style lang="scss" scoped>
.nkg {
    // tab & tab-content
    &__tab {
        position: relative;
        @include bgFillCenter;
        background-size: auto 170px;
        border: 0 solid transparent;
        color: #fff;
        cursor: pointer;
        font-weight: bold;
        font-size: 1.125rem;
        transition: $sec ease-in-out;
        &::before {
            @include pseudoBlock;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .5);
            border-radius: 100%;
            transition: $sec ease-in-out;
        } 
        &::after {
            @include pseudoBlock;
            bottom: -4.3rem;
            left: 50%;
            width: 40px;
            height: 40px;
            background-color: #fff;
            border-radius: $border-radius * .5;
            box-shadow: 0 1px 2px 6px rgba(0, 0, 0, 0.03);
            transform-origin: center;
            transform: translate(-50%,1rem) rotate(45deg);
            opacity: 0;
            z-index: 1;
        }          
        &.active {
            border: 5px solid #fff;
            &::before {
                background-color: rgba($blue-700, .2);
            }
            &::after {
                transform: translateX(-50%) rotate(45deg);   
                opacity: 1; 
                transition: $sec ease-in-out;
            }
        }
        .h4 {
            position: relative;
            z-index: 2;
        }
        &__wrap{
            overflow-x: clip;
            overflow-y: visible;
        }
        &__content {
            position: relative;
            margin-top: 2.5rem;
            border-radius: $border-radius * 2;
            box-shadow: 0 1px 2px 6px rgba(0, 0, 0, 0.03);
        }
        &__inner {
            position: relative;
            padding: 2.5rem 3.5rem;
            background-color: #fff;
            border-radius: $border-radius * 2;
            z-index: 2;
            @include media-breakpoint-down(sm) {
                padding: 2rem 1.5rem;
            }
        }
    }
}
</style>