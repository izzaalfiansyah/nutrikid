<script lang="ts" setup>
import { StudentService } from "~/services/student/student.service";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  registerables,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Loader2 } from "lucide-vue-next";
import { MeasurementService } from "~/services/measurement/measurement.service";
import colorLib from "@kurkle/color";

ChartJS.register(...registerables);

const ChartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

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

const options = computed((): ChartOptions => {
  return {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        filter: function (tooltipItem) {
          return tooltipItem.datasetIndex === 0;
        },
        callbacks: {
          title: (context) => "",
          label: function (context) {
            const measurement = measurements.value.find(
              (m) => m.student_age_month_total.toString() == context.label,
            )!;

            return `
BMI : ${measurement.student_bmi.toFixed(2)},\n
Z-Score: ${measurement.z_score!.toFixed(2)},\n
Status: ${mappedMeasurementStatus(measurement.status ?? "normal")}
`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
      x: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
  };
});

const chartData = computed((): ChartData => {
  const labels = ["-3", "-2", "-1", "0", "+1", "+2", "+3"];
  const colors = [
    ChartColors.yellow,
    ChartColors.green,
    ChartColors.green,
    ChartColors.green,
    ChartColors.yellow,
    ChartColors.yellow,
    ChartColors.red,
  ];
  const borderColors = [
    ChartColors.red,
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    ChartColors.red,
  ];

  return {
    labels: default_z_scores.value.map((z) => z.month),
    datasets: [
      {
        label: "BMI",
        fill: false,
        data: default_z_scores.value.map((z) => {
          const measurement = measurements.value.find((m) => {
            return m.student_age_month_total == z.month;
          });

          return measurement?.student_bmi || null;
        }),
        pointStyle: "circle",
        pointRadius: 5,
        pointHoverRadius: 7,
        borderColor: ChartColors.blue,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 3,
        pointHoverBorderWidth: 5,
        spanGaps: true,
      },
      ...Array.from({ length: 7 }).map((_, index) => {
        const label = labels[index] + " SD";
        const color = colors[index];
        const borderColor = borderColors[index];

        return {
          label,
          data: [
            ...default_z_scores.value.map((z) => {
              return z.z_scores_range[index]!.min;
            }),
          ],
          pointStyle: false,
          borderWidth: 3,
          fill: "+1",
          backgroundColor: colorLib(color as string)
            .alpha(0.5)
            .rgbString(),
          borderColor: borderColor,
        };
      }),
    ],
  };
});

async function getDefaultZScores() {
  const zscores = await MeasurementService.getDefaultZScore(
    student.value!.gender,
  );

  default_z_scores.value = zscores.filter((z) => z.month <= 8 * 12);
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
        <div class="text-sm">BMI</div>
        <Line :data="chartData as any" :options="options as any"></Line>
        <div class="text-sm text-center mt-3">Umur (bulan)</div>
      </ClientOnly>
      <template v-else>
        <div class="flex items-center justify-center">
          <Loader2 class="size-8 text-primary animate-spin"></Loader2>
        </div>
      </template>
    </CardContent>
  </Card>
</template>
