<script setup>
    defineProps(['search'])
    defineEmits(['update:search'])

    const handleInputChange = (event) => {
        return (event.target).value
    }
</script>
<template>
    <label
        ><span>Search:</span
        ><input
        type="text"
        class="
            form-control form-control-sm
            d-inline-block
            w-auto
            ms-2
        "
        :value="search"   
        @input="$emit('update:search', handleInputChange($event))"                         
        placeholder="Search"
    /></label>
</template>
