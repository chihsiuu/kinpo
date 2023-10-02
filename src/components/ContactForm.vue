<template>
    <section :data-sec-scroll="L2.Title" :class="L2.Styles" class="nkg__section">
        <div class="nkg__container">
            <h2 v-if="L2.Title!==''" class="h3 text-center fw-bold" v-html="L2.Title"></h2>
            <div class="nkg__wrap">

                <Form class="row justify-content-center text-body" @submit="onSubmit">
                    <div :class="this.$route.params.lang=='en-US'?'col-lg-6':'col-md-6'">
                        <div class="mb-3 mb-md-4">
                            <Field type="text" name="UserProblem" class="d-none" v-model="UserProblem" :rules="'is_not:'+ChLangData('Select')"/>
                            <CustomSelect
                                class="required"
                                :options="ProblemData"
                                :default="updateProblem"
                                :label="ChLangData('Question type')"
                                @input-value="filterGroup($event); UserProblem=$event; UserSctItem=''"
                            />         
                            <ErrorMessage v-show="isChanged" class="smallest text-warning" name="UserProblem" />
                        </div>
                    </div>
                    <div :class="this.$route.params.lang=='en-US'?'col-lg-6':'col-md-6'"> 
                        <div class="mb-3 mb-md-4">                       
                            <Field type="text" name="UserSctItem" class="d-none" v-model="UserSctItem"/>
                            <CustomSelect
                                :class="{'pe-none disabled':SctItemData.length<1, 'required':SctItemData.length>0}"
                                :options="SctItemData"
                                :default="updateSctItem"
                                :label="ChLangData('Query item')"
                                @input-value="UserSctItem=$event"
                            />      
                            <ErrorMessage class="smallest text-warning" name="UserSctItem" />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating mb-3 mb-md-4 required">
                            <Field type="text" name="Country" class="d-none" v-model="UserCountry" :rules="'is_not:'+ChLangData('Select')"/>
                            <CustomSelect
                                class="required"
                                :options="CountryItemData"
                                :default="updateCountry"
                                :label="ChLangData('Country')"
                                @input-value="UserCountry=$event"
                            />         
                            <ErrorMessage v-show="isChanged" class="smallest text-warning" name="Country" />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating mb-3 mb-md-4">
                            <Field type="text" name="City" class="form-control border-0" id="City" v-model="UserCity" :placeholder="ChLangData('City')" maxlength="16" />
                            <label for="City" v-i18n="'City'"></label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating mb-3 mb-md-4 required">
                            <Field type="text" name="Name" class="form-control border-0" id="Name" v-model="UserName" :placeholder="ChLangData('Name')" maxlength="16" rules="required" />
                            <label for="Name" v-i18n="'Name'"></label>
                            <ErrorMessage class="smallest text-warning" name="Name" />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating mb-3 mb-md-4">
                            <Field type="tel" name="Phone" class="form-control border-0" id="Phone" v-model="UserPhone" :placeholder="ChLangData('Phone')" maxlength="16" />
                            <label for="Phone" v-i18n="'Phone'"></label>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="form-floating mb-3 mb-md-4 required">
                            <Field type="email" name="Email" class="form-control border-0" id="Mail" v-model="UserMail" :placeholder="ChLangData('E-mail')" maxlength="32" rules="required|email" />
                            <label for="Mail" v-i18n="'E-mail'"></label>
                            <ErrorMessage class="smallest text-warning" name="Email" />
                        </div>
                    </div>
                    <!-- <div class="col-md-6">
                        <div class="form-floating mb-3 mb-md-4 required">
                            <Field type="tel" name="Vcode" class="form-control border-0" id="Vcode" placeholder="驗證碼" maxlength="16" />
                            <label for="Vcode">驗證碼</label>
                            <ErrorMessage class="smallest text-warning" name="Vcode" />
                        </div>
                    </div> -->
                    <div class="col-12">
                        <div class="form-floating required textarea">
                            <Field as="textarea" name="Comments" class="form-control border-0" placeholder=" " id="Comments" v-model="UserComments" style="min-height: 200px" rules="required|min:3"></Field>
                            <label for="Comments" v-i18n="'Questions and Suggestions'"></label>
							<ErrorMessage class="smallest text-warning" name="Comments" />
                        </div>
                    </div>

                    <!--Submit -->
                    <div class="nkg__wrap text-center">
                        <button type="submit" class="d-inline-flex justify-content-between align-items-center btn btn-outline-primary rounded-pill text-start" @click="isChanged = true">
                            <span></span>
                            <span v-i18n="'Submit'"></span><svg-icon name="arrow-r" size="24" />
                        </button>
                    </div>
                </Form>


            </div>
        </div>
    </section>
    <div v-if="isCollapse" class="modal-backdrop show d-flex justify-content-center align-items-center" style="z-index:1052;">
        <div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>

<script>
import kernel from "../plugins/kernel";
import CustomSelect from "@/components/lib/CustomSelect.vue";
import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate';
import AllRules from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import en from '@vee-validate/i18n/dist/locale/en.json';
import zh_TW from '@vee-validate/i18n/dist/locale/zh_TW.json';

Object.keys(AllRules).forEach(rule => {
    defineRule(rule, AllRules[rule]);
});
configure({   
    generateMessage: localize({
        zh_TW: {
            messages: {
                required: '此為必填欄位',
                is_not: '此為必填欄位',
                email: '不是正確的電子郵件',
                min: '不能小於 0:{min} 個字元',
            },
        },
        en: {
            messages: {
                required: 'This is a required field',
                is_not: 'This is a required field',
                email: 'Not a correct email',
                min: 'Cannot be less than 0:{min} characters',
            },
        },
    }),
});

export default {
    props: {
        pageindex: [Number, String],
        L2: Object
    },
    components: {
        CustomSelect,
        Form,
        Field,
        ErrorMessage
    },
    data() {
        return {
            ProblemData:[],
            ProblemGroupItem:[],
            SctItemData:[],
            SctItemDataTmp:[],
            CountryItemData:[],
            UserProblem:'',
            UserSctItem:'',
            UserCountry: '',
            UserCity: '',
            UserName: '',
            UserPhone: '',
			UserMail: '',
            UserComments: '',
			// submitRandom: Math.random(),
            isChanged: false,
            isCollapse: false,
            SctItemEmail:[]
        };
    },
    setup() {
        const {ChLangData, LangData, getLang} = kernel();
        LangData(getLang.value);
        return {
            ChLangData
        }; 
    },    
    mounted() { 
        let L=this.$route.params.lang;
        let {ACWSCFG,CfgData} = kernel();
        let _t=this;
        CfgData('{"class":"kpo-contact-us","lang":"'+L+'"'+ ACWSCFG.value +'}').then(r => {
            Object.keys(r.Problem).forEach(function(v,k){
                _t.ProblemData[k] = r.Problem[v].ValA; //賦予問題類型值
                _t.ProblemGroupItem[r.Problem[v].ValA] = r.Problem[v].ValC;
            });
            Object.keys(r.SctItem).forEach(function(v,k){
                _t.SctItemEmail[r.SctItem[v].ValA] = r.SctItem[v].ValA_Name;
            });
            _t.SctItemDataTmp=r.SctItem;
            _t.CountryItemData=Object.keys(r.Country);
        });
        if(L == 'zh-TW'){
            setLocale('zh_TW');
        } else if(L == 'en-US'){
            setLocale('en');
        }
    },
    computed: {
        updateProblem() {
            if(this.UserProblem!==''){
                return this.UserProblem;
            } else {
                return this.ChLangData('Select');
            }
        },
        updateSctItem() {
            if(this.SctItemData.length>0){
                return this.SctItemData[0];
            } else {
                return '----';
            }
        },
        updateCountry() {
            if(this.UserCountry!==''){
                return this.UserCountry;
            } else {
                return this.ChLangData('Select');
            }
        }, 
    },
    methods: {
        filterGroup(e){
            let _t=this;
            _t.SctItemData=[];
            Object.values(Object.values(this.SctItemDataTmp).filter(item => item.ValC.indexOf(this.ProblemGroupItem[e])!==-1)).forEach(function(v,k){
                _t.SctItemData[k]=v.ValA;
            });
        },
        getFormatCode(strValue){
            return strValue.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
        },
        // 送出表單
		onSubmit(values, { resetForm }) {  
            this.isCollapse = true;          
			var FD = new FormData();
			FD.append('mode', 'add');
            var UserSctItem = this.UserSctItem=='' ? this.SctItemData[0] : this.UserSctItem;
			var objData ={
				"class": "kpo-contact-us",
				"lang": this.$route.params.lang,
                "Problem": this.UserProblem,
				"SctItem": UserSctItem,
                "Country": this.UserCountry,
				"City": this.UserCity,
				"Phone": this.UserPhone,
				"Name": this.UserName,
				"Email": this.UserMail,
                "Content": this.getFormatCode(this.UserComments),  
				"RandCode": Math.random(),
                "send_server": "https://event.xyzprinting.com/Tp/SendMAIL/",
                "send_email": this.SctItemEmail[UserSctItem],
                "send_name": "KPO",
                "send_trigger": "KPOTwContactUs_"+this.$route.params.lang,
			};
			FD.append('data',JSON.stringify(objData));
			this.axios({
				method: 'post',
				url: 'https://nkg-web-api.japaneast.cloudapp.azure.com/Form/',
				data: FD,
				headers: {'Content-Type': 'multipart/form-data' }
			})
			.then(response => {
                if(response.status == 200){
                    this.isCollapse=false;
                    resetForm();
                    this.UserProblem=this.UserCountry='';
                    this.SctItemData=[];
                    let sendMsg = this.$route.params.lang=='zh-TW' ? '送出成功' : 'Sent successfully';
                    alert(sendMsg);
				} else {	
                    this.isCollapse=false;
                    let sendMsg = this.$route.params.lang=='zh-TW' ? '送出失敗' : 'Failed to send';
                    alert(sendMsg);	
				}
			})
			.catch(error => {
				// console.log(error);
			});					
		}
    },
};
</script>