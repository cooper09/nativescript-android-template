const{algorithms:s,platforms:t}=require("./constants"),r=require("crypto");module.exports={getCredentialsFromAuth:s=>{const t=(s=s||"").indexOf(":");let r="",e="";return t>-1&&(r=s.substring(0,t),e=s.substring(t+1)),{username:r,password:e}},getHash:(t,e=s.sha512)=>{const n=r.createHash(e);n.update(t);return n.digest()},isWindows:()=>process.platform===t.windows,stringify:s=>JSON.stringify(s,null,2)};