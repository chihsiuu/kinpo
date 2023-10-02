<template>
    <!-- <transition name="fade"> -->
    <span v-if="pageData !== undefined && renderComponent" :id="pageData.ID" class="pageid">
        <template v-for="(item, idx) in pageData.BlockDet" :key="idx">
            <template v-if="item.Templates == 'NewsPage'">
                <component :is="item.Templates" :L2="item" :pageindex="PagesLock" @pageExist="redirectErrPage"></component>
            </template>
            <template v-else>
                <component :is="item.Templates" :L2="item" :pageindex="PagesLock"></component>
            </template>
        </template>
    </span>
    <!-- </transition> -->
    <ErrorPage :display="isPageExist"></ErrorPage>
</template>

<script>
import { defineAsyncComponent, inject } from "vue";
import kernel from "../plugins/kernel";

export default {
    name: "dyna",
    emits: ["updateParent"],
    components: {
        Accordion: defineAsyncComponent(() => import("@/components/Accordion.vue")),
        AccordionLoc: defineAsyncComponent(() => import("@/components/Accordion.vue")),
        AwardsCarousel: defineAsyncComponent(() => import("@/components/Carousel.vue")),
        Blank: defineAsyncComponent(() => import("@/components/Blank.vue")),
        Banner: defineAsyncComponent(() => import("@/components/Banner.vue")),
        CircleTab: defineAsyncComponent(() => import("@/components/CircleTab.vue")),
        ChartFlow: defineAsyncComponent(() => import("@/components/ChartFlow.vue")),
        Custom: defineAsyncComponent(() => import("@/components/Custom.vue")),
        ContactForm: defineAsyncComponent(() => import("@/components/ContactForm.vue")),
        HomeBanner: defineAsyncComponent(() => import("@/components/HomeBanner.vue")),
        HomeCard: defineAsyncComponent(() => import("@/components/HomeCard.vue")),
        NewsPage: defineAsyncComponent(() => import("@/components/News.vue")),
        NewsList: defineAsyncComponent(() => import("@/components/News.vue")),
        FullSectionFixed: defineAsyncComponent(() => import("@/components/Product.vue")),
        FullSectionAuto: defineAsyncComponent(() => import("@/components/Product.vue")),
        ProductTitle: defineAsyncComponent(() => import("@/components/Product.vue")),
        ProductCarousel: defineAsyncComponent(() => import("@/components/Product.vue")),
        Tab: defineAsyncComponent(() => import("@/components/Tab.vue")),
        TimelineCS: defineAsyncComponent(() => import("@/components/Timeline.vue")),
        TimelineMS: defineAsyncComponent(() => import("@/components/Timeline.vue")),
        TimelineAP: defineAsyncComponent(() => import("@/components/Timeline.vue")),
        TimelineQT: defineAsyncComponent(() => import("@/components/Timeline.vue")),
        ErrorPage: defineAsyncComponent(() => import("@/pages/404.vue")),
    },
    data() {
        return {
            pageData: [],
            BlockDetTmp: [],
            relatedPageData: [],
            PagesLock: 0,
            renderComponent: true,
            isPageExist: true,
        };
    },
    setup() {
        const deviceMode = inject("deviceMode");
        return {
            deviceMode,
        };
    },
    watch: {
        $route(to, from) {
            let toPath = to.path.substring(0, to.path.lastIndexOf("/") == to.path.length - 1 ? to.path.lastIndexOf("/") : to.path.length);
            let fromPath = from.path.substring(0, from.path.lastIndexOf("/") == from.path.length - 1 ? from.path.lastIndexOf("/") : from.path.length);

            if (toPath !== fromPath) {
                this.readData(this.$route);
            }
        },
    },
    created() {
        this.readData(this.$route);
    },
    methods: {
        forceRerender() {
            // 元件強制重新渲染 https://iter01.com/467453.html
            this.renderComponent = false; // 從 DOM 中刪除元件
            this.$nextTick(() => {
                this.renderComponent = true; // 在 DOM 中新增元件
                this.$emit("updateParent", true);
            });
        },
        readData(to) {
            this.PagesLock = 0;
            let { ACWS } = kernel();
            let L = this.$route.params.lang;
            var FD = new FormData();
            let PathArr = [];
            Object.keys(to.params).forEach((k, i) => {
                if (i > 0) {
                    if (k == "subdyna" && to.params.dyna == "news") {
                        this.PagesLock = k; //傳入%指標位置
                    } else {
                        PathArr = PathArr + to.params[k] + "/";
                    }
                }
            });

            FD.append("mode", "sct");
            if (this.PagesLock !== 0) {
                FD.append("data", '{"class":"KinpoWs","lang":"' + L + '","key":"UrlPath","val":"' + PathArr + '%/","BlockDet":true,"Data":true' + ACWS.value + "}");
            } else {
                FD.append("data", '{"class":"KinpoWs","lang":"' + L + '","key":"UrlPath","val":"' + PathArr + '","BlockDet":true,"Data":true' + ACWS.value + "}");
            }

            this.axios({
                method: "post",
                url: "https://nkg-web-api.japaneast.cloudapp.azure.com/Form/",
                data: FD,
                headers: { "Content-Type": "multipart/form-data" },
            }).then(response => {
                //.filter((item, i, self)=>{return self.lastIndexOf(item) == i}) 刪除重複
                if (response.data.data !== null) {
                    this.isPageExist = true;
                    this.pageData = response.data.data[0];

                    // 新聞列表
                    if (this.pageData.UrlPath == "news/") {
                        let newBlockDet = [];
                        this.pageData.BlockDet.forEach(e => {
                            if (
                                !newBlockDet.some(function (es) {
                                    return e.Templates == es.Templates;
                                })
                            ) {
                                newBlockDet.push(e);
                            }
                        });
                        this.pageData.BlockDet = newBlockDet;
                    }

                    // 重組關聯資料
                    if (this.pageData.BlockDet.length > 0) {
                        let { getAllData, getLang } = kernel();
                        let relatedUrlPath = []; // 存關聯頁面路徑(不重複)
                        this.BlockDetTmp = this.pageData.BlockDet; //暫存原始L2
                        this.BlockDetTmp.forEach(e => {
                            if (e.UrlPath !== "" && e.L2SID !== "") {
                                let j = '{"class":"KinpoWs","lang":"' + getLang.value + '","key":"UrlPath","val":"' + e.UrlPath + '","BlockDet":true,"Data":true' + ACWS.value + "}";
                                if (relatedUrlPath.indexOf(j) == -1) {
                                    relatedUrlPath.push(j); // 給api的path L
                                }
                            }
                        });

                        if (relatedUrlPath.length > 0) {
                            // 此頁L2要抓關聯資料
                            this.relatedPageData = [];
                            this.pageData.BlockDet = [""]; // 清除原始L2
                            getAllData(relatedUrlPath)
                                .then(R => {
                                    // 合併請求api
                                    R.forEach(es => {
                                        if (es !== null) {
                                            es.data[0].BlockDet.forEach(BkDt => {
                                                this.relatedPageData.push(BkDt); // 提取結果、陣列重新組合、去除陣列層級
                                            });
                                        }
                                    });
                                    let newBlockDet = []; // 重組新L2資料
                                    this.BlockDetTmp.forEach(e => {
                                        // L2原始資料
                                        if (e.UrlPath == "") {
                                            newBlockDet.push(e);
                                        } else {
                                            this.relatedPageData.forEach(es => {
                                                // api回傳的L2關聯資料
                                                if (e.L2SID !== "" && e.L2SID == es.ID) {
                                                    newBlockDet.push(es);
                                                }
                                            });
                                        }
                                    });
                                    this.pageData.BlockDet = newBlockDet; // 覆寫原始L2
                                })
                                .catch(error => {
                                    // console.log(error);
                                });
                        }
                    }

                    // 介面刷新
                    this.forceRerender();

                    // SEO
                    document.title = this.pageData.Title;
                    document.querySelector('meta[property="og:title"]').setAttribute("content", this.pageData.Title);
                    document.querySelector('meta[name="description"]').setAttribute("content", this.pageData.Description);
                    document.querySelector('meta[property="og:description"]').setAttribute("content", this.pageData.Description);
                    document.querySelector('meta[property="og:type"]').setAttribute("content", this.pageData.Type);
                    document.querySelector('meta[property="og:url"]').setAttribute("content", window.location.href);
                    if (this.pageData.PageImg !== "") {
                        document.querySelector('meta[property="og:image"]').setAttribute("content", this.pageData.PageImg);
                    }
                } else {
                    this.isPageExist = false;
                    this.forceRerender();
                    //this.$router.push('/'+L+'/errorpage'); // false 回errorpage
                }
            });
        },
        redirectErrPage(value) {
            this.isPageExist = this.renderComponent = value;
        },
    },
};
</script>
