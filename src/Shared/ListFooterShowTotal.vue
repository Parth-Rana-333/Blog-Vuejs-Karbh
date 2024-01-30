<script setup>
    const props = defineProps({
        "list": Object
    })
</script><template>
    <div class="d-flex justify-content-between">
        <p class="m-0">Showing {{props.list.from}} to {{props.list.to}} of {{props.list.total}} entries</p>
    </div>
</template>
