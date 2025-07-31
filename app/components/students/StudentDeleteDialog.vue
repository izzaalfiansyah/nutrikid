<script lang="ts" setup>
import { handleError } from "~/lib/handle-error";
import { handleSuccess } from "~/lib/handle-success";
import type { Student } from "~/services/student/dto/student.dto";
import { StudentService } from "~/services/student/student.service";

const props = defineProps<{
  student: Student;
  callback?: () => any;
}>();

const open = ref(false);

async function handleDelete() {
  try {
    const data = await StudentService.destroy(props.student);

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
        <AlertDialogTitle>Hapus Siswa?</AlertDialogTitle>
        <AlertDialogDescription>
          Anda yakin menghapus siswa terpilih? Aksi tidak dapat dibatalkan.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Batal</AlertDialogCancel>
        <AlertDialogAction @click="handleDelete">Hapus</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
