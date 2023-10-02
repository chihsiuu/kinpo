import { createApp,watch } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from 'axios';
import VueAxios from 'vue-axios';
import kernel from "./plugins/kernel";
import 'bootstrap';

// 輪播
import VueSplide from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';

// svg icon
import "@/assets/svgIcon/index"
import svgIcon from "@/assets/svgIcon/index.vue";

// all css
import '@/assets/scss/style.scss';


// Register it globally
const app = createApp(App)
    .use(router)
    .use(VueAxios, axios)
    .use(VueSplide)
    .component('svg-icon',svgIcon)
    .mixin({
        directives: {
            i18n: {//v-i18n
                mounted(el, binding) {
                    var obj = [];
                    let {getLangData} = kernel();
                    watch(getLangData,(r)=>{
                        //Object.keys(r).forEach(function(v,k){obj[v] = r[v];});// console.log(k,v,r[v]);
                        obj = getLangData.value;
                        if(obj[binding.value]!==undefined){
                            el.innerHTML=obj[binding.value];
                        } else {
                            el.innerHTML=binding.value;
                        }
                    });
                }
            },
            drag: {
                mounted(el, binding) {
                    var isDrag = false;
                    let mouseOffsetX, posX;                    
                    //鼠标点击的时候（标记元素为可拖动）
                    el.addEventListener('mousedown', function(e) {
                        var e = e || window.event;
                        mouseOffsetX = e.clientX;  //鼠标相对于被触发元素的位置
                        posX = el.scrollLeft;
                        isDrag = true;
                        el.style.cursor = 'grabbing';
                    })
                    //鼠标移动时（要检测，元素是否标记为移动）
                    el.onmousemove = function(e) {
                        var e = e || window.event;
                        var mouseX = e.clientX; //鼠标当前的位置
                        if (isDrag) {
                            // 鼠标移动的距离
                            var moveX = mouseX - mouseOffsetX;
                            el.scrollLeft = posX - moveX;
                        }
                    };
                    //鼠标松开&離開的时候（标记元素为不可拖动）
                    el.onmouseup = function(e) {
                        isDrag = false;
                        el.style.cursor = 'pointer';
                    }
                    el.onmouseleave = function(e) {
                        isDrag = false;
                        el.style.cursor = 'pointer';
                    }
                }
            }
        },
    })
app.config.globalProperties.$filters = {
    removeHtml(str) {
        return str.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, "");
    },
    dateFormat(str) {
        if(str !== 'null'){
            let dateObj = new Date(str).toDateString().split(' ');
            dateObj.shift();
            return dateObj.slice(0, -1).join('. ')+', '+dateObj.slice(-1);
        }
    },
}
app.mount("#app");