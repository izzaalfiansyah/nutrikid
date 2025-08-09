<script lang="ts" setup>
import { MoreHorizontal, Plus } from "lucide-vue-next";
import SchoolStoreDialog from "~/components/schools/SchoolStoreDialog.vue";
import { SchoolService } from "~/services/school/school.service";

const schools = ref<Array<School>>([]);

async function getSchools() {
  try {
    const result = await SchoolService.findAll();
    schools.value = result.schools;
  } catch (err) {
    schools.value = [];
  }
}

onMounted(() => {
  getSchools();
});
</script>

<template>
  <div class="space-y-4">
    <div
      class="flex lg:items-center justify-between lg:flex-row flex-col gap-4"
    >
      <SchoolStoreDialog :callback="getSchools" caption="Tambah Sekolah">
        <Button type="button" class="cursor-pointer">
          <Plus />
          Tambah Sekolah
        </Button>
      </SchoolStoreDialog>
    </div>
    <Card>
      <CardContent>
        <div class="overflow-x-auto">
          <Table>
            <TableCaption v-if="schools.length == 0"
              >Data tidak tersedia</TableCaption
            >
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Opsi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(school, i) in schools" :key="school.id">
                <TableCell>
                  {{ i + 1 }}
                </TableCell>
                <TableCell class="font-medium">
                  <span>{{ school.name }}</span>
                </TableCell>
                <TableCell class="align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <button class="cursor-pointer">
                        <MoreHorizontal class="size-4"></MoreHorizontal>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <SchoolStoreDialog
                        :callback="getSchools"
                        :school="school"
                        caption="Edit Sekolah"
                      >
                        <DropdownMenuItem @select="(e) => e.preventDefault()">
                          <span>Edit</span>
                        </DropdownMenuItem>
                      </SchoolStoreDialog>
                      <DeleteDialog
                        title="Hapus Sekolah"
                        description="Anda yakin akan menghapus sekolah terpilih? Data akan terhapus permanen"
                        :fn="() => SchoolService.destroy(school)"
                        :callback="getSchools"
                      >
                        <DropdownMenuItem @select="(e) => e.preventDefault()">
                          <span>Hapus</span>
                        </DropdownMenuItem>
                      </DeleteDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
