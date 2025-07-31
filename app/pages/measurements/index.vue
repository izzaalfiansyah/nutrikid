<script lang="ts" setup>
import { CalendarIcon, Filter } from "lucide-vue-next";
import type { DateValue } from "reka-ui";
import StudentSelect from "~/components/students/StudentSelect.vue";
import { formatDate } from "~/lib/format-date";
import type { MeasurementParams } from "~/services/measurement/dto/measurement-params.dto";
import type { Measurement } from "~/services/measurement/dto/measurement.dto";
import { MeasurementService } from "~/services/measurement/measurement.service";
import { useHomeStore } from "~/stores/home.store";

const measurements = ref<Array<Measurement>>([]);
const total = ref(0);
const homeStore = useHomeStore();

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

  const data = await MeasurementService.findAll(params.value);

  measurements.value = data.measurements;
  total.value = data.total || 0;
}

const start_date = ref<DateValue>();
const end_date = ref<DateValue>();

watch(
  params,
  async () => {
    await getMeasurements(false);
  },
  { deep: true },
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
      <Dialog>
        <DialogTrigger as-child>
          <Button type="button" variant="outline">
            <Filter class="size-3 mr-2"></Filter>
            Filter
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form @submit.prevent="() => getMeasurements()" class="space-y-5">
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
        <Button type="button" as="nuxt-link" class="cursor-pointer">
          <Plus />
          Tambah Pengguna
        </Button>
      </UserStoreDialog>
    </div>
    <Card>
      <CardContent>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet nisi
        cumque, explicabo quas dolorum amet quae iste dolore debitis commodi
        odit dignissimos, soluta vel est at eaque perferendis ipsum rem?
      </CardContent>
    </Card>
  </div>
</template>
