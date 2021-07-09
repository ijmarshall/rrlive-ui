<template>
  <div class="container">
    
    <!-- <div class="form" v-if="signedInStatus"> -->
    <b-container fluid="xs"  class="shadow-sm p-4 bg-white rounded">
      <FormulateForm
        class="summary-form"
        v-model="formValues"
        @submit="sendData"
      >
        <h1>Create New RobotReviewer Live Summary</h1>
        <p>RobotReviewer LIVE is an interface to produce semi-automatic, living, systematic reviews.
        <br>Please submit the following information to create a new live summary.</p>
        <FormulateInput
          name="name"
          type="text"
          label="Name of Live Summary"
          help="Please enter a name"
          validation="required"
        />
        <FormulateInput
          type="file"
          name="document"
          label="Article Decisions"
          help="Select a csv (with title, article, and whether we should include or exclude them for summary) to upload."
          upload-url="/your/upload/directory"
          validation="mime:text/csv,text/x-csv"
          upload-behavior="live"
        />
        <FormulateInput
          type="submit"
          :disabled="isLoading"
          :label="isLoading ? 'Loading...' : 'Submit'"
        />
        <pre
          class="code"
          v-text="formValues"
        />
      </FormulateForm>


    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formValues: {}
    };
  },
  components: {
  },
  computed: {
  },
  methods: {
    async sendData (data) {
      // (in the demo we show the data object at this point)
      // Send data to your server
      await this.$axios.put('/profile', data)
    }
  },
};
</script>

<style scoped>
@import '../assets/css/snow.css';
</style>