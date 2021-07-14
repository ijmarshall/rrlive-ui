<template>
    <div class="search" >
        <vue-tags-input v-model="tag" :tags="tags" :autocomplete-items="autocompleteItems" :add-only-from-autocomplete="true" @tags-changed="update" style="max-width: 30em; margin-bottom: .1em;" v-bind="tags" />
        <div class="loading">
            <b-spinner v-if="loading" small label="Loading" variant="secondary" />
        </div>
        <b-alert v-if="error" show dismissible variant="danger" style="max-width: 30em; margin-top: 1em">
            {{error}}
        </b-alert>
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
            tag: "",
            tags: [],
            autocompleteItems: [],
            debounce: null,
            loading: false,
            error: null
        };
    },
    mutations: {
        updateTags (state, new_tags) {
            state.tags = new_tags;
        },
        updateLoading (state, loading) {
            state.loading = loading;
        }
    },
    getters: {
        getTags(state) {
            return state.tags;
        },
        getLoading(state) {
            return state.loading;
        }
    },
    computed: {
        token() {
            return this.$store.getters.getToken;
        },
    },
    watch: {
        tag: "initItems",
        $route(to) {
            this.loading = true;
            let tags = JSURL.parse(to.query.q) || [];
            if (tags !== this.tags || !tags.length) {
                this.tags = tags.map((item) => ({
                    classes: item.field,
                    text: item.text,
                    cui: item.cui,
                }));
            }
            this.loading = false;
        }
    },
    beforeMount() {
        let tags = JSURL.parse(this.$route.query.q);
        if (tags && tags.length) {
            this.tags = tags.map((item) => ({
                classes: item.field,
                text: item.text,
                cui: item.cui,
            }));
        }
    },
    methods: {
        update(newTags) {
            this.autocompleteItems = [];
            let tags = newTags.map((item) => ({
                field: item.classes,
                text: item.text,
                cui: item.cui,
            }));
            this.$router.push({ name: 'createsummary', query: { q: JSURL.stringify(tags) } });
        },
        initItems() {
            if (this.tag.length < 2) return;
            const url = `${settings.url}/api/get_autocomplete_tags?q=${this.tag.toLowerCase()}`;
            clearTimeout(this.debounce);
            this.loading = true;
            let self = this;
            this.debounce = setTimeout(() => {
                axios
                    .get(url, { headers: { Authorization: `Bearer ${this.token}` } })
                    .then((response) => {
                        console.log(response)
                        this.autocompleteItems = response.data.data.map((item) => ({
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
.loading {
    position: absolute;
    opacity: 0.5;
    left: 28em;
    bottom: .5em;
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
    background: #003F5C;
}

.vue-tags-input .ti-tag.interventions {
    background: #FFA600;
    color: #000;
}

.vue-tags-input .ti-tag.outcomes {
    background: #BC5090;
}
</style>