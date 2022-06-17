<template>
    <b-container fluid="xs" class="shadow-sm p-4 bg-white rounded">
        <h1>RobotReviewer Live Summary</h1>
        <p>RobotReviewer LIVE is an interface to produce semi-automatic, living, systematic reviews</p>
        <b-card title="Live-updating abstract">

            <div class="mt-2 mb-2">{{templatedSummary}}</div>

            <strong>BACKGROUND</strong>
            <p>{{ summary.background }}</p>
            <strong>METHODS</strong>
            <p>{{ summary.methods }}</p>
            <strong>RESULTS</strong>
            <p>{{ summary.results }}</p>
            <!-- <div class="mt-4">
                <code-diff
                  :old-string="summary.conclusion"
                  :new-string="summary.automated_narrative_summary"/>
            </div> -->

            <strong>CONCLUSIONS</strong>
            <div class="mt-4 mb-4">
                <FormulateForm @submit="updateConclusion" :form-errors="saveFormErrors">
                    <FormulateInput type="textarea" v-model="summary.conclusion"
                        label="Edit the conclusion based on suggestions below" validation="required" error-behavior="submit"/>
                    <FormulateErrors />
                    <FormulateInput type="submit" :label="isSaveLoading ? 'Loading...' : 'Save'"
                        :disabled="isSaveLoading || this.token == null" />
                </FormulateForm>
            </div>
            <h6>Original Conclusion vs Updated Conclusion</h6>
            <div class="mt-4 mb-4">
                <FormulateForm v-model="sliderValue" @submit="updateSummaryByDiff" :form-errors="updateFormErrors">
                    <FormulateInput label="How many edits would you like the updated conclusion to have?" type="range"
                        name="number_edits" min="1" max="10" value="1" validation="min:0|max:10" error-behavior="live"
                        :show-value="true" />
                    <FormulateErrors />
                    <FormulateInput type="submit" :label="isUpdateLoading ? 'Loading...' : 'Update'"
                        :disabled="isUpdateLoading || this.token == null" />
                </FormulateForm>
            </div>
            <div class="mt-4 mb-4" id="outputdiv">
            </div>
        </b-card>
    </b-container>
</template>
<script>
import axios from 'axios';
import settings from '../settings.js'
import DiffMatchPatch from 'diff-match-patch';
// import {CodeDiff} from 'v-code-diff'

export default {
    name: "Summary",
    components: {
        //CodeDiff
    },
    data() {
        return {
            templatedSummary: "",
            updateFormErrors: [],
            saveFormErrors: [],
            summary: {
                bakground: null,
                methods: null,
                results: null,
                conclusion: "",
                automated_narrative_summary: "",
            }, // summary object with all different sections
            sliderValue: {
                range: "1"
            },
            isUpdateLoading: false,
            isSaveLoading: false
        }
    },
    computed: {
        token() {
            return this.$store.getters.getToken;
        },
    },
    methods: {
        getSummary() {
            const headers = { Authorization: `Bearer ${this.token}` };
            axios
                .get(`${settings.url}/api/get_live_review_summary/${this.$route.params.revid}`, { headers: headers })
                .then(response => {
                    console.log(response.data)
                    this.summary = response.data;
                    const dmp = new DiffMatchPatch();
                    const diff = dmp.diff_main(this.summary.conclusion, this.summary.automated_narrative_summary);
                    dmp.diff_cleanupSemantic(diff);
                    // Count non-copy diff
                    const count = diff.filter(edit => {
                        if (edit[0] != 0) {
                            return true;
                        }
                        return false;
                    }).length;
                    this.sliderValue.range = count;

                    var ds = dmp.diff_prettyHtml(diff);
                    document.getElementById('outputdiv').innerHTML = ds;
                }).catch(error => {
                    console.log(error); // error
                });
        },
        getTemplatedSummary() {
            axios
                .get(`${settings.url}/api/summarize_new_evidence/${this.$route.params.revid}`)
                .then(response => {
                    this.templatedSummary = response.data;
                }).catch(error => {
                    console.log(error); // error
                });
        },
        updateSummaryByDiff() {
            this.isUpdateLoading = true;
            const headers = { Authorization: `Bearer ${this.token}` };
            axios
                .get(`${settings.url}/api/get_updated_summary/${this.$route.params.revid}?num_edits=${this.sliderValue.range - 1}`, { headers: headers })
                .then(response => {
                    const updated_summary = response.data.updated_summary;
                    this.summary.automated_narrative_summary = updated_summary;
                    const dmp = new DiffMatchPatch();
                    const diff = dmp.diff_main(this.summary.conclusion, this.summary.automated_narrative_summary);
                    // this.sliderValue.range = this.sliderValue.range + 1;
                    var ds = dmp.diff_prettyHtml(diff);
                    document.getElementById('outputdiv').innerHTML = ds;
                }).catch(error => {
                    console.log(error); // error
                    this.updateFormErrors = ['Sorry, an unexpected error occurred. Please try again soon..']
                }).then(() => {
                    // always executed
                    this.isUpdateLoading = false;
                });
        },
        updateConclusion() {
            this.isSaveLoading = true;
            const headers = { Authorization: `Bearer ${this.token}` };
            axios
                .post(`${settings.url}/api/update_live_summary_conclusion/`, {"revid": this.$route.params.revid, "conclusion": this.summary.conclusion}, { headers: headers })
                .then(response => {
                    const success = response.data.success;
                    if (!success) {
                        this.saveFormErrors = ['There was an error saving.'];
                    }
                }).catch(error => {
                    console.log(error); // error
                    this.saveFormErrors = ['Sorry, an unexpected error occurred. Please try again soon..']
                }).then(() => {
                    // always executed
                    this.isSaveLoading = false;
                });
        },
    },
    created() {
        this.getSummary();
        this.getTemplatedSummary();
    }
};
</script>
<style scoped>
</style>