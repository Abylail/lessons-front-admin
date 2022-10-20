import Vue from "vue";

import ModalService from 'vue-modal-service';
Vue.use(ModalService);

import { VueMaskDirective } from 'v-mask'
Vue.directive("mask", VueMaskDirective);
