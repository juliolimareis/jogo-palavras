<template>
  <div class="container mx-auto px-14 max-w-md mt-10">
    <Header>
      Takopi
    </Header>

    <div class="grid grid-cols-1 gap-4 mt-16">
      <Button @click="useRouter().push('/create-game')">
        Criar Sala
      </Button>
      <Button>Entrar</Button>
      <Button>Como Jogar</Button>
    </div>
  </div>
</template>