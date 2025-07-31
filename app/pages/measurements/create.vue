<script lang="ts" setup>
import MeasurementForm from "~/components/measurements/MeasurementForm.vue";
import { date } from "~/lib/format-date";
import { handleError } from "~/lib/handle-error";
import { handleSuccess } from "~/lib/handle-success";
import type { Measurement } from "~/services/measurement/dto/measurement.dto";
import { MeasurementService } from "~/services/measurement/measurement.service";

const homeStore = useHomeStore();

const params = ref<Measurement>({
  id: 0,
  student_id: undefined,
  student_age: 0,
  student_height: 0,
  student_weight: 0,
  student_bmi: 0,
  created_at: date(),
});

async function handleSubmit() {
  try {
    const data = await MeasurementService.store(params.value);

    handleSuccess(data.message);

    useRouter().back();
  } catch (err) {
    handleError(err);
  }
}

onMounted(() => {
  homeStore.setTitle(`Tambah Pengukuran`);
});
</script>

<template>
  <MeasurementForm v-model="params" :handleSubmit="handleSubmit" />
</template>
