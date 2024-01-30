<script setup>
import {useAuthStore} from "../stores/auth";
import {storeToRefs} from "pinia";
import { watch } from "vue";
import debounce from "lodash/debounce";

    const { authenticated, posts_all } = storeToRefs(useAuthStore());
    const { getAllPosts } = useAuthStore();
    getAllPosts();

</script>
<template>
    <div class="text-center" v-if="authenticated">
        <div class="album py-5 bg-body-tertiary">
            <div class="container">
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                    <div class="col" v-if="posts_all.length > 0" v-for="(post, index) in posts_all" :key="index">
                        <router-link class="nav-link" :to="{name: 'watchPost', params: { slug: post.slug }}">
                            <div class="card shadow-sm">
                                <img :src="'http://127.0.0.1:8000/storage/images/'+post.image.name" class="bd-placeholder-img card-img-top" width="100%" height="225" preserveAspectRatio="xMidYMid slice" focusable="false">
                                <div class="card-body">
                                    <p class="card-text">{{ post.title }}</p>
                                </div>
                            </div>
                        </router-link>
                    </div>
                    <div v-else class="text-center">
                        <p> No posts avaiable! </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="text-center" v-else>
        Home Page | You are not logged in.
    </div>
</template>

<style scoped>
</style>
