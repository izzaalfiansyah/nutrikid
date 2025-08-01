<script lang="ts" setup>
import type { Component } from "vue";

defineProps<{
  total: number;
  label: string;
  icon: Component;
}>();
</script>

<template>
  <Card>
    <CardContent>
      <div class="flex items-center justify-between">
        <div>
          <div class="text-xs text-muted-foreground">{{ label }}</div>
          <Label class="text-2xl font-semibold">{{ total }}</Label>
        </div>

        <div
          class="size-18 flex items-center justify-center bg-gray-100 rounded-full"
        >
          <component class="text-primary" :is="icon"></component>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
