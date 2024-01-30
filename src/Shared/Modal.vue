<script setup>
import { onMounted } from "vue"
import CloseIcon from "./Icons/CloseIcon.vue";
    const emit = defineEmits(['close-modal'])
    const props = defineProps({
        "show": {
            type: Boolean,
            default: false
        },
        "show_close_icon": {
            type: Boolean,
            default: true
        }
    })
    onMounted(() => window.addEventListener('keydown', (e) => {
        if (e.keyCode == 27 && props.show_close_icon) {
            emit("close-modal");
        }
    }));
</script>

<template>
    <Transition name="modal_transition">
        <div v-if="show" class="modal-mask">
            <div class="modal-container">
                <div v-if="show_close_icon" v-on:click="$emit('close-modal')" class="cursor-pointer modal-close">
                    <CloseIcon />
                </div>
                <header>
                    <slot name="header"></slot>
                </header>
                <div class="modal-body">
                    <slot></slot>
                </div>
                <footer class="d-flex flex-wrap align-items-center justify-content-center pb-2">
                    <slot name="footer"></slot>
                </footer>
            </div>
        </div>
    </Transition>
</template>
