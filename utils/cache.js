import moment from "moment";
import axios from "axios";

const cache = {};

export const client = async (url, accessToken, data = true) => {
  const timestamp = moment();

  if (Object.keys(cache).includes(url)) {
    const timeDiff = moment(cache[url].timestamp).diff(timestamp, "hours");

    if (timeDiff < 12) {
      return new Promise((ok) => {
        ok(cache[url].response);
      });
    }
  } else {
    const response = await axios({
      method: "get",
      url,
      headers: {
        accept: "application/json",
        Authorization: `token ${accessToken}`,
      },
    }).then((result) => (data ? result.data : result));

    cache[url] = {
      timestamp: new Date(),
      response,
    };
    return response;
  }
};
