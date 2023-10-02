<template>
    <section v-if="L2.Templates == 'NewsList'" class="news__list nkg__section">
        <div class="nkg__container">
            <transition name="fade">
                <ul v-if="newsList.length > 0" class="p-0 m-0">
                    <li v-for="(news, i) in newsList.slice(startItem, startItem + countOfPage)" class="nkg__card" :key="i">
                        <div class="row">
                            <div class="col-12 col-sm-auto">
                                <div class="card-img overflow-hidden ratio" style="--bs-aspect-ratio: 62.22%">
                                    <img :src="news.Img" :alt="news.ImgAlt" />
                                </div>
                            </div>
                            <div class="col">
                                <div class="card-body">
                                    <p class="small fw-bold text-primary mb-2 mb-xxl-3">{{ $filters.dateFormat(news.PODate) }}</p>
                                    <h2 class="card-title h3 fw-bold text-body ellipsis mb-3 mb-md-2 mb-xl-3">{{ news.Title }}</h2>
                                    <p class="card-text lh-lg ellipsis mb-0">
                                        <span v-html="$filters.removeHtml(news.Content)"></span>
                                    </p>
                                </div>
                            </div>
                            <router-link v-if="news.Links == ''" :to="'/' + this.$route.params.lang + '/news/' + (news.L2SID !== '' ? news.L2SID : news.ID)" class="card-link stretched-link fw-bold mt-3 mt-lg-1" @click="setKData(this.$route.params.dyna, 'page', currPage)">{{ news.SubTitle }}<svg-icon name="arrow-r" size="24" /></router-link>
                            <a v-else :href="news.Links" :target="news.Target" class="card-link stretched-link fw-bold mt-3 mt-lg-1"> {{ news.SubTitle }} <svg-icon name="arrow-r" size="24" /> </a>
                        </div>
                    </li>
                </ul>
                <!-- skeleton -->
                <ul v-else class="p-0">
                    <li v-for="i in countOfPage" class="nkg__card load" :key="i">
                        <div class="row">
                            <div class="col-12 col-sm-auto">
                                <div class="card-img overflow-hidden ratio" style="--bs-aspect-ratio: 62.22%">
                                    <div class="photo"></div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card-body">
                                    <h2 class="mb-3 mb-md-2 mb-xl-3 rounded">&nbsp;</h2>
                                    <p class="mb-0 rounded">&nbsp;</p>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </transition>
            <!-- 分頁 -->
            <span>
                <nav v-if="newsList.length > 0" aria-label="Page navigation">
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ disabled: currPage === 1 }" @click="setPage(currPage - 1)">
                            <a class="page-link py-1 px-1" aria-label="Previous"> <svg-icon name="arrow-l" size="24" /><span class="small" v-i18n="'Previous'"></span> </a>
                        </li>
                        <li class="page-item" v-for="(n, i) in counter(totalPage)" :key="i" :class="{ 'active fw-bold': currPage == i + 1 }" @click="setPage(i + 1)">
                            <a class="page-link">{{ i + 1 }}</a>
                        </li>
                        <li class="page-item" :class="{ disabled: currPage === totalPage }" @click="setPage(currPage + 1)">
                            <a class="page-link py-1 px-1" aria-label="Next"> <span class="small" v-i18n="'Next'"></span><svg-icon name="arrow-r" size="24" /> </a>
                        </li>
                    </ul>
                </nav>
            </span>
        </div>
    </section>

    <section v-if="L2.Templates == 'NewsPage'" class="news__page nkg__section">
        <div v-if="isLoaded" class="nkg__container">
            <p class="small fw-bold text-primary mb-2 mb-xxl-3">{{ $filters.dateFormat(newsPage.PODate) }}</p>
            <div class="d-flex flex-column flex-lg-row align-items-lg-center border-bottom pb-2">
                <h1 class="h3 fw-bold py-2 mb-0">{{ newsPage.Title }}</h1>
                <ul class="d-flex flex-shrink-0 list-unstyled list-inline ms-auto mb-0">
                    <!-- <li class="list-inline-item">
                        <a href @click.prevent="shareToSocialMedia('https://www.facebook.com/sharer/sharer.php?u=https://www.kinpo.com.tw/' + this.$route.params.lang + '/news/' + this.$route.params.subdyna)" class="d-flex nkg__ic nkg__ic--lg fb-share"></a>
                    </li>
                    <li class="list-inline-item">
                        <a href @click.prevent="shareToSocialMedia('https://www.linkedin.com/shareArticle?url=https://www.kinpo.com.tw/' + this.$route.params.lang + '/news/' + this.$route.params.subdyna)" class="d-flex nkg__ic nkg__ic--lg linkin"></a>
                    </li> -->
                    <!-- <li class="list-inline-item">
                        <a href="#" class="d-flex nkg__ic nkg__ic--lg share" @click.prevent="copyLink()" @mouseover.passive="isCopied = false">
                            <span v-if="deviceMode == 'deskTop'" class="position-absolute badge rounded-pill bg-primary tooltip">{{ isCopied ? "Copied" : "Copy to clipboard" }}</span>
                        </a>
                    </li> -->
                </ul>
            </div>
            <div class="nkg__wrap custom__style">
                <!-- 文字內容 -->
                <div v-html="newsPage.Content"></div>
            </div>
            <div class="nkg__wrap text-center">
                <button
                    class="d-inline-flex justify-content-between align-items-center btn btn-outline-primary rounded-pill text-start"
                    @click="
                        goBack();
                        isLoaded = false;
                    "
                >
                    <span v-i18n="'Back'"></span><svg-icon name="arrow-l" size="24" />
                </button>
            </div>
        </div>
    </section>
</template>

<script>
import kernel from "../plugins/kernel";
import { inject } from "vue";

export default {
    emits: ["pageExist"],
    props: {
        pageindex: [Number, String],
        L2: Object,
    },
    data() {
        return {
            newsList: [],
            currPage: 1,
            countOfPage: 8,
            startItem: 0,
            totalPage: [],
            newsPage: [],
            isCopied: false,
            isLoaded: false,
        };
    },
    setup() {
        const { fetchData, LangData, setKData, secTitleList, KData } = kernel();
        const deviceMode = inject("deviceMode");
        return {
            LangData,
            fetchData,
            setKData,
            deviceMode,
            secTitleList,
            KData,
        };
    },
    watch: {
        $route(to, from) {
            if (to.params.dyna !== "news") {
                this.setKData("news", "page", 1);
            }
        },
    },
    mounted() {
        let L = this.$route.params.lang;
        let { ACWS } = kernel();

        // 新聞列表
        if (this.L2.Templates == "NewsList") {
            this.fetchData('{"class":"Det","lang":"' + L + '","key":"Templates","val":"NewsList"' + ACWS.value + "}").then(r => {
                this.LangData(L);
                this.newsList = r.data;
                this.totalPage = Math.ceil(this.newsList.length / this.countOfPage);
                this.isLoaded = true;
                if (this.KData !== 0 && this.KData.news !== undefined) {
                    this.setPage(this.KData.news.page);
                }
            });
        }

        // 新聞內頁
        if (this.L2.Templates == "NewsPage") {
            if (this.$route.params.subdyna == undefined) {
                this.$router.push("/" + L + "/" + this.$route.params.dyna);
                return;
            }
            this.fetchData('{"class":"Det","lang":"' + L + '","key":"L2SID","val":"' + this.$route.params[this.pageindex] + '","BlockDet":true,"Data":true' + ACWS.value + "}").then(r => {
                if (r.data !== null) {
                    this.LangData(L);
                    this.newsPage = r.data[0];
                    this.isLoaded = true;
                    this.setSEO(this.newsPage);
                } else {
                    this.fetchData('{"class":"Det","lang":"' + L + '","key":"ID","val":"' + this.$route.params[this.pageindex] + '","BlockDet":true,"Data":true' + ACWS.value + "}").then(r => {
                        if (r.data !== null) {
                            this.LangData(L);
                            this.newsPage = r.data[0];
                            this.isLoaded = true;
                            this.setSEO(this.newsPage);
                        } else {
                            this.$emit("pageExist", false);
                            //this.$router.push('/'+L+'/errorpage'); // false 回errorpage
                        }
                    });
                }
            });
        }
    },
    methods: {
        copyLink() {
            let copyText = "https://www.kinpo.com.tw/" + this.$route.params.lang + "/news/" + this.$route.params.subdyna;
            if (this.deviceMode == "deskTop") {
                navigator.clipboard.writeText(copyText);
            } else {
                navigator.share({
                    title: this.newsPage.Title,
                    text: this.newsPage.Description,
                    url: copyText,
                });
            }
            this.isCopied = true;
        },
        shareToSocialMedia(url) {
            if (this.deviceMode == "deskTop") {
                window.open(url, "_blank", "toolbar=No, location=No ,directories=No, width=800, height=600");
            } else {
                window.open(url, "_blank");
            }
        },
        setPage(idx) {
            if (idx <= 0 || idx > this.totalPage) {
                return;
            }
            this.currPage = idx;
            this.startItem = (this.currPage - 1) * this.countOfPage;
            // 頁面切換跳過banner
            if (idx > 1) {
                let wrap = document.getElementsByClassName("news__list")[0].offsetTop;
                let header_h = document.getElementsByClassName("navbar")[0].offsetHeight;
                window.scrollTo(window.scrollX, wrap - header_h);
            } else {
                document.body.scrollIntoView();
            }
        },
        counter(i) {
            return new Array(i);
        },
        goBack() {
            this.$router.push("/" + this.$route.params.lang + "/news/");
            // window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/" + this.$route.params.lang + "/news/");
        },
        setSEO(page) {
            let site = document.querySelector("meta[property='og:site_name']").getAttribute("content");
            document.title = page.Title + " | " + site;
            document.querySelector('meta[property="og:title"]').setAttribute("content", page.Title + " | " + site);
            document.querySelector('meta[name="description"]').setAttribute("content", page.Description);
            document.querySelector('meta[property="og:description"]').setAttribute("content", page.Description);
            document.querySelector('meta[property="og:image"]').setAttribute("content", page.Img);
            document.querySelector('meta[property="og:type"]').setAttribute("content", "article");
        },
    },
};
</script>

<style lang="scss">
.news__list {
    .nkg__card {
        margin-bottom: 3.125rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px dashed $gray-500;
    }
    .card {
        &-img {
            width: 450px;
        }
        &-body {
            padding: 0 0 0 1.25rem;
            background: transparent;
        }
        &-link {
            color: $blue-500;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            &:hover {
                .nkg__ic--svg {
                    transform: translateX(5px);
                }
            }
        }
        &-title {
            -webkit-line-clamp: 2;
        }
        &-text {
            -webkit-line-clamp: 6;
        }
        @include media-breakpoint-down(xl) {
            &-img {
                width: 300px;
            }
            &-body {
                padding: 0;
            }
            &-text {
                -webkit-line-clamp: 3;
            }
        }
        @include media-breakpoint-down(sm) {
            &-img {
                margin-bottom: 1.5rem;
                width: 100%;
            }
            &-text {
                -webkit-line-clamp: 6;
            }
        }
    }
    .page-item {
        user-select: none;
        &:not(.disabled) {
            cursor: pointer;
        }
        .small {
            vertical-align: bottom;
        }
        &.active {
            .page-link::after {
                @include pseudoBlock;
                bottom: 2px;
                left: 50%;
                transform: translateX(-50%);
                width: 30%;
                height: 2px;
                background-color: $blue-500;
            }
        }
    }
}
.news__page {
    .nkg__ic {
        width: 2rem;
        height: 2rem;
        &:hover {
            > .tooltip {
                opacity: 1;
            }
        }
    }
    .tooltip {
        white-space: nowrap;
        font-size: 0.75rem;
        top: -100%;
        left: 50%;
        transform: translateX(-50%);
        transition: $sec ease-in-out;
    }
}
</style>
