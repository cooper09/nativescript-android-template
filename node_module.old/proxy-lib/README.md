# proxy-lib
Proxy library used in NativeScript tooling.
This library gives you methods to get, set and clear proxy settings respected by NativeScript tooling.

## Contents
* [getProxySettings](#getproxysettings)
  * [Definition](#getproxysettings-definition)
  * [Examples](#getproxysettings-examples)
* [setProxySettings](#setproxysettings)
  * [Definition](#setproxysettings-definition)
  * [Examples](#setproxysettings-parameters-and-examples)
* [clearProxySettings](#setproxysettings)
  * [Definition](#clearproxysettings-definition)
  * [Examples](#clearproxysettings-examples)

## API
### getProxySettings
This method returns the proxy information. In case there's no proxy settings file, the returned promise is resolved with `null`.

#### getProxySettings definition
```TypeScript
/**
 * Get information about current proxy settings.
 * @param {string | { credentialsKey: string, userSpecifiedSettingsFilePath: string }} params @optional CredentialsKey and path to file from which to get the information.
 * @returns {Promise<{ proxy: string, rejectUnauthorized: boolean, username: string, password: string, protocol: string, port: string, hostname: string }>} Information about proxy settings
 */
getProxySettings(params: string | { credentialsKey: string, userSpecifiedSettingsFilePath: string }): Promise<{proxy: string, rejectUnauthorized: boolean, username: string, password: string, protocol: string, port: string, hostname: string}>;
```

#### getProxySettings examples
* Passing `credentials key` only - in this case the settings will be read from default location:
```JavaScript
const proxyLib = require("proxy-lib");
proxyLib.getProxySettings({ credentialsKey: "myCredKey" })
	.then(proxySettings => console.log(proxySettings))
	.catch(err => console.error("Error while getting proxy settings.", err));
```

* Passing `credentialsKey` and `userSpecifiedSettingsFilePath` - proxy settings will be read from this file:
```JavaScript
const proxyLib = require("proxy-lib");
proxyLib.getProxySettings({ credentialsKey: "myCredKey", userSpecifiedSettingsFilePath: "~/.local/share/myProxyFile.json" })
	.then(proxySettings => console.log(proxySettings))
	.catch(err => console.error("Error while getting proxy settings.", err));
```

* Passing credentials key as string - in this case the settings will be read from default location:
```JavaScript
const proxyLib = require("proxy-lib");
proxyLib.getProxySettings("myCredKey")
	.then(proxySettings => console.log(proxySettings))
	.catch(err => console.error("Error while getting proxy settings.", err));
```

### setProxySettings
This method sets the proxy information to a specified file (or default location). In case proxy requires authentication, you can pass credentials and they'll be stored securely in Windows Credentials Manager.

#### setProxySettings definition
```TypeScript
/**
 * Sets new proxy settings.
 * @param {string | { proxyUrl: string, credentialsKey: string, rejectUnauthorized: boolean, username: string, password: string, userSpecifiedSettingsFilePath: string }} params Proxy settings
 * @returns {Promise<void>}
 */
setProxySettings(params: string | { proxyUrl: string, credentialsKey: string, rejectUnauthorized: boolean, username: string, password: string, userSpecifiedSettingsFilePath: string }): Promise<void>;
```
#### setProxySettings parameters and examples
* Passing all settings:
```JavaScript
const proxyLib = require("proxy-lib");
proxyLib.setProxySettings({ proxyUrl: "http://192.168.1.102:8888", credentialsKey: "myCredKey", rejectUnauthorized: true, username: "myUsername", password: "myPassword", userSpecifiedSettingsFilePath: "~/.local/share/myProxyFile.json" })
	.then(() => console.log("Successfully set proxy settings."))
	.catch(err => console.error("Unable to set proxy settings", err));
```

* `proxyUrl` - this parameter is mandatory and it shows the url of the proxy. You can pass it as a single string argument of the method or as part of an object:

```JavaScript
const proxyLib = require("proxy-lib");
proxyLib.setProxySettings({ proxyUrl: "http://192.168.1.102:8888" })
	.then(() => console.log("Successfully set proxy settings."))
	.catch(err => console.error("Unable to set proxy settings", err));
```
or
```JavaScript
const proxyLib = require("proxy-lib");
proxyLib.setProxySettings("http://192.168.1.102:8888")
	.then(() => console.log("Successfully set proxy settings."))
	.catch(err => console.error("Unable to set proxy settings", err));
```

The `proxyUrl` may also contain the authentication information, in this case the call will be:
```JavaScript
const proxyLib = require("proxy-lib");
proxyLib.setProxySettings({ proxyUrl: "http://myUsername:myPassword@192.168.1.102:8888" })
	.then(() => console.log("Successfully set proxy settings."))
	.catch(err => console.error("Unable to set proxy settings", err));
```
or
```JavaScript
const proxyLib = require("proxy-lib");
proxyLib.setProxySettings("http://myUsername:myPassword@192.168.1.102:8888")
	.then(() => console.log("Successfully set proxy settings."))
	.catch(err => console.error("Unable to set proxy settings", err));
```

* `rejectUnauthorized` - this parameter defines if Node.js errors for invalid certificates should be respected. In case you do not pass this value, it will be set to `true`, so based on the configuration, errors like `self signed certificate in certificate chain` may be thrown. Setting this value to `false` will disregard such errors.
```JavaScript
const proxyLib = require("proxy-lib");
proxyLib.setProxySettings({ proxyUrl: "http://192.168.1.102:8888", rejectUnauthorized: false })
	.then(() => console.log("Successfully set proxy settings."))
	.catch(err => console.error("Unable to set proxy settings", err));
```

* `username` and `password` - these parameters should be used in case the proxy requires basic authentication. Currently you can use them only on Windows. Passing only one of the values will throw error. You can either pass the two arguments or include the authentication in the `proxyUrl` as shown above. The passed values will be saved in Windows Credential Manager.
```JavaScript
const proxyLib = require("proxy-lib");
proxyLib.setProxySettings({ proxyUrl: "http://192.168.1.102:8888", username: "myUsername", password: "myPassword" })
	.then(() => console.log("Successfully set proxy settings."))
	.catch(err => console.error("Unable to set proxy settings", err));
```

* `credentialsKey` - this parameter defines the name of the entry in Windows Credential Manager, where the username and password will be persisted. If it is not passed, it has default value. This parameter has no effect in case there's no authentication arguments passed.
```JavaScript
const proxyLib = require("proxy-lib");
proxyLib.setProxySettings({ proxyUrl: "http://192.168.1.102:8888", username: "myUsername", password: "myPassword", credentialsKey: "myKey" })
	.then(() => console.log("Successfully set proxy settings."))
	.catch(err => console.error("Unable to set proxy settings", err));
```

* `userSpecifiedSettingsFilePath` - this parameter defines the path to the file where proxy settings (without authentication) will be persisted. In case it is not passed, it has default value.
```JavaScript
const proxyLib = require("proxy-lib");
proxyLib.setProxySettings({ proxyUrl: "http://192.168.1.102:8888", userSpecifiedSettingsFilePath: "~/.local/share/myProxyFile.json" })
	.then(() => console.log("Successfully set proxy settings."))
	.catch(err => console.error("Unable to set proxy settings", err));
```

### clearProxySettings
This method clears the proxy settings by removing the proxy file and removing the specified entry from Credentials Manager.

#### clearProxySettings definition
```TypeScript
/**
 * Clears proxy settings.
 * @param {string | { credentialsKey: string, userSpecifiedSettingsFilePath: string }} params @optional Options for credentials key and path to be cleaned.
 * @returns {Promise<void>}
 */
clearProxySettings(params: string | { credentialsKey: string, userSpecifiedSettingsFilePath: string }): Promise<void>;
```

#### clearProxySettings examples
* Removing default settings:
```JavaScript
const proxyLib = require("proxy-lib");
proxyLib.clearProxySettings()
	.then(() => console.log("Successfully cleared proxy settings file."))
	.catch(err => console.error("Unable to clear proxy settings", err));
```

* Removing settings from custom file:
```JavaScript
const proxyLib = require("proxy-lib");
proxyLib.clearProxySettings({ userSpecifiedSettingsFilePath: "~/.local/share/myProxyFile.json" })
	.then(() => console.log("Successfully cleared custom proxy settings file."))
	.catch(err => console.error("Unable to clear proxy settings", err));
```

* Removing settings from custom Credentials Manager entry and default settings file:
```JavaScript
const proxyLib = require("proxy-lib");
proxyLib.clearProxySettings({ credentialsKey: "myKey" })
	.then(() => console.log("Successfully cleared custom proxy settings file and custom entry."))
	.catch(err => console.error("Unable to clear proxy settings", err));
```