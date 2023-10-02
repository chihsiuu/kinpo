<template>
    <section v-if="L2.Templates == 'Accordion'" :data-sec-scroll="L2.Title" class="nkg__section accordion__wrap py-0" :class="L2.Styles">
        <div class="nkg__container">
            <h2 v-if="L2.Title!==''" class="accordion__maintitle h3 text-center fw-bold" v-html="L2.Title"></h2>
            <div class="accordion accordion-flush" :class="{'nkg__wrap':L2.Title!==''}">
                <div class="accordion-item border-0">
                    <h3 class="accordion-header">
                        <button class="h4 accordion-button rounded-0 bg-transparent fw-bold text-body" :class="{'collapsed':L2.Title==''}" type="button" data-bs-toggle="collapse" :data-bs-target="'#cg'+L2.ID" aria-expanded="true" :aria-controls="'cg'+L2.ID" @click="subTemplate=='Timeline' ? triggerTimeline() : false">
                            {{ L2.SubTitle }}
                        </button>
                    </h3>
                    <div :id="'cg'+L2.ID" class="accordion-collapse collapse" :class="{'show':L2.Title!==''}" aria-labelledby="">
                        <div class="accordion-body">
                            <!-- L2 自編區 -->
                            <div v-html="L2.Content" class="custom__style"></div>
                            
                            <!-- L3 時間軸 -->
                            <div v-if="L2.Data!==null && subTemplate=='Timeline'" :id="L2.ID" class="timeline__wrap">
                                <!-- top -->
                                <div class="timeline__nav position-relative">
                                    <ul class="timeline--scroll list-unstyled px-0" :class="{'opacitymask--l': deviceMode !== 'mobile' && nowCarouselItem !== 0, 'opacitymask--r': deviceMode !== 'mobile' && nowCarouselItem + 1 !== carouselLen, 'show': showToggle}" tabindex="0" @blur="showToggle = false" v-drag>
                                        <li v-if="deviceMode == 'mobile'" class="list-inline-item d-flex justify-content-between align-items-center" @click.prevent="showToggle = !showToggle">
                                            {{ selectedItem }}
                                            <svg-icon name="arrow-down" size="24" />
                                        </li>
                                        <transition name="toggle">
                                            <li v-if="deviceMode !== 'mobile' || showToggle" :class="{ 'position-absolute w-100': deviceMode == 'mobile' }">
                                                <ul class="list-inline position-relative d-md-flex mb-0"
                                                    :class="{'justify-content-around':!isOver && deviceMode !== 'mobile'}"
                                                >
                                                    <li v-for="(item, idx) in L2.Data" :key="idx" class="list-inline-item" :class="{ active: idx == nowCarouselItem }" @click="clickTimeline(idx); selectedItem = item.Title; showToggle = !showToggle;">
                                                        {{ item.Title }}
                                                    </li>
                                                </ul>
                                            </li>
                                        </transition>
                                    </ul>
                                    <div v-if="deviceMode !== 'mobile'" class="arrows">
                                        <svg-icon v-if="nowCarouselItem !== 0" class="splide__arrow splide__arrow--prev" name="arrow-l" size="24" @click.prevent="toPrev" />
                                        <svg-icon v-if="nowCarouselItem + 1 < carouselLen" class="splide__arrow splide__arrow--next" name="arrow-r" size="24" @click.prevent="toNext" />
                                    </div>
                                </div>
                                <!-- bottom -->
                                <div class="nkg__list text-center py-md-3">
                                    <template v-for="(item, idx) in L2.Data" :key="idx">
                                        <transition name="fadeInDown">
                                            <span v-if="idx == nowCarouselItem">
                                                <a :href="item.Url" :target="item.Target" class="d-flex d-md-inline-flex justify-content-between align-items-center btn btn-outline-primary rounded-pill text-start my-3 my-md-2 mx-md-2">
                                                    {{ $filters.removeHtml(item.SubTitle) }}
                                                    <svg-icon class="ms-2" name="download" size="24" />
                                                </a>
                                            </span>
                                        </transition>
                                    </template>
                                </div>
                            </div>

                            <!-- L3 簡介 -->
                            <div v-if="L2.Data!==null && subTemplate=='Profile'" :id="L2.ID">
                                <div v-for="(item, idx) in L2.Data" :key="idx" class="profile__wrap d-flex flex-column flex-md-row" :class="{'align-items-center':item.Img!=='' || deviceMode !== 'mobile'}">
                                    <div class="profile__photo flex-shrink-0">
                                        <img v-if="item.Img!==''" :src="item.Img" :alt="item.Title+' '+item.ImgAlt" class="w-100 mb-2 mb-md-0">
                                        <div v-else class="mb-0">
                                            <span class="fw-bold">{{item.Title}}</span>
                                            <span class="d-inline-block ms-2">{{item.ImgAlt}}</span>
                                        </div>
                                    </div>
                                    <div class="profile__text">
                                        <div v-if="item.Img!==''" class="mb-3">
                                            <span class="fw-bold">{{item.Title}}</span>
                                            <span class="d-inline-block ms-2">{{item.ImgAlt}}</span>
                                        </div>
                                        <span v-html="item.SubTitle" class="lh-lg"></span>
                                    </div>
                                </div>
                            </div>                            
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </section>

    <section v-if="L2.Templates == 'AccordionLoc'" :data-sec-scroll="L2.Title" class="nkg__section accordion__wrap py-0" :class="L2.Styles">
        <div class="nkg__container">
            <h2 v-if="L2.Title!==''" class="accordion__maintitle h3 text-center fw-bold" v-html="L2.Title"></h2>
            <div class="accordion accordion-flush" :class="{'nkg__wrap':L2.Title!==''}">
                <div class="accordion-item border-0">
                    <h3 class="accordion-header">
                        <button class="h4 accordion-button rounded-0 bg-transparent fw-bold text-body" :class="{'collapsed':L2.Title==''}" type="button" data-bs-toggle="collapse" :data-bs-target="'#cg'+L2.ID" aria-expanded="true" :aria-controls="'cg'+L2.ID">
                            {{ L2.SubTitle }}
                        </button>
                    </h3>
                    <div :id="'cg'+L2.ID" class="accordion-collapse collapse" :class="{'show':L2.Title!==''}" aria-labelledby="">
                        <div class="accordion-body lh-lg">
                            <ul class="row list-unstyled mb-0">
                                <li v-for="(loc, i) in L2.Data" class="col-md-6 mb-4" :key="i">
                                    <h4 class="fw-bold text-primary">{{loc.Title}}</h4>
                                    <div v-html="loc.SubTitle"></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </section>
</template>

<script>
import $ from "jquery";
import { inject } from "vue";

export default {
    props: {
        pageindex: [Number, String],
        L2: Object
    },
    data: function () {
        return {
            isCollapse: false,
            isOver: false,
            isClickable: true,
            subTemplate: "",
            showToggle: false,
            selectedItem: "",
            nowCarouselItem: 0,
            nowCarouselSubItem: 0,
            carouselName: "carousel-next",
            carouselLen: 0,
        };
    },
    setup() {
        const deviceMode = inject("deviceMode");
        return {
            deviceMode,
        };
    },
    updated(){
        this.subTemplate=='Timeline' ? this.triggerTimeline() : false;
    },
    mounted() {
        if (this.L2.Data.length > 0) { 
            let subStatus = this.L2.Data.some(function(item){
                return item.Img !== ""
            });
            if(subStatus){
                this.subTemplate="Profile"
            } else {
                this.subTemplate="Timeline";
                this.selectedItem = this.L2.Data[0].Title;
            }
        }

        if (this.L2.ID !== null) {
            if($('#cg'+this.L2.ID +' table')[0]!==undefined){ 
                let arrows_top = '';
                let arrows = `<div class='table__arrows position-absolute d-lg-none'><svg class='nkg__ic--svg icon-arrow-l splide__arrow splide__arrow--prev' style='width: 24px; height: 24px;'><use xlink:href='#icon-arrow-l'></use></svg><svg class='nkg__ic--svg icon-arrow-r splide__arrow splide__arrow--next' style='width: 24px; height: 24px;'><use xlink:href='#icon-arrow-r'></use></svg></div>`;
                for(let i=0; i<$('#cg'+this.L2.ID).find("table").length; i++){
                    // 加樣式
                    $('#cg'+this.L2.ID).find("table").eq(i).css({'width' : 'auto'}).addClass('table table-striped table-borderless lh-base');
                    arrows_top = $('#cg'+this.L2.ID).find("table").eq(i).find("th").eq(0).outerHeight();
                    // 表格是否需要RWD
                    if($('#cg'+this.L2.ID).find("table").eq(i).width() > $('.nkg__container').width()){
                        $('#cg'+this.L2.ID).find("table").eq(i).wrap("<div class='table-responsive'></div>");
                        // RWD箭頭
                        $(arrows).insertBefore('#cg'+this.L2.ID +' table:eq('+i+')').css({'margin-top' : arrows_top});
                        $('.splide__arrow--prev').hide();
                    }
                    $('#cg'+this.L2.ID).find("table").eq(i).css({'width' : '100%'});
                }
            }
            // 點擊箭頭scroll
            let scrollTo = 150;
            $('.splide__arrow--prev, .splide__arrow--next').parents('.table-responsive').scroll(function() {
                if($(this).scrollLeft() == 0) {
                    $(this).find('.splide__arrow--prev').hide();
                } else if($(this).scrollLeft() > 0) {
                    $(this).find('.splide__arrow--prev').show();
                } 
                if($(this).scrollLeft() + $(this).width() > ($(this).find('table').width() - 1)) {
                    $(this).find('.splide__arrow--next').hide();
                } else {
                    $(this).find('.splide__arrow--next').show();
                }
            });
            $('.splide__arrow--prev').on( "click", function(e) {
                $(this).parents('.table-responsive').stop(true).animate({
                    scrollLeft: "-="+scrollTo
                }, 300);
            })
            $('.splide__arrow--next').on( "click", function(e) {
                $(this).parents('.table-responsive').stop(true).animate({
                    scrollLeft: "+="+scrollTo
                }, 300);
            })
        }        
    },
    methods: {
        clickTimeline(i) {
            if (i !== this.nowCarouselItem) {
                i > this.nowCarouselItem ? this.scrolltoItem(i, "next") : this.scrolltoItem(i, "prev");
            }
            this.nowCarouselItem = i;
        },
        toPrev() {
            if(this.isClickable){
                this.nowCarouselItem - 1 < 0 ? (this.nowCarouselItem = this.carouselLen - 1) : (this.nowCarouselItem = this.nowCarouselItem - 1);
                this.scrolltoItem(this.nowCarouselItem, "prev");
            }
            this.carouselName = "carousel-prev";
            this.isClickable = false;
        },
        toNext() {
            if(this.isClickable){
                this.nowCarouselItem + 1 >= this.carouselLen ? (this.nowCarouselItem = 0) : (this.nowCarouselItem = this.nowCarouselItem + 1);
                this.scrolltoItem(this.nowCarouselItem, "next");
            }
            this.carouselName = "carousel-next";
            this.isClickable = false;
        },
        scrolltoItem(i, to) {            
            let $item = $("#" + this.L2.ID + " .list-inline-item:eq(" + i + ")");
            let item_W = $item.innerWidth();
            let item_P_X = $item.position().left;
            let wrap_S_X = $("#" + this.L2.ID + " .timeline--scroll").scrollLeft();
            let wrap_W = $("#" + this.L2.ID + " .timeline--scroll").width();

            if (item_P_X >= (wrap_W - item_W) && to == "next") {
                $("#" + this.L2.ID + " .timeline--scroll")
                .stop(true)
                .animate({ scrollLeft: wrap_S_X + item_W }, 300);
            }
            if (item_P_X < (wrap_S_X + item_W) && to == "prev") {
                $("#" + this.L2.ID + " .timeline--scroll")
                .stop(true)
                .animate({ scrollLeft: wrap_S_X - item_W }, 300);
            }
            setTimeout(() => {
                this.isClickable = true;
            }, 300)
        },
        triggerTimeline(){
            this.carouselLen = this.L2.Data.length;
            let allItem_W = 0;
            let wrap_W = $("#" + this.L2.ID + " .timeline--scroll").width();
            for (let i = 0; i < this.carouselLen; i++) {
                allItem_W += $("#" + this.L2.ID + " .list-inline-item:eq(" + i + ")").innerWidth();
            }
            allItem_W >= wrap_W ? this.isOver = true : this.isOver = false;
            // console.log($("#" + this.L2.ID + " .timeline--scroll").width(), this.L2.Data.length);
        }
    },
};
</script>

<style lang="scss">
.profile{
    &__wrap{
        @include layoutPadding-y(3.125rem);
        &:first-child{
            padding-top: 0;
        }
        p:last-child{
            margin-bottom: 0;
        }
        & + .profile__wrap{
            border-top: 1px dashed $gray-500;
        }
        @include media-breakpoint-down(sm) {
            @include layoutPadding-y(1.875rem);
        }
    }
    &__photo{
        margin-right: 1.85rem;
        width: 13vw;
        min-width: 180px;
        @include media-breakpoint-down(md) {
            margin-right: 0;
            margin-bottom: 1rem;
        }
        @include media-breakpoint-down(sm) {
            
        }
    }
}
.accordion{
    &__wrap + .nkg__section:not(.accordion__wrap){
        margin-top: 5rem;
    }
    &__maintitle{
        padding-top: 3.125rem;
    }
    &-button{
        @include layoutPadding-y(1.35rem);
        box-shadow: inset 0 -1px 0 rgba(0,0,0,.13);
        &:focus{
            box-shadow: inset 0 -1px 0 rgba(0,0,0,.13);
        }
        &::after{
            background-image: url($icon-path+'plus.svg');
        }
        &:not(.collapsed)::after {
            background-image: url($icon-path+'minus.svg');
        }
        @include media-breakpoint-down(xl) {
            @include layoutPadding-x(0);
        }
        @include media-breakpoint-down(sm) {
            font-size: 1rem;
        }
    }
    &-body{
        @include layoutPadding-x(1.25rem);
        @include layoutPadding-y(3.47vw);
        @include media-breakpoint-down(xl) {
            @include layoutPadding-x(0);
        }
        @include media-breakpoint-down(lg) {
            @include layoutPadding-y(1.875rem);
        }
    }
    .collapse:not(.show){
        position: fixed;
        visibility: hidden;
        display: block;
    }
}
</style>