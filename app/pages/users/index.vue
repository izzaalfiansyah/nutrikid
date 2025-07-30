<script lang="ts" setup>
import { UserService } from "~/services/user/user.service";

const profiles = ref([]);

onMounted(() => {
  UserService.findAll();
});
</script>

<template>
  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eaque possimus
  accusamus nostrum nesciunt quisquam ex assumenda deleniti ab odit aliquam
  optio sed quam corrupti sapiente fugiat, accusantium praesentium. Expedita,
  temporibus.
</template>
