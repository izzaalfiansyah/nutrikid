<script lang="ts" setup>
const props = defineProps<{
  modelValue?: ProfileRole;
  withAll?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: ProfileRole | null): void;
}>();
const value = ref(props.modelValue);

watch(value, () => {
  emit("update:modelValue", value.value || null);
});
</script>

<template>
  <Select v-model="value">
    <SelectTrigger class="col-span-3">
      <SelectValue required placeholder="Pilih Role" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem v-if="withAll" :value="null">Semua</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="teacher">Guru</SelectItem>
        <SelectItem value="expert">Ahli Gizi</SelectItem>
        <!-- <SelectItem value="parent">Orang Tua</SelectItem> -->
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
