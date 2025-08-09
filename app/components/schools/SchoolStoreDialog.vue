<script lang="ts" setup>
import { Loader2 } from "lucide-vue-next";
import { handleError } from "~/lib/handle-error";
import { handleSuccess } from "~/lib/handle-success";
import { SchoolService } from "~/services/school/school.service";

const props = defineProps<{
  caption: string;
  school?: School;
  callback?: () => any;
}>();

const open = ref(false);
const is_submitted = ref(false);
const params = ref<School>({
  id: props.school?.id || 0,
  name: props.school?.name || "",
});

async function handleSubmit() {
  is_submitted.value = true;
  try {
    let message = "";

    if (props.school) {
      const data = await SchoolService.update(params.value);
      message = data.message;
    } else {
      const data = await SchoolService.store(params.value);
      message = data.message;
    }

    handleSuccess(message);

    open.value = false;
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
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot></slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <form @submit.prevent="handleSubmit">
        <DialogHeader>
          <DialogTitle>{{ caption }}</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="" class="text-right">Nama</Label>
            <Input
              class="col-span-3"
              required
              placeholder="Masukkan Nama"
              v-model="params.name"
            ></Input>
          </div>
        </div>
        <DialogFooter>
          <Button :disabled="is_submitted" type="submit" class="cursor-pointer">
            <Loader2
              class="size-4 mr-1 animate-spin"
              v-if="is_submitted"
            ></Loader2>
            Simpan Data
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
