<template>
    <div class="container">
        <!-- <div class="form" v-if="signedInStatus"> -->
        <b-container fluid="xs" class="shadow-sm p-4 bg-white rounded">
            <FormulateForm name="form" class="summary-form" v-model="formValues" @submit="sendData" #default="{ isLoading }">
                <h1>Create New RobotReviewer Live Summary</h1>
                <p>RobotReviewer LIVE is an interface to produce semi-automatic, living, systematic reviews.
                    <br>Please submit the following information to create a new live summary.</p>
                <FormulateInput name="name" type="text" label="Name of Live Summary" help="Please enter a name" validation="required" validation-behavior="live" error-behavior="submit" />
                <FormulateInput type="file" name="document" label="Article Decisions" help="Select a csv (with title, article, and whether we should include or exclude them for summary) to upload." validation="required|mime:text/csv,text/x-csv" upload-behavior="delayed" validation-behavior="live" error-behavior="submit" />
                <FormulateInput
                    type="searchbox"
                    name="tags"
                    label="Tags/Categories"
                    help="Start typing a Population, Intervention, Comparator, or Outcome (PICO) to select tags for filtering."
                    validation="required"
                    error-behavior="submit"
                    validation-behavior="live"
                >
                    <div class="search" >
                        <vue-tags-input v-model="tag" :tags="tags" :autocomplete-items="autocompleteItems" :add-only-from-autocomplete="true" @tags-changed="update" style="max-width: 30em; margin-bottom: .1em;" v-bind="tags" />
                        <div class="loading">
                            <b-spinner v-if="tagsLoading" small label="Loading" variant="secondary" />
                        </div>
                        <b-alert v-if="tagsError" show dismissible variant="danger" style="max-width: 30em; margin-top: 1em">
                            {{tagsError}}
                        </b-alert>
                    </div>
                </FormulateInput>
                <FormulateInput type="textarea" name="existingSummary" label="Enter existing summary" validation="optional" validation-behavior="live" error-behavior="submit" help="Please enter an existing systemic review/summary. (optional)" />
                <FormulateErrors />
                <div class="actions">
                    <FormulateInput type="submit" :disabled="isLoading" :label="isLoading ? 'Loading...' : 'Submit'" />
                    <FormulateInput type="button" label="Reset" data-ghost @click="reset" />
                </div>
                <!-- This is just for debugging and test purposes. The code part can be removed for production. -->
                <code class="code code--block">
                    INPUT STATE (for development only)<br>
                    names: {{ formValues.name }}<br>
                    document: {{ formValues.document }}<br>
                    tags: {{ formValues.tags }}<br>
                    existingSummary: {{ formValues.existingSummary }}
                </code>
            </FormulateForm>
        </b-container>
    </div>
</template>
<script>
import VueTagsInput from "@johmun/vue-tags-input";
import axios from "axios";
import JSURL from "jsurl";
import settings from '../settings.js';
export default {
    name:"CreateSummaryForm",
    data() {
        return {
            formValues: {},
            isLoading: false,
            tag: "",
            tags: [],
            autocompleteItems: [],
            debounce: null,
            tagsLoading: false,
            tagsError: null
        };
    },
    components: {
        VueTagsInput,
    },
    computed: {
        token() {
            return this.$store.getters.getToken;
        },
    },
    watch: {
        tag: "initItems",
        $route(to) {
            this.loading = true;
            let tags = JSURL.parse(to.query.q) || [];
            if (tags !== this.tags || !tags.length) {
                this.tags = tags.map((item) => ({
                    classes: item.field,
                    text: item.text,
                    cui: item.cui,
                }));
                this.formValues.tags = this.tags;
            }
            this.loading = false;
        }
    },
    beforeMount() {
        let tags = JSURL.parse(this.$route.query.q);
        if (tags && tags.length) {
            this.tags = tags.map((item) => ({
                classes: item.field,
                text: item.text,
                cui: item.cui,
            }));
            this.formValues.tags = this.tags;
        }
    },
    methods: {
        async sendData(data) {
            // (in the demo we show the data object at this point)
            // Send data to your server
            console.log(data)
            setTimeout(() => { console.log("HELLO World!"); }, 3000);
            return Promise.resolve(data)
            //await this.$axios.put('/profile', data)
        },
        reset() {
            this.tags = []
            this.$formulate.reset('form')
            if (this.$route.query.q.length > 0) {
                this.$router.push({ name: 'createsummary'});
            }
        },
        update(newTags) {
            this.autocompleteItems = [];
            let tags = newTags.map((item) => ({
                field: item.classes,
                text: item.text,
                cui: item.cui,
            }));
            this.$router.push({ name: 'createsummary', query: { q: JSURL.stringify(tags) } });
        },
        initItems() {
            if (this.tag.length < 2) return;
            this.loading = true;
            const url = `${settings.url}/api/get_autocomplete_tags?q=${this.tag.toLowerCase()}`;
            clearTimeout(this.debounce);
            let self = this;
            this.debounce = setTimeout(() => {
                axios
                    .get(url, { headers: { Authorization: `Bearer ${self.token}` } })
                    .then((response) => {
                        console.log(response)
                        this.autocompleteItems = response.data.data.map((item) => ({
                            classes: item.field,
                            text: item.cui_pico_display,
                            cui: item.cui,
                        }));
                    })
                    .catch(function(e) {
                        self.error = e.toString();
                        console.error(e.stack);
                    })
                    .finally(() => self.loading = false);
            }, 125);
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