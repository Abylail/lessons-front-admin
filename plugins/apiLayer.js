
/** Создание options */
const createOptions = (options, store) => {

}

/** GET */
const createGet = ({ axios, store }) => {
  return (url, options = {}) => new Promise(resolve => {
    const prepareOptions = createOptions(options, store);
    axios.$get(url, prepareOptions)
      .then(resolve)
      .catch(err => resolve({ err }))
  })
}

/** POST */
const createPost = ({ axios, store }) => {
  return (url, body = {}, options = {}) => new Promise(resolve => {
    const prepareOptions = createOptions(options, store);
    axios.$post(url, body, prepareOptions)
      .then(resolve)
      .catch(err => resolve({ err }))
  })
}

const createApiLayer = ({ axios, store }) => ({
  $get: createGet({ axios, store }),
  $post: createPost({ axios, store }),
})

export default function ({ $axios, store }, inject) {
  inject("api", createApiLayer({ axios: $axios, store }))
}
