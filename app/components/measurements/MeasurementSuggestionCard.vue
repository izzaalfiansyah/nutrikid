<script lang="ts" setup>
import { SendHorizontal } from "lucide-vue-next";
import { formatDate } from "~/lib/format-date";
import { handleError } from "~/lib/handle-error";
import { handleSuccess } from "~/lib/handle-success";
import { MeasurementService } from "~/services/measurement/measurement.service";

const props = defineProps<{
  measurement: Measurement;
}>();

const is_submitted = ref(false);
const params = ref({
  advice: "",
  measurement_id: props.measurement.id,
});
const suggestions = ref<Array<MeasurementSuggestion>>([]);

const authStore = useAuthStore();

async function getSuggestions() {
  try {
    const { suggestions: data_suggestion } =
      await MeasurementService.getSuggestions(props.measurement);

    suggestions.value = data_suggestion || [];
  } catch (err) {
    suggestions.value = [];
  }
}

async function handleStore() {
  is_submitted.value = true;
  try {
    const res = await MeasurementService.storeSuggestion(params.value as any);

    handleSuccess(res.message);
    getSuggestions();
    params.value.advice = "";
  } catch (err) {
    handleError(err);
  }
  is_submitted.value = false;
}

onMounted(() => {
  getSuggestions();
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle> Saran Ahli </CardTitle>
    </CardHeader>
    <CardContent>
      <div
        class="text-left text-muted-foreground text-sm"
        v-if="suggestions.length == 0"
      >
        Belum ada saran ahli
      </div>
      <template v-else>
        <div class="space-y-3">
          <template v-for="suggestion in suggestions">
            <div class="shadow-none border p-4 space-y-2 rounded-lg">
              <div class="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {{ letterName(suggestion.creator?.name) }}
                  </AvatarFallback>
                </Avatar>
                <div class="text-sm">
                  {{ suggestion.creator?.name }}
                </div>
              </div>
              <div class="border-b mt-3 mb-3"></div>
              <div class="text-sm text-muted-foreground">
                {{ suggestion.advice }}
              </div>
              <div class="mt-4 text-xs flex justify-end">
                {{ formatDate(suggestion.created_at, { withTime: true }) }}
              </div>
            </div>
          </template>
        </div>
      </template>
    </CardContent>
    <CardFooter v-if="['admin', 'expert'].includes(authStore.user?.role || '')">
      <form @submit.prevent="handleStore" class="w-full">
        <div class="flex items-center w-full gap-3">
          <div class="grow">
            <Input
              class="grow"
              v-model="params.advice"
              placeholder="Tulis Saran..."
            ></Input>
          </div>
          <Button :disabled="is_submitted" type="submit">
            <SendHorizontal class="size-4"></SendHorizontal>
          </Button>
        </div>
      </form>
    </CardFooter>
  </Card>
</template>
