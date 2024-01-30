<script setup>
    const props = defineProps(['comment']);

</script>

<template>
    <div>
        <div class="comment">
            <div class="comment__flex">
                <p>"{{ props.comment.content }}"</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>