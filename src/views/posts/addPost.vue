<script setup>
import { reactive } from "vue";
import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { usePostStore } from "../../stores/postStore";
import { storeToRefs } from "pinia";
import Multiselect from 'vue-multiselect'
import _ from "lodash";

    const { title, content, categories_id, category, tagInput, tags, image } = storeToRefs(usePostStore());
    const { add, getCategories } = usePostStore()
    getCategories();
    let post_add_form = reactive({
        categories_id: categories_id,
        title : title,
        content: content,
        image: image,
    });

    let post_add_form_rules = {
        title: { 
            required : helpers.withMessage('Please enter a post title', required)
        },
        content: { 
            required : helpers.withMessage('Please enter a content', required)
        },
        categories_id: {
            required: helpers.withMessage("Please select a categories", required),
        },
        image: {
            required: helpers.withMessage("Please select profile image", required),
        },
    }
    const v$ = useVuelidate(post_add_form_rules, post_add_form);

    let addPost = async () => {
        const is_valid = await v$.value.$validate();
        if (is_valid) { await add(); }
    }

    let onChange = (e) => {
        post_add_form.image = e.target.files[0];
    }

    let addTag = (newTag) => {
        const tag = {
            name: newTag,
            code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
        }
        tagInput.value.push(tag)
        tags.value.push(tag)
    }


</script>

<template>
    <div class="main-content">
        <div class="page-content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 class="mb-sm-0 font-size-18">Add New Post</h4>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xl-12">
                        <div class="card">
                            <div class="card-body">
                                <form @submit.prevent="addPost">
                                    <div class="row mb-4" :class="{ 'form-group--error': v$.title.$errors.length }">
                                        <label for="horizontal-firstname-input" class="col-sm-2 col-form-label text-end">Title</label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control" placeholder="Enter Title" :class="{ 'border-danger': v$.title.$errors.length }" id="horizontal-firstname-input" v-model.trim="post_add_form.title">
                                            <div v-for="error of v$.title.$errors" :key="error.$uid">
                                                <div class="form-error-text">{{ error.$message }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mb-4" :class="{ 'form-group--error': v$.content.$errors.length }">
                                        <label for="horizontal-lastname-input" class="col-sm-2 col-form-label text-end">Content</label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" placeholder="Enter Content" :class="{ 'border-danger': v$.content.$errors.length }" id="horizontal-lastname-input" v-model.trim="post_add_form.content" />
                                            <div v-for="error of v$.content.$errors" :key="error.$uid">
                                                <div class="form-error-text">{{ error.$message }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mb-4" :class="{ 'form-group--error': v$.image.$errors.length }">
                                        <label for="horizontal-email-input" class="col-sm-2 col-form-label text-end">Image : </label>
                                        <div class="col-sm-8">
                                            <input type="file" v-on:change="onChange" class="form-control" :class="{'border-danger': v$.image.$errors.length}" />
                                            <div v-for="error of v$.image.$errors" :key="error.$uid">
                                                <div class="form-error-text">{{ error.$message }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mb-4" :class="{'form-group--error': v$.categories_id.$errors.length }">
                                        <label class="col-sm-2 col-form-label text-end">Select Category : </label>
                                        <div class="col-sm-8">
                                            <Multiselect
                                                v-model="v$.categories_id.$model"
                                                :options="category"
                                                track-by="id"
                                                label="name"
                                                placeholder="Select Categories"
                                                :class="{'border-danger': v$.categories_id.$errors.length}"
                                                :multiple="true"
                                                :allow-empty="false"
                                                :searchable="true"
                                                :showLabels="false"
                                                :taggable="false"
                                            >
                                                <template #noResult>
                                                    <div class="multiselect__noResult text-center">
                                                        No results found
                                                    </div>
                                                </template>
                                                <template #noOptions>
                                                    <div class="multiselect__noOptions text-center">
                                                        No data available
                                                    </div>
                                                </template>
                                            </Multiselect>
                                            <div v-for="error of v$.categories_id.$errors" :key="error.$uid">
                                                <div class="form-error-text">{{ error.$message }}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row mb-4">
                                        <label class="col-sm-2 col-form-label text-end">Select Tag : </label>
                                        <div class="col-sm-8">
                                            <Multiselect
                                                v-model="tags"
                                                :options="tagInput"
                                                track-by="code"
                                                label="name"
                                                tag-placeholder="Add this as new tag"
                                                placeholder="Type to search or add tag"
                                                :multiple="true"
                                                :taggable="true"
                                                @tag="addTag"
                                            >
                                                <template #noResult>
                                                    <div class="multiselect__noResult text-center">
                                                        No results found
                                                    </div>
                                                </template>
                                                <template #noOptions>
                                                    <div class="multiselect__noOptions text-center">
                                                        No data available
                                                    </div>
                                                </template>
                                            </Multiselect>
                                            <div v-for="error of v$.categories_id.$errors" :key="error.$uid">
                                                <div class="form-error-text">{{ error.$message }}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-2">
                                        </div>
                                        <div class="col-sm-8">
                                            <div>
                                            <router-link
                                                as="button"
                                                :to="{name: 'posts'}"
                                                class="btn btn-danger w-md me-2"
                                                type="button"
                                            >
                                                CANCEL
                                            </router-link>
                                            <button type="submit" class="btn btn-primary w-md">ADD</button>
                                            </div>
                                        </div>
                                    </div>
                                </form> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped>
.tags-container {
  display: flex;
  flex-wrap: wrap;
}

.tag {
  margin-right: 8px;
  margin-bottom: 8px;
  padding: 4px 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.tag button {
  margin-left: 4px;
  cursor: pointer;
}
</style>