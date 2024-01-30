<script setup>
import { reactive } from "vue";
import { storeToRefs } from "pinia";
import useVuelidate from '@vuelidate/core'
import { required, helpers, minLength, sameAs } from '@vuelidate/validators'
import { useAuthStore } from '../../stores/auth';

    const { first_name, last_name, email, password, password_confirmation } = storeToRefs(useAuthStore());
    const { register } = useAuthStore();
    let register_form = reactive({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        password_confirmation: password_confirmation
    });

    let register_form_rules = {
        first_name: {
            required : helpers.withMessage('Please enter a First Name', required)
        },
        last_name: {
            required : helpers.withMessage('Please enter a Last Name', required)
        },
        email: { 
            required : helpers.withMessage('Please enter a Email', required)
        },
        password: { 
            required: helpers.withMessage('Please enter a Password', required),
            minLength: minLength(8)
        },
        password_confirmation: {
            required: helpers.withMessage('Please enter a Password Confirmation', required),
            sameAsPassword: sameAs(password)
        }
    }
    const v$ = useVuelidate(register_form_rules, register_form);

    let signUp = async() => {
        const is_valid = await v$.value.$validate();
        if (is_valid) { await register(); }
    }
</script>

<template>
    <div class="container">
        <div class="card">
            <form @submit.prevent="signUp">
                <div class="row mb-4" :class="{ 'form-group--error': v$.first_name.$errors.length }">
                    <input type="text" name="first_name" placeholder="First Name" :class="{ 'border-danger': v$.first_name.$errors.length }" v-model.trim="register_form.first_name">
                    <div v-for="error of v$.first_name.$errors" :key="error.$uid">
                        <div class="form-error-text">{{ error.$message }}</div>
                    </div>
                </div>
                <div class="row mb-4" :class="{ 'form-group--error': v$.last_name.$errors.length }">
                    <input type="text" name="last_name" placeholder="Last Name" :class="{ 'border-danger': v$.last_name.$errors.length }" v-model.trim="register_form.last_name">
                    <div v-for="error of v$.last_name.$errors" :key="error.$uid">
                        <div class="form-error-text">{{ error.$message }}</div>
                    </div>
                </div>
                <div class="row mb-4" :class="{ 'form-group--error': v$.email.$errors.length }">
                    <input type="email" name="email" placeholder="Email" :class="{ 'border-danger': v$.email.$errors.length }" v-model.trim="register_form.email">
                    <div v-for="error of v$.email.$errors" :key="error.$uid">
                        <div class="form-error-text">{{ error.$message }}</div>
                    </div>
                </div>
                <div class="row mb-4" :class="{ 'form-group--error': v$.password.$errors.length }">
                    <input type="password" name="password" placeholder="Password" :class="{ 'border-danger': v$.password.$errors.length }" v-model.trim="register_form.password">
                    <div v-for="error of v$.password.$errors" :key="error.$uid">
                        <div class="form-error-text">{{ error.$message }}</div>
                    </div>
                </div>
                <div class="row mb-4" :class="{ 'form-group--error': v$.password_confirmation.$errors.length }">
                    <input type="password" name="password_confirmation" placeholder="Password Confirmation" :class="{ 'border-danger': v$.password_confirmation.$errors.length }" v-model.trim="register_form.password_confirmation">
                    <div v-for="error of v$.password_confirmation.$errors" :key="error.$uid">
                        <div class="form-error-text">{{ error.$message }}</div>
                    </div>
                </div>
                <div class="buttons">
                    <router-link :to="{name : 'login'}" class="btn register-button">Login</router-link>
                    <button type="submit" class="login-button">Register</button>
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