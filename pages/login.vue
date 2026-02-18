<template>
  <div>
    <!-- Formulário de Login com largura máxima controlada -->
    <div class="container mx-auto px-4 mt-10 mb-10 max-w-2xl max-xl:px-8">
      <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-16">
        <h2 class="font-cursive text-3xl font-bold text-center text-blue-800 mb-8">
          Login
        </h2>

        <form novalidate @submit.prevent="onLogin">
          <!-- Mensagem de Erro -->
          <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span class="block sm:inline">{{ errorMessage }}</span>
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-700"
              placeholder="player@exemple.com"
              required
            >
          </div>

          <!-- Senha -->
          <div class="mb-6">
            <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password:</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-700"
              placeholder="******************"
              required
            >
            <!-- <a href="#" class="text-sm text-blue-700 hover:text-blue-800">Esqueceu a senha?</a> -->
          </div>

          <!-- Botão de Login -->
          <div class="flex items-center justify-center mb-4">
            <button class="w-full px-6 py-3 bg-blue-800 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800 font-bold" type="submit" :disabled="isLoading">
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref("");
const password = ref("");
const errorMessage = ref<string | null>(null);
const isLoading = ref(false);

const { $onLogin } = useNuxtApp();

const onLogin = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    await $onLogin(email.value, password.value);
    navigateTo("/");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Erro no login:", error.code);
    switch (error.code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      errorMessage.value = "Email ou senha inválidos.";
      break;
    default:
      errorMessage.value = "Ocorreu um erro ao tentar fazer login.";
    }
  } finally {
    isLoading.value = false;
  }
};

</script>