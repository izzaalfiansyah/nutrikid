<script lang="ts" setup>
import { SchoolService } from "~/services/school/school.service";

const schools = ref<Array<School>>([]);

const props = defineProps<{
  modelValue?: number;
  withAll?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void;
}>();

async function getParents() {
  try {
    const data = await SchoolService.findAll();

    schools.value = data.schools;
  } catch (err) {
    schools.value = [];
  }
}

const value = ref(props.modelValue);

watch(value, () => {
  emit("update:modelValue", value.value || null);
});

onMounted(() => {
  getParents();
});
</script>

<template>
  <Select v-model="value" :disabled="disabled">
    <SelectTrigger>
      <SelectValue placeholder="Pilih Sekolah"></SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-if="schools.length == 0"
        class="text-center"
        :value="null"
        disabled
      >
        <span :class="{ 'text-muted-foreground': !withAll }">{{
          withAll ? "Semua Sekolah" : "Data tidak ditemukan."
        }}</span>
      </SelectItem>
      <SelectItem v-if="withAll" :value="null"> Semua </SelectItem>
      <SelectItem
        v-for="school in schools"
        :key="school.id"
        :value="school.id"
        >{{ school.name }}</SelectItem
      >
    </SelectContent>
  </Select>
</template>
