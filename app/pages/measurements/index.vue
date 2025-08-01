<script lang="ts" setup>
import { CalendarIcon, Filter, MoreHorizontal, Plus } from "lucide-vue-next";
import type { DateValue } from "reka-ui";
import StudentSelect from "~/components/students/StudentSelect.vue";
import { formatDate } from "~/lib/format-date";
import { genderIcon } from "~/lib/gender-icon";
import type { MeasurementParams } from "~/services/measurement/dto/measurement-params.dto";
import { MeasurementService } from "~/services/measurement/measurement.service";
import { useHomeStore } from "~/stores/home.store";

const measurements = ref<Array<Measurement>>([]);
const total = ref(0);
const homeStore = useHomeStore();
const authStore = useAuthStore();
const show_filter_dialog = ref(false);

const params = ref<MeasurementParams>({
  page: 1,
  limit: 20,
  student_id: undefined,
});

async function getMeasurements(reset = true) {
  measurements.value = [];

  if (reset) {
    params.value.page = 1;
    params.value.start_date = undefined;
    params.value.end_date = undefined;
    params.value.student_id = undefined;
  }

  if (authStore.isParent) {
    params.value.parent_id = authStore.user?.id;
  }

  const data = await MeasurementService.findAll(params.value);

  measurements.value = data.measurements;
  total.value = data.total || 0;
}

const start_date = ref<DateValue>();
const end_date = ref<DateValue>();

watch(start_date, () => {
  if (start_date.value) {
    params.value.start_date = start_date.value.toDate("utc");
  }
});

watch(end_date, () => {
  if (end_date.value) {
    params.value.end_date = end_date.value.toDate("utc");
  }
});

watch(
  () => params.value.page,
  () => getMeasurements(false),
);

onMounted(async () => {
  await getMeasurements();

  homeStore.setTitle("Data Pengukuran");
});
</script>

<template>
  <div class="space-y-4">
    <div
      class="flex lg:items-center justify-between lg:flex-row flex-col gap-4"
    >
      <Dialog v-model:open="show_filter_dialog">
        <DialogTrigger as-child>
          <Button type="button" variant="outline">
            <Filter class="size-3 mr-2"></Filter>
            Filter
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form
            @submit.prevent="
              () => {
                show_filter_dialog = false;
                getMeasurements(false);
              }
            "
            class="space-y-5"
          >
            <DialogTitle>Filter Data Pengukuran</DialogTitle>
            <div class="w-full space-y-4">
              <div class="space-y-2 w-full">
                <Label>Siswa</Label>
                <StudentSelect v-model="params.student_id"></StudentSelect>
              </div>
              <div class="space-y-2">
                <Label>Filter Tanggal</Label>
                <div class="flex gap-4">
                  <div class="grow">
                    <Popover>
                      <PopoverTrigger as-child>
                        <Button
                          variant="outline"
                          :class="`w-full items-center justify-start ${start_date ? '' : 'text-muted-foreground'}`"
                        >
                          <CalendarIcon class="mr-2 h-4 w-4" />
                          {{
                            start_date
                              ? formatDate(start_date.toDate("utc"))
                              : "Tanggal Mulai"
                          }}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent class="w-auto p-0">
                        <Calendar v-model="start_date" initial-focus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div class="grow">
                    <Popover>
                      <PopoverTrigger as-child>
                        <Button
                          variant="outline"
                          :class="`w-full items-center justify-start ${end_date ? '' : 'text-muted-foreground'}`"
                        >
                          <CalendarIcon class="mr-2 h-4 w-4" />
                          {{
                            end_date
                              ? formatDate(end_date.toDate("utc"))
                              : "Tanggal Akhir"
                          }}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent class="w-auto p-0">
                        <Calendar v-model="end_date" initial-focus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" class="cursor-pointer">Terapkan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <UserStoreDialog :callback="getMeasurements" caption="Tambah Pengukuran">
        <Button
          type="button"
          @click="() => navigateTo('/measurements/create')"
          class="cursor-pointer"
        >
          <Plus />
          Tambah Pengukuran
        </Button>
      </UserStoreDialog>
    </div>
    <Card>
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
              <TableHead>Opsi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="measurement in measurements" :key="measurement.id">
              <TableCell>
                {{ formatDate(measurement.created_at, { withTime: true }) }}
              </TableCell>
              <TableCell class="font-medium">
                <NuxtLink
                  :to="`/students/${measurement.student_id}/statistics`"
                  class="underline"
                  >{{ measurement.student?.name }}</NuxtLink
                >
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
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <button class="cursor-pointer">
                      <MoreHorizontal class="size-4"></MoreHorizontal>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      @select="
                        () => navigateTo('/measurements/' + measurement.id)
                      "
                    >
                      Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @select="
                        () =>
                          navigateTo(
                            '/measurements/' + measurement.id + '/edit',
                          )
                      "
                    >
                      Edit
                    </DropdownMenuItem>
                    <DeleteDialog
                      title="Hapus Pengukuran"
                      description="Anda yakin akan menghapus pengukuran terpilih? Data akan terhapus permanen"
                      :fn="() => MeasurementService.destroy(measurement)"
                    >
                      <DropdownMenuItem @select="(e) => e.preventDefault()">
                        Hapus
                      </DropdownMenuItem>
                    </DeleteDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    <Pagination
      v-slot="{ page }"
      :items-per-page="params.limit || 20"
      :total="total"
      v-model:page="params.page"
    >
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious />

        <template v-for="(item, index) in items" :key="index">
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="item.value === page"
          >
            {{ item.value }}
          </PaginationItem>
        </template>

        <PaginationEllipsis :index="4" />

        <PaginationNext />
      </PaginationContent>
    </Pagination>
  </div>
</template>
