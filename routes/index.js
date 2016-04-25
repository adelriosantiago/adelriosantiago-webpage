//TODO: Lint this please

var express = require('express');
var fs = require('fs');
var path = require('path');
var util = require('util');
var router = express.Router();
var slug = require('slug');
var git_wrapper = require('git-wrapper');
var _ = require('lodash');

var trueHostname = 'http://www.adelriosantiago.com/';
var allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var allLanguages = {eng: 'English', spa: 'Español', ita: 'Italiano'};
var excludedFiles = ['.git', 'LICENSE', 'README.md', 'images'];
var articles_repo_path = path.join(__dirname, '../public') + '/articles/.git';
var git = new git_wrapper({'git-dir': articles_repo_path});

var logFmt = 'format:\'{"commit":"%H",' + '"date":"%ad","message":"%s"}\',';
if (require('os').platform() === 'win32') {
	logFmt = 'format:{\\"commit\\":\\""%H"\\",' + '\\"date\\":\\"%ad\\",\\"message\\":\\"%s\\"},';
}

//var hljs = require('highlight.js'); //TODO: Implement highlight on <code> sections
var md = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true
});
md.use(require('markdown-it-sup'));
md.use(require('markdown-it-sub'));
md.use(require('markdown-it-mark'));

//Return "true" if mobile
function isMobile(req) {
    var userAgent = req.headers['user-agent'].toLowerCase(),
        isMobile = false;

    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0,4))) {
        return true;
        console.log("mobile dec");
    }
    
    return false;
}

//Sort by key function
function sortByKey(array, key) {
    'use strict';

    return array.sort(function (a, b) {
        var x = a[key],
            y = b[key];

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

//Parameter sanitize function
function sanitizeParam(input, len) {
	if (input == null) { return ""; }
	if (len == null) { len = 255; }
	
	var output;
	
	output = input.substring(0, len);
	output = slug(output);
	
	return output;
}

//Show the home page
router.get('/', function (req, res, next) {
    'use strict';
    var hostname = req.protocol + '://' + req.get('host') + req.originalUrl;    

    return res.render('eng', { hostname: hostname, isMobile: isMobile(req)});
});

router.get('/blog', function (req, res, next) {
    'use strict';
    
    return res.redirect('/blog/index#all'); //Show the articles in all languages
});

router.get('/blog/:article', function (req, res, next) {
    'use strict';
    
    var articlePath = req.params.article,
        articles;

    articles = path.join(__dirname, '../public') + '/articles/' + articlePath;
    
    console.log(articles);
    
	if (!fs.existsSync(articles)) {
		return res.redirect('/blog/index#all');
	}
	
    //Read all chapters (if available)
    fs.readdir(articles, function (err, files) {
        if (err) {
			return res.redirect('/blog/index#all');
		}
        
        files = _.difference(files, excludedFiles); //Remove files in excludedFiles
        console.log('chapters', files.length);
        
        if (files.length != 0) {
            var c = 0;
			var cUnskipped = 0;
			var hasChapters = false;			
            //if (files.length > 1) { hasChapters = true; }

            console.log("chapters: " + files);
            var data = [];
			
			files.forEach(function (file) {
				//Omit files with a different extension than .md
				if (file.substr(file.length - 3) !== '.md') {
					console.log('skipped ' + file);
					return;
				}
				
                c++;
				cUnskipped++;

                var chapterPath = path.join(articles, file);
						
                fs.readFile(chapterPath, 'utf-8', function (err, html) {
                    if (err) { throw err; }

                    var rendered = md.render(html),
                        regexTitle = /<h1.*>(.*?)<\/h1>/i, //Regex to extract titles
                        regexPermalink = /<permalink.*>(.*?)<\/permalink>/i, //Regex to extract titles
                        regexDateMonth = /<month.*>(.*?)<\/month>/i, //Regex to extract the order of the articles
                        regexDateYear = /<year.*>(.*?)<\/year>/i, //Regex to extract the order of the articles
                        header = rendered.match(regexTitle),
                        permalink = rendered.match(regexPermalink),
						lang = allLanguages[permalink[1]],
                        month = Number(rendered.match(regexDateMonth)[1]),
                        year = Number(rendered.match(regexDateYear)[1]),
                        order = year + (month / 100.0),
                        monthName = allMonths[month],
                        sortedData;

                    data[c] = {id: file, title: header[1], slug: slug(permalink[1]), lang: lang, content: rendered, year: year, month: monthName, order: order};

                    if (0 === --c) {
                        sortedData = sortByKey(data, "order");

                        console.log(data.length);
                        console.log(articlePath);
						
						if (cUnskipped > 1) { hasChapters = true; }
						
                        var commentPath = trueHostname + 'blog/' + articlePath;
                        return res.render('blog', {data: sortedData, hasChapters: hasChapters, commentPath: commentPath, isMobile: isMobile(req)});
                    }
                });
            });
            //res.render('blog', { title: 'Express' });
        }
    });
    console.log('art', articlePath);
});

router.get('/gitblog/:lang?/:article', function (req, res, next) {
    'use strict';
	
	//return res.redirect('/blog/index#all'); //Debug only, we don't want this route to be available yet
	
	//Working git status, not used currently
	/*git.exec('status', {'porcelain' : true}, function(err, msg) {
		console.log(err);
		return res.render('gitblog', {gitlog: msg});
	});*/
	
	var articleLang = sanitizeParam(req.params.lang),
		articlePath = sanitizeParam(req.params.article),
        articles_repo_path;
	
	if (!articleLang) { articleLang = "eng"; }
	
	var current_file = articlePath + "/" + articleLang + ".md";
	var full_article_path = path.join(__dirname, '../public/articles/') + current_file;
	
	if (!fs.existsSync(full_article_path)) {
		return res.redirect('gitblog/all/index');
	}
	
	git.exec('log', {"follow" : true, 'pretty' : logFmt}, ["-- " + articlePath], function(err, msg) {
		console.log(err);
		
		var file_commits;
		
		file_commits = msg.substring(0, msg.length - 1);
		file_commits = "[" + file_commits + "]";
		file_commits = JSON.parse(file_commits);
		file_commits = file_commits.reverse();
		
		var gitBlogData = {};
		var hashes = _.map(file_commits, 'commit');
		var dates = _.map(file_commits, 'date');
		var messages = _.map(file_commits, 'message');
		var hasTimeline = true; //Assume that every rendered thing will have a timeline on it
		
		//TODO: If the requested file is the index then only get the last hash???
				
		for (var i = 0; i < hashes.length; i++) {
			var processed = hashes.length;
			
			//TODO: Implement a way to save the last result in a cache, and only perform the git call every 1/100 times
			//Example of a working command to show the content of a single commit in time: git show 5757f05edd1656fde44ded344cd9a41fea7bc968:100-duolingo/spa.md
			var getCommitContent = function(index, next) {
				git.exec('show', [hashes[index] + ":" + current_file], function(err, msg) {
					if (err) {
						console.log("Error:");
						console.log(err);
						
						//TODO: DRY'fy this with the second
						processed--;
						if (processed <= 0) { next(); }
					
						return;
					}
					
					var rendered = md.render(msg),
						regexTitle = /<h1.*>(.*?)<\/h1>/i, //Regex to extract titles
						regexPermalink = /<permalink.*>(.*?)<\/permalink>/i, //Regex to extract titles
						regexDateMonth = /<month.*>(.*?)<\/month>/i, //Regex to extract the order of the articles
						regexDateYear = /<year.*>(.*?)<\/year>/i, //Regex to extract the order of the articles
						header = rendered.match(regexTitle),
						permalink = rendered.match(regexPermalink),
						lang = allLanguages[permalink[1]],
						month = Number(rendered.match(regexDateMonth)[1]),
						year = Number(rendered.match(regexDateYear)[1]),
						order = year + (month / 100.0),
						monthName = allMonths[month],
						sortedData;
					
					gitBlogData[index] = {title: header[1], slug: slug(permalink[1]), lang: lang, content: rendered, year: year, month: monthName, order: order, hash : hashes[index], message : messages[index], date : dates[index] };
					
					//TODO: DRY'fy this with the first
					processed--;
					if (processed <= 0) { next(); }
				});
			}
			
			console.log("->" + i);
						
			getCommitContent(i, function() {
				var range = _.range(Object.keys(gitBlogData).length);				
				
				return res.render('gitblog', {gitBlogData : gitBlogData, range : range, hasTimeline : hasTimeline}); //TODO: Implement a way to save the last result in a cache, and only perform the git call every 1/100 times
			})
		}
	});
});

router.get('/gitblog/index', function (req, res, next) {
	return res.redirect('gitblog/all/index');
});

router.get('/gitblog', function (req, res, next) {
	return res.redirect('gitblog/all/index');
});


router.get('/spa', function (req, res, next) { //Temporal debug route
    'use strict';
    var hostname = req.protocol + '://' + req.get('host') + req.originalUrl;

    return  res.render('spa', { hostname: hostname }); //This is the second version
});

router.get('/p5', function (req, res, next) {
    'use strict';

    return res.render('p5', {});
});

//This MUST be last on this file
router.get('*', function(req, res, next) {
    'use strict';

	return res.redirect('/');
});

module.exports = router;