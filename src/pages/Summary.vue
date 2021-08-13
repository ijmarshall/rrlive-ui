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
            <p>INSERT NARRATIVE SUMMARY HERE</p>
            <strong>CONCLUSIONS</strong>
            <p>{{summary.conclusion}}</p>
        </b-card>
    </b-container>
</template>
<script>
import axios from 'axios';
import settings from '../settings.js'


export default {
    name: "Summary",
    components: {},
    data() {
        return {
            summary: {
                bakground: null,
                methods: null,
                results: null,
                conclusion: null,
                automated_narrative_summary: null,
            }, // summary object with all different sections
        }
    },
    computed: {
        token() {
            return this.$store.getters.getToken;
        },
        // summary() {

        // return this.$store.getters.getSummary;
        // },
    },
    methods: {
        updateSummary() {

            // var summary;
            const headers = { Authorization: `Bearer ${this.token}` };
            axios
                .get(`${settings.url}/api/get_live_review_summary/${this.$route.params.revid}`, { headers: headers })
                .then(response => {
                    this.summary = response.data;
                }).catch(error => {
                    console.log(error); // error
                });

            // axios
            //     .get(`${settings.url}/api/get_review_update/${this.$route.params.revid}`)
            //     .then(response => {
            //         this.summary = response.data;
            //     }).catch(error => {
            //         console.log(error); // error
            //     });
            // this.summary = summary;
        },
    },
    mounted() {
        this.updateSummary()
    }
};
</script>
<style scoped>
</style>