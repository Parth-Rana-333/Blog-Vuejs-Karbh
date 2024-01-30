<script setup>
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";

    const { logout } = useAuthStore()
    const { authenticated } = storeToRefs(useAuthStore())

    const handleLogout = () => {
        logout();
    }

</script>

<template>
    <div>
        <header>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <router-link class="navbar-brand" to="/">Blog</router-link>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <template v-if="!authenticated">
                            <li class="nav-item">
                                <router-link class="nav-link" :to="{name: 'login'}">Login</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" :to="{name: 'register'}">Register</router-link>
                            </li>
                        </template>
                        <template v-else>
                            <li class="nav-item active">
                                <router-link class="nav-link" to="/"> All Posts</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" :to="{name: 'posts'}">Post</router-link>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" @click="handleLogout">Logout</button>
                            </li>
                        </template>
                    </ul>
                </div>
            </nav> 
        </header>
    </div>
</template>

<style scoped>
</style>