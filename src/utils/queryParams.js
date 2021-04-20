export default query => {
  let keyValuePairs = query.split(/[&?]/g);
  let params = {};
  for (let i = 0, n = keyValuePairs.length; i < n; ++i) {
    let m = keyValuePairs[i].match(/^([^=]+)(?:=([\s\S]*))?/);
    if (m) {
      let key = decodeURIComponent(m[1]);
      (params[key] || (params[key] = [])).push(decodeURIComponent(m[2]));
    }
  }
  return params;
};
