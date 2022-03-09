import Vue from 'vue';
import _ from 'lodash';

const store = {};

store.state = () => ({
  minisLang: 'ru',
  minisThemeMain: null,
  minisThemeSpecial: null,
  themesJSON: {},
  translateJSON: {},
  minisJSON: {},
});

store.getters = {
  themeMain({ themesJSON, minisThemeMain }) {
    const isExist = themesJSON?.main?.[minisThemeMain];
    return isExist ? themesJSON.main[minisThemeMain] : themesJSON?.main?.dark;
  },
  themeSpecialName({ themesJSON, minisThemeSpecial }) {
    const isExist = themesJSON?.special?.colors?.[minisThemeSpecial];
    return isExist ? minisThemeSpecial : themesJSON?.special?.default;
  },
  themeSpecial({ themesJSON }, { themeSpecialName }) {
    return themesJSON?.special?.colors?.[themeSpecialName];
  },
};

store.mutations = {
  switchTheme(state, type = 'main') {
    const minisThemeType = type == 'main' ? 'minisThemeMain' : 'minisThemeSpecial';
    const themes = type == 'main' ? state.themesJSON.main : state.themesJSON.special.colors;
    const themesJSON = Object.keys(themes);
    const themeIndex = themesJSON.indexOf(state[minisThemeType]);
    const newThemeIndex = (themeIndex + 1) % themesJSON.length;
    Vue.set(state, minisThemeType, themesJSON[newThemeIndex]);
  },
  switchLang(state) {
    const langsList = Object.keys(state.translateJSON);
    const langIndex = langsList.indexOf(state.minisLang);
    const newLangIndex = (langIndex + 1) % langsList.length;
    Vue.set(state, 'minisLang', langsList[newLangIndex]);
  },
  initMinis(state, { translateJSON, minisJSON, themesJSON }) {
    Vue.set(state, 'minisJSON', minisJSON);
    Vue.set(state, 'translateJSON', translateJSON);
    Vue.set(state, 'themesJSON', themesJSON);
  },
};

export default store;