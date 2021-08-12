<template>
    <div class="landing">
        <div class="welcome">
            <img src="https://robotreviewer.vortext.systems/img/logo.svg">
            <h1 class="text-center">Welcome to RobotReviewer LIVE!</h1>
            <p class="text-center">To begin using RoboReviewer LIVE, please sign in using your <b-link href="https://github.com/">Github</b-link> credentials.</p>
            <p class="text-center">For more information, please refer to the <b-link :to="{ name: 'about' }">About</b-link> page.</p>
        </div>
    </div>
</template>
<script>
export default {
    name: "Landing",
    components: {},
    computed: {
        signedInStatus() {
            return this.$store.getters.getSignedInStatus;
        },

    },
};
</script>
<style scoped>
.welcome {
    padding: 1em;
}
.welcome .message {
    margin: 1.5em;
}
</style>