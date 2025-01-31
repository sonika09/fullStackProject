if(process.env.NODE_ENV === 'production'){
   module.exports = require('./prod')
   //return the prod set of key
}else{
   //return the development key
   module.exports = require('./dev')
}