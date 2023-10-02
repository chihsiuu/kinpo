<template>
    <section :data-sec-scroll="$filters.removeHtml(L2.Title)" 
        :class="[L2.Styles, L2.Border, { 'bgimg-fixed': L2.RGBA!=='' && L2.RGBA!=='rgba(0, 0, 0, 0)', 'pb-1': L2.Content == '' && L2.Data.length == 0}]"
        :style="{ backgroundImage: 'linear-gradient(' + L2.RGBA + ',' + L2.RGBA + '), url(\'' + (deviceMode=='deskTop'?L2.Img:(L2.MImg==''?L2.Img:L2.MImg)) + '\')'}"
        class="nkg__section">
        <div class="nkg__container">
            <h2 v-if="L2.Title!==''" class="h3 text-center fw-bold" v-html="L2.Title"></h2>
            <div v-if="L2.Content!=='' || L2.Data.length > 0" class="nkg__wrap custom__style" :class="{'mt-0':L2.Title==''}">
                <!-- 文字內容 -->
                <div :id="L2.ID" v-html="L2.Content"></div>
            
                <!-- 按鈕群組 -->
                <div class="text-center">
                    <a v-for="(item, index) in L2.Data" :key="index" :href="item.Url" :target="item.Target" class="d-flex d-md-inline-flex justify-content-between align-items-center btn btn-outline-primary rounded-pill text-start my-3 my-md-2 mx-md-2">
                        {{ item.Title}}
                        <svg-icon class="ms-2" :name="item.Icon" size="24"/>
                    </a>
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
    setup() {
        const deviceMode = inject('deviceMode')
        return {
            deviceMode,
        }
    },
    mounted() {        
        if (this.L2.ID !== null) {      
            $('.video-wrapper').addClass('ratio ratio-16x9');
            if($('#'+this.L2.ID +' table')[0]!==undefined){ 
                let arrows_top = '';
                let arrows = `<div class='table__arrows position-absolute d-lg-none'><svg class='nkg__ic--svg icon-arrow-l splide__arrow splide__arrow--prev' style='width: 24px; height: 24px;'><use xlink:href='#icon-arrow-l'></use></svg><svg class='nkg__ic--svg icon-arrow-r splide__arrow splide__arrow--next' style='width: 24px; height: 24px;'><use xlink:href='#icon-arrow-r'></use></svg></div>`;
                for(let i=0; i<$('#'+this.L2.ID).find("table").length; i++){
                    // 加樣式
                    $('#'+this.L2.ID).find("table").eq(i).css({'width' : 'auto'}).addClass('table table-striped table-borderless lh-base');
                    arrows_top = $('#'+this.L2.ID).find("table").eq(i).find("th").eq(0).outerHeight();
                    // 表格是否需要RWD
                    if($('#'+this.L2.ID).find("table").eq(i).width() > $('.nkg__container').width()){
                        $('#'+this.L2.ID).find("table").eq(i).wrap("<div class='table-responsive'></div>");
                        // RWD箭頭
                        $(arrows).insertBefore('#'+this.L2.ID +' table:eq('+i+')').css({'margin-top' : arrows_top});
                        $('.splide__arrow--prev').hide();
                    }
                    $('#'+this.L2.ID).find("table").eq(i).css({'width' : '100%'});
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
};
</script>