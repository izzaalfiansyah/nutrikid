<script lang="ts" setup>
const props = defineProps<{
  modelValue?: Gender;
  withAll?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Gender | null): void;
}>();
const value = ref(props.modelValue);

watch(value, () => {
  emit("update:modelValue", value.value || null);
});
</script>

<template>
  <Select v-model="value">
    <SelectTrigger class="col-span-3">
      <SelectValue required placeholder="Pilih Gender" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem v-if="withAll" :value="null">Semua</SelectItem>
        <SelectItem value="l">Laki-laki</SelectItem>
        <SelectItem value="p">Perempuan</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
