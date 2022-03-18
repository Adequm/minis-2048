import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import createMutationsSharer from 'vuex-shared-mutations';
import _ from 'lodash';

const projectKey = location.pathname.split('/')[1].split('-').slice(1).join('-');
const fullscreenKey = `${ projectKey }-isFullscreen`;
import { vuexMinisModule as minisModule, persistedMinis } from '@minis-core/mixins';

const store = {};
Vue.use(Vuex);

store.state = () => ({
  [fullscreenKey]: false,
  switchFullscreenKey: `switch_${fullscreenKey}`,
  projectKey,
  maxScore: 0,
  currentScore: 0,
  gameTypesList: ['raindrops', 'square'],
  gameType: 'raindrops',
  rowsMount: 4,
  colsMount: 4,
});


store.getters = {
  isFullscreen: state => state[fullscreenKey],
};


store.mutations = {
  [`switch_${fullscreenKey}`]: state => Vue.set(state, fullscreenKey, !state[fullscreenKey]),
  setCurrentScore: (state, score) => Vue.set(state, 'currentScore', score),
  setMaxScore(state, score) {
    if(state.maxScore >= score) return;
    Vue.set(state, 'maxScore', score);
  },
  switchGameType(state) {
    const index = _.indexOf(state.gameTypesList, state.gameType);
    const nextIndex = (index + 1) % state.gameTypesList.length;
    Vue.set(state, 'gameType', state.gameTypesList[nextIndex]);
  },
  setColsMount: (state, mount) => Vue.set(state, 'colsMount', mount),
  setRowsMount: (state, mount) => Vue.set(state, 'rowsMount', mount),
};


const persistedLocal = [
  fullscreenKey,
  'maxScore', 
  'gameType', 
  'rowsMount', 
  'colsMount',
];
store.modules = { minis: minisModule };
store.plugins = [
  createMutationsSharer({ predicate: () => [...persistedMinis, ...persistedLocal] }),
  createPersistedState({ paths: persistedMinis, key: 'minis' }),
  createPersistedState({ paths: persistedLocal, key: `minis-${projectKey}` }),
];

export default new Vuex.Store(store);