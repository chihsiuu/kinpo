<template>
    <div class="select__wrap form-floating text-body" 
        :tabindex="tabindex" @blur="open = false"
        :class="{'show':open}" 
    >
        <span class="form-select" @click="open = !open"> {{selected}} </span>
        <label class="form-label"> {{label}} </label>

        <transition name="toggle">
            <ul v-show="open" class="select__opt list-unstyled w-100">
                <li v-for="(option, i) of options"
                    :key="i"
                    @click="selected = option.split('(')[0]; open = false; $emit('input-value', option);"
                >
                    {{ option.split('(')[0] }}
                </li>
            </ul>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: true,
        },
        options: {
            type: Array,
            required: true,
        },
        default: {
            type: String,
            required: false,
            default: null,
        },
        tabindex: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    watch:{
        default(newValue, oldValue){
            this.selected = newValue;
        }
    },
    data() {
        return {
            selected: this.default ? this.default : this.options.length > 0 ? this.options[0] : null,
            open: false,
        };
    },
    mounted() {
        this.$emit('input-value', this.selected);
    },
};
</script>

<style lang="scss" scoped>
.select__wrap{
    .select__opt{
        position: absolute;
        padding: 0 1.5rem;
        background: #fff;
        border-radius: 0 0  $border-radius $border-radius;  
        border: 2px solid #fff;
        max-height: 0;
        overflow: auto;
        z-index: 10; 
        transition: $sec ease-in-out;  
        li{
            @include layoutPadding-y(.35rem);
            color: $gray-600;
            cursor: pointer;
            &:hover, &:focus{
                color: $dark;
            }
        }   
    }
    &.show{
        .form-select{
            border-color: $warning;
            border-bottom-color: #fff;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
        }
        .select__opt{
            padding: .75rem 1.5rem;
            margin-top: -4px;
            max-height: 500px;
            border-color: $warning;
            border-top: #fff;
        }
    }
    &.disabled{
        .form-select{
            background-color: $gray-300;
            background-image: none;
            border-color: $gray-300;
            color: $gray-500;
        }
    }
    &:focus {
        @include removeOutline;
    }
}
</style>
