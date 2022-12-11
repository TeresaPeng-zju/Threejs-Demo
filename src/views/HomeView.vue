<template>
  <div class="home">
    <textGeometry />
  </div>
</template>

<script>
// @ is an alias to /src
import textGeometry from "@/components/textGeometry.vue";

export default {
  name: "HomeView",
  components: {
    textGeometry,
  },
};
</script>
