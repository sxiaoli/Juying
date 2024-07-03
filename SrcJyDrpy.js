const JSEngine = com.example.hikerview.service.parser.JSEngine;
const drpyMap = new Map();
const GMkey = module.importParam;
function buildJsEnv(ticket) {
    let code = String.raw`
// const my_rule = '
const MY_RULE = ${my_rule};
const my_rule = JSON.stringify(MY_RULE);
const MY_TICKET = "${ticket || ""}";
eval(getJsPlugin());
eval(getJsLazyPlugin());
`;
    return code;
}

function sync(func, sp) {
    return new org.mozilla.javascript.Synchronizer(func, sp || {});
}

function createDrpy(key,path) {
    JSEngine.getInstance().evalJS(buildJsEnv(MY_TICKET) + "\n!" + $.toString((key, path, GMkey, MY_TICKET) => {
        const localKey = "drpy";
        globalThis.local = {
            set(rulekey, k, v) {
                storage0.setItem(localKey + "@" + rulekey + "@" + k, v);
            },
            get(rulekey, k, v) {
                return storage0.getItem(localKey + "@" + rulekey + "@" + k, "") || v;
            },
            delete(rulekey, k) {
                storage0.clearItem(localKey + "@" + rulekey + "@" + k);
            }
        };
        eval(getCryptoJS());
        globalThis.CryptoJS = CryptoJS;

        let $request = request;
        let $post = post;
        globalThis.req = function (url, cobj) {
            try {
                let res = {};
                let obj = Object.assign({}, cobj);
                if (obj.data) {
                    obj.body = obj.data;
                    delete obj.data;
                }

                if (obj.hasOwnProperty("redirect")) obj.redirect = !!obj.redirect;
                if (obj.buffer === 2) {
                    obj.toHex = true;
                }
                obj.headers = Object.assign({
                    Cookie: "#noCookie#"
                }, obj.headers);
                if (url === "https://api.nn.ci/ocr/b64/text" && obj.headers) {
                    obj.headers["Content-Type"] = "text/plain";
                }

                if (url.startsWith("file://") && (url.includes("?type=") || url.includes("?params="))) {
                    url = url.slice(0, url.lastIndexOf("?"));
                }
                for (let key in obj.headers) {
                    if (typeof obj.headers[key] !== "string") {
                        obj.headers[key] = String(obj.headers[key]);
                    }
                }
                let r = "";
                r = $request(url, obj);
                if (obj.withHeaders) {
                    r = JSON.parse(r);
                    res.content = r.body;
                    res.headers = {};
                    for (let [k, v] of Object.entries(r.headers || {})) {
                        res.headers[k] = v[0];
                    }
                } else {
                    res.content = r;
                }
                if (obj.buffer === 2) {
                    const CryptoUtil = $.require("hiker://assets/crypto-java.js");
                    res.content = CryptoUtil.Data.parseHex(res.content).toBase64(_base64.NO_WRAP);
                }
                return res;
            } catch (e) {
                log("Error" + e.toString());
            }
        }
        pdfa = _pdfa;
        pd = _pd;
        pdfh = _pdfh;
        String.prototype.replaceAll = function (search, replacement) {
            return this.split(search).join(replacement);
        };
        let $toString = Function.prototype.toString;
        Function.prototype.toString = function () {
            return $toString.apply(this).trim();
        };
        let drpy2 = $.require(path +'drpy/drpy2.js');
        GM.has(GMkey, (DrpyManage) => {
            DrpyManage.put(key, drpy2);
        });
    }, key, path, GMkey, MY_TICKET) + ";\n", "", false);
}

function createNewDrpy(source) {
    let key = source.key;
    createDrpy(key,source.path);
    let drpy = drpyMap.get(key);
    drpy.init(source.ext);
    return drpy;
}

function getDrpy(key,ext,path) {
    return sync(() => {
        //log(drpyMap.size)
        if (drpyMap.has(key)) {
            return drpyMap.get(key);
        }
        if (drpyMap.size >= 5) {
            //log("请求:" + key)
            del(Array.from(drpyMap.keys()).at(0));
        }
        let source = {key:key,ext:ext,path:path};
        let drpy = createNewDrpy(source);
        return drpy;
    }, this).call();
}

function put(key, drpy) {
    sync(() => drpyMap.set(key, drpy), this).call();
}

function del(key) {
    sync(() => {
        //log("删除" + key);
        drpyMap.delete(key);
        /*if (drpyMap.has(key)) {
        
        }*/
    }, this).call();
}

function clear() {
    sync(() => {
        drpyMap.clear();
    }, this).call();
}
$.exports = {
    getDrpy,
    clear
}