
const createCatcher = toast => err => {
  if (err && err.response && err.response.data && err.response.data.message) {
    toast.error(err.response.data.message);
  }
}

/** Создание ссылки */
const createUrl = url => process.env.BASE_URL + url;

/** Создание options */
const createOptions = (options, store) => {
  return options
}

/** GET */
const createGet = ({ axios, store, toast }) => {
  return (url, options = {}) => new Promise(resolve => {
    const preparedUrl = createUrl(url);
    const prepareOptions = createOptions(options, store);
    const catcher = createCatcher(toast);
    axios.$get(preparedUrl, prepareOptions)
      .then(resolve)
      .catch(err => {catcher(err);resolve({ err });})
  })
}

/** POST */
const createPost = ({ axios, store, toast }) => {
  return (url, body = {}, options = {}) => new Promise(resolve => {
    const preparedUrl = createUrl(url);
    const prepareOptions = createOptions(options, store);
    const catcher = createCatcher(toast);
    axios.$post(preparedUrl, body, prepareOptions)
      .then(resolve)
      .catch(err => {catcher(err);resolve({ err })})
  })
}

/** PUT */
const createPut = ({ axios, store, toast }) => {
  return (url, body = {}, options = {}) => new Promise(resolve => {
    const prepareOptions = createOptions(options, store);
    const catcher = createCatcher(toast);
    const preparedUrl = createUrl(url);
    axios.$put(preparedUrl, body, prepareOptions)
      .then(resolve)
      .catch(err => {catcher(err);resolve({ err })})
  })
}

/** DELETE */
const createDelete = ({ axios, store, toast }) => {
  return (url, options = {}) => new Promise(resolve => {
    const prepareOptions = createOptions(options, store);
    const catcher = createCatcher(toast);
    const preparedUrl = createUrl(url);
    axios.$delete(preparedUrl, prepareOptions)
      .then(resolve)
      .catch(err => {catcher(err);resolve({ err });})
  })
}

const createApiLayer = ({ axios, store, toast }) => ({
  $get: createGet({ axios, store, toast }),
  $post: createPost({ axios, store, toast }),
  $put: createPut({ axios, store, toast }),
  $delete: createDelete({ axios, store, toast }),
})

export default function ({ $axios, store, $toast }, inject) {
  inject("api", createApiLayer({ axios: $axios, store, toast: $toast }))
}
