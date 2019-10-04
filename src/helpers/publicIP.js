const publicIp = require('public-ip');
 
(async () => {
    console.log(await publicIp.v4());
    //=> '46.5.21.123'
 
    console.log(await publicIp.v6());
    //=> 'fe80::200:f8ff:fe21:67cf'
})();