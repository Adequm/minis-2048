import { mapState } from 'vuex';
import _ from 'lodash';

export default {
  computed: {
    ...mapState(['projectKey']),
    ...mapState({
      minisLang: state => state.minis.minisLang,
      translateJSON: state => state.minis.translateJSON,
    }),


    translateOfMinis({ translateJSON, minisLang, projectKey }) {
      return _.get(translateJSON?.[minisLang], projectKey, {});
    },

    translateErrorMessage({ translateJSON, minisLang }) {
      return _.get(translateJSON?.[minisLang], 'default.error', '%err%');
    },

    translate({ translateErrorMessage, translateOfMinis }) {
      return (path, def) => _.get(translateOfMinis, path, def || translateErrorMessage);
    },

    translateDef({ translateJSON, minisLang, translateErrorMessage }) {
      return (path, def) => _.get(translateJSON?.[minisLang]?.default, path, def || translateErrorMessage);
    },

    translateChain({ translateJSON, minisLang, translateErrorMessage }) {
      return function chain(data, path, def) {
        const translateData = path || _.isNumber(path) ? _.get(data, path, def || translateErrorMessage) : data;
        return (chainPath, def) => chainPath 
          ? chain(translateData, chainPath, def) 
          : translateData;
      }(translateJSON?.[minisLang]);
    },
  },
};