/// Base Actions - calling external API

import axios from "axios";
import _ from "lodash";


///TODO: move this to an external config
import { baseAPIUrl } from "../config.js"

axios.defaults.baseURL = baseAPIUrl;

const getHeaders = () => {
  // we store the auth for accessing the api in auth_token
  const token = localStorage.getItem('auth_token');
  let headers = {};

  if(token) {
    headers.Authorization = 'Bearer ' + token;
  }

  return headers;
};

const getConfig = () => {
  return {
    headers:getHeaders()
  };
};

/// Functions for getting info from API 

export function get(endpoint) {
  return axios.get(endpoint,getConfig());
}

export function post(endpoint,data) {
  return axios.post(endpoint,data,getConfig());
}

export function put(endpoint,data) {
  return axios.put(endpoint,data,getConfig());
} 

export function del(endpoint) {
  return axios.delete(endpoint,getConfig());
}

export function request(config) {
  let newConfig = _.merge(getConfig(),config);
  return axios.request(newConfig);
}
