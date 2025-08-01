<script lang="ts" setup>
import MeasurementForm from "~/components/measurements/MeasurementForm.vue";
import { date } from "~/lib/format-date";
import { handleError } from "~/lib/handle-error";
import { handleSuccess } from "~/lib/handle-success";
import { MeasurementService } from "~/services/measurement/measurement.service";

const homeStore = useHomeStore();
const route = useRoute();
const id = route.params.id;

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
    const data = await MeasurementService.update(params.value);

    handleSuccess(data.message);

    await getMeasurement();
  } catch (err) {
    handleError(err);
  }
}

async function getMeasurement() {
  try {
    const data = await MeasurementService.show(id as any);

    params.value = data.measurement;
  } catch (err) {
    handleError(err);

    navigateTo("/measurements", {
      replace: true,
    });
  }
}
onMounted(() => {
  homeStore.setTitle(`Edit Pengukuran`);
  getMeasurement();
});
</script>

<template>
  <MeasurementForm
    v-model="params"
    :handleSubmit="handleSubmit"
    is_edit
    v-if="params.id != 0"
  ></MeasurementForm>
</template>
