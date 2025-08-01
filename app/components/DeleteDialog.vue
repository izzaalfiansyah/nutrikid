<script lang="ts" setup>
import { Loader2 } from "lucide-vue-next";
import { handleError } from "~/lib/handle-error";
import { handleSuccess } from "~/lib/handle-success";

const props = defineProps<{
  callback?: () => any;
  fn: () => Promise<any>;
  title: string;
  description: string;
}>();

const is_submitted = ref(false);
const open = ref(false);

async function handleDelete() {
  is_submitted.value = true;
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
  is_submitted.value = false;
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
        <AlertDialogAction :disabled="is_submitted" @click="handleDelete">
          <Loader2
            class="size-4 animate-spin mr-1"
            v-if="is_submitted"
          ></Loader2>
          Hapus
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
