<template>
    <section class="mainbanner">
        <Splide class="banner mx-0" :options="topBanner">
            <SplideSlide v-for="(item, idx) in L2.Data" :key="idx">
                <h1 class="banner__title position-absolute top-50 start-50 translate-middle fw-bold text-white text-center mt-4" :lang="this.$route.params.lang">
                    <p class="mb-2">{{item.Title}}</p>
                    <p :class="deviceMode=='mobile'?'h6':'h5'" v-html="item.SubTitle"></p>
                </h1>
                <img v-if="!isVideo(item.Img)" class="banner__img w-100 h-100" :src="item.Img" :alt="item.ImgAlt"/>
                <iframe v-else
                    class="banner__video w-100 pe-none"
                    :src="'https://www.youtube.com/embed/'+videoCode+'?playlist='+videoCode+'&loop=1&autoplay=1&modestbranding=1&controls=0&disablekb=1&rel=0&showinfo=0&fs=0&playsinline=1&mute=1'"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title="YouTube video"
                    allowfullscreen
                ></iframe>
            </SplideSlide>
        </Splide>
    </section>
</template>

<script>
import { inject } from "vue";

export default {
    props: {
        pageindex: [Number, String],
        L2: Object
    },
    data() {
        return {
            topBanner: {
                // type: "loop",
                perPage: 1,
                perMove: 1,
                heightRatio: 0.42857142857, // 21:9
                arrows: false,
                breakpoints: {
                    1200: {
                        heightRatio: 0.45,
                    },
                    768: {
                        heightRatio: 0.612,
                    },
                    576: {
                        heightRatio: 0.81,
                    },
                },
            },
        };
    },
    setup() {
        const deviceMode = inject("deviceMode");
        return {
            deviceMode,
        };
    },
    methods: {
        isVideo(url){
            if(url.includes('youtube')){
                this.videoCode = url.split('/').pop();
                return true;
            } else {
                return false;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.mainbanner{
    @include media-breakpoint-down(xl) {
        margin-bottom: -1px;
    }
}
.banner{
    &__title{
        white-space: nowrap;
        text-shadow: 0 2px 14px rgba($blue-900, 0.5);
        z-index: 2;
        @include media-breakpoint-down(sm) {
            &:lang(en-US){
                font-size: 5.25vw;
            }
        }
    }
    &__img{
        object-fit: cover;
        object-position: center;
    }
    &__video{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        height: 132%;
        pointer-events: none;
    }
}
</style>