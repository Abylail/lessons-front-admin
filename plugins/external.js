import Vue from "vue";

import ModalService from 'vue-modal-service';
Vue.use(ModalService);

import {VueMaskDirective, VueMaskFilter} from 'v-mask'
Vue.directive("mask", VueMaskDirective);
Vue.filter("vmask", VueMaskFilter);
