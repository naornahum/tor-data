const url = require("url");
const http = require("http");
const fs = require("fs");
const DOMParser = require("xmldom").DOMParser;
const HttpProxyAgent = require("http-proxy-agent");

// HTTP/HTTPS proxy to connect to
let proxy = process.env.http_proxy || "http://localhost:8118";
console.log("using proxy server %j", proxy);

// HTTP endpoint for the proxy to connect to
let endpoint =
  process.argv[2] || "http://strongerw2ise74v3duebgsvug4mehyhlpa7f6kfwnas7zofs3kov7yd.onion/all";
console.log("attempting to GET %j", endpoint);
let opts = url.parse(endpoint);

// create an instance of the HttpProxyAgent class with the proxy server information
let agent = new HttpProxyAgent(proxy);
opts.agent = agent;

async function fetchPages() {
  let html = "",
    domHtml = null;
  http.get(opts, (res) => {
    console.log('"response" event!', res.headers);
    res.on("data", function (chunk) {
      html += "" + chunk;
      console.log("" + chunk);
      fs.writeFile("home.html", html, (err) => {
        if (err) console.log(err);
        else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(fs.readFileSync("home.html", "utf8"));
        }
      });
    });
    let parser = new DOMParser();
    domHtml = parser.parseFromString(html, "text/html");
  });

  // console.log(domHtml);
}
function main() {
  fetchPages();
}
main();
