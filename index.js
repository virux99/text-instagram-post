const { http, https } = require("follow-redirects");
var url = require("url");

function makeAdviceRequest(urlEndpoint, method, data = null) {
    let d = "";
    if (data != null) d = JSON.stringify(data);
    const uri = url.parse(urlEndpoint);
    const proto = uri.protocol === "https:" ? https : http;
    const opts = {
        method: method,
    };

    return new Promise((resolve, reject) => {
        const req = proto.request(urlEndpoint, opts, (res) => {
            res.setEncoding("utf8");
            let responseBody = "";

            res.on("data", (chunk) => {
                responseBody += chunk;
            });

            res.on("end", () => {
                resolve(responseBody);
            });
        });

        req.on("error", (err) => {
            reject(err);
        });
        if (data) {
            req.write(d);
        }
        req.end();
    });
}

function makeRequest(urlEndpoint, method, apiKey, data = null) {
    let d = "";
    if (data != null) d = JSON.stringify(data);
    const uri = url.parse(urlEndpoint);
    const proto = uri.protocol === "https:" ? https : http;
    const opts = {
        method: method,
        headers: {
            "Content-Length": d.length,
            "Content-Type": "application/json",
            "X-API-KEY": apiKey,
        },
    };

    return new Promise((resolve, reject) => {
        const req = proto.request(urlEndpoint, opts, (res) => {
            res.setEncoding("utf8");
            let responseBody = "";

            res.on("data", (chunk) => {
                responseBody += chunk;
            });

            res.on("end", () => {
                resolve(responseBody);
            });
        });

        req.on("error", (err) => {
            reject(err);
        });
        if (data) {
            req.write(d);
        }
        req.end();
    });
}

let apiKey = "d5a0NTg5MDoyOTAzOkF0YjlyWnNaY3ZxRlVVUEM";
let template_id = "d7177b2b27223336";

(async() => {
    //calling advice data
    let response = await makeAdviceRequest("https://api.adviceslip.com/advice", "GET");
    let advice = JSON.parse(response).slip.advice;

    let data = [{
            name: "background-color",
            stroke: "#000000",
            backgroundColor: "#FFD35A",
        },
        {
            name: "circle-image_1",
            stroke: "#F2F2F2",
            src: "https://apitemplateio.s3-ap-southeast-1.amazonaws.com/default-template-images/mountain-icon.png",
        },
        {
            name: "text_quote",
            text: advice,
            textBackgroundColor: "rgba(233, 233, 233, 0)",
            color: "#333",
        },
    ];
    let resp = await makeRequest("https://api.apitemplate.io/v1/create?template_id=" + template_id, "POST", apiKey, {
        overrides: data,
    });
    let ret = JSON.parse(resp);
    console.log("🚀 ~ file: index.js ~ line 70 ~ ret", ret);
    console.log("🚀 ~ file: index.js ~ line 72 ~ ret.download_url_png", ret.download_url_png);
})();