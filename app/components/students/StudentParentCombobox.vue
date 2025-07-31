<script setup lang="ts">
import { Check, ChevronsUpDown, Search } from "lucide-vue-next";
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
} from "@/components/ui/combobox";
import { cn } from "~/lib/utils";
import type { Profile } from "~/services/auth/dto/profile.dto";
import type { UsersParams } from "~/services/user/dto/users-params.dto";
import { UserService } from "~/services/user/user.service";

const props = defineProps<{
  modelValue?: Profile;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Profile | null): void;
}>();

const value = ref<Profile | null>(props.modelValue || null);
const parents = ref<Profile[]>([]);
const params = ref<UsersParams>({
  search: props.modelValue?.name || "",
  role: "parent",
});

async function getParents() {
  try {
    const data = await UserService.findAll(params.value);
    parents.value = data.profiles;
  } catch (err) {
    parents.value = [];
  }
}

watch(params, getParents, {
  deep: true,
});

watch(value, () => {
  emit("update:modelValue", value.value);
});
</script>

<template>
  <Combobox v-model="value" by="label">
    <ComboboxAnchor as-child>
      <ComboboxTrigger as-child>
        <Button
          variant="outline"
          :class="`justify-between ${value ? '' : 'text-muted-foreground'}`"
        >
          {{ value?.name ?? "Pilih Orang Tua" }}

          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList>
      <div class="relative w-full max-w-sm items-center">
        <ComboboxInput
          @update:model-value="(value) => (params.search = value)"
          class="pl-9 focus-visible:ring-0 border-0 border-b rounded-none h-10"
          placeholder="Cari Orang Tua..."
        />
        <span
          class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
        >
          <Search class="size-4 text-muted-foreground" />
        </span>
      </div>

      <ComboboxEmpty> Data tidak ditemukan. </ComboboxEmpty>

      <ComboboxGroup>
        <ComboboxItem
          v-for="parent in parents"
          :key="parent.id"
          :value="parent.id"
        >
          {{ parent.name }}

          <ComboboxItemIndicator>
            <Check :class="cn('ml-auto h-4 w-4')" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
