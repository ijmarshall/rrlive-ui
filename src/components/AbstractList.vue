<template>
  <div v-if="isLoading">
        <LoadingSpinner />
    </div>
  <div v-else class="container">
    <div class="row" v-if="activeReview.revid != null">

      <div class="col-sm-10">      
        <hr />
        
        
        <br /><br />

        <h1>{{ activeReview.title }} review</h1>
    <span v-if="numberTodo>0">{{ numberTodo }} / {{ numberTotal }} abstracts still to screen</span>
    <span v-else>Abstracts all screened!</span>
    <div v-for="(abstract, index) in abstracts" :key="abstract.pmid">
      Abstract {{ index + 1 }} of {{ numberTotal }}
    <b-card
        :title="abstract.ti"
        :header="abstract.citation"
        :header-text-variant="headerText(abstract.decision)"
        :header-bg-variant="headerBack(abstract.decision)"

        >
    <b-card-text>{{abstract.ab}}</b-card-text>
       <b-form-group
      v-slot="{ ariaDescribedby }"
    >
      <b-form-radio-group
        v-model="abstract.decision"
        :options="includeOptions"
        :aria-describedby="ariaDescribedby"
        button-variant="outline-primary"
        size="lg"
        name="radio-btn-outline"
        @change="changeAbstractStatus(abstract.pmid, abstract.decision)"
        buttons
      ></b-form-radio-group>
    </b-form-group> 

    </b-card>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from "../components/LoadingSpinner.vue";

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
    LoadingSpinner,
  },
  computed: {
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
    isLoading() {
      return this.$store.getters.getIsLoading;
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
