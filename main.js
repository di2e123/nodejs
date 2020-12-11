var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path')

function templateHTML(title, body){
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <link rel="stylesheet" href="index.css" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Nanum+Gothic+Coding|Ubuntu|Black+Han+Sans" rel="stylesheet">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FLY.GG - ${title}</title>
  </head>
  <body>
  <div class="l-header">
    <div class="header">
      <ul class="menu">
        <li class="menu_item menu_item-logo">
          <a href="./">
            <span class="logo_name">
            ...
            </span>
          </a>
        </li>
        <li class="menu_item menu_item-active">
          <a href="./" class="target=">
            홈
          </a>
        </li>
        <li class="menu_item">
          <a href="./champion" class="target=">
            챔피언
          </a>
        </li>
        <li class="menu_item">
          <a href="./statistics" class="target=">
            통계
          </a>
        </li>
        <li class="menu_item">
          <a href="./ranking" class="target=">
            랭킹
          </a>
        </li>
        <li class="menu_item">
          <a href="http://talk.op.gg/s/lol" class="target=_blank">
            커뮤니티
          </a>
        </li>
      </ul>
    </div>
  </div>
  ${body}
  <div class="l-footer">
    <div class="footer">
      <ul class="bmenu">
        <li class="bmenu_item icon">
          <a href="./" class="target=">
            <div class="mw">
              <img src="img/home50.png"/>
            </div>
            <div class="t">
              홈
            </div>
          </a>
        </li>
        <li class="bmenu_item icon">
          <a href="./champion" class="target=">
            <div class="mw">
              <img src="img/prize50.png"/>
            </div>
            <div class="t">
              챔피언
            </div>
          </a>
        </li>
        <li class="bmenu_item icon">
          <a href="http://talk.op.gg/s/lol" class="target=_blank">
            <div class="mw">
              <img src="img/people50.png"/>
            </div>
            <div class="t">
              커뮤니티
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>

  </body>
  </html>
  `;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
      fs.readFile(`data/index.html`, `utf8`, function(err,body){
        var title = 'HOME'
        var template = templateHTML(title, body);
        response.writeHead(200);
        response.end(template);
      });
    } else if (pathname === '/champion') {
      fs.readFile(`data/champion.html`, `utf8`, function(err,body){
        var title = 'Champion'
        var template = templateHTML(title, body);
        response.writeHead(200);
        response.end(template);
      });
    } else if (pathname === '/champion_process'){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      });
      request.on("end", function(){
        var post = qs.parse(body);
        var champion_name = post.cn;
        fs.readFile(`champion/${champion_name}.html`, 'utf8', function(err, data){
            if (err){
              response.writeHead(404);
              response.end('Not found');
            }
            response.writeHead(302, {Location: `./champion/${champion_name}`});
            response.end();
        });
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
    });
    app.listen(3000);
