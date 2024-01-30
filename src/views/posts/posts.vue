<script setup>
import { reactive, watch } from "vue";
import debounce from "lodash/debounce";
import Modal from "../../Shared/Modal.vue";
import { ConvertDateTimeToLocal } from "../../Composables/ConvertDateTimeToLocal";
import ListHeaderSearch from "../../Shared/ListHeaderSearch.vue";
import ListHeaderShowEntry from "../../Shared/ListHeaderShowEntry.vue";
import ListFooterShowTotal from "../../Shared/ListFooterShowTotal.vue";
import ListFooterPagination from '../../Shared/ListFooterPagination.vue';
import { usePostStore } from "../../stores/postStore";
import { storeToRefs } from "pinia";

    let post_table = reactive({
        columns: [{"id": "title", "text": "Title"}, {"id": "content", "text": "Content"}, {"id": "category", "text": "Category(s)"}, {"id": "created_at", "text": "ADDED DATE"}],
    })
    let post_delete = reactive({
        'show_modal' : false,
        'show_close_icon' : true,
        'post_id': ''
    });

    const { posts, selected_show_entry, search, sort_column, sort_order, current_page } = storeToRefs(usePostStore());
    const { getPostList, remove } = usePostStore();
    getPostList();

    watch(search, debounce(() => { getPostList(); }, 300));
    watch(selected_show_entry, debounce(() => { getPostList(); }, 300));
    
    let sortByColumn = (column) => {
        if (column === sort_column.value) {
            sort_order.value = sort_order.value === "asc" ? "desc" : "asc";
        } else {
            sort_column.value = column;
            sort_order.value = "asc";
        }
        getPostList();
    }

    let changePage = (page) => {
        current_page.value = page
        getPostList();
    }

    let deleteModalToggle = (id) => {
        post_delete.show_modal = true;
        post_delete.post_id = id;
    }

    let deleteCourse = async () => {
        post_delete.show_close_icon = false;
        await remove(post_delete.post_id);
        post_delete.show_modal = false;
        post_delete.show_close_icon = true;
    }

</script>

<template>
    <div class="main-content">
        <div class="page-content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <div
                            class="
                            page-title-box
                            d-sm-flex
                            align-items-center
                            justify-content-between
                            "
                        >
                            <h4 class="mb-sm-0 font-size-18">Posts List</h4>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xl-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="row mb-2">
                                    <div class="col-sm-12 col-md-6">
                                        <ListHeaderShowEntry v-model:selected_show_entry="selected_show_entry"/>
                                    </div>
                                    <div class="col-sm-12 col-md-6 text-end">
                                        <router-link :to="{name: 'addPost'}" class="btn btn-primary">Add</router-link>
                                        <ListHeaderSearch v-model:search="search"/>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xl-12">
                                        <table
                                            class="
                                            table table-responsive table-bordered
                                            mb-0
                                            dataTable
                                            table-fixed
                                            "
                                        >
                                            <thead class="table-light">
                                                <tr>
                                                    <th
                                                        v-for="column in post_table.columns"
                                                        :key="column.id"
                                                        @click="sortByColumn(column.id)"
                                                        class="sorting"
                                                        :class="[(column.id === sort_column)?(sort_order == 'asc')?'sorting_asc':'sorting_desc':'']"
                                                        >
                                                        {{ column.text }}
                                                    </th>
                                                    <th>ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody v-if="posts.data && posts.data.length > 0">
                                                <tr v-for="(post, index) in posts.data" :key="index">
                                                    <td>{{ post.title }}</td>
                                                    <td>{{ post.content }}</td>
                                                    <td>
                                                        <span v-for="(cate,index) in post.category" :key="index">
                                                            {{cate.name}}{{
                                                            post.content.length-1 != index
                                                                ? ",":''
                                                            }}
                                                        </span>
                                                    </td>
                                                    <td>{{ ConvertDateTimeToLocal(post.created_at, 'MM/DD/YYYY hh:mm A') }}</td>
                                                    <td>
                                                        <router-link title="Edit" :to="{ name: 'editPost', params: { slug: post.slug }}" class="btn btn-primary waves-effect waves-light"><i class="bx bx-edit font-size-18 align-middle me-0"></i></router-link>
                                                        <button title="Delete" type="button"  @click="deleteModalToggle(post.id)" class="btn btn-danger waves-effect waves-light"><i class="bx bx-trash font-size-18 align-middle me-0"></i></button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody v-else>
                                                <tr>
                                                    <td colspan="6" class="text-center">
                                                    No records available!
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-xl-12">
                                        <ListFooterShowTotal 
                                            v-if="posts.data && posts.data.length > 0"
                                            :list = "posts"
                                        />
                                        <ListFooterPagination
                                            v-if="posts.data && posts.data.length > 0"
                                            :list = "posts"
                                            @change-page="changePage"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Teleport to="div">
        <Modal :show="post_delete.show_modal" :show_close_icon="post_delete.show_close_icon" @close-modal="post_delete.show_modal = false">
            <template #header>
                <div class="text-center">
                    <i class="bx bx-error-circle text-muted display-2"></i>
                </div>
            </template>
            <template #default>
                <p class="text-center mb-2 mt-2 fs-6">Are you sure you want to delete this Course? Once deleted you will not be able to recover information. </p>
            </template>
            <template #footer>
                <button
                type="button"
                class="btn btn-danger"
                data-dismiss="modal"
                @click="post_delete.show_modal = false"
                :disabled="!post_delete.show_close_icon"
                >
                NO
                </button>
                <button 
                type="button" 
                class="btn btn-primary ms-2" 
                :disabled="!post_delete.show_close_icon"
                @click="deleteCourse"
                >
                YES
                </button>
            </template>
        </Modal>
    </Teleport>
</template>

<style scoped>
</style>