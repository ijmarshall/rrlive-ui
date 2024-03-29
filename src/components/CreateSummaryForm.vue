<template>
    <div class="container">
        <div class="form" v-if="signedInStatus">
            <div class="form" v-if="!isSubmitted">
            <b-container fluid="xs" class="shadow-sm p-4 bg-white rounded">
                <FormulateForm name="form" class="summary-form" v-model="formValues" @submit="sendData" #default="{ isLoading }" :form-errors="formErrors">
                    <h1>Create New RobotReviewer Live Summary</h1>
                    <p>RobotReviewer LIVE is an interface to produce semi-automatic, living, systematic reviews.
                        <br>Please submit the following information to create a new live summary.</p>
                    <FormulateInput name="name" type="text" label="Name of Live Summary" help="Please enter a name" validation="required" validation-behavior="live" error-behavior="submit" />
                    <FormulateInput type="file" name="document" label="Article Decisions" help="Select a csv (with pmid, title, abstract, and decision - 'Include' or 'Exclude') to upload." validation="required|mime:text/csv,text/x-csv" upload-behavior="delayed" validation-behavior="live" error-behavior="submit" :uploader="uploadFile" />
                    <FormulateInput
                      type="date"
                      name="date"
                      label="Date of Last Manual Search"
                      placeholder="Sample date placeholder"
                      help="The date when the last manual search was done/csv was created."
                      validation="required"
                      validation-behavior="live"
                      error-behavior="submit"
                    />
                    <FormulateInput type="searchbox" name="tags" label="Tags/Categories" help="Start typing a Population, Intervention, Comparator, or Outcome (PICO) to select tags for filtering." validation="required" error-behavior="submit" validation-behavior="live" />
                    <FormulateInput type="textarea" name="background" label="Existing BACKGROUND section (optional)" validation="optional" validation-behavior="live" error-behavior="submit" help="Please enter an existing systemic review's background section." />
                    <FormulateInput type="textarea" name="methods" label="Existing METHODS section (optional)" validation="optional" validation-behavior="live" error-behavior="submit" help="Please enter an existing systemic review's methods section." />
                    <FormulateInput type="textarea" name="results" label="Existing RESULTS section (optional)" validation="optional" validation-behavior="live" error-behavior="submit" help="Please enter an existing systemic review's results section." />
                    <FormulateInput type="textarea" name="conclusion" label="Existing CONCLUSION section (optional)" validation="optional" validation-behavior="live" error-behavior="submit" help="Please enter an existing systemic review's conclusion section." />
                    <FormulateErrors />
                    <div class="actions">
                        <FormulateInput type="submit" :disabled="isLoading" :label="isLoading ? 'Loading...' : 'Submit'" />
                        <FormulateInput type="button" label="Reset" data-ghost @click="reset" />
                    </div>
                    <!-- This is just for debugging and test purposes. The code part can be removed for production. -->
                    <!-- <code class="code code--block">
                        INPUT STATE (for development only)<br>
                        name: {{ formValues.name }}<br>
                        document: {{ formValues.document }}<br>
                        tags: {{ formValues.tags }}<br>
                        background: {{ formValues.background }}<br>
                        methods: {{ formValues.methods }}<br>
                        results: {{ formValues.results }}<br>
                        conclusion: {{ formValues.conclusion }}<br>
                    </code> -->
                </FormulateForm>
            </b-container>
            </div>
            <div class="submitted" v-else>
                Submitted successfully!
                <div class="new_form">
                    <FormulateInput type="button" label="Create Another Live Summary" @click="newForm" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import settings from '../settings.js';
export default {
    name: "CreateSummaryForm",
    data() {
        return {
            formValues: {
                tags: []
            },
            isLoading: false,
            formErrors: [],
            isSubmitted: false,
        };
    },
    watch: {
        '$store.state.categoryTags': {
            immediate: true,
            handler() {
               // update locally relevant data
               this.formValues.tags = this.$store.getters.getCategoryTags;
            }
        }
    },
    computed: {
        signedInStatus() {
            return this.$store.getters.getSignedInStatus;
        },
        token() {
            return this.$store.getters.getToken;
        },
    },
    methods: {
        async sendData(data) {
            try {
                console.log(data)
                const url = `${settings.url}/api/create_live_summary`;
                const headers = { Authorization: `Bearer ${this.token}` };
                const result = await axios.post(url, data, { headers: headers});
                
                this.isSubmitted = result.data.success;
                if (!result.data.success) {
                    this.formErrors = ['There was an error submitting the form.'];
                }
                this.$store.dispatch("updateReviewMeta");
            } catch (err) {
                if (err.response && err.response.data.message) {
                    this.formErrors = err.response.data.message;
                    return
                }
                this.formErrors = ['There was an error submitting the form.'];
            }
        },
        reset() {
            this.$store.dispatch("updateCategoryTags", [])
            this.$formulate.reset('form');
        },
        newForm() {
            this.isLoading = false;
            this.formErrors = [];
            this.$store.dispatch("updateCategoryTags", [])
            this.isSubmitted = false;
        },
        async uploadFile(file, progress, error) {
            try {
              const formData = new FormData();
              formData.append('csv_file', file);
              const result = await fetch(`${settings.url}/api/upload_csv`, {
                method: 'POST',
                body: formData
              })
              progress(100); // (native fetch doesn’t support progress updates)
              return await result.json();
            } catch (err) {
              error('Unable to upload file');
            }
        },
    },
};
</script>
<style scoped>
@import '../assets/css/snow.css';

.actions {
    display: flex;
    margin-bottom: 1em;
    margin-top: 1em;
}

.actions .formulate-input {
    margin-right: 1em;
    margin-bottom: 0;
}

.submitted {
    margin-bottom: 1em;
    margin-top: 1em;
}

.submitted .formulate-input {
    margin-right: 1em;
    margin-bottom: 0;
    margin-top: 1em;
}
</style>