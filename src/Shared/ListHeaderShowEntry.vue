<script setup>
    import { reactive } from "vue";
    let data = reactive({
        show_entry_list : [10, 25, 50, 100],
    })
    defineProps(['selected_show_entry'])
    defineEmits(['update:selected_show_entry'])

    const handleInputChange = (event) => {
        return (event.target).value
    }
      
</script>

<template>
    <label
        >Show
        <select
        :value="selected_show_entry"
        @change="$emit('update:selected_show_entry', handleInputChange($event))"
        class="
            custom-select custom-select-sm
            form-control
            form-control-sm
            form-select
            form-select-sm
            d-inline-block
            w-auto
            ms-2
            me-2
        "
        >
        <option :value="entry" v-for="entry in data.show_entry_list" :key="entry">{{entry}}</option>
        </select>
        entries
    </label>
</template>
