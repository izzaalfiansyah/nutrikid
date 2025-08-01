<script setup lang="ts">
import { app } from "~/lib/app";
</script>

<template>
  <Head>
    <Title>
      {{ app().name }} - Aplikasi Digital Monitoring Status Gizi Anak
    </Title>
    <Meta name="description" :content="app().description"></Meta>
    <Meta
      name="og:title"
      :content="`${app().name} - Aplikasi Digital Monitoring Status Gizi Anak`"
    ></Meta>
    <Meta name="og:description" :content="app().description"></Meta>
  </Head>
</template>
