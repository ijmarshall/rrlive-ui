<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">      
        <hr />
        <br /><br />
        <alert :message="message" v-if="showMessage"></alert>
        <br /><br />
    <span v-if="numberTodo>0">{{ numberTodo }} / {{ numberTotal }} abstracts still to screen</span>
    <span v-else>Abstracts all screened!</span>
    <div v-for="(abstract, index) in abstracts" :key="abstract.id">
      {{ index }}
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
        @change="updateFirebase(abstract.id, abstract.included)"
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

import appwrite from "../AppwriteInit.js";


export default {
  data() {
    return {
      abstracts: [],
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
    reference() {
      let text = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
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
    updateFirebase(id, state) {
        let promise = appwrite.database.updateDocument('[COLLECTION_ID]', '[DOCUMENT_ID]', {}, [], []);

        promise.then(function (response) {
        console.log(response); // Success
            }, function (error) {
        console.log(error, state); // Failure
        });

        // db.ref("review_results/"+id).update({included: state});
    },
    getAbstracts() {
        let promise = appwrite.database.listDocuments('60341a26ca741');

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
