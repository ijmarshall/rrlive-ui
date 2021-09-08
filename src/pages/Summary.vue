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

            <h6>Old Review vs Updated Review</h6>
            <div class="m-4" id="outputdiv">
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
        }
    },
    computed: {
        token() {
            return this.$store.getters.getToken;
        },
    },
    methods: {
        updateSummary() {

            // var summary;
            const headers = { Authorization: `Bearer ${this.token}` };
            axios
                .get(`${settings.url}/api/get_live_review_summary/${this.$route.params.revid}`, { headers: headers })
                .then(response => {
                    this.summary = response.data;
                    const dmp = new DiffMatchPatch();
                    const diff = dmp.diff_main(this.summary.conclusion, this.summary.automated_narrative_summary);
                    var ds = dmp.diff_prettyHtml(diff);
                    document.getElementById('outputdiv').innerHTML = ds;
                }).catch(error => {
                    console.log(error); // error
                });
        },
    },
    mounted() {
        this.updateSummary()
    }
};
</script>
<style scoped>
</style>