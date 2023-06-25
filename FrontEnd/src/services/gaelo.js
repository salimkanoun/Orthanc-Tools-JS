import axios from "axios";

const axiosInstance = axios.create();

const gaelo = {
  url: "https://platform.gaelo.fr",

  getHeader(token) {
    return {
      Authorization: "Bearer " + token,
    };
  },

  login: (email, password) => {
    let payload = {
      email: email,
      password: password,
    };
    return axiosInstance
      .post(gaelo.url + "/api/login", payload)
      .then((answer) => answer.data)
      .catch((error) => {
        throw error;
      });
  },

  getStudiesFromUser: (token, userId) => {
    let header = gaelo.getHeader(token);
    return axiosInstance
      .get(gaelo.url + "/api/users/" + userId + "/studies", { headers: header })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        if (error.response) {
          throw error.response;
        }
        throw error;
      });
  },

  getRoles: (token, userId, studyName) => {
    let header = gaelo.getHeader(token);
    return axiosInstance
      .get(
        gaelo.url + "/api/users/" + userId + "/roles?studyName=" + studyName,
        {
          headers: header,
        }
      )
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        if (error.response) {
          throw error.response;
        }
        throw error;
      });
  },

  getVisitsTree: (token, studyName, role) => {
    let header = gaelo.getHeader(token);
    return axiosInstance
      .get(
        gaelo.url + "/api/studies/" + studyName + "/visits-tree?role=" + role,
        {
          headers: header,
        }
      )
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        if (error.response) {
          throw error.response;
        }
        throw error;
      });
  },

  getPatient: (token, studyName, patientId, role) => {
    let header = gaelo.getHeader(token);
    return axiosInstance
      .get(
        gaelo.url + "/api/patients/" +
          patientId +
          "?role=" +
          role +
          "&studyName=" +
          studyName,
        { headers: header }
      )
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        if (error.response) {
          throw error.response;
        }
        throw error;
      });
  },
};

export default gaelo;
