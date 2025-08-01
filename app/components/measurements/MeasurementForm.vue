<script lang="ts" setup>
import { date } from "~/lib/format-date";
import StudentSelect from "../students/StudentSelect.vue";
import { StudentService } from "~/services/student/student.service";
import { Loader2 } from "lucide-vue-next";

const props = defineProps<{
  handleSubmit: () => any;
  is_edit?: boolean;
  modelValue: Measurement;
}>();

const is_submitted = ref(false);
const params = ref<Measurement>(props.modelValue);

const emit = defineEmits<{
  (e: "update:modelValue", value: Measurement): void;
}>();

async function handleChangeStudent(s: Student | null) {
  params.value.student = s || undefined;
  params.value.student_age = calculateAge(s?.birth_date ?? date());

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

watch(
  () => [params.value.student_weight, params.value.student_height],
  ([weight, height]) => {
    height = height || 0;
    weight = weight || 0;

    const result = calculateBmi(params.value.student_age, {
      height,
      weight,
    });

    params.value.student_bmi = result.bmi;
    params.value.z_score = result.z_score;
    params.value.status = result.status;
  },
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
              <CardTitle>Detail Siswa</CardTitle>
              <div class="space-y-3 grow">
                <Label>Umur</Label>
                <Input
                  v-model="params.student_age"
                  type="number"
                  placeholder="Masukkan Umur"
                  required
                  class="max-w-full w-xl"
                  disabled
                />
              </div>
              <div class="flex gap-3 max-w-full w-xl">
                <div class="space-y-3 grow">
                  <Label>Tinggi</Label>
                  <NumberField
                    v-model="params.student_height"
                    required
                    :min="0"
                    :max="200"
                  >
                    <NumberFieldContent>
                      <NumberFieldDecrement />
                      <NumberFieldInput />
                      <NumberFieldIncrement />
                    </NumberFieldContent>
                  </NumberField>
                </div>
                <div class="space-y-3 grow">
                  <Label>Berat</Label>
                  <NumberField
                    v-model="params.student_weight"
                    required
                    :min="0"
                    :max="200"
                  >
                    <NumberFieldContent>
                      <NumberFieldDecrement />
                      <NumberFieldInput />
                      <NumberFieldIncrement />
                    </NumberFieldContent>
                  </NumberField>
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
