<script lang="ts" setup>
import { toast } from "vue-sonner";
import { handleError } from "~/lib/handle-error";
import { handleSuccess } from "~/lib/handle-success";
import type { Profile } from "~/services/auth/dto/profile.dto";
import type { RegisterUser } from "~/services/user/dto/register-user.dto";
import { UserService } from "~/services/user/user.service";

const props = defineProps<{
  caption: string;
  user?: Profile;
  callback?: () => any;
}>();

const open = ref(false);
const params = ref<RegisterUser>({
  id: 0,
  name: "",
  user_id: "",
  email: "",
  phone: "",
  role: "user",
  created_at: new Date(),
  password: "12345678",
});

function handleUser() {
  if (props.user) {
    params.value.id = props.user.id;
    params.value.name = props.user.name;
    params.value.user_id = props.user.user_id;
    params.value.email = props.user.email;
    params.value.role = props.user.role;
    params.value.phone = props.user.phone;
    params.value.created_at = props.user.created_at;
  }
}

watch(() => props.user, handleUser);

async function handleSubmit() {
  try {
    let message = "";

    if (props.user) {
      const data = await UserService.update(params.value);
      message = data.message;
    } else {
      const data = await UserService.store(params.value);
      message = data.message;
    }

    handleSuccess(message);

    open.value = false;
    if (props.callback) {
      props.callback();
    }
  } catch (err: any) {
    handleError(err);
  }
}

onMounted(() => {
  handleUser();
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot></slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <form @submit.prevent="handleSubmit">
        <DialogHeader>
          <DialogTitle>{{ caption }}</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="" class="text-right">Nama</Label>
            <Input
              class="col-span-3"
              required
              placeholder="Masukkan Nama"
              v-model="params.name"
            ></Input>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="" class="text-right">Role</Label>
            <RoleSelect v-model="params.role"></RoleSelect>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="" class="text-right">Phone</Label>
            <Input
              class="col-span-3"
              required
              placeholder="Masukkan Nomor Telepon"
              v-model="params.phone"
            ></Input>
          </div>
          <template v-if="!user">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="" class="text-right">Email</Label>
              <Input
                type="email"
                class="col-span-3"
                required
                placeholder="Masukkan Email"
                v-model="params.email"
              ></Input>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="" class="text-right">Password</Label>
              <Input
                type="text"
                class="col-span-3"
                required
                placeholder="Masukkan Password"
                v-model="params.password"
              ></Input>
            </div>
          </template>
        </div>
        <DialogFooter>
          <Button type="submit" class="cursor-pointer"> Simpan Profil </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
