/*
 * Forage.js
 * 
 * Authored by Ryhan Hassan
 * ryhanh@me.com
 */


function analyze( query , callback)
{
	var concatTweetText = function(tweetData)
	{
		var string = _.pluck(tweetData.results, 'text').join(' ');

		string = string.replace(/"/g,'')
					   .replace(/[\n\r]/g, '')
					   .replace(/“/g,'')
					   .replace(/'/g,'')
					   .replace(/\//g,'')
					   .replace(/&/g,'')
					   .replace(/%/g,'')
					   .replace(/\./g,'')
					   .replace(/\=/g,'');
		
		return string;
	}

	var getEntites = function(contentData)
	{
		if (contentData.query.results != undefined)
		{
			var categories,
				related;

			if (contentData.query.results.yctCategories != undefined && 
				contentData.query.results.yctCategories.yctCategory != undefined)
			{
				var topicData = contentData.query.results.yctCategories.yctCategory;

				categories = _.compact(_.pluck(topicData, 'content'));
			}

			if (contentData.query.results.entities != undefined &&
				contentData.query.results.entities.entity != undefined)
			{
				var entityData = contentData.query.results.entities.entity;

				if (entityData.length != undefined)
				{
					entityData = _.pluck(entityData, 'text');
				}
				else
				{
					entityData = [entityData.text];
				}

				related = _.uniq(_.pluck(entityData,'content'));
			}

			callback({
				categories: categories,
				related: related
				});
		}
		else
		{
			console.log('some error occured');
			callback({});
		}
	}

	var handleTweets = function(data)
	{
		return contentAnalyze(concatTweetText(data), getEntites); 
	}

	return fetchTweets( query, handleTweets, true);
}


function fetchTweets( query, callback, noise)
{
	$.ajax({
		url : 'http://search.twitter.com/search.json',
		jsonp: 'callback',
		dataType : 'jsonp',
		data : {
			q : query,
			lang : 'en',
			result_type : (noise == true) ? 'mixed' : 'popular',
			rpp : 50,
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