<template>
  <b-container fluid="xs"  class="shadow-sm p-4 bg-white rounded">
    <h1>RobotReviewer Live Summary</h1>
    <p>RobotReviewer LIVE is an interface to produce semi-automatic, living, systematic reviews</p>
    <p>This page lists a summary overview</p><br>
    <h2>Automatic COVAX Summary</h2>
    <p>INSERT COMPONENT 1 HERE</p>
    <AbstractList />
    <p>{{get_summary_covax}}</p>
    <br>
    <h2>Automatic Byron Summary</h2>
    <p>INSERT COMPONENT 2 HERE</p>
    <div>
      <test />
    </div>

  </b-container>

</template>


<script>
import AbstractList from "../components/AbstractList.vue";
import test from "../components/test.vue";

export default {
  name: "ScreenAbstracts",
  components: {AbstractList, test}
};

</script>


<style scoped>
</style>
