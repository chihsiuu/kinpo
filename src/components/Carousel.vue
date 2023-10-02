<template>
    <!-- carousel -->
    <section v-if="L2.Templates == 'AwardsCarousel'" class="nkg__section" :data-sec-scroll="L2.Title" :class="[L2.Styles, { 'bgimg-fixed': L2.RGBA!=='' && L2.RGBA!=='rgba(0, 0, 0, 0)' }]"
        :style="{ backgroundImage: 'linear-gradient(' + L2.RGBA + ',' + L2.RGBA + '), url(\'' + (deviceMode=='deskTop'?L2.Img:(L2.MImg==''?L2.Img:L2.MImg)) + '\')'}">
        <h2 v-if="L2.Title!=='' && deviceMode == 'mobile'" class="h3 text-center text-warning fw-bold">{{ L2.Title }}</h2>
        <div class="nkg__container">
            <div class="nkg__wrap">
                <div class="row justify-content-end">

                    <div class="col-md-4 col-lg-3 order-5 order-md-1">
                        <h2 v-if="L2.Title!=='' &&  deviceMode !== 'mobile'" class="h3 text-center text-warning fw-bold mb-md-4">{{ L2.Title }}</h2>
                        <Splide :options="mainOptions" ref="main" class="award__logo text-center">
                            <SplideSlide v-for="(p, i) in L2.Data" :key="i">
                                <img :src="p.Img" alt=""/>
                            </SplideSlide>
                        </Splide>
                    </div>

                    <div class="col-md-8 col-lg-6 col-xxl-5 order-1 order-md-5">
                        <Splide :options="thumbsOptions" ref="thumbs" class="award__list mb-4 mb-md-0">
                            <SplideSlide v-for="(p, i) in L2.Data" :key="i">
                                <p>{{ p.Title }}</p>
                            </SplideSlide>
                        </Splide>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { inject } from "vue";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import { onMounted, ref } from "vue";

export default {
    props: {
        pageindex: [Number, String],
        L2: Object
    },
    components: {
        Splide,
        SplideSlide,
    },
    setup() {
        const deviceMode = inject('deviceMode');
        const splide = ref();
        const main = ref();
        const thumbs = ref();

        const mainOptions = {
            type: "fade",
            perPage: 1,
            perMove: 1,
            gap: ".5rem",
            pagination: false,
            arrows: false,
            drag: false,
            breakpoints: {
                576: {
                    type: "loop",
                    arrows: true,
                    arrowPath: "M22.6,20l-8.8,8.8c-0.6,0.7-0.6,1.7,0,2.4c0.6,0.6,1.7,0.6,2.3,0l10-10c0.7-0.7,0.7-1.7,0-2.4l-10-10c-0.7-0.6-1.7-0.6-2.4,0c-0.6,0.6-0.6,1.7,0,2.3L22.6,20z",
                }
            }
        };

        const thumbsOptions = {
            type: "slide",
            rewind: true,
            gap: ".5rem",
            pagination: false,
            arrows: false,
            autoplay: true,
            interval: 3000,
            // fixedWidth: 110,
            fixedHeight: '2rem',
            direction: 'ttb',
            height: '30rem',
            cover: true,
            focus: 0,
            isNavigation: true,
            updateOnMove: true,     
            breakpoints: {
                992: {
                    fixedHeight: '1.5rem',
                    height: '24rem',
                },
                576: {
                    height: '15rem',
                }
            }       
        };

        onMounted(() => {
            const thumbsSplide = thumbs.value?.splide;
            if (thumbsSplide) {
                main.value?.sync(thumbsSplide);
            }
        });

        return {
            deviceMode,
            splide,
            main,
            thumbs,
            mainOptions,
            thumbsOptions,
        };
    }
};
</script>

<style lang="scss">
.award{
    &__list{
        position: relative;
        padding-left: 1.5rem;
        font-size: 1.125rem;
        font-weight: 300;
        color: #fff7bc;
        line-height: 1.25;
        &::before{
            @include pseudoBlock;
            top: 4%;
            left: 0;
            width: 4px;
            height: 92%;
            background-image: linear-gradient(to bottom, $white, $warning);
        }
        .splide__slide {
            transition: $sec ease-in-out;
            border: none !important;
            &.is-active{
                font-weight: bold;
            }
        }
        .splide__track{
            margin: 0 !important; 
        }
        @include media-breakpoint-down(lg) {
            font-size: 1rem;
        }
        @include media-breakpoint-down(sm) {
            padding-left: 0;
            font-size: .875rem;
            &::before{
                display: none;
            }
        }
    }
    &__logo{
        img{
            width: 150px;
        }
        .splide__slide{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .splide__track{
            margin: 0 !important; 
        }
    }
}
</style>