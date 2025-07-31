<script lang="ts" setup>
import type { ProfileRole } from "~/services/auth/dto/profile.dto";

const props = defineProps<{
  modelValue?: ProfileRole;
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
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="user">User</SelectItem>
        <SelectItem value="parent">Orang Tua</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
