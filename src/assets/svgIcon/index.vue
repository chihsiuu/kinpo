<template>
    <svg :class="svgClass" v-bind="$attrs" :style="{ width: props.size + 'px', height: props.size + 'px', color: color }">
        <use :xlink:href="iconName"/>
    </svg>
</template>
 
<script setup>
import { defineProps, computed } from "vue";
 
const props = defineProps({
    name: {
        type: String,
        required: true
    },
    size: {
        type: String,
        default: '16'
    },
    color: {
        type: String,
        default: ''
    }
})
 
const iconName = computed(()=>`#icon-${props.name}`);
const svgClass = computed(()=> {
    if (props.name) {
        return `nkg__ic--svg icon-${props.name}`
    }
    return 'nkg__ic--svg'
});
</script>