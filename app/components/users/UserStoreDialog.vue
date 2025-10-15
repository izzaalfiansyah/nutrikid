<script lang="ts" setup>
import { Loader2 } from "lucide-vue-next";
import { date } from "~/lib/format-date";
import { handleError } from "~/lib/handle-error";
import { handleSuccess } from "~/lib/handle-success";
import type { RegisterUser } from "~/services/user/dto/register-user.dto";
import { UserService } from "~/services/user/user.service";

const props = defineProps<{
  caption: string;
  user?: Profile;
  callback?: () => any;
}>();

const authStore = useAuthStore();

const open = ref(false);
const is_submitted = ref(false);
const params = ref<RegisterUser>({
  id: 0,
  name: "",
  username: "",
  phone: "",
  role: "teacher",
  created_at: date(),
  school_id: undefined,
  password: "12345678",
});

function handleUser() {
  params.value.id = props.user?.id || 0;
  params.value.name = props.user?.name || "";
  params.value.username = props.user?.username || "";
  params.value.role = props.user?.role || "teacher";
  params.value.phone = props.user?.phone || "";
  params.value.created_at = props.user?.created_at || date();
  params.value.password = "12345678";
  params.value.school_id =
    props.user?.school?.id || props.user?.school_id || undefined;

  if (authStore.user?.role != "superadmin") {
    params.value.school_id =
      authStore.user?.school?.id || authStore.user?.school_id || undefined;
  }
}

watch(() => props.user, handleUser);
watch(open, () => {
  if (open.value) {
    handleUser();
  }
});
watch(
  () => params.value.role,
  (value) => {
    if (value == "superadmin") {
      params.value.school_id = undefined;
    }
  },
);

async function handleSubmit() {
  is_submitted.value = true;
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
  is_submitted.value = false;
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
          <div
            class="grid grid-cols-4 items-center gap-4"
            v-if="authStore.user?.id != params.id"
          >
            <Label for="" class="text-right">Role</Label>
            <RoleSelect v-model="params.role"></RoleSelect>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="" class="text-right">Telepon</Label>
            <Input
              class="col-span-3"
              required
              placeholder="Masukkan Nomor Telepon"
              v-model="params.phone"
            ></Input>
          </div>
          <div
            class="grid grid-cols-4 items-center gap-4"
            v-if="params.role != 'superadmin'"
          >
            <Label for="" class="text-right">Sekolah</Label>
            <SchoolSelect
              :disabled="authStore.user?.role != 'superadmin'"
              v-model="params.school_id"
            ></SchoolSelect>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="" class="text-right">Username</Label>
            <Input
              type="text"
              class="col-span-3"
              required
              placeholder="Masukkan Username"
              v-model="params.username"
              :disabled="!!user"
            ></Input>
          </div>
          <template v-if="!user">
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
          <Button :disabled="is_submitted" type="submit" class="cursor-pointer">
            <Loader2
              class="size-4 mr-1 animate-spin"
              v-if="is_submitted"
            ></Loader2>
            Simpan Profil
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
