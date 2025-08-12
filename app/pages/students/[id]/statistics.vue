<script lang="ts" setup>
import { StudentService } from "~/services/student/student.service";
import { Line } from "vue-chartjs";
import { Chart as ChartJS, registerables, type ChartData } from "chart.js";
import { formatDate } from "~/lib/format-date";
import { Loader2 } from "lucide-vue-next";
import { MeasurementService } from "~/services/measurement/measurement.service";

ChartJS.register(...registerables);

const homeStore = useHomeStore();
const measurements = ref<Array<Measurement>>([]);
const student = ref<Student>();
const id: any = useRoute().params.id;
const is_loaded = ref(false);
const default_z_scores = ref<Array<ZScore>>([]);

const last_measurement = computed(() => {
  return measurements.value[measurements.value.length - 1];
});

async function getMeasurements() {
  try {
    const data = await StudentService.statistics(id);

    measurements.value = data.measurements;
    student.value = data.student as any;
  } catch (err) {
    measurements.value = [];
  }

  is_loaded.value = true;
}

const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const chartData = computed((): ChartData => {
  const fill = false;

  return {
    labels: measurements.value.map((measurement) =>
      formatDate(measurement.created_at),
    ),
    datasets: [
      // {
      //   label: "Berat",
      //   data: measurements.value.map(
      //     (measurement) => measurement.student_weight,
      //   ),
      //   fill,
      //   hidden: false,
      // },
      // {
      //   label: "Tinggi",
      //   data: measurements.value.map(
      //     (measurement) => measurement.student_height,
      //   ),
      //   fill,
      //   hidden: false,
      // },
      {
        label: "BMI",
        data: measurements.value.map((measurement) => measurement.student_bmi),
        fill,
        hidden: false,
      },
      // {
      //   label: "Z Score",
      //   data: measurements.value.map((measurement) => measurement.z_score || 0),
      //   fill,
      //   hidden: false,
      // },
    ],
  };
});

async function getDefaultZScores() {
  const zscores = await MeasurementService.getDefaultZScore(
    student.value!.gender,
  );

  default_z_scores.value = zscores;
}

onMounted(async () => {
  homeStore.setTitle("Riwayat Pengukuran");

  await getMeasurements();
  await getDefaultZScores();
});
</script>
<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <Label class="text-muted-foreground text-xs mb-1"
            >Riwayat Pengukuran</Label
          >
          <CardTitle> {{ student?.name }} </CardTitle>
        </div>
        <div>
          <Badge>{{
            mappedMeasurementStatus(last_measurement?.status || "normal")
          }}</Badge>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <ClientOnly v-if="is_loaded">
        <Line :data="chartData as any" :options="options"></Line>
      </ClientOnly>
      <template v-else>
        <div class="flex items-center justify-center">
          <Loader2 class="size-8 text-primary animate-spin"></Loader2>
        </div>
      </template>
    </CardContent>
  </Card>
</template>
