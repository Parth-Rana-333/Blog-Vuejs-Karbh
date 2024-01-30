import { defineStore } from "pinia";
import axios from 'axios';
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import toastr from "toastr";
toastr.options.preventDuplicates = true;

export const useAuthStore = defineStore('auth', () => {
    // state
    const token = localStorage.getItem('token') ? ref(localStorage.getItem('token')) : ref(0);
    const first_name = ref(null);
    const last_name = ref(null);
    const email = ref(null);
    const password = ref(null);
    const password_confirmation = ref(null);
    const router = useRouter();
    const route = useRoute();
    const posts_all = ref([]);
    const selected_show_entry = ref(10)
    const search = ref("")
    const sort_column = ref("created_at")
    const sort_order = ref("desc")
    const current_page = ref(1)
    const post_details = ref({});


    // getters
    const authenticated =  computed(() => {
        return !!token.value ;
    });
    const getToken = computed(() => {
        return token.value;
    });
    const getPostsAll = computed(() => { return posts_all });

    // action
    const login = async() => {
        try {
            await axios.post('login', {
                email: email.value,
                password: password.value
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
                    const data = response['data']['data'];
                    setToken(data.token);
                    getUser();
                    router.push({name: 'home'});
                }
            }).catch((errors) => {
                toastr.error(errors.response["data"]["message"], "Error");
            }).then(()=>{});
        } catch(errors) {
            console.log(errors);
        }
        finally{ console.log('success'); }
    }
    const setToken = (user_token) => {
        token.value = user_token;
    }
    const removetoken = () => {
        localStorage.removeItem("token");
        token.value = 0;
    }

    const register = async() => {
        try {
            await axios.post('register', {
                first_name: first_name.value,
                last_name: last_name.value,
                email: email.value,
                password: password.value,
                password_confirmation: password_confirmation.value,
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
                    router.push({name: 'login'});
                }
            }).catch((errors) => {
                toastr.error(errors.response["data"]["message"], "Error");
            }).then(()=>{});
        } catch(errors) {
            console.log(errors);
        } finally { console.log('success'); }
    }

    const logout = async() => {
        try {
            axios.post('logout').then((response) => {
                if (response["data"]["status"] == "Error") {
                    if(response["data"]['data'].length > 0){
                        toastr.error(response["data"]['data'].join('</br>'), "Error");
                    }else{
                        toastr.error(response["data"]["message"], "Error");
                    }
                } else {
                    toastr.success(response["data"]["message"], "Success");
                    removetoken();
                    resetForm()
                    router.push({name: 'login'})
                }
            }).catch((errors) => {
                toastr.error(errors.response["data"]["message"], "Error");
            }).then(()=>{});
        } catch (errors) {
            console.log(errors);
        } finally { console.log('success'); }
    }

    const getUser = async() => {
        try {
            await axios.get('user')
            .then((response) => {
                if (response["data"]["status"] == "Error") {
                    if(response["data"]['data'].length > 0){
                        toastr.error(response["data"]['data'].join('</br>'), "Error");
                    }else{
                        toastr.error(response["data"]["message"], "Error");
                    }
                } else {
                    const data = response.data;
                    localStorage.setItem("user", JSON.stringify(data))
                }
            }).catch((errors) => {
                toastr.error(errors.response["data"]["message"], "Error");
            }).then(()=>{})
        } catch(errors) {
            console.log(errors);
        } finally{ console.log('finnaly'); }
    }

    const resetForm = () => {
        first_name.value = null
        last_name.value = null
        email.value = null
        password.value = null
    }

    const getAllPosts = async() => {
        posts_all.value = [];
        try {
            await axios.get("get-all-post", {
                params: {
                    search: search.value,
                }})
                .then((response) => {
                    posts_all.value = response['data']['data'];
                });
        } catch(error) {
            console.log(error);
        } finally{ }
    }

    const getPostById = () => {
        try {
            axios.get(`get-post-by-id/${route.params.slug}`)
            .then((response) => {
                const data = response.data.data;
                post_details.value = data
            })
            .catch((errors) => {
                toastr.error(Object.values(errors).join('</br>'), "Error");
            })
            .then(()=>{})
        } catch(errors) {
            if(errors.response.status == 401) {
                localStorage.removeItem('token');
                router.push({name: 'login'});
            }
        } finally{}
    }

    return { login, register, logout, getUser, getAllPosts, getPostById, post_details, authenticated, getToken, first_name, last_name, email, password, password_confirmation, posts_all };
});
