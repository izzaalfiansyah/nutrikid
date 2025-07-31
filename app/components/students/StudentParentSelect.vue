<script lang="ts" setup>
import type { Profile } from "~/services/auth/dto/profile.dto";
import { UserService } from "~/services/user/user.service";

const parents = ref<Array<Profile>>([]);

const props = defineProps<{
  modelValue?: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void;
}>();

async function getParents() {
  try {
    const data = await UserService.findAll({
      role: "parent",
      limit: 200,
    });

    parents.value = data.profiles;
  } catch (err) {
    parents.value = [];
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
  <Select v-model="value">
    <SelectTrigger>
      <SelectValue placeholder="Pilih Orang Tua"></SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-if="parents.length == 0" class="text-center" value="none">
        <span class="text-muted-foreground">Data tidak ditemukan.</span>
      </SelectItem>
      <SelectItem
        v-for="parent in parents"
        :key="parent.id"
        :value="parent.id"
        >{{ parent.name }}</SelectItem
      >
    </SelectContent>
  </Select>
</template>
