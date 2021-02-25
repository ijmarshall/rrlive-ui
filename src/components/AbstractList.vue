<template>
  <div class="container">
    <div class="row" v-if="activeReview.uuid != null">
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
        :header-text-variant="headerText(abstract.included)"
        :header-bg-variant="headerBack(abstract.included)"

        >
    <b-card-text>{{abstract.ab}}</b-card-text>
       <b-form-group
      v-slot="{ ariaDescribedby }"
    >
      <b-form-radio-group
        v-model="abstract.included"
        :options="includeOptions"
        :aria-describedby="ariaDescribedby"
        button-variant="outline-primary"
        size="lg"
        name="radio-btn-outline"
        @change="changeAbstractStatus(abstract.pmid, abstract.included)"
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

import apw from '../AppwriteInit.js';
let appwrite = apw.appwrite;



export default {
  data() {
    return {

      includeOptions: [
          { text: 'Include', value: 'included' },
          { text: 'Exclude', value: 'excluded' },
          { text: 'reset', value: 'new'}
        ],
    };
  },
  components: {

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
        return this.abstracts.filter(abstract => (abstract.included=='new')).length;
    },
    numberTotal() {
        return this.abstracts.length;
    },
    filteredAbs() {
      return this.abstracts.filter(item => {
         return item.data.included
      })
    },


  //   orderedAbs() {
  //       return _.orderBy(this.abstracts, '')
  // }
  },
  methods: {
    changeAbstractStatus(pmid, state) {
      console.log( {pmid: pmid, new_status: state})
      this.$store.dispatch("changeAbstractStatus", {pmid: pmid, new_status: state})
        
    },
    getAbstracts() {
        let filters = [`review_uuid=${this.activeReview.uuid}`]
        let promise = appwrite.database.listDocuments('6037e17461ada', filters);

        promise.then(function (response) {
            console.log(response); // Success
            this.abstracts=response.documents;
        }, function (error) {
            console.log(error); // Failure
        });

    },
    headerText(state) {
        if (state=='new') {return "white"} else {return "dark"}
    },
    headerBack(state) {
        if (state=='new') {return "info"} else {return "light"}
    },
  },
  created() {
    this.getAbstracts();
  }
};
</script>
