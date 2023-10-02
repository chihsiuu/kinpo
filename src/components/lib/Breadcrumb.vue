<template>
	<ol style="--bs-breadcrumb-divider: '/'" class="breadcrumb">
		<li
			v-for="(breadcrumb, idx) in breadcrumbList"
			:key="idx"
			class="breadcrumb-item small">
			<router-link 
				:to="breadcrumb.link"
				:class="{'pe-none': breadcrumb.link=='' || idx==(breadcrumbList.length-1)}"
				> {{ breadcrumb.name }} 
			</router-link>
		</li>
	</ol>
</template>

<script>
import { inject } from "vue";
import kernel from "../../plugins/kernel";

export default {
    data() {
        return {
			breadcrumbList: []
        };
    },
    setup() {
		const MenuData = inject("MenuData");
		return {
			MenuData,
		};
    },
    mounted() {
		this.LinkVerify(this.MenuData,'','');
    },
    methods: {
        LinkVerify(arr,Title,Link) {
			let L=this.$route.params.lang;
			let {ChLangData} = kernel();
			arr.forEach((v) => {
				if(v["Link"].indexOf('http')==-1 && v["Link"]!==''){
					if(v["Link"].split('/').filter(i=>i)[0]==this.$route.params.dyna){
						if(v["Link"].split('/').filter(i=>i)[1]==this.$route.params.subdyna){
							let r={};
							r.name=ChLangData('Home');
							r.link='/'+L+'/home/';
							this.breadcrumbList.push(r);

							if(Title !== ''){
								let res={};
								res.name=Title;
								res.link=Link;
								this.breadcrumbList.push(res);
							}

							let ress={};
							ress.name=v.Title;
							ress.link='/'+L+v.Link;
							this.breadcrumbList.push(ress);
						}
					}
				}
				if(v["Children"] !== undefined){this.LinkVerify(v["Children"],v["Title"],v["Link"]);}
			});
        }
    },
};
</script>

<style lang="scss" scoped>
.breadcrumb a {
    color: $gray-300;
}
</style>