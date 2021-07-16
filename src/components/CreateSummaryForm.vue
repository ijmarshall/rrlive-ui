<template>
    <div class="container">
        <!-- <div class="form" v-if="signedInStatus"> -->
        <b-container fluid="xs" class="shadow-sm p-4 bg-white rounded">
            <FormulateForm name="form" class="summary-form" v-model="formValues" @submit="sendData" #default="{ isLoading }" :form-error="formErrors">
                <h1>Create New RobotReviewer Live Summary</h1>
                <p>RobotReviewer LIVE is an interface to produce semi-automatic, living, systematic reviews.
                    <br>Please submit the following information to create a new live summary.</p>
                <FormulateInput name="name" type="text" label="Name of Live Summary" help="Please enter a name" validation="required" validation-behavior="live" error-behavior="submit" />
                <FormulateInput type="file" name="document" label="Article Decisions" help="Select a csv (with pmid, title, abstract, and decision - 'Include' or 'Exclude') to upload." validation="required|mime:text/csv,text/x-csv" upload-behavior="delayed" validation-behavior="live" error-behavior="submit" :uploader="uploadFile" />
                <FormulateInput type="searchbox" name="tags" label="Tags/Categories" help="Start typing a Population, Intervention, Comparator, or Outcome (PICO) to select tags for filtering." validation="required" error-behavior="submit" validation-behavior="live" />
                <FormulateInput type="textarea" name="existing_summary" label="Enter existing summary" validation="optional" validation-behavior="live" error-behavior="submit" help="Please enter an existing systemic review/summary. (optional)" />
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
                    existing_summary: {{ formValues.existing_summary }}
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
    name: "CreateSummaryForm",
    data() {
        return {
            formValues: {
                tags: []
            },
            isLoading: false,
            formErrors: []
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
            await axios.put(url, data, { headers: { Authorization: `Bearer ${this.token}` } })
                .then((response) => {
                console.log(response.data)
                return response 
                })
                .catch((error) => {
                    this.formErrors = ["There was an error submitting the form."]
                    console.log(error)
                    return
                });
        },
        reset() {
            if (this.$route.query.q && this.$route.query.q.length > 0) {
                this.$router.push({ name: 'createsummary' });
            }
            this.$formulate.reset('form')
        },
        async uploadFile(file, progress, error, options) {
            try {
              const formData = new FormData()
              formData.append('csv_file', file)
              const result = await fetch(`${settings.url}/api/upload_csv`, {
                method: 'POST',
                body: formData
              })
              console.log(options)
              progress(100) // (native fetch doesn’t support progress updates)
              return await result.json()
            } catch (err) {
              error('Unable to upload file')
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
</style>