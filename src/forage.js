/*
 * Forage.js
 * 
 * Authored by Ryhan Hassan
 * ryhanh@me.com
 */

function forage( query , callback)
{
	console.log(query);
	// Fetch tweets based on the provided query,
	// and then pass the data to handleTweets();
	var init = function(){
		fetchTweets( query, handleTweets, true);
	}

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

	// Pull out category data
	var processCategories = function(contentData){
		var catGroup = contentData.query.results.yctCategories;
		if (catGroup != undefined && catGroup.yctCategory != undefined)
		{
			var topicData = catGroup.yctCategory;
			return _.without(_.compact(_.pluck(topicData, 'content')), query);
		}
		return [];
	}

	// Pull out related entity data
	var processRelated = function(contentData){
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

			return _.without(_.compact(_.uniq(_.pluck(entityData,'content'))), query);
		}
	}

	// Given the content analyzed data, return 
	// a JSON object containing the categories
	// that this query belongs to, as well 
	// as related entites
	var getEntites = function(contentData)
	{
		/*
		callback({
				categories: processCategories(contentData),
				related: processRelated(contentData)
			});
		*/
		if (contentData.query!= undefined && contentData.query.results != undefined)
		{
			callback({
				categories: processCategories(contentData),
				related: processRelated(contentData)
			});
		}
		else
		{
			callback({});
		}
	}

	/*
	 * Helper Functions
	 */

	// Return data related to tweets that match query
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
			success : function (data){ callback(data);}
		});
	}

	// Analyze the content of a string
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

	// Remove problematic characters from a string
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

	init();
}

function self(data){
	console.log(data);
}