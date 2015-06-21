var request = require("request");
var cheerio = require("cheerio");
var http = require('http');
var fs = require('fs');
var url = "http://thechive.com/"

var scrap_post = function(target){
	request(target, function(err, header, body){

		$ = cheerio.load(body);
		
		$("nav.page-navi a").each(function(index, pagination){
			var next = $(pagination).text();
			if (next=="Next") {
				var next_page = $(pagination).attr("href");
				
				scrap_post(next_page);
			};
		})

		$("h2.post-title a").each(function(index, posts){
			var links = $(posts).attr("href");
			console.log("POST LINK: "+links);
			scrape_photos(links);
		});

	});

}


var scrape_photos = function(target){
	request(target, function(err, header, body){
		$ = cheerio.load(body);
		$("img.attachment-full").each(function(index, image_body){
			var image_link = $(image_body).attr('src');

			var trimpos = image_link.indexOf("?");
			var trimmed_image_link = image_link.substring(0,trimpos);
			var http_link = trimmed_image_link.replace("https", "http");
			console.log(http_link);
			// console.log("IMAGE LINK= "+image_link);

			if (http_link.indexOf(".jpg")!= "-1") {
				var filename = Math.floor((Math.random() * 1000000) + 1)+".jpg";
			}else if (http_link.indexOf(".png")!= "-1") {
				var filename = Math.floor((Math.random() * 1000000) + 1)+".png";	
			}else if (http_link.indexOf(".jpeg")!= "-1") {
				var filename = Math.floor((Math.random() * 1000000) + 1)+".jpeg";	
			}else if (http_link.indexOf(".gif")!= "-1") {
				var filename = Math.floor((Math.random() * 1000000) + 1)+".gif";	
			}


			// var filename = Math.floor((Math.random() * 1000000) + 1)+".jpeg";
			download(http_link, "thechive/"+filename, function(){
				console.log("Done");
			})
		});
	});
}

var download = function(uri, filename, callback){
request
  .get(uri)
  .on('error', function(err) {
    console.log(err)
  })
  .pipe(fs.createWriteStream(filename))

};

scrap_post(url);
