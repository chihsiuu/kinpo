<template>
    <section :data-sec-scroll="L2.Title" class="nkg__section">
        <div class="nkg__container">
            <h2 v-if="L2.Title!==''" class="h3 text-center fw-bold" v-html="L2.Title"></h2>
            <div class="nkg__wrap">
                <ul v-if="deviceMode!=='mobile'" class="chart--flow row justify-content-center list-unstyled mb-0">
                    <li v-for="(item, idx) in L2.Data" :key="idx" class="col-4 col-xl-2 position-relative mb-4 mb-xl-0">
                        <div class="nkg__block--circle" :class="{'bg--circle bg-transparent':item.Img}" :style="{ backgroundImage: 'url(\'' + item.Img + '\')' }">
                            <p v-if="!item.Img" class="text-white-50 fw-light fst-italic pt-4 mb-0">{{idx + 1}}.</p>
                            <span v-if="!item.Img" class="h5 fw-bold text-white">{{item.Title}}</span>
                            <svg-icon v-if="(idx + 1) !== L2.Data.length" name="arrow-r" size="30" color="2a7fdd"/>
                        </div>
                    </li>
                </ul>
                <Splide v-else class="chart--flow" :options="newsCard">
                    <SplideSlide v-for="(item, idx) in L2.Data" :key="idx">
                        <div class="nkg__block--circle" :class="{'bg--circle bg-transparent':item.Img}" :style="{ backgroundImage: 'url(\'' + item.Img + '\')' }">
                            <p v-if="!item.Img" class="text-white-50 fw-light fst-italic pt-4 mb-0">{{idx + 1}}.</p>
                            <span v-if="!item.Img" class="h5 fw-bold text-white">{{item.Title}}</span>
                        </div>
                    </SplideSlide>
                </Splide>
                <div :id="L2.ID" v-html="L2.Content" class="mt-5 pt-lg-3"></div>
            </div>
        </div>            
    </section>
</template>

<script>
import { inject } from "vue";

export default {
    props: {
        pageindex: [Number, String],
        L2: Object
    },
    setup() {
        const deviceMode = inject("deviceMode");
        return {
            deviceMode,
        };
    },
    data() {
        return {
            newsCard: {
                arrows: true,
                pagination: true,
                perPage: 1,
                arrowPath: "M22.6,20l-8.8,8.8c-0.6,0.7-0.6,1.7,0,2.4c0.6,0.6,1.7,0.6,2.3,0l10-10c0.7-0.7,0.7-1.7,0-2.4l-10-10c-0.7-0.6-1.7-0.6-2.4,0c-0.6,0.6-0.6,1.7,0,2.3L22.6,20z",
            }
        }
    },
};
</script>

<style lang="scss">
.join-us{
    .btn-outline-light{
        background-color: transparent;
        &:hover{
            color: $blue-700;
            background-color: #fff;
            border-color: #fff;
        }
    }
}
.chart--flow{
    .nkg__block--circle{
        display: block;
        margin: 0 auto;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        &.bg--circle{
            border-radius: 0;
        }
        p{
            font-size: 2.5rem;
        }
        .nkg__ic--svg{
            position: absolute;
            right: 0;
            top: 50%;
            transform: translate(50%,-50%);
        }
    }            
    li{
        &:nth-child(1){
            .nkg__block--circle{
                background-color: #5ca4ff;
            }
        }
        &:nth-child(2){
            .nkg__block--circle{
                background-color: #428deb;
            }
        }
        &:nth-child(3){
            .nkg__block--circle{
                background-color: #1876ed;
            }
        }
        &:nth-child(4){
            .nkg__block--circle{
                background-color: #146cdb;
            }
        }
        &:nth-child(5){
            .nkg__block--circle{
                background-color: #1a64c2;
            }
        }
        &:nth-child(6){
            .nkg__block--circle{
                background-color: #1654a3;
            }
        }
    }
    .splide__arrow{
        top: 42%;
        fill: $blue-500;
    }
}    
</style>