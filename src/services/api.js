/* eslint-disable array-callback-return */
/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import querystring from "qs";

const DEFAULT_BASE_URL = null;

const api = axios.create({
  timeout: 60000,
  headers: {
    Accept: "application/json",
  },
  paramsSerializer: (params) => querystring.stringify(params),
});

const api_upload = axios.create({
  timeout: 120000,
  headers: {
    Accept: "application/json",
  },
  paramsSerializer: (params) => querystring.stringify(params),
});

export default {
  /**
   * @param {Sring} url '/path/to/endpoint'
   * @param {Object} json
   * @param {Object} form
   */
  put: (base_url, url, form = {}, json = {}) => {
    api.defaults.headers.common["Content-Type"] = json
      ? "application/json"
      : "application/x-www-form-urlencoded";
    const data = querystring.stringify(form) || json;
    return api
      .put(url, data, {
        params: querystring.stringify(form),
        baseURL: base_url || DEFAULT_BASE_URL,
      })
      .then((response) => Promise.resolve(response.data))
      .catch((err) => Promise.reject(err));
  },

  /**
   * @param {Sring} url '/path/to/endpoint'
   * @param {Object} param query params
   */
  get: (base_url, url, customConfig = {}) => {
    return api
      .get(url, {
        baseURL: base_url || DEFAULT_BASE_URL,
        ...customConfig,
      })
      .then((response) => Promise.resolve(response.data))
      .catch((err) => Promise.reject(err));
  },

  /**
   * @param {Sring} url '/path/to/endpoint'
   * @param {Object} json
   * @param {Object} form
   * @param {Object} reqConfig  custom config for request
   */
  post: (base_url, url, form = null, json = {}, reqConfig = {}) => {
    api.defaults.headers["Content-Type"] = form
      ? "application/x-www-form-urlencoded"
      : "application/json";
    const data = querystring.stringify(form) || json;
    return api
      .post(url, data, {
        params: querystring.stringify(form),
        baseURL: base_url || DEFAULT_BASE_URL,
        ...reqConfig,
      })
      .then((response) => Promise.resolve(response.data))
      .catch((err) => Promise.reject(err));
  },

  /**
   * Send request with Content-Type multipart/form
   * used to upload file
   * @param {Sring} url '/path/to/endpoint'
   * @param {Object} data
   */
  postData: (base_url, url, data = {}, customConfig = {}) => {
    api_upload.defaults.headers["Content-Type"] = "multipart/form-data";
    api_upload.defaults.timeout = 30000;
    const formData = new FormData();
    const keys = Object.keys(data);
    keys.map((key) => {
      data[key] instanceof File
        ? formData.append(key, data[key], data[key].name)
        : formData.append(key, data[key]);
    });
    return api_upload
      .post(url, formData, {
        baseURL: base_url || DEFAULT_BASE_URL,
        ...customConfig,
      })
      .then((response) => Promise.resolve(response.data))
      .catch((err) => Promise.reject(err));
  },

  postDataMultiple: (url, data = {}, customConfig = {}) => {
    api.defaults.headers["Content-Type"] = "multipart/form-data";
    api.defaults.timeout = 30000;
    const formData = new FormData();
    const keys = Object.keys(data);
    keys.forEach((key) => {
      data[key] instanceof File
        ? formData.append(key, data[key], data[key].name)
        : formData.append(key, data[key]);
      if (Array.isArray(data[key])) {
        data[key].forEach((data2, index) => {
          data2 instanceof File
            ? formData.append(key, data[key][index], data[key][index].name)
            : formData.append(key, data[key][index]);
        });
      }
    });
    return api
      .post(url, formData, {
        ...customConfig,
      })
      .then((response) => Promise.resolve(response.data))
      .catch((err) => Promise.reject(err));
  },

  /**
   * @param {Sring} url '/path/to/endpoint'
   * @param {Object} params
   * {
   *   id: [1,2,3]
   * }
   */
  delete: (base_url, url, params) => {
    let newUrl = url;
    if (params) {
      const qparam = querystring.stringify(params);
      newUrl = `${newUrl}?${qparam}`;
    }
    return api
      .delete(newUrl, {
        baseURL: base_url || DEFAULT_BASE_URL,
      })
      .then((response) => Promise.resolve(response.data))
      .catch((err) => Promise.reject(err));
  },
  /**
   * @param {Sring} url '/path/to/endpoint'
   * @param {Object} payload
   * {
   *   id: [1,2,3]
   * }
   */ deleteData: (base_url, url, payload) => {
    return api
      .delete(
        url,
        { data: payload },
        {
          baseURL: base_url || DEFAULT_BASE_URL,
        }
      )
      .then((response) => Promise.resolve(response.data))
      .catch((err) => Promise.reject(err));
  },
  /**
   * Send request with Content-Type multipart/form
   * used to upload file
   * @param {Sring} url '/path/to/endpoint'
   * @param {Object} data
   */
  putData: (base_url, url, data = {}, customConfig = {}) => {
    api.defaults.headers["Content-Type"] = "multipart/form-data";
    api.defaults.timeout = 30000;
    const formData = new FormData();
    const keys = Object.keys(data);
    keys.map((key) => {
      data[key] instanceof File
        ? formData.append(key, data[key], data[key].name)
        : formData.append(key, data[key]);
    });
    return api
      .put(url, formData, {
        baseURL: base_url || DEFAULT_BASE_URL,
        ...customConfig,
      })
      .then((response) => Promise.resolve(response.data))
      .catch((err) => Promise.reject(err));
  },
};
