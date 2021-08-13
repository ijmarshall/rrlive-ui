<template>
    <!-- SPINNER FOR LOADING -->
    <div v-if="isPageLoading">
        <LoadingSpinner />
    </div>
    <!-- CONTENT -->
    <div v-else class="container">
        <!-- WELCOME/SPLASH SCREEN -->
        <div class="p-3 text-center" v-if="!signedInStatus">
            <b-img center fluid thumbnail :src="require('../assets/rr_logo.png')" alt="RobotReviewer Logo"></b-img>
            <h1 class="m-5">Welcome to RobotReviewer LIVE!</h1>
            <p>To begin using RoboReviewer LIVE, please sign in using an authorized <b-link href="https://github.com/" target="_blank">Github</b-link> account.</p>
            <p>For more information, please refer to the <b-link :to="{ name: 'about' }">About</b-link> page.</p>
        </div>
        <!-- LANDING PAGE -->
        <div class="p-3" v-if="signedInStatus">
            <h1 class="m-5 text-center">Welcome to RobotReviewer LIVE, {{activeUser.name}}!</h1>
            <!-- ACCOUNT INFOMRATION -->
            <!-- Might be good to take this out to it's own component in the future if we will add more components to this page -->
            <div class="card m-3">
                <div class="card-body">
                    <h5 class="card-title">Account Information</h5>
                    <b-alert v-if="!activeUser.email" show dismissible variant="warning">
                        <p>Looks like we don't have your email address yet! Please provide your email by updating your account information.<br>We will only email you when new articles are available for screening.</p>
                    </b-alert>
                    <ul class="list-group">
                        <li class="list-group-item"><strong>Name</strong>: {{activeUser.name}}</li>
                        <li class="list-group-item"><strong>Github username</strong>: {{activeUser.login}}</li>
                        <li class="list-group-item"><strong>Email</strong>: {{activeUser.email}}</li>
                    </ul>
                    <!-- Button trigger modal -->
                    <div class="mt-3">
                        <b-button @click="show=true" variant="info">
                            <b-icon icon="pencil-fill" aria-hidden="true"></b-icon> Update Account Information
                        </b-button>
                        <b-modal v-model="show" title="Update Account Information" hide-footer>
                            <FormulateForm name="form" @submit="submitAccountUpdate" class="update-account-form" v-model="formValues" invalid-message="Not all fields were filled out properly" :form-errors="formErrors" #default="{ isLoading }">
                                <FormulateInput label="Github username (readonly)" name="login" :value="activeUser.login" placeholder="Enter username" help="This field is not editable." readonly />
                                <FormulateInput label="Name" name="name" :value="activeUser.name" placeholder="Enter your name" />
                                <FormulateInput label="Email" type="email" name="email" validation="email" placeholder="Enter your email" :value="activeUser.email" />
                                <!-- Form errors will show here -->
                                <FormulateErrors />
                                <div class="modal-actions">
                                    <b-button class="mr-2" variant="secondary" @click="show=false">
                                        Cancel
                                    </b-button>
                                    <FormulateInput type="submit" :disabled="isLoading" :label="isLoading ? 'Loading...' : 'Submit'" />
                                </div>
                            </FormulateForm>
                        </b-modal>
                    </div>
                </div>
            </div>
            <!-- DASHBOARD -->
            <div class="card m-3" v-if="numberOfReviewMeta>0">
                <!-- Might be good to take this out to it's own component in the future if we will add more components to this page -->
                <!-- Might need to add pagination if users end up creating a lot of live summaries -->
                <div class="card-body">
                    <h5 class="card-title">Your Dashboard</h5>
                    <p>Reviews with the status <b-icon icon="check-circle-fill" variant="success"></b-icon> do not require any action.<br>
                        Reviews with the status <b-icon icon="exclamation-circle-fill" variant="danger"></b-icon> requires you to screen abstracts.</p>
                    <p class="text-muted">Please click the buttons with the abstract numbers to be directed to the corresponding screening page.</p>
                    <table class="table table-striped text-center">
                        <thead>
                            <tr>
                                <th scope="col">Status</th>
                                <th scope="col">ID</th>
                                <th scope="col">Title</th>
                                <th scope="col">Last Updated</th>
                                <th scope="col"># of Abstracts to Screen</th>
                                <!-- <th scope="col">Link to Screening</th> -->
                                <th scope="col">Link to Live Summary</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="review in reviewMeta" :key="review.revid">
                                <td scope="row">
                                    <div>
                                        <b-icon v-if="review.num_abstracts_to_screen==0" icon="check-circle-fill" variant="success"></b-icon>
                                        <b-icon v-else icon="exclamation-circle-fill" variant="danger"></b-icon>
                                    </div>
                                </td>
                                <td scope="row">{{review.revid}}</td>
                                <td>{{review.title}}</td>
                                <td>{{review.last_updated.substring(0,10)}}</td>
                                <td>
                                    <b-button v-if="review.num_abstracts_to_screen==0" pill variant="success" class="btn-sm" style="width: 75%; margin: auto;" v-on:click="updateActiveReview(review)">{{review.num_abstracts_to_screen}}</b-button>
                                    <b-button v-else pill variant="danger" class="btn-sm" style="width: 75%; margin: auto;" v-on:click="updateActiveReview(review)">{{review.num_abstracts_to_screen}}</b-button>
                                </td>
                                <!-- <td>
                                <b-button v-if="review.num_abstracts_to_screen==0" pill block variant="success" class="btn-sm" v-on:click="updateActiveReview(review)">{{review.num_abstracts_to_screen}}</b-button>
                                <b-button v-else pill block variant="danger" class="btn-sm" v-on:click="updateActiveReview(review)">Screen Abstracts</b-button>
                            </td> -->
                                <td>
                                    <b-button pill block class="btn-sm" :to="'/summary/' + review.revid">Live Summary</b-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <b-button variant="info" :to="{ name: 'createsummary' }">
                        <b-icon icon="plus" aria-hidden="true"></b-icon> Create New Live Summary
                    </b-button>
                </div>
            </div>
            <!-- WHEN USER DOESN'T HAVE ANY REVIEWS -->
            <div v-else>
                <p>You currently do not have any live reviews yet.</p>
                <p>You can create a new live summary/review by clicking on the button below.</p>
                <b-button variant="info" :to="{ name: 'createsummary' }">
                    <b-icon icon="plus" aria-hidden="true"></b-icon> Create New Live Summary
                </b-button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import settings from '../settings.js';
import LoadingSpinner from "../components/LoadingSpinner.vue";
export default {
    name: "Landing",
    data() {
        return {
            show: false,
            formErrors: [],
            formValues: {
                name: '',
                email: '',
            },
            isLoading: false,
        }
    },
    components: { LoadingSpinner, },
    created() {
        if (this.signedInStatus) {
            this.$store.dispatch("updateReviewMeta");
            this.$store.commit('setAbstracts', []);
            this.$store.commit('setActiveReview', { activeReviewId: null, activeReviewTitle: null });
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
        isPageLoading() {
            return this.$store.getters.getIsLoading;
        },
        activeUser() {
            return this.$store.getters.getActiveUser;
        },
        token() {
            return this.$store.getters.getToken;
        },
    },
    methods: {
        updateActiveReview(review) {
            console.log("updateActiveReview")
            this.$store.dispatch("updateActiveReview", review);
            this.$router.push({ name: 'screenabstracts' });
        },
        async submitAccountUpdate(data) {
            try {
                console.log(data)
                const url = `${settings.url}/api/update_user_information`;
                const headers = { Authorization: `Bearer ${this.token}` };
                const result = await axios.post(url, data, { headers: headers });

                this.isSubmitted = result.data.success;
                if (!result.data.success) {
                    this.formErrors = ['There was an error submitting the form.'];
                }
                this.show=false;
                this.$store.commit("setActiveUser", result.data.user);
            } catch (err) {
                if (err.response && err.response.data.message) {
                    this.formErrors = err.response.data.message;
                    return
                }
                this.formErrors = ['There was an error submitting the form.'];
            }
        },
    },
};
</script>
<style scoped>
.modal-actions {
    display: flex;
    margin-bottom: 1em;
    margin-top: 1em;
}

.modal-actions .formulate-input {
    margin-right: 1em;
    margin-bottom: 0;
}
</style>