<script lang="ts" setup>
import { Loader2 } from "lucide-vue-next";
import { handleError } from "~/lib/handle-error";
import { handleSuccess } from "~/lib/handle-success";
import type { ChangePasswordOtherParams } from "~/services/user/dto/change-password-other.dto";
import { UserService } from "~/services/user/user.service";

const open = ref(false);
const is_submitted = ref(false);

const props = defineProps<{
  uuid: string;
  callback?: () => void;
}>();

const params = ref<ChangePasswordOtherParams>({
  uuid: props.uuid,
  password: "12345678",
});

async function handleSubmit() {
  is_submitted.value = true;
  try {
    const data = await UserService.changePassword(params.value);

    open.value = false;

    handleSuccess(data.message);
  } catch (err: any) {
    handleError(err);
  }
  is_submitted.value = false;
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot></slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <form @submit.prevent="handleSubmit">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
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
        </div>
        <DialogFooter>
          <Button :disabled="is_submitted" type="submit" class="cursor-pointer">
            <Loader2
              class="animate-spin size-4 mr-1"
              v-if="is_submitted"
            ></Loader2>
            Konfirmasi
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
