export const token = "a1ad2c38-8ac9-485a-bdd5-0420684a0ec3";
export const baseUrl = "https://mesto.nomoreparties.co/v1/cohort-59";

export const apiConfig = { baseUrl: baseUrl, headers: token };

export class Apic {
  constructor({ baseUrl, headers }) {
    this.url = baseUrl;
    this.headers = headers;
  }

  _processingServerResponse(res) {
    return res.ok ? res.json() : Promise.reject();
  }

  getUserInfo() {
    return fetch(this.url + "/users/me", {
      method: "GET",
      headers: {
        authorization: this.headers,
      },
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }

  editUserInfo({ name, about }) {
    return fetch(this.url + "/users/me", {
      method: "PATCH",
      headers: {
        authorization: this.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }

  editAvatarImage({ avatar }) {
    return fetch(this.url + "/users/me/avatar", {
      method: "PATCH",
      headers: {
        authorization: this.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: avatar,
      }),
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }

  renderCards() {
    return fetch(this.url + "/cards", {
      method: "GET",
      headers: {
        authorization: this.headers,
      },
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }

  addCard = ({ name, link }) => {
    return fetch(this.url + "/cards", {
      method: "POST",
      headers: {
        authorization: this.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  };

  deleteCard(id) {
    return fetch(this.url + "/cards/" + id, {
      method: "DELETE",
      headers: {
        authorization: this.headers,
      },
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }

  likeCard(idCard) {
    return fetch(this.url + "/cards/" + idCard + "/likes", {
      method: "PUT",
      headers: {
        authorization: this.headers,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }

  deleteLikeCard(idCard) {
    return fetch(this.url + "/cards/" + idCard + "/likes", {
      method: "DELETE",
      headers: {
        authorization: this.headers,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }
}

export const api = new Apic(apiConfig);
