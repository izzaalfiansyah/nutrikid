<script lang="ts" setup>
import {
  MoreHorizontal,
  Plus,
  Search,
  SquareArrowOutUpRight,
} from "lucide-vue-next";
import UserDeleteDialog from "~/components/app/users/UserDeleteDialog.vue";
import UserResetPasswordDialog from "~/components/app/users/UserResetPasswordDialog.vue";
import UserStoreDialog from "~/components/app/users/UserStoreDialog.vue";
import { roleIcon } from "~/lib/role-icon";
import { letterName, type Profile } from "~/services/auth/dto/profile.dto";
import type { StudentsParams } from "~/services/student/dto/students-params.dto";
import { UserService } from "~/services/user/user.service";

const profiles = ref<Array<Profile>>([]);
const total = ref(0);
const homeStore = useHomeStore();
const authStore = useAuthStore();

const params = ref<StudentsParams>({
  page: 1,
  limit: 20,
  search: "",
  gender: "",
});

async function getStudents(reset = true) {
  profiles.value = [];

  if ((reset = true)) {
    params.value.page = 1;
    params.value.search = "";
    params.value.gender = "";
  }

  const data = await UserService.findAll(params.value);

  profiles.value = data.profiles;
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
            <TableCaption v-if="profiles.length == 0"
              >Data tidak tersedia</TableCaption
            >
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Nomor Telepon</TableHead>
                <TableHead>Opsi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="profile in profiles" :key="profile.id">
                <TableCell class="font-medium">
                  <div class="flex items-center">
                    <Avatar class="mr-3">
                      <AvatarFallback>{{
                        letterName(profile.name)
                      }}</AvatarFallback>
                    </Avatar>
                    <span>{{ profile.name }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <component
                    :is="roleIcon(profile.role)"
                    class="size-3 mr-2 inline"
                  ></component>
                  {{ profile.role.toUpperCase() }}
                </TableCell>
                <TableCell>
                  <div class="flex items-center">
                    <span>
                      {{ profile.phone || "-" }}
                    </span>
                    <template v-if="profile.phone">
                      <a
                        :href="`tel:${profile.phone}`"
                        class="ml-3 inline cursor-pointer"
                      >
                        <SquareArrowOutUpRight
                          class="size-3 text-primary inline"
                        ></SquareArrowOutUpRight>
                      </a>
                    </template>
                  </div>
                </TableCell>
                <TableCell class="align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <button class="cursor-pointer">
                        <MoreHorizontal class="size-4"></MoreHorizontal>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <UserStoreDialog
                        :callback="getStudents"
                        :user="profile"
                        caption="Edit Pengguna"
                      >
                        <DropdownMenuItem @select="(e) => e.preventDefault()">
                          <span>Edit</span>
                        </DropdownMenuItem>
                      </UserStoreDialog>
                      <UserResetPasswordDialog :uuid="profile.user_id">
                        <DropdownMenuItem @select="(e) => e.preventDefault()">
                          <span>Reset Password</span>
                        </DropdownMenuItem>
                      </UserResetPasswordDialog>
                      <template v-if="profile.id != authStore.user?.id">
                        <UserDeleteDialog
                          :user="profile"
                          :callback="getStudents"
                        >
                          <DropdownMenuItem @select="(e) => e.preventDefault()">
                            <span>Hapus</span>
                          </DropdownMenuItem>
                        </UserDeleteDialog>
                      </template>
                    </DropdownMenuContent>
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
