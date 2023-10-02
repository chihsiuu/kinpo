<template>
	<div class="flex-fill bg-dark" :class="display ? 'd-none':'d-flex'">
		<div class="nkg__section nkg__section--error flex-fill">
			<div class="text-center">
				<p class="text-uppercase mb-3">PAGE NOT FOUND</p>
				<p v-i18n="'Not Found'" class="text-light"></p>
				<router-link
					:to="'/' + this.$route.params.lang + '/home/'"
					class="btn btn-outline-light rounded-pill mt-2"
					v-i18n="'Go to Homepage'"
				></router-link>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		display: Boolean,
	},
};
</script>
<style lang="scss" scoped>
.nkg__section--error {
	background-image: url("~@/assets/images/404/404_l.jpg");
	background-size: cover;
	background-position: top center;
	div {
		margin-top: 30vw;
		margin-bottom: 3vw;
	}
	.text-uppercase {
		font-size: 2.3vw;
		font-weight: 300;
		font-style: italic;
		letter-spacing: 1.07px;
		color: #42c6ff;
		text-shadow: 0 0 12px rgba(131, 195, 255, 0.8);
	}
	.btn {
		background-color: transparent;
	}
	@include media-breakpoint-down(xl) {
		margin-top: 80px;
	}
	@include media-breakpoint-down(sm) {
		margin-top: 50px;
		background-image: url("~@/assets/images/404/404_m.jpg");
		div {
			margin-top: 42vw;
			margin-bottom: 0;
		}
		.text-uppercase {
			font-size: 7vw;
		}
	}
}
</style>
