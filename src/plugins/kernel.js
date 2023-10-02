import { ref } from "vue";
import axios from "axios";
// 全域宣告
const getLangData = ref(0);
const getLang = ref(0);
const KData = ref(0);
const ACWS = ref("");
const ACWSCFG = ref("");

export default function () {
    const deviceMode = ref(0);
    const MenuData = ref(0);
    const FooterFast = ref(0);
    const FooterInvestor = ref(0);
    const FooterData = ref(0);
    const FooterIcon = ref(0);

    function CWS() {
        // 正式測試站判斷
        if (process.env.VUE_APP_ENV == "prod") {
            ACWS.value = ',"sw":1';
            ACWSCFG.value = ',"cfgsw":1';
        }
    }

    function thisDevice() {
        if (window.innerWidth >= 1200) {
            deviceMode.value = "deskTop";
        } else if (window.innerWidth < 1200 && window.innerWidth >= 768) {
            deviceMode.value = "pad";
        } else {
            deviceMode.value = "mobile";
        }
    }

    function BaseService(Lang) {
        //if(getLang.value=='' || getLang.value==0){ //判斷是否設定語系，設定過即取過資料共用資料不再進入
        getLang.value = Lang; // getLang.value = window.location.pathname.split("/")[1];
        if (getLang.value !== "" && getLang.value !== 0) {
            CWS();
            let KpMenu = '{"class":"KpMenu","lang":"' + getLang.value + '","BlockDet":true,"Data":true' + ACWS.value + "}";
            let KpFtFastMenu = '{"class":"KPOFtFastMenu","lang":"' + getLang.value + '","BlockDet":true,"Data":true' + ACWS.value + "}";
            let KpFtMenu = '{"class":"KpFtMenu","lang":"' + getLang.value + '","BlockDet":true,"Data":true' + ACWS.value + "}";
            let KpFtIcon = '{"class":"KPOFtIcon","lang":"' + getLang.value + '","BlockDet":true,"Data":true' + ACWS.value + "}";

            getAllData([KpMenu, KpFtFastMenu, KpFtMenu, KpFtIcon]).then(R => {
                if (R[0].data !== null) {
                    MenuData.value = R[0].data;
                } // 主選單
                if (R[1].data !== null) {
                    // 頁尾快速選單
                    FooterFast.value = R[1].data;
                    FooterInvestor.value = R[1].data.filter(function (item) {
                        return item.Link == "investor";
                    });
                    FooterInvestor.value = FooterInvestor.value[0].Children;
                }
                if (R[2].data !== null) {
                    FooterData.value = R[2].data;
                } // 頁尾主選單
                if (R[3].data !== null) {
                    FooterIcon.value = R[3].data;
                } // 頁尾社群
            });
        }
        //}
    }

    function getAllData(Json) {
        return Promise.all(Json.map(fetchData));
    }

    function fetchData(Json) {
        var FD = new FormData();
        FD.append("mode", "sct");
        FD.append("data", Json);
        return axios({
            method: "post",
            url: "https://nkg-web-api.japaneast.cloudapp.azure.com/Form/",
            data: FD,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return { success: false };
            });
    }

    async function LangData(Lang) {
        CfgData('{"class":"KPOLanguage","lang":"' + (getLang.value == 0 ? Lang : getLang.value) + '"}').then(r => {
            getLangData.value = r;
            return r;
        });
    }

    function CfgData(J) {
        var obj = JSON.parse(J);
        var FD = new FormData();
        if (obj.class == "KPOLanguage") {
            FD.append("mode", "cfg_sct");
        } else {
            FD.append("mode", "cfg");
        }
        FD.append("data", J);
        return axios({
            method: "post",
            url: "https://nkg-web-api.japaneast.cloudapp.azure.com/Form/",
            data: FD,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return { success: false };
            });
    }

    function ChLangData(el) {
        var obj = [];
        Object.keys(getLangData.value).forEach(function (v, k) {
            obj[v] = getLangData.value[v];
        });
        if (obj[el] !== undefined) {
            return obj[el];
        } else {
            return el;
        }
    }

    function setKData(r, k, v) {
        var wpk = new Object();
        var wpv = new Object();
        if (KData.value !== 0) {
            wpv = KData.value;
        }
        wpk[k] = v;
        wpv[r] = wpk;
        KData.value = wpv;
    }

    return {
        // 呼叫副程式
        thisDevice,
        BaseService, // 呼叫 基本共用區塊資料讀取(選單)
        getAllData,
        LangData, // 呼叫 刷新語系對照表
        fetchData,
        CfgData, // 調用設定檔
        ChLangData, // 翻譯替換文字
        setKData, // 列表頁/內頁切換

        //回傳共用區塊DATA
        deviceMode,
        MenuData, // 頂部主選單
        FooterData, // 底部主選單
        FooterFast,
        FooterInvestor,
        FooterIcon,
        getLang, // 取得當前語系
        getLangData, // 取得語系對照列表
        KData, // 模組設定資料暫存
        ACWS,
        ACWSCFG,
    };
}
