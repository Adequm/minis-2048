import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import createMutationsSharer from 'vuex-shared-mutations';
import _ from 'lodash';

const projectKey = location.pathname.split('/')[1];
import minisModule from './minis';

const store = {};
Vue.use(Vuex);

store.state = () => ({
  projectKey: projectKey.split('-').slice(-1)[0],
  maxScore: 0,
  currentScore: 0,
  gameTypesList: ['raindrops', 'square'],
  gameType: 'raindrops',
  rowsMount: 4,
  colsMount: 4,
});


store.mutations = {
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


const persistedMinis = [
  'minis.minisThemeMain', 'minis.minisThemeSpecial', 'minis.minisLang',
  'minis.themesJSON', 'minis.translateJSON', 'minis.minisJSON',
];
const persistedLocal = ['maxScore', 'gameType', 'rowsMount', 'colsMount'];
store.modules = { minis: minisModule };
store.plugins = [
  createMutationsSharer({ predicate: () => [...persistedMinis, ...persistedLocal] }),
  createPersistedState({ paths: persistedMinis, key: 'minis' }),
  createPersistedState({ paths: persistedLocal, key: projectKey }),
];

export default new Vuex.Store(store);