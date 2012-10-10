/*
 * Forage.js
 * 
 * Authored by Ryhan Hassan
 * ryhanh@me.com
 */



function analyze( query , callback)
{
	// Fetch tweets based on the provided query,
	// and then pass the data to handleTweets();
	return fetchTweets( query, handleTweets, true);

	// Given tweet data, santize the data,
	// analyze the content, and then return the entities
	var handleTweets = function(data)
	{
		return contentAnalyze(sanitizeTweetText(data), getEntites); 
	}

	// Pull out the text attribute and remove problematic characters
	var sanitizeTweetText = function(tweetData)
	{
		var string = _.pluck(tweetData.results, 'text').join(' ');
		return cleanString(string);
	}

	// Given the content analyzed data, return 
	// a JSON object containing the categories
	// that this query belongs to, as well 
	// as related entites
	var getEntites = function(contentData)
	{
		if (contentData.query.results != undefined)
		{
			var categories,
				related;

			// Pull out category data
			var catGroup = contentData.query.results.yctCategories;
			if (catGroup != undefined && catGroup.yctCategory != undefined)
			{
				var topicData = catGroup.yctCategory;
				categories = _.compact(_.pluck(topicData, 'content'));
			}

			// Pull out related entity data
			var entGroup = contentData.query.results.entities;
			if (entGroup != undefined && entGroup.entity != undefined)
			{
				var entityData = entGroup.entity;

				if (entityData.length != undefined){
					entityData = _.pluck(entityData, 'text');
				}
				else{
					entityData = [entityData.text];
				}

				related = _.uniq(_.pluck(entityData,'content'));
			}

			// Call the callback function, returning the expected data
			callback({
				categories: categories,
				related: related
			});
		}
		else
		{
			// Some error occurred, so return {empty}
			callback({});
		}
	}
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

var cleanString = function(string){
	return string
		.replace(/"/g,'')
	    .replace(/[\n\r]/g, '')
	    .replace(/“/g,'')
	    .replace(/'/g,'')
	    .replace(/\//g,'')
	    .replace(/&/g,'')
	    .replace(/%/g,'')
	    .replace(/\./g,'')
	    .replace(/\=/g,'');
}

function self(data){
	console.log(data);
}