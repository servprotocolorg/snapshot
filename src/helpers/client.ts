class Client {
  request(command, body?) {
    const url = `${process.env.VUE_APP_HUB_URL}/api/${command}`;
    let init;
    if (body) {
      init = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      };
    }
    return new Promise((resolve, reject) => {
      fetch(url, init)
        .then(res => {
          if (res.ok) return resolve(res.json());
          throw res;
        })
        .catch(e => e.json().then(json => reject(json)));
    });
  }

  getByUrl(url, body?, method = 'GET') {
    let init;
    if (body) {
      init = {
        method: method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      };
    }
    return new Promise((resolve, reject) => {
      fetch(url, init)
        .then(res => {
          if (res.ok) return resolve(res.json());
          throw res;
        })
        .catch(e => e.json().then(json => reject(json)));
    });
  }

  getTextByUrl(url, body?, method = 'GET') {
    let init;
    if (body) {
      init = {
        method: method,
        headers: {},
        body: body
      };
    }
    return new Promise((resolve, reject) => {
      fetch(url, init)
        .then(res => {
          if (res.ok) return resolve(res);
          throw res;
        })
        .catch(e => reject(e));
    });
  }
}

const client = new Client();

export default client;
