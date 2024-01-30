<script setup>
import { reactive } from "vue";
import { storeToRefs } from "pinia";
import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { useAuthStore } from '../../stores/auth';

    const { email, password } = storeToRefs(useAuthStore());
    const { login } = useAuthStore();
    let login_form = reactive({
        email: email,
        password: password,
    });

    let login_form_rules = {
        email: { 
            required : helpers.withMessage('Please enter a Email', required)
        },
        password: { 
            required : helpers.withMessage('Please enter a Password', required)
        },
    }
    const v$ = useVuelidate(login_form_rules, login_form);

    let signIn = async() => {
        const is_valid = await v$.value.$validate();
        if (is_valid) { await login(); }
    }
</script>

<template>
    <div class="container">
        <div class="card">
            <form @submit.prevent="signIn">
                <div class="row mb-4" :class="{ 'form-group--error': v$.email.$errors.length }">
                    <input type="email" name="email" placeholder="Email" :class="{ 'border-danger': v$.email.$errors.length }" v-model.trim="login_form.email">
                    <div v-for="error of v$.email.$errors" :key="error.$uid">
                        <div class="form-error-text">{{ error.$message }}</div>
                    </div>
                </div>
                <div class="row mb-4" :class="{ 'form-group--error': v$.password.$errors.length }">
                    <input type="password" name="password" placeholder="Password" :class="{ 'border-danger': v$.password.$errors.length }" v-model.trim="login_form.password">
                    <div v-for="error of v$.password.$errors" :key="error.$uid">
                        <div class="form-error-text">{{ error.$message }}</div>
                    </div>
                </div>
                <div class="buttons">
                    <router-link :to="{name : 'register'}" class="btn register-button">Register</router-link>
                    <button type="submit" class="login-button">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
body {
    margin: 0;
    padding: 0;
    background: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.card {
    width: 300px;
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    border-top: 4px solid #f6226f;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input {
    padding: 10px;
    border: none;
    background-color: transparent;
    border-bottom: 1px solid #ccc;
    color: #333;
}

.buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.login-button {
    padding: 10px 20px;
    background-color: #f6226f;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.register-button {
    padding: 10px 20px;
    background-color: #fff;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
}

@media (max-width: 480px) {
    .card {
        width: 100%;
        max-width: 300px;
    }
}
</style>