var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/
  console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)
    if(path === "sign_in" && method === "post"){
    const userArray=JSON.parse(fs.readFileSync('./db/users.json'))
    const array=[]
    request.on('data',(chunk)=>{
      array.push(chunk)
    })
    request.on('end',()=>{
      const string=Buffer.concat(array).toString()
     const obj=JSON.parse(string)//name password
     const user=userArray.find((user)=>user.name === obj.name && user.password === ogj.password)
      if(user === undefined){
        response.statusCode=400
        response.setHeader('Content-Type','text/json;charset=utf-8')//告诉浏览器返回的是json
        response.end(`{"errorCode":4001}`)//每个公司文档都有errorCode编码，自己定义的
      }else{
        response.statusCode=200
        response.setHeader('Set-Cookie',`sameSite=none;secure=true;logined=1`) //true已登陆
        response.end();
      }
    });
    }else if(path==='/home.html'){
      response.end("home")
    }else if(path==='/register' && method==='post'){
    response.setHeader('Content-Type','text/html;charset=utf-8')
    const userArray=JSON.parse(fs.readFileSync('./db/users.json'))
    const array=[]
    request.on('data',(chunk)=>{
      array.push(chunk)
    })
    request.on('end',()=>{
      const string=Buffer.concat(array).toString()
     const obj=JSON.parse(string)
      //console.log(obj.name)
      //console.log(obj.password)
      const lastUser=userArray[userArray.length-1]
      const newUser={
        //id为最后一个用户的id +1
        id:lastUser ? lastUser.id+1 : 1,
        name:obj.name,
        password:obj.password
      };
      userArray.push(newUser)
      fs.writeFileSync('./db/users.json',JSON.stringify(userArray))

      response.end("很好")
    })
  }else{
    response.statusCode = 200
    const filePath = path === '/' ? '/index.html' : path //默认首页，很多浏览器都会默认加这句话
    const index=filePath.lastIndexOf('.')//从/开始数,最后一个是.;/index.html，6
    const suffix=filePath.substring(index)//suffix后缀 //获取下标
    //console.log(suffix)
    const fileTypes={
     '.html':'text/html',
     '.css':'text/css',
     '.js':'text/javascript',
     '.png':'image/png',
     '.jpg':'image/jpeg'
   }
   response.setHeader('Content-Type', `${fileTypes[suffix] || 'text/html'};charset=utf-8`)//如果取不到时'text/html'保底
    let content
    try{
        content=fs.readFileSync(`./public${filePath}`)
    }catch(error){
        content='文件不存在' 
        response.statusCode = 404
    }
    response.write(content)
    response.end()
  }
  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
