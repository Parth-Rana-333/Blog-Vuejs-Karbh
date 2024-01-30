<script setup>
import { usePostStore } from '../stores/postStore';
import { storeToRefs } from "pinia";

  const { comment } = storeToRefs(usePostStore())
  const { addComment } = usePostStore()

  const saveComment = () => {
    addComment();
  }
</script>
  
<template>
  <div>
    <div class="form">
      <form @submit.prevent="saveComment">
        <div class="form__group">
          <label>Leave a comment</label>
          <textarea v-model="comment" rows="5" required cols="50" placeholder="type in your comment" />
          <button>Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>
  
<style scoped>
.form {
  margin-top: 1.5em;
}
label {
  display: block;
  margin-bottom: 1em;
  font-weight: 700;
  font-family: Padauk, sans-serif;
}
textarea {
  width: 100%;
  margin-top: 0.5em;
}
button {
  border: unset;
  background: #79b791;
  color: #230c0f;
  font-weight: 700;
  padding: 1em 2.5em;
  margin-top: 1em;
}
</style>