#!/usr/bin/env node
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
require('axios-https-proxy-fix').get('http://lumtest.com/myip.json',
    {
        proxy: {
            host: 'zproxy.lum-superproxy.io',
            port: '22225',
            auth: {
                username: 'brd-customer-hl_55cbe8a8-zone-isp-country-us',
                password: 'zm76rukrik0k'
            }
        }
    }
)
.then(function(data){ console.log(data); },
    function(err){ console.error(err); });