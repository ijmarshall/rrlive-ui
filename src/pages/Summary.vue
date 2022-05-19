<template>
    <b-container fluid="xs" class="shadow-sm p-4 bg-white rounded">
        <h1>RobotReviewer Live Summary</h1>
        <p>RobotReviewer LIVE is an interface to produce semi-automatic, living, systematic reviews</p>
        <b-card title="Live-updating abstract">
            <strong>BACKGROUND</strong>
            <p>{{summary.background}}</p>
            <strong>METHODS</strong>
            <p>{{summary.methods}}</p>
            <strong>RESULTS</strong>
            <p>{{summary.results}}</p>
            <strong>AUTOMATIC UPDATES</strong>
            <p>{{summary.automated_narrative_summary}}</p>

            <h6>Original Conclusion vs Updated Conclusion</h6>
            <div class="mt-4 mb-4">
                <FormulateForm
                    v-model="sliderValue"
                    @submit="updateSummaryByDiff"
                >
                    <FormulateInput
                        label="How many edits would you like the updated conclusion to have?"
                        type="range"
                        name="range"
                        min="1"
                        max="10"
                        value="1"
                        validation="min:0|max:10"
                        error-behavior="live"
                        :show-value="true"
                    />
                    <!-- <FormulateInput
                        type="submit"
                        :label="isLoading ? 'Loading...' : 'Update'"
                        :disabled="isLoading"
                    /> -->
                </FormulateForm>
            </div>
            <div class="mt-4 mb-4" id="outputdiv">
            </div>

            <!-- <div class="mt-4">
                <code-diff
                  :old-string="summary.conclusion"
                  :new-string="summary.automated_narrative_summary"/>
            </div> -->

            <strong>CONCLUSIONS</strong>
            <p>{{summary.conclusion}}</p>
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
            isLoading: false,
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
        updateSummaryByDiff() {
            this.isLoading = true;
            new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
                this.isLoading = false;
            });
            // TODO: NEED TO FIGURE OUT HOW TO MAKE THIS WORK ONE AT A TIME
            // const headers = { Authorization: `Bearer ${this.token}` };
            // axios
            //     .get(`${settings.url}/api/get_updated_summary/${this.$route.params.revid}`, { headers: headers })
            //     .then(response => {
            //         const updated_summary = response.data.updated_summary;
            //         this.summary.automated_narrative_summary = updated_summary;
            //         const dmp = new DiffMatchPatch();
            //         const diff = dmp.diff_main(this.summary.conclusion, this.summary.automated_narrative_summary);
            //         this.sliderValue.range = this.sliderValue.range + 1;
            //         var ds = dmp.diff_prettyHtml(diff);
            //         document.getElementById('outputdiv').innerHTML = ds;
            //     }).catch(error => {
            //         console.log(error); // error
            //     });
        },
    },
    created() {
        this.getSummary()
    }
};
</script>
<style scoped>
</style>