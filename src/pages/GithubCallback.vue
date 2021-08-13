<template>
  <div class="m-2">
    <div v-if="!user">Authorizing ...</div>
    <div v-else>
      Logged in ...
    </div>
  </div>
</template>

<script>
import axios from "axios";
import settings from "../settings.js"
export default {
  name: "GithubCallback",
  data() {
    return {
      token: undefined,
      user: undefined
    };
  },
  created() {
    this.authorize();
  },
  methods: {
    authorize() {
      
      const data = {
        state: this.$route.query.state,
        code: this.$route.query.code
      };

      console.log(data);
      axios
        .post(`${settings.url}/api/authorize`, data)
        .then(response => {
          console.log(response.data)
          this.$store.commit("setToken",response.data.access_token)
          this.$store.dispatch("signIn")
          this.$router.replace("/");
        })
        .catch((response) => {
          console.log(response)
          this.$router.replace("/");

        });
    },

  }
};
</script>