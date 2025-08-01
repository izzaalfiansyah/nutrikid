<script lang="ts" setup>
import {
  mappedMeasurementStatus,
  type Measurement,
} from "~/services/measurement/dto/measurement.dto";
import { MeasurementService } from "~/services/measurement/measurement.service";
import { SquareUser, Users2, UserPen } from "lucide-vue-next";
import { UserService } from "~/services/user/user.service";
import { StudentService } from "~/services/student/student.service";
import { formatDate } from "~/lib/format-date";
import { genderIcon } from "~/lib/gender-icon";

const homeStore = useHomeStore();
const authStore = useAuthStore();

const totalStudent = ref(0);
const totalTeacher = ref(0);
const totalExpert = ref(0);
const measurements = ref<Array<Measurement>>([]);

async function getMeasurements() {
  try {
    const data = await MeasurementService.findAll({
      limit: 5,
    });

    measurements.value = data.measurements;
  } catch (e) {
    measurements.value = [];
  }
}

async function getAllTotals() {
  try {
    const { total: total_teacher } = await UserService.findAll({
      limit: 1,
      role: "teacher",
    });

    const { total: total_expert } = await UserService.findAll({
      limit: 1,
      role: "expert",
    });

    const { total: total_student } = await StudentService.findAll({
      limit: 1,
    });

    totalStudent.value = total_student || 0;
    totalTeacher.value = total_teacher || 0;
    totalExpert.value = total_expert || 0;
  } catch (e) {
    // do nothing
  }
}

onMounted(async () => {
  homeStore.setTitle("Beranda");

  await getAllTotals();
  await getMeasurements();
});
</script>

<template>
  <div class="space-y-5">
    <Card>
      <CardHeader>
        <CardTitle>Selamat Datang 👋</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Halo, {{ authStore.user?.name }}. Semoga hari anda menyenangkan!</p>
      </CardContent>
    </Card>
    <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
      <DashboardCard
        :total="totalStudent"
        label="Jumlah Siswa"
        :icon="SquareUser"
      ></DashboardCard>
      <DashboardCard
        :total="totalTeacher"
        label="Jumlah Guru"
        :icon="Users2"
      ></DashboardCard>
      <DashboardCard
        :total="totalExpert"
        label="Jumlah Ahli Gizi"
        :icon="UserPen"
      ></DashboardCard>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Pengukuran Terkini</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption v-if="measurements.length == 0"
            >Data tidak tersedia</TableCaption
          >
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Siswa</TableHead>
              <TableHead>Tinggi</TableHead>
              <TableHead>Berat</TableHead>
              <TableHead>BMI</TableHead>
              <TableHead>Z Score</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="measurement in measurements" :key="measurement.id">
              <TableCell>
                {{ formatDate(measurement.created_at, { withTime: true }) }}
              </TableCell>
              <TableCell class="font-medium">
                {{ measurement.student?.name }}
                <component
                  :is="genderIcon(measurement.student?.gender || 'l')"
                  :class="`size-3 ml-2 inline ${measurement.student?.gender == 'l' ? 'text-sky-500' : 'text-pink-500'}`"
                ></component>
              </TableCell>
              <TableCell>
                {{ measurement.student_height.toFixed(2) }}cm
              </TableCell>
              <TableCell>
                {{ measurement.student_weight.toFixed(2) }}kg
              </TableCell>
              <TableCell>
                {{ measurement.student_bmi.toFixed(2) }}
              </TableCell>
              <TableCell>
                {{ (measurement.z_score || 0).toFixed(2) }}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {{ mappedMeasurementStatus(measurement.status || "normal") }}
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <NuxtLink to="/measurements">
          <Button>Lihat Selengkapnya</Button>
        </NuxtLink>
      </CardFooter>
    </Card>
  </div>
</template>
