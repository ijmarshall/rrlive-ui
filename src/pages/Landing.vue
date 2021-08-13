<template>
    <div v-if="isLoading">
        <LoadingSpinner />
    </div>
    <div v-else class="container">
        <div class="p-3 text-center" v-if="!signedInStatus">
            <b-img center fluid thumbnail :src="require('../assets/rr_logo.png')" alt="RobotReviewer Logo"></b-img>
            <h1 class="m-4">Welcome to RobotReviewer LIVE!</h1>
            <p>To begin using RoboReviewer LIVE, please sign in using an authorized <b-link href="https://github.com/" target="_blank">Github</b-link> account.</p>
            <p>For more information, please refer to the <b-link :to="{ name: 'about' }">About</b-link> page.</p>
        </div>
        <div class="p-3" v-if="signedInStatus">
            <h1 class="m-4 text-center">Welcome to RobotReviewer LIVE!</h1>
            <div v-if="numberOfReviewMeta>0">
                <div class="card-body">
                    <!-- Might be good to take this out to it's own component in the future if we will add more components to this page -->
                    <!-- Might need to add pagination if users end up creating a lot of live summaries -->
                    <h5 class="card-title">Your Dashboard</h5>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Title</th>
                                <th scope="col">Last Updated</th>
                                <th scope="col"># of Abstracts to Screen</th>
                                <th scope="col">Link to Screening</th>
                                <th scope="col">Link to Live Summary</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="review in reviewMeta" :key="review.revid">
                                <td scope="row">{{review.revid}}</td>
                                <td>{{review.title}}</td>
                                <td>{{review.last_updated.substring(0,10)}}</td>
                                <td>{{review.num_abstracts_to_screen}}</td>
                                <td>
                                    <b-button class="btn-sm" v-on:click="updateActiveReview(review)">Go to Screening</b-button>
                                </td>
                                <td>
                                    <b-button class="btn-sm" :to="'/summary/' + review.revid">Go to Live Summary</b-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <b-button :to="{ name: 'createsummary' }">Create New Live Summary</b-button>
                </div>
            </div>
            <div v-else>
                <p>You currently do not have any live reviews yet.</p>
                <p>You can create a new live summary/review by clicking on the button below.</p>
                <b-button :to="{ name: 'createsummary' }">Create New Live Summary</b-button>
            </div>
        </div>
    </div>
</template>
<script>
import LoadingSpinner from "../components/LoadingSpinner.vue";
export default {
    name: "Landing",
    components: { LoadingSpinner, },
    created() {
        if (this.signedInStatus) {
            this.$store.dispatch("updateReviewMeta");
        }
    },
    computed: {
        signedInStatus() {
            return this.$store.getters.getSignedInStatus;
        },
        reviewMeta() {
            return this.$store.getters.getReviewMeta;
        },
        numberOfReviewMeta() {
            return this.reviewMeta ? this.reviewMeta.length : 0;
        },
        isLoading() {
            return this.$store.getters.getIsLoading;
        },
    },
    methods: {
        updateActiveReview(review) {
            this.$router.push({ name: 'screenabstracts' });
            this.$store.dispatch("updateActiveReview", review)
        },
    },
};
</script>
<style scoped>
</style>