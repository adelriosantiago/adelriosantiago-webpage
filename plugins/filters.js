import Vue from "vue"

Vue.filter("shorten", (text) => `${text.substr(0, 5)}...${text.substr(-5)}`)

// Add more filters here
