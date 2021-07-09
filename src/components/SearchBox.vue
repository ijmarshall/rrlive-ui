<template>
    <div class="formulate-input formulate-input-wrapper formulate-input-element">
        <div class="search">
            <label id="formulate--createsummary-3_label" for="formulate--createsummary-1" class="formulate-input-label formulate-input-label--before">
                Tags/Categories
            </label>
            <vue-tags-input v-model="tag" :tags="tags" :autocomplete-items="autocompleteItems" :add-only-from-autocomplete="true" @tags-changed="update" style="max-width: 30em; margin-bottom: .1em;" v-bind="tag" /> 
            <!-- v-model="formValues" -->
            <div class="loading">
                <b-spinner v-if="loading" small label="Loading" variant="secondary" />
            </div>
            <div id="formulate--createsummary-1-help" class="formulate-input-help formulate-input-help--after">Start typing a Population, Intervention, Comparator, or Outcome (PICO) to select tags for filtering.</div>
            <b-alert v-if="error" show dismissible variant="danger" style="max-width: 30em; margin-top: 1em">
                {{error}}
            </b-alert>
        </div>
    </div>
</template>
<script>
import VueTagsInput from "@johmun/vue-tags-input";
import axios from "axios";
import JSURL from "jsurl";
import settings from '../settings.js';
export default {
    name: "SearchBox",
    components: {
        VueTagsInput,
    },
    data() {
        return {
            formValues: {},
            tag: "",
            tags: [],
            autocompleteItems: [],
            debounce: null,
            loading: false,
            error: null
        };
    },
    computed: {
        isLoading() {
            return this.$store.getters.getLoadingArticles;
        },
        token() {
            return this.$store.getters.getToken;
        },
    },
    watch: {
        tag: "initItems",
        $route(to) {
            this.$store.commit("loadingArticles", true);
            let tags = JSURL.parse(to.query.q) || [];
            if (tags !== this.tags || !tags.length) {
                this.tags = tags.map((item) => ({
                    classes: item.field,
                    text: item.text,
                    cui: item.cui,
                }));
                this.$store.commit("updateTags", this.tags);
            }
            if (tags.length) {
                this.fetch(tags);
            } else {
                this.$store.commit("updateArticles", []);
            }
        }
    },
    beforeMount() {
        this.$store.commit("updateArticles", []);
        let tags = JSURL.parse(this.$route.query.q);
        if (tags && tags.length) {
            this.$store.commit("updateTags", tags);
            this.tags = tags.map((item) => ({
                classes: item.field,
                text: item.text,
                cui: item.cui,
            }));
            this.fetch(tags);
        }
    },
    methods: {
        fetch(tags) {
            this.$store.commit("loadingArticles", true);
            let self = this;
            const url = `${settings.url}/picosearch`;
            axios
                .post(
                    url, { terms: tags }, { headers: { Authorization: `Bearer ${this.token}` } }
                )
                .then((response) => {
                    this.$store.commit("updateArticles", response.data);
                })
                .catch(function(e) {
                    self.error = e.toString();
                    console.error(e.stack);
                })
                .finally(function() {
                    self.$store.commit("loadingArticles", false);
                });
        },
        update(newTags) {
            this.autocompleteItems = [];
            let tags = newTags.map((item) => ({
                field: item.classes,
                text: item.text,
                cui: item.cui,
            }));
            this.$router.push({ name: 'search', query: { q: JSURL.stringify(tags) } });
        },
        initItems() {
            if (this.tag.length < 2) return;
            const url = `${settings.url}/autocomplete?q=${this.tag.toLowerCase()}`;
            clearTimeout(this.debounce);
            this.loading = true;
            let self = this;
            this.debounce = setTimeout(() => {
                axios
                    .get(url, { headers: { Authorization: `Bearer ${this.token}` } })
                    .then((response) => {
                        this.autocompleteItems = response.data.map((item) => ({
                            classes: item.field,
                            text: item.cui_pico_display,
                            cui: item.cui,
                        }));
                    })
                    .catch(function(e) {
                        self.error = e.toString();
                        console.error(e.stack);
                    })
                    .finally(() => this.loading = false);
            }, 125);
        },
    },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import '../assets/css/snow.css';

.loading {
    position: absolute;
    opacity: 0.5;
    left: 28em;
    bottom: 1.5em;
}

.search {
    position: relative;
    margin: 0 auto;
}

.search .vue-tags-input {
    max-width: none;
    width: 100%;
}

.search .vue-tags-input .ti-input {
    border-radius: .3em;
}

.vue-tags-input .ti-tag.population {
    background: var(--population-background);
}

.vue-tags-input .ti-tag.interventions {
    background: var(--intervention-background);
    color: var(--intervention-color);
}

.vue-tags-input .ti-tag.outcomes {
    background: var(--outcome-background);
}
</style>