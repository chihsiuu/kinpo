<template>
    <section :data-sec-scroll="L2.Title" :class="L2.Styles" :style="{ backgroundImage: 'linear-gradient(' + L2.RGBA + ',' + L2.RGBA + '), url(\'' + (deviceMode == 'mobile' ? L2.MImg : L2.Img) + '\')' }" class="nkg__section">
        <div :class="{ nkg__lo__container: deviceMode == 'deskTop' }">
            <h2 class="text-center fw-bold">{{ L2.Title }}</h2>
            <transition name="fade">
                <Splide v-if="cardData.length > 0" :options="newsCard" class="nkg__wrap">
                    <SplideSlide v-for="(news, i) in cardData" :key="i" class="d-grid">
                        <template v-if="news.Pinning == '1'">
                            <div class="nkg__card card border-0">
                                <div class="card-img-top overflow-hidden ratio" style="--bs-aspect-ratio: 62.22%">
                                    <img :src="news.Img" data-splide-lazy="path-to-the-image" alt="" />
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <p class="small fw-bold text-primary mb-2 mb-md-3">{{ $filters.dateFormat(news.PODate) }}</p>
                                    <p class="h5 card-title text-body ellipsis mb-3 mb-md-4" :lang="this.$route.params.lang">
                                        {{ news.Title }}
                                    </p>
                                    <router-link v-if="news.Links == ''" :to="'/' + this.$route.params.lang + '/' + L2.UrlPath + news.ID" class="d-flex justify-content-between align-items-center btn btn-outline-primary rounded-pill stretched-link text-start w-100 mt-auto"> {{ news.SubTitle }} <svg-icon name="arrow-r" size="24" /> </router-link>
                                    <a v-else :href="news.Links" :target="news.Target" class="d-flex justify-content-between align-items-center btn btn-outline-primary rounded-pill stretched-link text-start w-100 mt-auto"> {{ news.SubTitle }} <svg-icon name="arrow-r" size="24" /> </a>
                                </div>
                            </div>
                        </template>
                    </SplideSlide>
                </Splide>
                <!-- skeleton -->
                <Splide v-else :options="newsCard" class="nkg__wrap">
                    <SplideSlide v-for="i in 6" :key="i" class="d-grid">
                        <div class="nkg__card card load border-0">
                            <div class="card-img-top overflow-hidden ratio" style="--bs-aspect-ratio: 62.22%">
                                <div class="photo"></div>
                            </div>
                            <div class="card-body d-flex flex-column">
                                <p class="small w-50 rounded mb-3">&nbsp;</p>
                                <p class="d-none d-xl-block small rounded mb-2">&nbsp;</p>
                                <p class="small rounded mb-2">&nbsp;</p>
                                <p class="small rounded mb-4">&nbsp;</p>

                                <a class="btn btn-outline-secondary rounded-pill w-100 mt-2 mt-xl-1 disabled">&nbsp;</a>
                            </div>
                        </div>
                    </SplideSlide>
                </Splide>
            </transition>
            <div class="text-center mt-5">
                <router-link :to="'/' + this.$route.params.lang + '/' + L2.UrlPath" class="h5 fw-bold link-light text-decoration-underline">{{ L2.SubTitle }}</router-link>
            </div>
        </div>
    </section>
</template>

<script>
import { inject } from "vue";
import kernel from "../plugins/kernel";

export default {
    props: {
        pageindex: [Number, String],
        L2: Object,
    },
    data() {
        return {
            cardData: [],
            newsCard: {
                perPage: 5,
                gap: "1.5rem",
                arrowPath: "M22.6,20l-8.8,8.8c-0.6,0.7-0.6,1.7,0,2.4c0.6,0.6,1.7,0.6,2.3,0l10-10c0.7-0.7,0.7-1.7,0-2.4l-10-10c-0.7-0.6-1.7-0.6-2.4,0c-0.6,0.6-0.6,1.7,0,2.3L22.6,20z",
                lazyLoad: "nearby",
                breakpoints: {
                    1920: {
                        perPage: 4,
                    },
                    1610: {
                        perPage: 3,
                    },
                    992: {
                        perPage: 2,
                        perMove: 1,
                        arrows: false,
                        padding: {
                            left: "2.75rem",
                            right: "2.75rem",
                        },
                    },
                    576: {
                        perPage: 1,
                        type: "slide",
                        trimSpace: false,
                        gap: "2rem",
                        arrows: true,
                        padding: {
                            left: "2.75rem",
                            right: "2.75rem",
                        },
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
    mounted() {
        if (this.L2.UrlPath !== "") {
            let { ACWS, fetchData } = kernel();
            fetchData('{"class":"KinpoWs","lang":"' + this.$route.params.lang + '","key":"UrlPath","val":"' + this.L2.UrlPath + '","BlockDet":true,"Data":true' + ACWS.value + "}").then(r => {
                this.cardData = r.data[0].BlockDet.filter(item => item.Pinning == "1");
            });
        }
    },
};
</script>

<style lang="scss" scoped>
.card-title {
    @media (max-width: 1439.98px) {
        &:lang(en-US) {
            font-size: 1rem;
        }
    }
}
</style>
