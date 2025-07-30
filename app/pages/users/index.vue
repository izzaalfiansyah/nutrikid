<script lang="ts" setup>
import { Plus, Search } from "lucide-vue-next";
import { UserService } from "~/services/user/user.service";

const profiles = ref([]);
const homeStore = useHomeStore();

onMounted(() => {
  UserService.findAll();
  homeStore.setTitle("Data Pengguna");
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="w-1/2 max-w-xl">
        <div class="relative">
          <div class="absolute left-3 flex items-center top-0 bottom-0">
            <Search class="size-4"></Search>
          </div>
          <Input placeholder="Cari Pengguna" class="pl-10"></Input>
        </div>
      </div>
      <Button class="cursor-pointer" type="button">
        <Plus></Plus>
        Tambah Pengguna
      </Button>
    </div>
    <Card>
      <CardContent>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque
        inventore aut esse vitae dolorum ab, optio beatae suscipit facilis
        aliquid distinctio recusandae? Quam doloremque quisquam cumque mollitia
        voluptatibus, eligendi libero?
      </CardContent>
    </Card>
  </div>
</template>
