<script lang="ts" setup>
import { handleError } from "~/lib/handle-error";
import { handleSuccess } from "~/lib/handle-success";

const props = defineProps<{
  callback?: () => any;
  fn: () => Promise<any>;
  title: string;
  description: string;
}>();

const open = ref(false);

async function handleDelete() {
  try {
    const data = await props.fn();

    open.value = false;

    handleSuccess(data?.message || "Berhasil menghapus data");

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
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Batal</AlertDialogCancel>
        <AlertDialogAction @click="handleDelete">Hapus</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
