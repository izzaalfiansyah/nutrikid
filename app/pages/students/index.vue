<script lang="ts" setup>
import { MoreHorizontal, Plus, Search } from "lucide-vue-next";
import UserStoreDialog from "~/components/app/users/UserStoreDialog.vue";
import { calculateAge } from "~/lib/calculate-age";
import { formatDate } from "~/lib/format-date";
import { genderIcon } from "~/lib/gender-icon";
import { letterName } from "~/services/auth/dto/profile.dto";
import { mappedGender, type Student } from "~/services/student/dto/student.dto";
import type { StudentsParams } from "~/services/student/dto/students-params.dto";
import { StudentService } from "~/services/student/student.service";

const students = ref<Array<Student>>([]);
const total = ref(0);
const homeStore = useHomeStore();

const params = ref<StudentsParams>({
  page: 1,
  limit: 20,
  search: "",
  gender: "",
});

async function getStudents(reset = true) {
  students.value = [];

  if ((reset = true)) {
    params.value.page = 1;
    params.value.search = "";
    params.value.gender = "";
  }

  const data = await StudentService.findAll(params.value);

  students.value = data.students;
  total.value = data.total || 0;
}

watch(
  params,
  async () => {
    await getStudents(false);
  },
  { deep: true },
);

onMounted(async () => {
  await getStudents();

  homeStore.setTitle("Data Siswa");
});
</script>

<template>
  <div class="space-y-4">
    <div
      class="flex lg:items-center justify-between lg:flex-row flex-col gap-4"
    >
      <div class="md:w-1/2 max-w-xl">
        <div class="flex items-center space-x-3">
          <div class="relative grow">
            <div class="absolute left-3 flex items-center top-0 bottom-0">
              <Search class="size-4"></Search>
            </div>
            <Input
              placeholder="Cari Siswa"
              @change="(e: any) => (params.search = e.currentTarget.value)"
              class="pl-10"
            ></Input>
          </div>
          <div class="w-36">
            <Select v-model="params.gender">
              <SelectTrigger>
                <SelectValue placeholder="Pilih Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="l">Laki-laki</SelectItem>
                <SelectItem value="p">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <UserStoreDialog :callback="getStudents" caption="Tambah Pengguna">
        <Button type="button" class="cursor-pointer">
          <Plus />
          Tambah Pengguna
        </Button>
      </UserStoreDialog>
    </div>
    <Card>
      <CardContent>
        <div class="overflow-x-auto">
          <Table>
            <TableCaption v-if="students.length == 0"
              >Data tidak tersedia</TableCaption
            >
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Tanggal Lahir</TableHead>
                <TableHead>Umur</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Opsi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="student in students" :key="student.id">
                <TableCell class="font-medium">
                  {{ student.id }}
                </TableCell>
                <TableCell class="font-medium">
                  <div class="flex items-center">
                    <Avatar class="mr-3">
                      <AvatarFallback>{{
                        letterName(student.name)
                      }}</AvatarFallback>
                    </Avatar>
                    <span>{{ student.name }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {{ formatDate(student.birth_date) }}
                </TableCell>
                <TableCell>
                  {{ calculateAge(student.birth_date) }}
                </TableCell>
                <TableCell>
                  <component
                    :is="genderIcon(student.gender)"
                    :class="`size-3 inline mr-1 ${student.gender == 'l' ? 'text-sky-500' : 'text-pink-500'}`"
                  ></component>
                  {{ mappedGender(student.gender) }}
                </TableCell>
                <TableCell class="align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <button class="cursor-pointer">
                        <MoreHorizontal class="size-4"></MoreHorizontal>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent> </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
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
