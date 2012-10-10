/*
 * Forage.js
 * 
 * Authored by Ryhan Hassan
 * ryhanh@me.com
 */


function analyze( query )
{
	var concatTweetText = function(tweetData)
	{
		//console.log(_.pluck(tweetData.results, 'text'));
		return _.pluck(tweetData.results, 'text').join(' ').replace(/"/g,'');
	}

	var getEntites = function(contentData)
	{
		//console.log(contentData.query.results);
		if (contentData.query.results != undefined)
		{

			if (contentData.query.results.yctCategories != undefined && 
				contentData.query.results.yctCategories.yctCategory != undefined)
			{
				var topicData = contentData.query.results.yctCategories.yctCategory;
				console.log(_.pluck(topicData, 'content').join(', '));
			}

			if (contentData.query.results.entities != undefined &&
				contentData.query.results.entities.entity != undefined)
			{
				var entityData = contentData.query.results.entities.entity
				console.log( _.uniq(_.pluck(_.pluck(entityData, 'text'),'content')).join(', '));
			}
		}
	}

	return fetchTweets( query, function(data){ return contentAnalyze(concatTweetText(data), getEntites); });
}


function fetchTweets( query , callback )
{
	$.ajax({
		url : 'http://search.twitter.com/search.json',
		jsonp: 'callback',
		dataType : 'jsonp',
		data : {
			q : query,
			lang : 'en',
			result_type : 'mixed',
			rpp : 30,
			show_user : true
		},
		success : function (data){ return callback(data);}
	});
}

function contentAnalyze( string, callback )
{
	$.ajax({
	  url : 'http://query.yahooapis.com/v1/public/yql',
	  jsonp : 'callback',
	  dataType : 'jsonp',
	  data : {
	    q : "select * from contentanalysis.analyze where text=\"" + string + "\"",
		format : 'json'
	  },
	  success : function(data){ return callback(data);}
	});

}

function self(data){
	console.log(data);
}