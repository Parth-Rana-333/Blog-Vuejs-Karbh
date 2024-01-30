import { defineStore, storeToRefs } from 'pinia';
import axios from 'axios';
import { computed, ref } from 'vue';
import toastr from "toastr";
toastr.options.preventDuplicates = true;
import { useRoute, useRouter } from "vue-router";
import _ from 'lodash';

export const usePostStore = defineStore('post', () => {
    // state
    const posts = ref([]);
    const selected_show_entry = ref(10)
    const search = ref("")
    const sort_column = ref("created_at")
    const sort_order = ref("desc")
    const current_page = ref(1)
    const id = ref(null)
    const title = ref("")
    const content = ref("")
    let category = ref([]);
    let categories_id = ref([])
    const tagInput = ref([]);
    const tags = ref([]);
    let image = ref({});
    let file = ref({});
    let comment = ref('');

    const route = useRoute();
    const router = useRouter();
    const user = JSON.parse(localStorage.getItem("user"))

    // getters
    const getPosts = computed(() => { return posts });

    // actions 
    const getPostList = async() => {
        posts.value = [];
        try {
            await axios.get("posts", {
                params: {
                    search: search.value,
                    selected_show_entry: selected_show_entry.value,
                    page: current_page.value,
                    sort_column: sort_column.value,
                    sort_order: sort_order.value,
                }})
                .then((response) => {
                    posts.value = response['data']['data'];
                });
        } catch(error) {
            console.log(error);
        } finally{ }
    }

    let getCategories = async() => {
        category.value = []
        try {
            await axios.get('posts/get-category-post')
            .then((response) => {
                if(response.data.status = "Success") {
                    category.value = response['data']['data'];
                }
            })
            .catch((error) => {
                toastr.error(Object.values(error).join("</br>"), "Error");
            })
            .finally(() => {})
        } catch(errors) { 
            if(errors.response.status == 401) {
                localStorage.removeItem('token');
                router.push({name: 'login'});
            }
        }
        finally{ };
    }

    const add = async() => {
        try {
            const selected_cat = categories_id.value.map((cat) => cat.id );
            const post_tags = tags.value.map((tag) => tag.name );

            const post_add_form = new FormData();
            post_add_form.append('user_id', user.id)
            post_add_form.append('title', title.value)
            post_add_form.append('content', content.value)
            post_add_form.append('tags', post_tags)
            post_add_form.append("image", image.value);
            post_add_form.append("categories_id", selected_cat)

            await axios.post("posts/add-post", post_add_form)
                .then((response) => {
                    if (response["data"]["status"] == "Error") {
                        if(response["data"]['data'].length > 0){
                            toastr.error(response["data"]['data'].join('</br>'), "Error");
                        }else{
                            toastr.error(response["data"]["message"], "Error");
                        }
                    } else {
                        toastr.success(response["data"]["message"], "Success");
                        formReset();
                        router.push({name: 'posts'});
                    }
                })
                .catch((error) => {
                    toastr.error(error.response["data"]["message"], "Error");
                    if(error.response.status == 401) {
                        localStorage.removeItem('token');
                        router.push({name: 'login'});
                    }
                }).then(()=>{})
        } catch(errors) {
            console.log(errors);
        } finally{ }
    }

    const getPostDetails = async() => {
        axios.get(`posts/edit/${route.params.slug}`)
        .then((response) => {
            const data = response.data.data;
            id.value = data.id
            title.value = data.title
            content.value = data.content
            image.value = data.image
            categories_id.value = data.category
        })
        .catch((errors) => {
            toastr.error(Object.values(errors).join('</br>'), "Error");
        })
        .then(()=>{})
    }

    const update = async() => {
        try {
            const post_update_form = new FormData();
            post_update_form.append('id', id.value)
            post_update_form.append('tile', title.value)
            post_update_form.append('content', content.value)
            if (!isEmpty(file.value)) {
                post_update_form.append('image', file.value);
            }

            axios.post("posts/update-post", post_update_form)
            .then((response) => {
                if(response['data']['status'] == "Success") {
                    toastr.success(response["data"]["message"], "Success");
                    formReset();
                    router.push({name: 'posts'});
                }
            })
            .catch((error) => {
                toastr.error(error.response["data"]["message"], "Error");
            })
            .then(()=>{})
        } catch(errors) { console.log(errors); }
        finally { } 
    }

    const remove = async(post_id) => {
        try {
            await axios.post('posts/post-delete', {
                'post_id': post_id
            })
            .then((response) => {
                if (response["data"]["status"] == "Error") {
                    if(response["data"]['data'].length > 0){
                        toastr.error(response["data"]['data'].join('</br>'), "Error");
                    }else{
                        toastr.error(response["data"]["message"], "Error");
                    }
                } else {
                    setTimeout(() => {
                        const found_index = _.findIndex(posts.value['data'], function(o) { return o.id === post_id; });
                        if(found_index >= 0){
                            posts.value.data.splice(found_index, 1);
                        }
                        toastr.success(response["data"]["message"], "Success");
                    }, 100);
                }
            });
        } catch(errors) { console.log(errors); } 
        finally{ }
    }

    const addComment = async() => {
        try {
            await axios.post('posts/add-comment-post', {
                'slug': route.params.slug,
                'comment': comment.value
            })
            .then((response) => {
                if (response["data"]["status"] == "Error") {
                    if(response["data"]['data'].length > 0){
                        toastr.error(response["data"]['data'].join('</br>'), "Error");
                    }else{
                        toastr.error(response["data"]["message"], "Error");
                    }
                } else {
                    toastr.success(response["data"]["message"], "Success");
                    comment.value = ''
                }
            });
        } catch(errors) { console.log(errors); } 
        finally{ }
    }
        
    function formReset() {
        title.value = "";
        content.value = "";
        image.value = {};
        categories_id.value = []
        tags.value = [];
    }

    return { posts, selected_show_entry, sort_column, sort_order, current_page, search, id, title, content, categories_id, tags, category, image, getPostList, add, remove, update, getPostDetails, getCategories, getPosts, tagInput, comment, addComment};
});
