<script lang="ts" setup>
import { MessageSquareQuote, SendHorizontal } from "lucide-vue-next";
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

function handleSuggestionAdvice(advice: string) {
  params.value.advice = advice;
}

onMounted(() => {
  getSuggestions();
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle> Saran Pengukuran </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="text-left">
        <template v-if="measurement.suggestion_advices.length == 0">
          Belum ada saran ahli
        </template>
        <ul class="pl-4">
          <template v-for="suggestion in measurement.suggestion_advices">
            <li class="list-decimal mb-1">{{ suggestion }}</li>
          </template>
        </ul>
      </div>
    </CardContent>
  </Card>
</template>
