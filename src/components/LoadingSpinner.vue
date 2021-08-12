<template>
    <div class="container">
        <div class="text-center m-5">
            <b-spinner class="m-2" label="Spinning"></b-spinner>
            <b-spinner class="m-2" type="grow" label="Spinning"></b-spinner>
            <b-spinner class="m-2" variant="primary" label="Spinning"></b-spinner>
            <b-spinner class="m-2" variant="primary" type="grow" label="Spinning"></b-spinner>
            <b-spinner class="m-2" variant="success" label="Spinning"></b-spinner>
            <b-spinner class="m-2" variant="success" type="grow" label="Spinning"></b-spinner>
        </div>
    </div>
</template>
<script>
export default { // do not need to pass in this prop at the moment. can uncomment in future if needed
    // props: ['isLoading'],
    // data() {
    //     return {
    //         isLoading: this.isLoading,
    //     };
    // },
};
</script>