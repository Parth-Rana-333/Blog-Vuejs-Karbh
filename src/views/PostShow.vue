<script setup>
import {useAuthStore} from "../stores/auth";
import {storeToRefs} from "pinia";
import comment from './comment.vue';
import addComments from './addcomments.vue'

    const { post_details, search } = storeToRefs(useAuthStore());
    const { getPostById } = useAuthStore();
    getPostById();

</script>

<template>
    <div>
        <section class="section">
            <div class="section__details">
                <div class="section__details-info">
                    <h1>{{ post_details.title }}</h1>
                    <div class="section__details-img">
                        <img :src="'http://127.0.0.1:8000/storage/images/'+post_details.image.name" />
                    </div>
                </div>
                <div class="section__details-content">
                    <p>
                        {{ post_details.content }}
                    </p>
                </div>
            </div>
        </section>
        <div>
            <h4>Comments: </h4>
            <comment v-for="(comment, index) in post_details.comments" :key="index" :comment="comment" class="message" />
        </div>
        <addComments />
    </div>
</template>

<style scoped>
</style>