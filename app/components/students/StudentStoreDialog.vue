<script lang="ts" setup>
import { CalendarIcon } from "lucide-vue-next";
import { type DateValue } from "reka-ui";
import { calculateAge } from "~/lib/calculate-age";
import { date, formatDate } from "~/lib/format-date";
import type { Student } from "~/services/student/dto/student.dto";
import { CalendarWithMonthYear } from "../ui/calendar";
import StudentParentSelect from "./StudentParentSelect.vue";
import { handleError } from "~/lib/handle-error";
import { StudentService } from "~/services/student/student.service";
import { parseDate } from "@internationalized/date";
import { handleSuccess } from "~/lib/handle-success";
import moment from "moment";

const props = defineProps<{
  student?: Student;
  callback?: () => any;
}>();

const birth_date = ref<DateValue>();
const open = ref(false);

const params = ref<Student>(
  props.student || {
    id: 0,
    name: "",
    birth_date: date(),
    gender: "l",
    parent_id: undefined,
  },
);

async function handleSubmit() {
  try {
    let message = "";
    if (props.student) {
      const data = await StudentService.update(params.value);
      message = data.message;
    } else {
      const data = await StudentService.store(params.value);
      message = data.message;
    }

    open.value = false;
    handleSuccess(message);

    if (props.callback) {
      props.callback();
    }
  } catch (err) {
    handleError(err);
  }
}

watch(birth_date, () => {
  if (birth_date.value) {
    params.value.birth_date = birth_date.value.toDate("utc");
  }
});

watch(open, () => {
  if (open.value) {
    handleStudent();
  }
});

function handleStudent() {
  if (props.student) {
    birth_date.value = parseDate(
      moment(props.student.birth_date).format("YYYY-MM-DD"),
    );
  }

  params.value.id = props.student?.id || 0;
  params.value.name = props.student?.name || "";
  params.value.gender = props.student?.gender || "l";
  params.value.parent_id = props.student?.parent_id || undefined;
  params.value.birth_date = props.student?.birth_date || date();
}

onMounted(() => {
  handleStudent();
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot></slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <form @submit.prevent="handleSubmit">
        <DialogHeader>
          <DialogTitle>{{
            props.student ? "Edit Siswa" : "Tambah Siswa"
          }}</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for=""> Nama </Label>
            <Input
              v-model="params.name"
              class="col-span-3"
              placeholder="Masukkan Nama"
              required
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for=""> Gender </Label>
            <div class="col-span-3">
              <GenderSelect v-model="params.gender"></GenderSelect>
            </div>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for=""> Tgl Lahir </Label>
            <div class="col-span-3">
              <Popover>
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    :class="`w-full justify-start ${birth_date ? '' : 'text-muted-foreground'}`"
                  >
                    <CalendarIcon class="mr-1 size-4" />
                    {{
                      birth_date
                        ? formatDate(params.birth_date)
                        : "Pilih Tanggal"
                    }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <CalendarWithMonthYear
                    v-model="birth_date"
                  ></CalendarWithMonthYear>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for=""> Umur </Label>
            <div class="relative col-span-3">
              <Input
                :model-value="calculateAge(params.birth_date)"
                placeholder="Umur"
                disabled
              />
              <div
                class="absolute top-0 bottom-0 right-0 flex items-center justify-center px-2 text-sm text-muted-foreground"
              >
                Tahun
              </div>
            </div>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for=""> Orang Tua </Label>
            <div class="col-span-3">
              <StudentParentSelect v-model="params.parent_id" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit"> Simpan Siswa </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
