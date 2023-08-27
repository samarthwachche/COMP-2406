const http = require("http");
const file = require("fs");
const url = require("url");

const host = "localhost";
const port = 8000;

const server = http.createServer(processRequest);

server.listen(port, host, () =>{
    console.log("Server is running!");
});

function processRequest(request, response){
    if(request.url.indexOf(".html") > -1){
        console.log("html requested");

        let location = request.url;
        location = location.substring(1);
        console.log(location);

        file.readFile(location, 'utf8', function(err, contents){
            if(err){
                response.writeHead(500, { "Content-Type": "text/html"});
                response.end();
                return;
            }
            response.writeHead(200, { "Content-Type": "text/html"});
            response.end(contents);
        });
    }

    else if(request.url.indexOf(".css") > -1){
        console.log("css requested");

        let location = request.url;
        location = location.substring(1);
        console.log(location);

        file.readFile(location, 'utf8', function(err, contents){
            if(err){
                response.writeHead(500, { "Content-Type": "text/css"});
                response.end();
                return;
            }
            response.writeHead(200, { "Content-Type": "text/css"});
            response.end(contents);
        });
    }

    else if(request.url.indexOf(".js") > -1){
        console.log("js requested");

        let location = request.url;
        location = location.substring(1);
        console.log(location);

        file.readFile(location, 'utf8', function(err, contents){
            if(err){
                response.writeHead(500, { "Content-Type": "application/javascript"});
                response.end();
                return;
            }
            response.writeHead(200, { "Content-Type": "application/javascript"});
            response.end(contents);
        });
    }

    else if(request.url.indexOf(".JSON") > -1){
        console.log("json requested");

        let location = request.url;
        location = location.substring(1);
        console.log(location);

        file.readFile(location, 'utf8', function(err, contents){
            if(err){
                response.writeHead(500, { "Content-Type": "application/javascript"});
                response.end();
                return;
            }
            response.writeHead(200, { "Content-Type": "application/javascript"});
            response.end(contents);
        });
    }

    else if(request.url.indexOf(".jpeg") > -1){
        console.log("Image requested");

        let location = request.url;
        location = location.substring(1);
        console.log(location);

        file.readFile(location, function(err, contents){
            if(err){
                response.writeHead(500, { "Content-Type": "image/jpeg"});
                response.end();
                return;
            }
            response.writeHead(200, { "Content-Type": "image/jpeg"});
            response.end(contents);
        });
    }

    else if(request.url.indexOf(".svg") > -1){
        console.log("Image requested");

        let location = request.url;
        location = location.substring(1);
        console.log(location);

        file.readFile(location, 'utf8', function(err, contents){
            if(err){
                response.writeHead(500, { "Content-Type": "image/svg+xml"});
                response.end();
                return;
            }
            response.writeHead(200, { "Content-Type": "image/svg+xml"});
            response.end(contents);
        });
    }

}