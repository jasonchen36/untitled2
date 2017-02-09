/// Base Actions - calling external API

import axios from "axios";
import _ from "lodash";

///TODO: move this to an external config
import { baseAPIUrl } from "../../config.js"

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

const getConfig = (overrideParams) => {
  overrideParams = overrideParams ? overrideParams : {};

  return _.merge({
    headers:getHeaders()
  }, overrideParams);
};

/// Functions for getting info from API 

export function get(endpoint) {
  return axios.get(endpoint,getConfig())
    .catch((err) => {
      return Promise.reject(cleanErrorObject(err));
    });
}

export function getBlob(endpoint) {
  return axios.get(endpoint,getConfig({responseType:'blob'}))
    .catch((err) => {
      return Promise.reject(cleanErrorObject(err));
    });

}

export function post(endpoint,data) {
  return axios.post(endpoint,data,getConfig())
    .catch((err) => {
      return Promise.reject(cleanErrorObject(err));
    });

}

/// uploadFile
export function postFile(endpoint,data) {
      let formData = new FormData();

      let keys = _.keys(data);

      
        _.each(keys,(k) => {
          formData.append(k,data[k]);
        });

      //        formData.append('name', data.name)
//        const config = {
//            headers: { 'content-type': 'multipart/form-data' }
//        }
//        const url = 'http://example.com/fileupload/';
//        post(url, formData, config)
//            .then(function(response) {
//                console.log(response);
//            })
//            .catch(function(error) {
//                console.log(error);
//            });

  let config = getConfig({'content-type':'multipart/form-data'});

  return axios.post(endpoint,formData,config)
    .catch((err) => {
      return Promise.reject(cleanErrorObject(err));
    });

}

export function put(endpoint,data) {
  return axios.put(endpoint,data,getConfig())
    .catch((err) => {
      return Promise.reject(cleanErrorObject(err));
    });

} 

export function del(endpoint) {
  return axios.delete(endpoint,getConfig())
    .catch((err) => {
      return Promise.reject(cleanErrorObject(err));
    });

}

export function request(config) {
  let newConfig = _.merge(getConfig(),config);
  return axios.request(newConfig)
    .catch((err) => {
      return Promise.reject(cleanErrorObject(err));
    });
}

const cleanErrorObject =(error) => {
  const errorObject = {
    data:error.data,
    status: error.status,
    statusText: error.statusText,
    message: getErrorMessage(error),
    original: error
  };

  return errorObject;
};

const getErrorMessage = (error) => {
  if(error.data && error.data.msg) {
    return error.data.msg;
  } else if (error.data && error.data.message) {
    return error.data.message;
  } else {
    return error.statusText;
  }
}
