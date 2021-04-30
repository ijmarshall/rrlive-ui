<template>
  <div class="container">


      <div class="col-sm-10">
        <hr />


        <br /><br />
      </div>
        <h1>Test-Component is here! review</h1>

        <b-dropdown-item href="#" v-for="review in this.$store.getters.getReviewMeta" :key="review.revid" v-on:click="updateActiveReview(review)">{{ review.title }}</b-dropdown-item>
 </div>
</template>

<script>



export default {
  data() {
    return {

      includeOptions: [
          { text: 'Include', value: true },
          { text: 'Exclude', value: false },
          { text: 'reset', value: null}
        ],
    };
  },
  components: {

  },
  computed: {
    get_summary_covax() {
    return this.$store.getters.get_Summary_covax;
    },
    abstracts() {
      return this.$store.getters.getAbstracts;
    },
    signedInStatus() {
        return this.$store.getters.getSignedInStatus;
    },
    activeReview() {
      return this.$store.getters.getActiveReview;
    },
    numberTodo() {
        return this.abstracts.filter(abstract => (abstract.decision==null)).length;
    },
    numberTotal() {
        return this.abstracts.length;
    },

  },
  methods: {
    changeAbstractStatus(pmid, decision) {
      console.log( {pmid: pmid, decision: decision})
      this.$store.dispatch("changeAbstractStatus", {pmid: pmid, decision: decision})

    },
    headerText(state) {
        if (state=='new') {return "white"} else {return "dark"}
    },
    headerBack(state) {
        if (state=='new') {return "info"} else {return "light"}
    },
  },
  // created() {
    // this.getAbstracts();
  // }
};
</script>
