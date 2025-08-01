<script lang="ts" setup>
import { StudentService } from "~/services/student/student.service";

const students = ref<Array<Student>>([]);

const props = defineProps<{
  modelValue?: number;
  withAll?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void;
  (e: "change", value: Student | null): void;
}>();

async function getStudents() {
  try {
    const authStore = useAuthStore();

    const data = await StudentService.findAll({
      limit: 200,
      parent_id: authStore.isParent ? authStore.user?.id : undefined,
    });

    students.value = data.students;
  } catch (err) {
    students.value = [];
  }
}

const value = ref(props.modelValue);

watch(value, () => {
  emit("update:modelValue", value.value || null);
  emit(
    "change",
    students.value.find((student) => student.id == value.value) || null,
  );
});

onMounted(() => {
  getStudents();
});
</script>

<template>
  <Select v-model="value" class="w-full">
    <SelectTrigger :disabled="disabled" class="w-full">
      <SelectValue placeholder="Pilih Siswa"></SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-if="students.length == 0"
        class="text-center"
        :value="null"
        disabled
      >
        <span class="text-muted-foreground">Data tidak ditemukan.</span>
      </SelectItem>
      <SelectItem v-if="withAll" :value="null"> Semua </SelectItem>
      <SelectItem
        v-for="student in students"
        :key="student.id"
        :value="student.id"
        >{{ student.name }}</SelectItem
      >
    </SelectContent>
  </Select>
</template>
