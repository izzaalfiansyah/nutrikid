<script lang="ts" setup>
import StudentSelect from "../students/StudentSelect.vue";
import { StudentService } from "~/services/student/student.service";
import { CalendarIcon, Loader2 } from "lucide-vue-next";
import { http } from "~/lib/axios";
import type { DateValue } from "reka-ui";
import { date, formatDate } from "~/lib/format-date";

const props = defineProps<{
  handleSubmit: () => any;
  is_edit?: boolean;
  modelValue: Measurement;
}>();

const is_submitted = ref(false);
const params = ref<Measurement>(props.modelValue);
const student = ref<Student>();
const created_at = ref<DateValue>();

if (params.value.student) {
  params.value.student_id = params.value.student.id;
}

const emit = defineEmits<{
  (e: "update:modelValue", value: Measurement): void;
}>();

async function handleChangeStudent(s: Student | null) {
  params.value.student = s || undefined;
  params.value.student_age = s!.age || 0;
  student.value = s!;

  if (s) {
    try {
      const { measurement } = await StudentService.lastStatistic(s);

      params.value.student_height = measurement.student_height;
      params.value.student_weight = measurement.student_weight;
    } catch (err) {
      // do nothing
    }
  }
}

const abortController = ref<AbortController>(new AbortController());

watch(created_at, () => {
  if (created_at.value) {
    params.value.created_at = created_at.value.toDate("utc");
  }
});

async function getCalculation() {
  abortController.value.abort();
  const result = await http().post("/calculate", {
    height: params.value?.student_height || 0,
    weight: params.value?.student_weight || 0,
    birth_date: student.value?.birth_date,
    gender: student.value?.gender,
    created_at: params.value.created_at,
  });

  const { bmi, z_score, status, age, age_month } = result.data.data;

  params.value.student_age = age;
  params.value.student_age_month = age_month;
  params.value.student_bmi = bmi;
  params.value.z_score = z_score;
  params.value.status = status;
}

watch(
  () => [
    params.value.student_weight,
    params.value.student_height,
    params.value.created_at,
  ],
  getCalculation,
);

watch(
  params,
  () => {
    emit("update:modelValue", params.value);
  },
  { deep: true },
);

async function submit() {
  is_submitted.value = true;
  await props.handleSubmit();
  is_submitted.value = false;
}

onMounted(() => {
  if (!props.is_edit) {
    getCalculation();
  }
});
</script>

<template>
  <form @submit.prevent="submit">
    <Card>
      <CardHeader>
        <CardTitle> {{ is_edit ? "Edit" : "Tambah" }} Pengukuran </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-5">
          <div class="space-y-3">
            <Label>Siswa</Label>
            <div class="max-w-full w-xl">
              <StudentSelect
                v-model="params.student_id"
                @change="handleChangeStudent"
                :disabled="is_edit"
              ></StudentSelect>
            </div>
          </div>
          <div class="space-y-5" v-if="params.student">
            <div class="border-b"></div>
            <div class="space-y-5">
              <CardTitle>Detail Pengukuran</CardTitle>
              <div class="space-y-8 grow">
                <Label>Tanggal Pengukuran</Label>
                <Popover>
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      :disabled="is_edit"
                      :class="`max-w-full w-xl cursor-pointer items-center justify-start`"
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      {{
                        formatDate(
                          modelValue?.created_at ||
                            created_at?.toDate("utc") ||
                            date(),
                        )
                      }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar v-model="created_at" initial-focus />
                  </PopoverContent>
                </Popover>
              </div>
              <div class="space-y-3 grow">
                <Label>Umur</Label>
                <Button
                  variant="outline"
                  class="max-w-full w-xl justify-start"
                  disabled
                >
                  {{ params.student_age || student?.age || 0 }} Tahun
                  {{ params.student_age_month || student?.age_month || 0 }}
                  Bulan
                </Button>
              </div>
              <div class="flex gap-3 max-w-full w-xl">
                <div class="space-y-3 grow">
                  <Label>Tinggi</Label>
                  <Input
                    type="text"
                    v-model.number="params.student_height"
                  ></Input>
                </div>
                <div class="space-y-3 grow">
                  <Label>Berat</Label>
                  <Input
                    type="text"
                    v-model.number="params.student_weight"
                  ></Input>
                </div>
              </div>
              <div class="space-y-3">
                <Label>BMI</Label>
                <Input
                  v-model="params.student_bmi"
                  type="number"
                  placeholder="Masukkan BMI"
                  required
                  disabled
                  class="max-w-full w-xl"
                />
              </div>
              <div class="space-y-3">
                <Label>Z-Score</Label>
                <Input
                  v-model="params.z_score"
                  type="number"
                  required
                  disabled
                  class="max-w-full w-xl"
                />
              </div>
              <div class="space-y-3" v-if="params.status">
                <Label>Status</Label>
                <Badge variant="outline">
                  {{ mappedMeasurementStatus(params.status) }}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button :disabled="is_submitted" type="submit" class="cursor-pointer">
          <Loader2
            v-if="is_submitted"
            class="size-4 animate-spin mr-1 text-white"
          ></Loader2>
          Simpan Pengukuran
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>
