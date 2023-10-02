<template>
    <section :data-sec-scroll="L2.Title" :class="L2.Styles" v-html="L2.Content"></section>
</template>

<script>
export default {
    props: {
        pageindex: [Number, String],
        L2: Object,
    },
};
</script>