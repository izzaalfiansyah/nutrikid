<script lang="ts" setup>
import { date, formatDate } from "~/lib/format-date";
import { handleError } from "~/lib/handle-error";
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
  homeStore.setTitle(`Detail Pengukuran`);
  getMeasurement();
});
</script>

<template>
  <Card v-if="params.id != 0">
    <CardHeader>
      <CardTitle>
        Detail Pengukuran
        <Badge class="ml-3">{{
          mappedMeasurementStatus(params.status || "normal")
        }}</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="gap-5 grid lg:grid-cols-2 grid-cols-1">
        <div class="space-y-5">
          <div class="space-y-2">
            <div class="text-muted-foreground text-sm">Tanggal</div>
            <Label>{{ formatDate(params.created_at) }}</Label>
          </div>
          <div class="space-y-2">
            <div class="text-muted-foreground text-sm">Siswa</div>
            <Label>{{ params.student?.name }}</Label>
          </div>
          <div class="space-y-2">
            <div class="text-muted-foreground text-sm">Gender</div>
            <Label>{{ mappedGender(params.student?.gender || "l") }}</Label>
          </div>
          <div class="space-y-2">
            <div class="text-muted-foreground text-sm">Umur</div>
            <Label>{{ params.student_age }}</Label>
          </div>
        </div>
        <div class="space-y-5">
          <div class="space-y-2">
            <div class="text-muted-foreground text-sm">Tinggi Badan</div>
            <Label>{{ params.student_height }}cm</Label>
          </div>
          <div class="space-y-2">
            <div class="text-muted-foreground text-sm">Berat Badan</div>
            <Label>{{ params.student_weight }}kg</Label>
          </div>
          <div class="space-y-2">
            <div class="text-muted-foreground text-sm">BMI</div>
            <Label>{{ params.student_bmi.toFixed(2) }}</Label>
          </div>
          <div class="space-y-2">
            <div class="text-muted-foreground text-sm">Z-Score</div>
            <Label>{{ params.z_score?.toFixed(2) }}</Label>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter class="mt-3">
      <Button variant="outline" @click="$router.back">Kembali ke Daftar</Button>
    </CardFooter>
  </Card>
</template>
