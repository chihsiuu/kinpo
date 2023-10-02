<template>
	<section
		:data-sec-scroll="L2.Title"
		:class="[
			L2.Styles,
			{ 'bgimg-fixed': L2.RGBA !== '' && L2.RGBA !== 'rgba(0, 0, 0, 0)' },
		]"
		:style="{
			backgroundImage:
				'linear-gradient(' +
				L2.RGBA +
				',' +
				L2.RGBA +
				'), url(\'' +
				(deviceMode == 'mobile'
					? L2.MImg == ''
						? L2.Img
						: L2.MImg
					: L2.Img) + 
				'\')',
		}"
		class="nkg__section "
	>
		<div class="nkg__container">
			<div class="row justify-content-center">
				<h2 v-if="L2.Title !== ''" class="h3 text-center fw-bold">
					{{ L2.Title }}
				</h2>
				<div :id="ID" class="timeline__wrap">
					<div
						v-html="L2.Content"
						class="nkg__wrap text-center"
					></div>
					<!-- top -->
					<div class="timeline__nav position-relative">
						<div
							class="timeline--scroll list-unstyled px-0"
							:class="{
								'opacitymask--l':
									deviceMode !== 'mobile' &&
									nowCarouselItem !== 0,
								'opacitymask--r':
									deviceMode !== 'mobile' &&
									nowCarouselItem + 1 !== carouselLen,
								show: showToggle,
							}"
							tabindex="0"
							@blur="showToggle = false"
							v-drag
						>
							<div
								v-if="deviceMode == 'mobile'"
								class="
									list-inline-item
									d-flex
									justify-content-between
									align-items-center
								"
								@click.prevent="showToggle = !showToggle"
							>
								{{ $filters.removeHtml(selectedItem) }}
								<svg-icon name="arrow-down" size="24" />
							</div>
							<transition name="toggle">
								<div
									v-if="deviceMode !== 'mobile' || showToggle"
									:class="{
										'position-absolute w-100':
											deviceMode == 'mobile',
									}"
								>
									<!-- 季 -->
									<ul
										v-if="L2.Templates == 'TimelineQT'"
										class="
											list-inline
											position-relative
											d-md-flex
											mb-0
										"
										:class="{
											'justify-content-around':
												!isOver &&
												deviceMode !== 'mobile',
										}"
									>
										<li
											v-for="(
												item, idx
											) in compDataDisplay"
											:key="idx"
											class="list-inline-item h5"
											:class="{
												active: idx == nowCarouselItem,
											}"
											@click="
												clickTimeline(idx);
												selectedItem =
													$filters.removeHtml(
														item.year
													);
												nowCarouselSubItem = '0';
												showToggle = !showToggle;
											"
										>
											{{ item.year }}
										</li>
									</ul>
									<!-- 其他 -->
									<ul
										v-else
										class="
											list-inline
											position-relative
											d-md-flex
											mb-0
										"
										:class="{
											'justify-content-around':
												!isOver &&
												deviceMode !== 'mobile',
										}"
									>
										<li
											v-for="(
												item, idx
											) in compDataDisplay"
											:key="idx"
											class="list-inline-item h5"
											:class="{
												active: idx == nowCarouselItem,
											}"
											@click="
												clickTimeline(idx);
												selectedItem =
													$filters.removeHtml(
														item[0].Title
													);
												showToggle = !showToggle;
											"
										>
											{{
												$filters.removeHtml(
													item[0].Title
												)
											}}
										</li>
									</ul>
								</div>
							</transition>
						</div>
						<div v-if="deviceMode !== 'mobile'" class="arrows">
							<svg-icon
								v-if="nowCarouselItem !== 0"
								class="splide__arrow splide__arrow--prev"
								name="arrow-l"
								size="24"
								@click.prevent="toPrev"
							/>
							<svg-icon
								v-if="nowCarouselItem + 1 < carouselLen"
								class="splide__arrow splide__arrow--next"
								name="arrow-r"
								size="24"
								@click.prevent="toNext"
							/>
						</div>
					</div>

					<!-- bottom -->
					<!-- 季 -->
					<div
						v-if="L2.Templates == 'TimelineQT'"
						class="nkg__list py-2 py-lg-3"
					>
						<div v-for="(L1, idx) in compDataDisplay" :key="idx">
							<transition name="fadeInDownQT">
								<span
									class="row justify-content-center"
									v-if="idx == nowCarouselItem"
								>
									<div class="col-md-2 col-xl-2 col-xxl-1">
										<div
											class="
												row
												g-0
												flex-md-column
												justify-content-center
												justify-content-md-around
												h-100
											"
										>
											<div
												v-for="(L2, index) in L1.data"
												:key="index"
												@click="
													nowCarouselSubItem = index
												"
												class="col-3"
											>
												<span
													class="
														quarter
														h5
														d-inline-block
														text-center
													"
													:class="{
														active:
															nowCarouselSubItem ==
															index,
													}"
													>{{ L2.qt }}</span
												>
											</div>
										</div>
									</div>
									<div class="col-md-10 col-xl-10 col-xxl-6">
										<div
											v-for="(L2, indexqt) in L1.data"
											:key="indexqt"
										>
											<transition name="fadeInDown">
												<span
													v-if="
														deviceMode !==
															'mobile' ||
														nowCarouselSubItem ==
															indexqt
													"
													class="
														d-md-flex
														justify-content-between
														justify-content-xxl-evenly
														flex-wrap
														flex-xxl-nowrap
													"
												>
													<a
														v-for="(
															L3, index
														) in L2.files"
														:key="index"
														:href="L3.Url"
														target="_blank"
														class="
															d-flex
															d-md-inline-flex
															justify-content-between
															align-items-center
															btn
															btn-outline-primary
															rounded-pill
															text-start
															my-3 my-md-2
															mx-md-2
														"
														>{{
															$filters.removeHtml(
																L3.SubTitle
															)
														}}<svg-icon
															class="ms-2"
															name="download"
															size="24"
													/></a>
												</span>
											</transition>
										</div>
									</div>
								</span>
							</transition>
						</div>
					</div>

					<!-- 里程記事 -->
					<div
						v-else-if="L2.Templates == 'TimelineMS'"
						class="nkg__list timeline__milestone py-2 py-lg-3"
					>
						<template
							v-for="(item, idx) in compDataDisplay"
							:key="idx"
						>
							<transition name="fadeInDown">
								<span
									v-if="idx == nowCarouselItem"
									v-html="item[0].SubTitle"
								></span>
							</transition>
						</template>
					</div>

					<!-- 附件 -->
					<div
						v-else-if="L2.Templates == 'TimelineAP'"
						class="nkg__list text-center py-md-3"
					>
						<template
							v-for="(item, idx) in compDataDisplay"
							:key="idx"
						>
							<transition name="fadeInDown">
								<span v-if="idx == nowCarouselItem">
									<template
										v-for="(i, idx) in item"
										:key="idx"
									>
										<img
											v-if="i.Img"
											:src="i.Img"
											alt=""
											class="
												cover
												d-block
												mx-auto
												my-4
												mt-md-0
											"
										/>
										<a
											:href="i.Url"
											target="_blank"
											class="
												d-flex d-md-inline-flex
												justify-content-between
												align-items-center
												btn btn-outline-primary
												rounded-pill
												text-start
												my-3 my-md-2
												mx-md-2
											"
										>
											{{
												$filters.removeHtml(i.SubTitle)
											}}
											<svg-icon
												class="ms-2"
												name="download"
												size="24"
											/>
										</a>
									</template>
								</span>
							</transition>
						</template>
					</div>

					<!-- 自編 -->
					<div v-else class="nkg__list py-2 py-lg-3">
						<template
							v-for="(item, idx) in compDataDisplay"
							:key="idx"
						>
							<transition name="fadeInDown">
								<span
									v-if="idx == nowCarouselItem"
									v-html="item[0].SubTitle"
								></span>
							</transition>
						</template>
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
		L2: Object,
	},
	data() {
		return {
			showToggle: false,
			isOver: false,
			isClickable: true,
			selectedItem: "",
			nowCarouselItem: 0,
			nowCarouselSubItem: 0,
			carouselName: "carousel-next",
			carouselLen: 0,
			ID: "",
			compDataDisplay: [],
		};
	},
	setup() {
		const deviceMode = inject("deviceMode");
		return {
			deviceMode,
		};
	},
	updated() {
		this.carouselLen = this.compDataDisplay.length;
		let allItem_W = 0;
		let wrap_W = $("#" + this.ID + " .timeline--scroll").width();
		for (let i = 0; i < this.carouselLen; i++) {
			allItem_W += $(
				"#" + this.ID + " .list-inline-item:eq(" + i + ")"
			).innerWidth();
		}
		allItem_W > wrap_W ? (this.isOver = true) : (this.isOver = false);
	},
	mounted() {
		if (this.L2.Data !== null) {
			if (this.L2.Templates == "TimelineQT") {
				// 判斷是否為"季"
				let mst = [];
				this.compDataDisplay = _.groupBy(this.L2.Data, function (g) {
					// 依"年份"分群
					return g.PODate.slice(0, 4); //去除月日
				});
				Object.keys(this.compDataDisplay).forEach((key) => {
					// 解析3層(年份)
					let a = {},
						d = [];
					let value = this.compDataDisplay[key];
					a["year"] = key;
					let b = _.groupBy(value, function (g) {
						return g.Title;
					}); // 依"季"分群
					Object.keys(b).forEach((keys) => {
						let c = {},
							values = b[keys];
						c["qt"] = keys;
						c["files"] = values;
						d.push(c);
					});
					a["data"] = d.sort(function (a, b) {
						return a["qt"] > b["qt"] ? 1 : -1;
					}); // 依"季"物件排序
					mst.push(a);
				});
				mst.sort(function (a, b) {
					return b.year - a.year;
				});
				this.compDataDisplay = mst;
				this.selectedItem = this.compDataDisplay[0].year.slice(0, 4); // 手機default年份
			} else {
				this.compDataDisplay = _.groupBy(this.L2.Data, function (g) {
					return g.Title.replace(
						/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g,
						""
					); // 濾除P標籤
				});
				var NumCheck = /[0-9]/g; // 數字正則
				var CKN = Object.keys(this.compDataDisplay).some(function (
					item
				) {
					return NumCheck.test(item);
				}); // 檢核索引是否匹配數字
				if (CKN) {
					this.compDataDisplay = Object.keys(this.compDataDisplay)
						.sort()
						.reduce(
							// 物件key排序 https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
							(obj, key) => {
								obj[key] = this.compDataDisplay[key];
								return obj;
							},
							{}
						);
				}
				this.compDataDisplay = Object.values(this.compDataDisplay);
				this.compDataDisplay.reverse();
				this.selectedItem = this.compDataDisplay[0][0].Title;
			}
			this.ID = this.L2.Data[0].ID;
		}
	},
	methods: {
		clickTimeline(i) {
			if (i !== this.nowCarouselItem) {
				i > this.nowCarouselItem
					? this.scrolltoItem(i, "next")
					: this.scrolltoItem(i, "prev");
			}
			this.nowCarouselItem = i;
		},
		toPrev() {
			if (this.isClickable) {
				this.nowCarouselItem - 1 < 0
					? (this.nowCarouselItem = this.carouselLen - 1)
					: (this.nowCarouselItem = this.nowCarouselItem - 1);
				this.scrolltoItem(this.nowCarouselItem, "prev");
			}
			this.carouselName = "carousel-prev";
			this.isClickable = false;
		},
		toNext() {
			if (this.isClickable) {
				this.nowCarouselItem + 1 >= this.carouselLen
					? (this.nowCarouselItem = 0)
					: (this.nowCarouselItem = this.nowCarouselItem + 1);
				this.scrolltoItem(this.nowCarouselItem, "next");
			}
			this.carouselName = "carousel-next";
			this.isClickable = false;
		},
		scrolltoItem(i, to) {
			let $item = $("#" + this.ID + " .list-inline-item:eq(" + i + ")");
			let item_W = $item.innerWidth();
			let item_P_X = $item.position().left;
			let wrap_S_X = $("#" + this.ID + " .timeline--scroll").scrollLeft();
			let wrap_W = $("#" + this.ID + " .timeline--scroll").width();

			if (item_P_X >= wrap_W - item_W && to == "next") {
				$("#" + this.ID + " .timeline--scroll")
					.stop(true)
					.animate({ scrollLeft: wrap_S_X + item_W }, 300);
			}
			if (item_P_X < wrap_S_X + item_W && to == "prev") {
				$("#" + this.ID + " .timeline--scroll")
					.stop(true)
					.animate({ scrollLeft: wrap_S_X - item_W }, 300);
			}
			setTimeout(() => {
				this.isClickable = true;
			}, 300);
		},
	},
};
</script>

<style lang="scss">
.quarter {
	position: relative;
	background-color: $blue-500;
	color: #fff;
	width: 60px;
	line-height: 30px;
	&::after {
		@include pseudoBlock;
		width: 12px;
		height: 10px;
		background-color: $blue-500;
		right: -4px;
		top: 0;
		transform: skewX(-40deg);
	}
	@include media-breakpoint-down(md) {
		padding-bottom: 1rem;
		margin-bottom: 1rem;
		background-color: transparent;
		color: $gray-800;
		cursor: pointer;
		font-size: 1rem;
		width: 100%;
		transition: $sec ease-in-out;
		&.active {
			color: $blue-500;
			font-size: 1.25rem;
			font-weight: bold;
			&::after {
				height: 4px;
			}
		}
		&::after {
			width: 100%;
			height: 0;
			background-color: $blue;
			right: 0;
			top: auto;
			bottom: 0;
			transform: skewX(0);
			transition: 0.3s ease-in-out;
		}
	}
}

.timeline__milestone.nkg__list {
	li {
		&::before {
			top: 0.3rem;
			left: 0;
			width: 15px;
			height: 15px;
			border-radius: 50%;
			border: 3px solid $blue-500;
			background-color: $blue-900 !important;
			z-index: 1;
		}
		&:not(:last-child)::after {
			@include pseudoBlock;
			top: 1rem;
			left: 0.375rem;
			width: 3px;
			height: calc(100% + 1rem);
			background-color: $blue-500;
			z-index: 0;
		}
	}
}
</style>
