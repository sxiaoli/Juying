let alistfile = "hiker://files/rules/Src/Juying/Alist.json";
try {
  if(fetch(alistfile)){
    eval("var alistData = " + fetch(alistfile));
  }else{
    var alistData = {};
  }
} catch (e) {
  var alistData = {};
}
let alistconfig = alistData.config || {};
let fileFilter = alistconfig['fileFilter'] == 0 ? 0 : 1;
let audiovisual = alistconfig.contain ? alistconfig.contain.replace(/\./, "") : 'mp4|avi|mkv|rmvb|flv|mov|ts|mp3|m4a|wma|flac';//影音文件
let contain = new RegExp(audiovisual, "i");//设置可显示的影音文件后缀
let music = new RegExp("mp3|m4a|wma|flac", "i");//进入音乐播放器
let image = new RegExp("jpg|png|gif|bmp|ico|svg", "i");//进入图片查看
let transcoding = { UHD: "4K 超清", QHD: "2K 超清", FHD: "1080 全高清", HD: "720 高清", SD: "540 标清", LD: "360 流畅" };
let alitoken = alistconfig.alitoken;
if (!alitoken && getMyVar('getalitoken') != "1") {
  putMyVar('getalitoken', '1');
  try {
    //节约资源，如果有获取过用户信息，就重复利用一下
    let icyfilepath = "hiker://files/rules/icy/icy-ali-token.json";
    let joefilepath = "hiker://files/rules/joe/ali.json";
    let alifile = fetch(icyfilepath);
    if (alifile) {
      let tokenlist = eval(alifile);
      if (tokenlist.length > 0) {
        alitoken = tokenlist[0].refresh_token;
      }
    }
    if (!alitoken) {
      alifile = fetch(joefilepath);
      if (alifile) {
        let token = eval(alifile);
        alitoken = token.refresh_token;
      }
    }
    if (alitoken) {
      alistconfig.alitoken = alitoken;
      alistData.config = alistconfig;
      writeFile(alistfile, JSON.stringify(alistData));
    }
  } catch (e) {
    log('自动取ali-token失败' + e.message);
  }
}
let headers = {
  'content-type': 'application/json;charset=UTF-8',
  "origin": "https://www.aliyundrive.com",
  "referer": "https://www.aliyundrive.com/",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.41"
};
let userinfo = {};
if (alitoken) {
  let nowtime = Date.now();
  let oldtime = parseInt(getMyVar('userinfoChecktime', '0').replace('time', ''));
  let aliuserinfo = storage0.getMyVar('aliuserinfo');
  if (aliuserinfo && aliuserinfo.user_id && nowtime < (oldtime + 2 * 60 * 60 * 1000)) {
    userinfo = aliuserinfo;
  } else {
    userinfo = JSON.parse(request('https://auth.aliyundrive.com/v2/account/token', { headers: headers, body: { "refresh_token": alitoken, "grant_type": "refresh_token" }, method: 'POST', timeout: 3000 }));
    storage0.putMyVar('aliuserinfo', userinfo);
    putMyVar('userinfoChecktime', nowtime + 'time');
  }
}

function SortList(v1, v2) {
  var a = v1.name;
  var b = v2.name;
  var reg = /[0-9]+/g;
  var lista = a.match(reg);
  var listb = b.match(reg);
  if (!lista || !listb) {
    return a.localeCompare(b);
  }
  for (var i = 0, minLen = Math.min(lista.length, listb.length); i < minLen; i++) {
    //数字所在位置序号
    var indexa = a.indexOf(lista[i]);
    var indexb = b.indexOf(listb[i]);
    //数字前面的前缀
    var prefixa = a.substring(0, indexa);
    var prefixb = a.substring(0, indexb);
    //数字的string
    var stra = lista[i];
    var strb = listb[i];
    //数字的值
    var numa = parseInt(stra);
    var numb = parseInt(strb);
    //如果数字的序号不等或前缀不等，属于前缀不同的情况，直接比较
    if (indexa != indexb || prefixa != prefixb) {
      return a.localeCompare(b);
    }
    else {
      //数字的string全等
      if (stra === strb) {
        //如果是最后一个数字，比较数字的后缀
        if (i == minLen - 1) {
          return a.substring(indexa).localeCompare(b.substring(indexb));
        }
        //如果不是最后一个数字，则循环跳转到下一个数字，并去掉前面相同的部分
        else {
          a = a.substring(indexa + stra.length);
          b = b.substring(indexa + stra.length);
        }
      }
      //如果数字的string不全等，但值相等
      else if (numa == numb) {
        //直接比较数字前缀0的个数，多的更小
        return strb.lastIndexOf(numb + '') - stra.lastIndexOf(numa + '');
      }
      else {
        //如果数字不等，直接比较数字大小
        return numa - numb;
      }
    }
  }
}

evalPrivateJS('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')
evalPrivateJS('LMUBjarZ5eOGA/z1aks6fNNBHPn4N+xNr5JpUh71s2P9e+J6BhEF12L8JFIfeYrnj+pMPdP2pq4RTyQYWwSCW/sOK+rmBauO+krr6G4ZSFJJip1lnwRp5U0SlNnMPprAKRKZd4Xc8EjVNXtU52rrJyvTslFW+6IB6F7e+ZQcMLUaqWsEiqekcWERkauvRTo82E9FCWCToNkSocKnAog109gHJpRyC8vyMnXfyzvM3hXRE4DP9j8Wf+lkHsvPADRYGlMSM86YzsGPGMrinusmZhtq512Ahuji0YLOrCjDMzf/NwghsA0Hxb7dycAQ5nrt/f+WcVWvNzpq3WU9GFxPANzOe+4V3SV12rYacxfR5+XGTUjUFvzUqXDoIy5HAEzV83O62M7p0qL+E/rrq6SrNLHkBzEPbNHlmF1APsj9KgG1jfKGXeLpvIUbWqAhX4L/rYOTqO/vsSX13ybaua4A4x5FUwZnrklc212+P9h7j2D+BJoHaCQ+oHikoZ1X4sGlm2gVg6AZA80VJna6Wf2tbeWfXZUZFKQ671yW/OePQ9oodKscmtTqY6LKxTI5psxwMD6i9yfJy3n4IGlTFr6LxfnY5GqsYZ185n4i5UbLEQRJbFtU3umQm6pDCXh5d3mzBcycGkTjnLGTr8Fnm0oKmY2l+S7I7ByTQlZJ0lQETJ6PZe4F45CyeRBA18CizlwRlNfzHahN17LyMlXoRqhm4s7vAQ/Qj0hp6rWkUfI0IAO+WqEdi5HPsSX/622XpvyH6S7JLSnxosaSl8JqnI4fDYASMsGRGxvoUiXIUEHLfSLdeeEGvvEdvxYdu2p8kB5NGS82APXz9L5A+cHY/QQ57/cthoQq5QNA6MJGOciBEY5GJKOwtquRrl8SMB0LkA4U7BP+bLzulks22uVOulnSGX9vRI9m7OzKAeUZ6I/4fr1MQ5d/x6Ftqv2UVoloKPu4w3mw1GpljmQPZ/ZFeQ/mZV23uxkZ4kYt7JNEmThPF8FKC2dKEVzEEXHwY3+ANm+7z/DE6yyxowpvgQ8oY61NU3OGWvBldmB2ClVs9WW2qw1ZMgkF7Q6RX7NyPtnwBbHFd6iHE/7lweYiV1EqUNmTRFbja4YA/qp+kL+g2TpXif0MdrBQgLjgivPnVHS6E+4YrIIvvuaFGW7Y3dauOmwwM9a8Q3jl6QW1T1UkFDr4zkhcSOige4ULS4P7IOl4LZqS1Wn2kGiyElb2dphNl24jDdPOu8jRC5ONu6oPD6GrrnoRru5351ylo40NEEOT1ieypcjgYWcHwrHZcbjmfhXEswoWtGl473sbQwtpXCTi1CpxNzQk18iYPOOE6kuOVBcgHQ1WCQ5S0l0Nq1XP189Mri8aCsQTDUPj6IjnorDp7wib78dgLHGG2TfJsvHUuggoT2CP+lWnrA/qeTz7naRXyqLyrv3Z+jWUCPp6brZ7FbcrycYLJuTDAEUw+6fswY0L83O62M7p0qL+E/rrq6SrNOfnMA5tFRzt22MgDUU1CNDipRx2PmU1pP19myypfY8qXBLU+qwQIXU2nTyH5iLVwwZ6ybK/Xx+5tqBYQCVmf2mANWBulapVBAzcnBv0N1IZme/ZP3kqpzTolzZroKyftK9CpZYpi8OJWjVw4Gxwtjqxpjttk7zXOFEcRBILmBsds7BLFC9WU6pnIVtqpbsghcujP2wlNp2urGqb0nbI1R69a61K7MsLKAqKoFDzGrA4KDdQoqOW9ZmXOW3DzfQzbzcBfzWOPGCSed9IU4xTp+BaUZ43OIztHsoFmVsg/5RYEC2PM4bqTdCsbtl9us4SYOf1I7+Admq5BDIljHu7tjgSwISxWXMNYBT83z44tqsjTcf1NcvglBxldRbOnh4m8w==')
evalPrivateJS('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')
evalPrivateJS('rhiz2Ll8wYnkCoIzJ/nTsBjQ/xZMODzvvtPniw+kAOLskUtISUP3bxLpce3nKwueKIRVgYJSl08ETl80Jugl4F61PEurKDXlGxDMMHTL7RX8xTEGMNCtr0CEz49SZNWjtFkzEGIq6pS3iLCILVd6h1sXtv/FScNv6NQQYlEIjW7WckFOqjGXn5HhlATkGQmmbAMBJ0g/ouwqhIYNv1nH7aM4kSMYV2Nhe5VOaRJSBslqZw1YGcjXBGsYZxkC5TAkNDhSCR42A5to1wbVLxZKSf3fgoHgw+KOnjR8TJQCUbpri8ThGahcNNwT6KOSNgCmj51XEqoS0TCPxASkthcPtwtXvqepUwN0J4Yw+u9NTlvflx/heN21C99lmN6yaas6yJsPThBcAo3jemTHDB7XMnQ+kKPA/ewnSU7+1H4yZwcBUB10+Nc8wgA9X4E0J+ewhsMeSt+G0DEwiOpXGEBtIRKy/iVnqtMQRHPnsgOHcrcDt4Gsvz6HPt96e5z8iZf2Fc0QL3h6ttzoWhQe+QQBCBFWQZjj+wKwO2CrO+QquMGCMhBruPZ5ABGNRpVUhwpnmR18bApwPylzNvJ914epBb/09vaSV+tfD47g2MlmcF+TBjKMDhcSh/12ulK4mptYKEIgtITWO2Mn93gIo6W3SkSKPMO1aVMeCV9p192nn4hGHJQ6cgvJLxuzG//iZFEHJRUx6gpdXp9veuxHmi+lIC+TP/eMEIDVk3lRdLXnGrnq7urLKf6lq6QNwOklKE19gD21NChrlzhsUyUvCeSgiCcmHkeKYnBhGEmFlIGVlF4cppbtPp2BI9D1kolcTb6Is5hJwU0CkNeJK8EOorKLBPGc4TiyezUOexy7awqQBMCsDufyvWgQcfbloZLTORi+eH0xEUpkbnodXZDU3iyB5J/yFAm5Jb3i5Ww7pn3Zf6YZs/I3FMl5/kulM5NVyRyTB088OtOSYYMg5mO2aFegK2I+D7xW4B/cbZvQJExnMhrdH06FQRAhdSUhJ8/w0oWAhpdv0H0PhSOvsjecGSw9SNfRjYo05I5g2mEwdWDZKRLDrFg1/S+l7Scp8MySX2akWrNfxgLEW8eke5mEB9TdYCc9AVrboRipAaKzxoSpQFb9mdlA3soj51zHS6lrtoPN+WyDjTwnoS9w7qe+S4G9H2wjzQDvBSkejIRiP94UehCetAi+msmNwhmFBlm0ddPYHv/ZAzAXxVjF7aZ3WAMVLss2bRHaDWQEWdbAYoFZTESK5rupc1DPblPZ1jopKePg+H3uTEZaUseDUBvTCuKj/jfg5PibCBWaIHA8QOJwn/pjnx4YK/dfTaam0j4AJfVU7Lw531KsW0hIg5RSZs8cCghhJyUZfdag0LPi1xJdDjLO0MEYF8rSSDUpJSVYQuMR')
function aliMyPlayUrl(file_id) {
  try {
    let authorization = 'Bearer ' + userinfo.access_token;
    let deviceId = userinfo.device_id;
    let userId = userinfo.user_id;
    let drive_id = userinfo.default_drive_id;
    headers['authorization'] = authorization;
    headers['x-device-id'] = deviceId;
    let aliecc = createsession(headers,deviceId,userId);
    let aliyunUrl = [];
    if(aliecc.success){
      headers['x-signature'] = aliecc.signature;
      let data = { "drive_id": drive_id, "file_id": file_id, "category": "live_transcoding", "template_id": "", "get_subtitle_info": true }
      let json = JSON.parse(request('https://api.aliyundrive.com/v2/file/get_video_preview_play_info', { headers: headers, body: data, method: 'POST', timeout: 3000 }));
      aliyunUrl = json.video_preview_play_info.live_transcoding_task_list;
      aliyunUrl.reverse();
    }
    let urls = [];
    let names = [];
    let heads = [];
    if (aliyunUrl.length > 0) {
      aliyunUrl.forEach((item) => {
        urls.push(item.url + "#pre#");
        names.push(transcoding[item.template_id] ? transcoding[item.template_id] : item.template_height);
        heads.push({ 'Referer': 'https://www.aliyundrive.com/' });
      })
    } else {
      log('未获取阿里转码播放地址，建议重进软件再试一次')
    }
    let file_url = aliOpenPlayUrl(file_id);
    if(file_url){
      urls.unshift(file_url+ "#isVideo=true##pre#");
      names.unshift("原始 画质");
      heads.unshift({'Referer':'https://www.aliyundrive.com/'});
    }else{
      clearMyVar('aliopeninfo');
    }
    return {
      urls: urls,
      names: names,
      headers: heads
    };
  } catch (e) {
    log('获取我的云盘播放地址失败>' + e.message);
    return { message: '获取我的云盘播放地址失败>' + e.message };
  }
}
function aliOpenPlayUrl(file_id) {
  try {
    function getopentoken(token) {
      let authorization = 'Bearer ' + token;
      headers['authorization'] = authorization;
      headers['x-canary'] = "client=web,app=adrive,version=v4.3.1";
      let data = {"authorize":"1","scope":"user:base,file:all:read,file:all:write"}
      let json = JSON.parse(request('https://open.aliyundrive.com/oauth/users/authorize?client_id=76917ccccd4441c39457a04f6084fb2f&redirect_uri=https://alist.nn.ci/tool/aliyundrive/callback&scope=user:base,file:all:read,file:all:write&state=', { headers: headers, body: data, method: 'POST', timeout: 3000 }));
      let code = json.redirectUri.split("code=")[1];
      let data2 = {"code":code,"grant_type":"authorization_code"}
      let json2 = JSON.parse(request('https://alist.nn.ci/alist/ali_open/code', { body: data2, method: 'POST', timeout: 3000 }));
      return json2.access_token || "";
    }
    let opentoken;
    let nowtime = Date.now();
    let oldtime = parseInt(getMyVar('opentokenChecktime', '0').replace('time', ''));
    let aliopentoken = getMyVar('aliopentoken');
    if (aliopentoken && nowtime < (oldtime + 1 * 60 * 60 * 1000)) {
      opentoken = aliopentoken;
    } else {
      opentoken = getopentoken(userinfo.access_token);
      putMyVar('aliopeninfo', opentoken);
      putMyVar('opentokenChecktime', nowtime + 'time');
    }
    let drive_id = userinfo.default_drive_id;
    headers['authorization'] = 'Bearer ' + opentoken;
    let data3 = {"drive_id":drive_id,"file_id":file_id}
    let json3 = JSON.parse(request('https://open.aliyundrive.com/adrive/v1.0/openFile/getDownloadUrl', { headers: headers, body: data3, method: 'POST', timeout: 3000 }));
    return json3.url || "";
  } catch (e) {
    log('获取我的云盘开放原始播放地址失败>' + e.message);
  }
  return "";
}
//evalPrivateJS('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')