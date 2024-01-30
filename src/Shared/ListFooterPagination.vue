<script setup>
const emit = defineEmits(['change-page'])
const props = defineProps({
    "list": Object
})
let paginationClass = (pagination_item) => {
    if(pagination_item.label.includes('Previous')){
        return (props.list.current_page == 1)?'disabled':'';
    }else if(pagination_item.label.includes('Next')){
        return (props.list.current_page == props.list.last_page)?'disabled':'';
    }else if(pagination_item.label.includes('...')){
        return 'disabled';  
    }else{
        return (props.list.current_page == parseInt(pagination_item.label))?'active':'';
    }
};
let changePage = (page) => {
    if(props.list.current_page != page){
        emit('change-page', page)
    }else{
        return false;
    }
};
</script>

<template>
    <nav>
        <ul class="pagination justify-content-end m-0">
        <li
        class="page-item"  
        v-for="(pagination_item, index) in props.list.links" :key="index"
        :class="paginationClass(pagination_item)"
        >
        <a
        v-if="pagination_item.label.includes('Previous')"
        class="page-link"
        @click="changePage(props.list.current_page - 1)"
        href="javascript:void(0)"
        v-html="pagination_item.label"
        >                              
        </a>
        <a
        v-else-if="!pagination_item.label.includes('Previous') && !pagination_item.label.includes('Next')"
        class="page-link"
        @click="changePage(parseInt(pagination_item.label))"
        href="javascript:void(0)"
        v-html="pagination_item.label"
        >                              
        </a>
        <a
        v-else
        class="page-link"
        @click="changePage(props.list.current_page + 1)"
        href="javascript:void(0)"
        v-html="pagination_item.label"
        >                              
        </a>
        </li>
        </ul>
    </nav>
</template>

