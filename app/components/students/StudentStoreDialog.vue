<script lang="ts" setup>
import { CalendarIcon, Loader2 } from "lucide-vue-next";
import { type DateValue } from "reka-ui";
import { date, formatDate } from "~/lib/format-date";
import { CalendarWithMonthYear } from "../ui/calendar";
import { handleError } from "~/lib/handle-error";
import { StudentService } from "~/services/student/student.service";
import { parseDate } from "@internationalized/date";
import { handleSuccess } from "~/lib/handle-success";
import moment from "moment";

const props = defineProps<{
  student?: Student;
  callback?: () => any;
}>();

const authStore = useAuthStore();

const birth_date = ref<DateValue>();
const open = ref(false);
const is_submitted = ref(false);

const params = ref<Student>(
  props.student || {
    id: 0,
    nisn: "",
    name: "",
    birth_date: date(),
    gender: "l",
    age: 0,
    school_id: undefined,
    age_month: 0,
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
  params.value.birth_date = props.student?.birth_date || date();
  params.value.school_id =
    props.student?.school?.id ||
    props.student?.school_id ||
    authStore.user?.school_id ||
    undefined;
}

onMounted(() => {
  handleStudent();
});

async function submit() {
  is_submitted.value = true;
  await handleSubmit();
  is_submitted.value = false;
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot></slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <form @submit.prevent="submit">
        <DialogHeader>
          <DialogTitle>{{
            props.student ? "Edit Siswa" : "Tambah Siswa"
          }}</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for=""> NISN </Label>
            <Input
              v-model="params.nisn"
              class="col-span-3"
              placeholder="Masukkan NISN"
              required
            />
          </div>
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
          <div
            v-if="!props.student"
            class="grid grid-cols-4 items-center gap-4"
          >
            <Label for=""> Asal Sekolah </Label>
            <SchoolSelect
              :disabled="!!authStore.user?.school_id"
              v-model="params.school_id"
            ></SchoolSelect>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" :disabled="is_submitted">
            <Loader2
              class="size-4 animate-spin mr-1"
              v-if="is_submitted"
            ></Loader2>
            Simpan Siswa
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
