<template>
    <div class="container">
    <!-- <div class="form" v-if="signedInStatus"> -->
        <b-container fluid="xs" class="shadow-sm p-4 bg-white rounded">
            <FormulateForm name="form" class="summary-form" v-model="formValues" @submit="sendData" #default="{ isLoading }">
                <h1>Create New RobotReviewer Live Summary</h1>
                <p>RobotReviewer LIVE is an interface to produce semi-automatic, living, systematic reviews.
                    <br>Please submit the following information to create a new live summary.</p>
                <FormulateInput name="name" type="text" label="Name of Live Summary" help="Please enter a name" validation="required" validation-behavior="live" error-behavior="submit" />
                <FormulateInput type="file" name="document" label="Article Decisions" help="Select a csv (with PMID, title, article, and 'Include' or 'Exclude' to indicate decision to include or not for summary) to upload." validation="required|mime:text/csv,text/x-csv" upload-behavior="delayed" validation-behavior="live" error-behavior="submit" />
                <FormulateInput
                    type="searchbox"
                    name="tags"
                    label="Tags/Categories"
                    help="Start typing a Population, Intervention, Comparator, or Outcome (PICO) to select tags for filtering."
                    validation="required"
                    error-behavior="submit"
                    validation-behavior="live"
                />
                <FormulateInput type="textarea" name="existingSummary" label="Enter existing summary" validation="optional" validation-behavior="live" error-behavior="submit" help="Please enter an existing systemic review/summary. (optional)" />
                <FormulateErrors />
                <div class="actions">
                    <FormulateInput type="submit" :disabled="isLoading" :label="isLoading ? 'Loading...' : 'Submit'" />
                    <FormulateInput type="button" label="Reset" data-ghost @click="reset" />
                </div>
                <!-- This is just for debugging and test purposes. The code part can be removed for production. -->
                <code class="code code--block">
                    INPUT STATE (for development only)<br>
                    name: {{ formValues.name }}<br>
                    document: {{ formValues.document }}<br>
                    tags: {{ formValues.tags }}<br>
                    existingSummary: {{ formValues.existingSummary }}
                </code>
            </FormulateForm>
        </b-container>
    <!-- </div> -->
    </div>
</template>
<script>
import JSURL from "jsurl";
import axios from "axios";
import settings from '../settings.js';
export default {
    name:"CreateSummaryForm",
    data() {
        return {
            formValues: {
                tags:[]
            },
            isLoading: false,
        };
    },
    watch: {
        $route(to) {
            let tags = JSURL.parse(to.query.q) || [];
            if (tags !== this.tags || !tags.length) {
                const parsed_tags = tags.map((item) => ({
                    classes: item.field,
                    text: item.text,
                    cui: item.cui,
                }));
                this.formValues.tags = parsed_tags;
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
            console.log(data)
            const url = `${settings.url}/api/create_live_summary`;
            const response = await axios.put(url, data, { headers: { Authorization: `Bearer ${this.token}` } })
            console.log(response)
        },
        reset() {
            if (this.$route.query.q && this.$route.query.q.length > 0) {
                this.$router.push({ name: 'createsummary'});
            }
            this.$formulate.reset('form')
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
</style>