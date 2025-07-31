<script lang="ts" setup>
import {
  mappedMeasurementStatus,
  type Measurement,
} from "~/services/measurement/dto/measurement.dto";
import { StudentService } from "~/services/student/student.service";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Colors,
  registerables,
  type ChartData,
} from "chart.js";
import { formatDate } from "~/lib/format-date";
import { Loader2 } from "lucide-vue-next";
import type { Student } from "~/services/student/dto/student.dto";

ChartJS.register(...registerables);

const homeStore = useHomeStore();
const measurements = ref<Array<Measurement>>([]);
const student = ref<Student>();
const id: any = useRoute().params.id;
const is_loaded = ref(false);

const last_measurement = computed(() => {
  return measurements.value[measurements.value.length - 1];
});

async function getMeasurements() {
  try {
    const data = await StudentService.statistics(id);

    measurements.value = data.measurements;
    student.value = data.student;
  } catch (err) {
    measurements.value = [];
  }

  is_loaded.value = true;
}

const options = {
  responsive: true,
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  } as any,
};

const chartData = computed((): ChartData => {
  const fill = false;

  return {
    labels: measurements.value.map((measurement) =>
      formatDate(measurement.created_at),
    ),
    datasets: [
      {
        label: "Berat",
        data: measurements.value.map(
          (measurement) => measurement.student_weight,
        ),
        fill,
        hidden: true,
      },
      {
        label: "Tinggi",
        data: measurements.value.map(
          (measurement) => measurement.student_height,
        ),
        fill,
        hidden: true,
      },
      {
        label: "BMI",
        data: measurements.value.map((measurement) => measurement.student_bmi),
        fill,
        hidden: false,
      },
      {
        label: "Z Score",
        data: measurements.value.map((measurement) => measurement.z_score || 0),
        fill,
        hidden: false,
      },
    ],
  };
});

onMounted(() => {
  homeStore.setTitle("Riwayat Pengukuran");

  getMeasurements();
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
