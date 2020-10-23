const e=require("path"),r=require("osenv"),t=require("fs"),s=require("./credentials-manager"),n=require("url"),{stringify:o,getCredentialsFromAuth:i}=require("./utils"),a=require("./utils"),{encodings:l,proxyCacheFileName:c,dirNames:u,setProxyErrors:d,getProxyErrors:p,clearProxyErrors:m,defaultCredentialsKey:y,proxySettingsKeys:f,dataTypes:h}=require("./constants"),w=require("util"),g=t=>t?e.resolve(t):(()=>{const t=a.isWindows()?process.env.AppData:e.join(r.home(),u.local,u.share),s=e.join(t,u.nativeScriptCliProfileDirName);return e.join(s,c)})();module.exports={getProxySettings:(e={})=>new Promise((r,n)=>{typeof e===h.string&&(e={credentialsKey:e});const{credentialsKey:o,userSpecifiedSettingsFilePath:i}=e,c=g(i);if(t.existsSync(c)){const e=t.readFileSync(c,l.utf8),i=JSON.parse(e),u={rejectUnauthorized:!i.ALLOW_INSECURE,protocol:i.PROXY_PROTOCOL,port:i.PROXY_PORT,hostname:i.PROXY_HOSTNAME},d=()=>{const e=u.username?`${u.username}:${u.password}@`:"";u.proxy=`${u.protocol}//${e}${u.hostname}:${u.port}`,r(u)};return a.isWindows()&&o?s.getCredentials({credentialsKey:o}).then(e=>{e&&(u.username=e.username,u.password=e.password),d()},e=>{const r=w.format(p.unableToGetCredentialsFormat,o,e.message);n(new Error(r))}):void d()}r(null)}),setProxySettings:e=>new Promise((r,a)=>{if(typeof e===h.string&&(e={proxyUrl:e}),!e||!e.proxyUrl)return a(new Error(d.invalidInputParams));let{credentialsKey:c,userSpecifiedSettingsFilePath:u,proxyUrl:p,rejectUnauthorized:m,username:P,password:S}=e;const x=g(u),C=n.parse(p);if(C.auth){const{username:e,password:r}=i(C.auth);if(P&&e!==P)return a(new Error(w.format(d.usernamesMismatchFormat,P,e)));if(P=e,S&&r!==S)return a(new Error(d.passwordsMismatch));S=r}if(P&&!S)return a(new Error(d.passwordRequired));const E={[f.hostname]:C.hostname,[f.port]:C.port,[f.protocol]:C.protocol,[f.allowInsecure]:void 0!==m&&!m},K=()=>{const e=o(E);t.writeFileSync(x,e,l.utf8),r()};return c=c||y,P?s.setCredentials({username:P,password:S,credentialsKey:c}).then(()=>K(),a):s.clearCredentials({credentialsKey:c}).then(()=>K(),a)}),clearProxySettings:(e={})=>new Promise((r,n)=>{typeof e===h.string&&(e={credentialsKey:e});const{credentialsKey:o,userSpecifiedSettingsFilePath:i}=e,a=g(i);if(t.existsSync(a)&&t.unlinkSync(a),o)return s.clearCredentials({credentialsKey:o}).then(r,e=>{const r=w.format(m.unableToClearCredentialsFormat,o,e.message);n(new Error(r))});r()})};