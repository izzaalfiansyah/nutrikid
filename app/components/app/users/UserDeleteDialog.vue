<script lang="ts" setup>
import { handleError } from "~/lib/handle-error";
import { handleSuccess } from "~/lib/handle-success";
import type { Profile } from "~/services/auth/dto/profile.dto";
import { UserService } from "~/services/user/user.service";

const props = defineProps<{
  user: Profile;
  callback?: () => any;
}>();

const open = ref(false);

async function handleDelete() {
  try {
    const data = await UserService.destroy(props.user.id);

    open.value = false;

    handleSuccess(data.message);

    if (props.callback) {
      props.callback();
    }
  } catch (err: any) {
    handleError(err);
  }
}
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogTrigger as-child>
      <slot></slot>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Hapus user?</AlertDialogTitle>
        <AlertDialogDescription>
          Anda yakin menghapus user terkait? Aksi tidak dapat dibatalkan.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Batal</AlertDialogCancel>
        <AlertDialogAction @click="handleDelete">Hapus</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
