<template>
  <div class="w-full h-screen items-center flex flex-col justify-center overflow-hidden" :style="{
    backgroundImage: 'url(https://github.com/juliolimareis/jogo-palavras/blob/main/assets/images/cover.jpg?raw=true)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  }">


    <div class=" mx-auto ">
      <Card class="p-4 bg-[#FFFFFF] shadow shadow-lg md:w-[450px]">
        <Header>
          Takopi
          <div class="h-1 w-[45px] bg-blue-400 rounded-full mx-auto mt-2"></div>
        </Header>

        <Subtitle class="m-4">
          Criar Sala
        </Subtitle>

        <ul class="text-center w-max-[300px]">
          <li v-for="error in errors" class="text-red-600">
            - {{ error }}
          </li>
        </ul>

        <div class="grid grid-cols-1 gap-4 mx-3 mt-5 items-center">
          <div class="m-auto w-full">



            <NumberField id="players" :default-value="10" :min="2" :max="10" v-model="roomData.maxPlayers">
              <Label for="players">Número máximo de Jogadores</Label>
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>

          </div>

          <div class="m-auto w-full">
            <NumberField id="rounds" :default-value="10" :min="1" :max="10" v-model="roomData.maxRounds">
              <Label for="rounds">Rodadas</Label>
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>

          </div>

          <div class="m-auto w-full">
            <NumberField id="timeRounds" :default-value="10" :min="1" :max="5" v-model="roomData.roundTimeout">
              <Label for="timeRounds">Tempo por rodada em
                minutos</Label>
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>


          </div>

          <div class="m-auto w-full">
            <Label for="rounds" class="w-full ">Idioma</Label>
            <Select v-model="roomData.type" class="hover:cursor-pointer ">
              
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Idioma" />
              </SelectTrigger>
              <SelectContent class="bg-[#FFFFFF]  duration-400 ">
                <SelectGroup class="hover:cursor-pointer">

                  <SelectItem value="pt" class="hover:cursor-pointer">
                    Português
                  </SelectItem>
                  <SelectItem value="en" class="hover:cursor-pointer">
                    English
                  </SelectItem>
                  <SelectItem value="jp" class="hover:cursor-pointer">
                    日本語
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>



          </div>
          <div class="w-full text-center mt-10 items-center justify-center">
            <Button :disabled="isLoading" @click="onCreate" class="w-full hover:scale-105 hover:bg-blue-500 transition">
              {{ isLoading ? 'Criando ...' : 'Criar Sala' }}
            </Button>

          </div>
        </div>


      </Card>
    </div>

  </div>

</template>

<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const { /*$io*/ $idUser } = useNuxtApp();

const errors = ref<string[]>([]);

const isLoading = ref(false);
const linkRoom = ref("");
const roomData = ref<RoomData>({
  id: "create",
  maxRounds: 3,
  maxPlayers: 2,
  roundTimeout: 3,
  idAdmin: $idUser,
  type: "pt"
});

onMounted(() => {
  // $io.on("create-room", (res: { idRoom: number, message: string, isCreated: boolean }) => {
  //   if(res.isCreated){
  //     window.location.replace(`/room/${res.idRoom}`);
  //   }else{
  //     linkRoom.value = `/room/${res.idRoom}`;
  //   }
  // });

  // checkPlayerRoom($idUser).then(res => {
  //   if(res?.isInRoom && res?.idRoom){
  //     linkRoom.value = `/room/${res.idRoom}`;
  //   }
  // });
});

function validate() {
  const { maxRounds, maxPlayers, roundTimeout } = roomData.value;

  errors.value = [];

  if (!maxPlayers || maxPlayers < 2) {
    errors.value.push("Número máximo de jogadores é inválido");
  }

  if (!maxRounds) {
    errors.value.push("Número de rodadas é inválido");
  }

  if (!roundTimeout) {
    errors.value.push("Tempo da rodada é inválido");
  }

  if (maxRounds > 10) {
    errors.value.push("Número máximo de rodadas deve ser menor que 10");
  }

  if (maxPlayers > 10) {
    errors.value.push("Número máximo de players deve ser menor que 10");
  }

  if (roundTimeout > 5) {
    errors.value.push("Número máximo de minutos por turno deve ser menor que 5");
  }

  return errors.value;
}

const onCreate = () => {
  if (validate().length) return;

  isLoading.value = true;

  // $io.emit("create-room", roomData.value);

  // createRoom(roomData.value).then((res) => {
  //   if(res.body?.idRoom){
  //     window.location.replace(`/room/${res.body.idRoom}`);
  //   }
  // });
};

</script>