const axios = require('axios')

axios({
  method: 'get',
  url: 'https://brightdata.com/api/zone/route_ips?zone=isp&country=us',
  headers: {'Authorization': 'Bearer 7bd593a4-8756-471a-a4f2-8243ff73fd7e'},
})
.then(function (response) {
  console.log(response)
})