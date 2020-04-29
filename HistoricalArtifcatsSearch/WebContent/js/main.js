function showProgressCursor() {
	$("#progressMessage").show();
}
function hideProgressCursor() {
	$("#progressMessage").hide();
}
$(document).ready(function () {
	$(document).bind('keypress', function (e) {
		if (e.keyCode == 13) {
			$('#searchButton').trigger('click');
		}
	});

	function truncate(n, useWordBoundary) {
		var isTooLong = this.length > n,
			s_ = isTooLong ? this.substr(0, n - 1) : this;
		s_ = (useWordBoundary && isTooLong) ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
		return isTooLong ? s_ + '&hellip;' : s_;
	};
	$("#clusterTab1").click(function () {
			showProgressCursor();
			var queryVal = $('#query').val();
			$.get('ClusteringPath', {
				query: queryVal,
				type:"kmean"
			},
				function (
					response) {
					hideProgressCursor();
					var jsonData = JSON.parse(response);
					var clustData;
					clustData = jsonData['clust'];
					console.log("Cluster data");
					console.log(clustData)
					data = Object.values(clustData);
					data = data.sort(function(a,b){return b.length-a.length})
			   
					$(".hideme")
						.removeClass(
							"hideme");
					
					var dataPoints = [];
					var labels = [];
				
					for (var key in clustData) {
						dataPoints.push(clustData[key].length);
						labels.push(key)
					}
					console.log(dataPoints)
					var ctx = document.getElementById('kmean').getContext('2d');
					var myChart = new Chart(ctx, {
						type: 'bar',
					    data: {
					        labels: labels,
					        datasets: [{
					            label: 'Search Result Clusters',
					            data: dataPoints,
					       
					            borderWidth: 1
					        }]
					    },
					    options: {
					        scales: {
					            yAxes: [{
					                ticks: {
					                    beginAtZero: true
					                }
					            }]
					        }
					    }
					});
//					
					data = Object.values(clustData);
					data = data.sort(function(a,b){return b.length-a.length}).flat()
					var count = 0;
					for (var i in data) {
						count = count + 1;
						if(data[i] !=null)
							{
							var link = data[i].id;
							var title = data[i].title;
							if (typeof title == 'undefined') {
								title = link;
							}
							var description = data[i].content[0].slice(0, 200);
							var dat = "<blockquote> <p><a href='" + link + "'>" +
								title +
								"</a><br><span class='linkclass'>" + link + "</span></p> <small><i>" +
								description +
								"</i></small></blockquote>";
							$(".kmeanContent")
								.append(
									"" +
									dat +
									"<br>");
							if (count == 15) {
								break;
							}
							}
					}

				});
		
	});
	$("#clusterTab2").click(function () {
		showProgressCursor();
		var queryVal = $('#query').val();
		$.get('ClusteringPath', {
			query: queryVal,
			type:"agg"
		},
			function (
				response) {
				hideProgressCursor();
				var jsonData = JSON.parse(response);
				var clustData;
				clustData = jsonData['clust'];
				console.log(clustData)
		   
				$(".hideme")
					.removeClass(
						"hideme");
			
				var dataPoints = [];
				var labels = [];
			
				for (var key in clustData) {
					dataPoints.push(clustData[key].length);
					labels.push(key)
				}
				console.log(dataPoints)
				var ctx = document.getElementById('agg').getContext('2d');
				var myChart = new Chart(ctx, {
					type: 'bar',
				    data: {
				        labels: labels,
				        datasets: [{
				            label: 'Search Result Clusters',
				            data: dataPoints,
				       
				            borderWidth: 1
				        }]
				    },
				    options: {
				        scales: {
				            yAxes: [{
				                ticks: {
				                    beginAtZero: true
				                }
				            }]
				        }
				    }
				});
				
				data = Object.values(clustData);
				data = data.sort(function(a,b){return b.length-a.length}).flat();
				var count = 0;
				for (var i in data) {
					count = count + 1;
					if(data[i] !=null)
						{
						var link = data[i].id;
						var title = data[i].title;
						if (typeof title == 'undefined') {
							title = link;
						}
						var description = data[i].content[0].slice(0, 200);
						var dat = "<blockquote> <p><a href='" + link + "'>" +
							title +
							"</a><br><span class='linkclass'>" + link + "</span></p> <small><i>" +
							description +
							"</i></small></blockquote>";
						$(".aggContent")
							.append(
								"" +
								dat +
								"<br>");
						if (count == 15) {
							break;
						}
						}
				}
//				

			});
	});
	$("#clusterTab3").click(function () {
		showProgressCursor();
		var queryVal = $('#query').val();
		$.get('ClusteringPath', {
			query: queryVal,
			type:"single"
		},
			function (
				response) {
				hideProgressCursor();
				var jsonData = JSON.parse(response);
				var clustData;
				clustData = jsonData['clust'];
				console.log(clustData)
		   
				$(".hideme")
					.removeClass(
						"hideme");
			
				var dataPoints = [];
				var labels = [];
			
				for (var key in clustData) {
					dataPoints.push(clustData[key].length);
					labels.push(key)
				}
				console.log(dataPoints)
				var ctx = document.getElementById('single').getContext('2d');
				var myChart = new Chart(ctx, {
					type: 'bar',
				    data: {
				        labels: labels,
				        datasets: [{
				            label: 'Search Result Clusters',
				            data: dataPoints,
				       
				            borderWidth: 1
				        }]
				    },
				    options: {
				        scales: {
				            yAxes: [{
				                ticks: {
				                    beginAtZero: true
				                }
				            }]
				        }
				    }
				});
				data = Object.values(clustData);
				console.log(data)
				data = data.sort(function(a,b){return b.length-a.length}).flat();
				var count = 0;
				for (var i in data) {
					count = count + 1;
					if(data[i] !=null)
						{
						var link = data[i].id;
						var title = data[i].title;
						if (typeof title == 'undefined') {
							title = link;
						}
						var description = data[i].content[0].slice(0, 200);
						var dat = "<blockquote> <p><a href='" + link + "'>" +
							title +
							"</a><br><span class='linkclass'>" + link + "</span></p> <small><i>" +
							description +
							"</i></small></blockquote>";
						$(".singleContent")
							.append(
								"" +
								dat +
								"<br>");
						if (count == 15) {
							break;
						}
						}
				}
//				

			});
	});
	$("#clusterTab4").click(function () {
		showProgressCursor();
		var queryVal = $('#query').val();
		$.get('ClusteringPath', {
			query: queryVal,
			type:"complete"
		},
			function (
				response) {
				hideProgressCursor();
				var jsonData = JSON.parse(response);
				var clustData;
				clustData = jsonData['clust'];
				console.log(clustData)
		   
				$(".hideme")
					.removeClass(
						"hideme");
			
				var dataPoints = [];
				var labels = [];
			
				for (var key in clustData) {
					dataPoints.push(clustData[key].length);
					labels.push(key)
				}
				console.log(dataPoints)
				var ctx = document.getElementById('complete').getContext('2d');
				var myChart = new Chart(ctx, {
					type: 'bar',
				    data: {
				        labels: labels,
				        datasets: [{
				            label: 'Search Result Clusters',
				            data: dataPoints,
				       
				            borderWidth: 1
				        }]
				    },
				    options: {
				        scales: {
				            yAxes: [{
				                ticks: {
				                    beginAtZero: true
				                }
				            }]
				        }
				    }
				});
				data = Object.values(clustData);
				data = data.sort(function(a,b){return b.length-a.length}).flat();
				var count = 0;
				for (var i in data) {
					count = count + 1;
					if(data[i] !=null)
						{
						var link = data[i].id;
						var title = data[i].title;
						if (typeof title == 'undefined') {
							title = link;
						}
						var description = data[i].content[0].slice(0, 200);
						var dat = "<blockquote> <p><a href='" + link + "'>" +
							title +
							"</a><br><span class='linkclass'>" + link + "</span></p> <small><i>" +
							description +
							"</i></small></blockquote>";
						$(".completeContent")
							.append(
								"" +
								dat +
								"<br>");
						if (count == 15) {
							break;
						}
						}
				}

			});
	});
	$("#qexpmcTab").click(function () {
		if ($('.qexpmc').html().length == 0) {
			showProgressCursor();
			var queryVal = $('#query').val();
			$.get('QexpServletPath', {
				query: queryVal,
				type:"metric"
			},
				function (
					response) {
					hideProgressCursor();
					var jsonData = JSON.parse(response);
					var mainData;
					mainData = jsonData['qexp'];
					var newQuery = mainData['newQuery'];
					var qexpData = mainData['result'];
					$(".qexpmc")
						.html(
							"");
					$(".hideme")
						.removeClass(
							"hideme");
					var count = 0;
					$(".qexpmc")
						.append("<h3>Showing results for - <i>" + newQuery + "</i></h3><br>");
					for (var i in qexpData) {
						count = count + 1;
						var link = qexpData[i].id;
						var title = qexpData[i].title;
						if (typeof title == 'undefined') {
							title = link;
						}
						var description = qexpData[i].content[0].slice(0, 200);
						var dat = "<blockquote> <p><a href='" + link + "'>" +
							title +
							"</a><br><span class='linkclass'>" + link + "</span></p> <small><cite title='" +
							"Source Title'>" +
							truncate.apply(description, [200, true]); +
								"</cite></small></blockquote>";
						$(".qexpmc")
							.append(
								"" +
								dat +
								"<br>");
						if (count == 15) {
							break;
						}
					}


				});
		}
	});
	$("#qexpacTab").click(function () {
		if ($('.qexpac').html().length == 0) {
			showProgressCursor();
			var queryVal = $('#query').val();
			$.get('QexpServletPath', {
				query: queryVal,
				type:"association"
			},
				function (
					response) {
					hideProgressCursor();
					var jsonData = JSON.parse(response);
					var mainData;
					mainData = jsonData['qexp'];
					var newQuery = mainData['newQuery'];
					var qexpData = mainData['result'];
					$(".qexpac")
						.html(
							"");
					$(".hideme")
						.removeClass(
							"hideme");
					var count = 0;
					$(".qexpac")
						.append("<h3>Showing results for - <i>" + newQuery + "</i></h3><br>");
					for (var i in qexpData) {
						count = count + 1;
						var link = qexpData[i].id;
						var title = qexpData[i].title;
						if (typeof title == 'undefined') {
							title = link;
						}
						var description = qexpData[i].content[0].slice(0, 200);
						var dat = "<blockquote> <p><a href='" + link + "'>" +
							title +
							"</a><br><span class='linkclass'>" + link + "</span></p> <small><cite title='" +
							"Source Title'>" +
							truncate.apply(description, [200, true]); +
								"</cite></small></blockquote>";
						$(".qexpac")
							.append(
								"" +
								dat +
								"<br>");
						if (count == 15) {
							break;
						}
					}


				});
		}
	});
	$("#qexpscTab").click(function () {
		if ($('.qexpsc').html().length == 0) {
			showProgressCursor();
			var queryVal = $('#query').val();
			$.get('QexpServletPath', {
				query: queryVal,
				type:"scalar"
			},
				function (
					response) {
					hideProgressCursor();
					var jsonData = JSON.parse(response);
					var mainData;
					mainData = jsonData['qexp'];
					var newQuery = mainData['newQuery'];
					var qexpData = mainData['result'];
					$(".qexpsc")
						.html(
							"");
					$(".hideme")
						.removeClass(
							"hideme");
					var count = 0;
					$(".qexpsc")
						.append("<h3>Showing results for - <i>" + newQuery + "</i></h3><br>");
					for (var i in qexpData) {
						count = count + 1;
						var link = qexpData[i].id;
						var title = qexpData[i].title;
						if (typeof title == 'undefined') {
							title = link;
						}
						var description = qexpData[i].content[0].slice(0, 200);
						var dat = "<blockquote> <p><a href='" + link + "'>" +
							title +
							"</a><br><span class='linkclass'>" + link + "</span></p> <small><cite title='" +
							"Source Title'>" +
							truncate.apply(description, [200, true]); +
								"</cite></small></blockquote>";
						$(".qexpsc")
							.append(
								"" +
								dat +
								"<br>");
						if (count == 15) {
							break;
						}
					}


				});
		}
	});
	$("#qexprcTab").click(function () {
		if ($('.qexprc').html().length == 0) {
			showProgressCursor();
			var queryVal = $('#query').val();
			$.get('QexpServletPath', {
				query: queryVal,
				type:"rocchio"
			},
				function (
					response) {
					hideProgressCursor();
					var jsonData = JSON.parse(response);
					var mainData;
					mainData = jsonData['qexp'];
					console.log(mainData)
					var newQuery = mainData['newQuery'];
					var qexpData = mainData['result'];
					$(".qexprc")
						.html(
							"");
					$(".hideme")
						.removeClass(
							"hideme");
					var count = 0;
					$(".qexprc")
						.append("<h3>Showing results for - <i>" + newQuery + "</i></h3><br>");
					for (var i in qexpData) {
	
						count = count + 1;
						var link = qexpData[i].id;
						var title = qexpData[i].title;
						if (typeof title == 'undefined') {
							title = link;
						}
						var description = qexpData[i].content[0].slice(0, 200);
						var dat = "<blockquote> <p><a href='" + link + "'>" +
							title +
							"</a><br><span class='linkclass'>" + link + "</span></p> <small><cite title='" +
							"Source Title'>" +
							truncate.apply(description, [200, true]); +
								"</cite></small></blockquote>";
						$(".qexprc")
							.append(
								"" +
								dat +
								"<br>");
						if (count == 15) {
							break;
						}
					}


				});
		}
	});
	$("#searchButton").click(function () {
		showProgressCursor();
		var queryVal = $('#query').val();
		$(".solr").html("");
		$(".google").html("");
		$(".bing").html("");
		$(".hits").html("");
		$(".cluster1").html("");
		$(".cluster2").html("");
		$(".cluster3").html("");
		$(".cluster4").html("");
		$(".qexp").html("");
		$(".nav-tabs .active").removeClass(
			"active");
		$("#tab1").addClass("active");
		$(".tab-content .active").removeClass(
			"active");
		$('#tab1default').addClass("active");


		$.get('MainServletPath', {
			query: queryVal
		},
			function (
				response) {

				hideProgressCursor();
				var jsonData = JSON.parse(response);
				if(response=='{}')
				{
					alert("NO RESULT FOUND !");
				}
				else{
					var pagerankData, googleData, bingData, hitsData;
					console.log(jsonData)
					var googleData = jsonData['google'];
					var bingData = jsonData['bing'];
					pagerankData = jsonData['solr'];
					hitsData = jsonData['hits'];
					console.log(pagerankData, hitsData);
	
					$(".pagerank").html("");
					$(".hideme")
						.removeClass(
							"hideme");
					var count = 0;
					for (var i in pagerankData) {
						count = count + 1;
						if(pagerankData[i] !=null)
							{
							var link = pagerankData[i].id;
							var title = pagerankData[i].title;
							if (typeof title == 'undefined') {
								title = link;
							}
							var description = pagerankData[i].content[0].slice(0, 200);
							var dat = "<blockquote> <p><a href='" + link + "'>" +
								title +
								"</a><br><span class='linkclass'>" + link + "</span></p> <small><i>" +
								description +
								"</i></small></blockquote>";
							$(".pagerank")
								.append(
									"" +
									dat +
									"<br>");
							if (count == 15) {
								break;
							}
							}
					}
	
					$(".google")
						.html(
							"");
					$(".hideme")
						.removeClass(
							"hideme");
					for (var i in googleData) {
						var link = googleData[i].link;
						var title = googleData[i].title;
						var description = googleData[i].snippet;
						var dat = "<blockquote> <p><a href='" + link + "'>" +
							title +
							"</a><br><span class='linkclass'>" + link + "</span></p> <small><cite title='" +
							"Source Title'>" +
							description +
							"</cite></small></blockquote>";
						$(
							".google")
							.append(
								"" +
								dat +
								"<br>");
					}
	
	
	
	
					$(".bing")
						.html(
							"");
					$(".hideme")
						.removeClass(
							"hideme");
					for (var i in bingData) {
						var link = bingData[i].displayUrl;
						var title = bingData[i].name;
						var description = bingData[i].snippet;
						var dat = "<blockquote> <p><a href='" + link + "'>" +
							title +
							"</a><br><span class='linkclass'>" + link + "</span></p> <small><cite title='" +
							"Source Title'>" +
							description +
							"</cite></small></blockquote>";
						$(
							".bing")
							.append(
								"" +
								dat +
								"<br>");
					}
	
					$(".hits").html("");
					$(".hideme").removeClass("hideme");
					var count = 0;
					for (var i in hitsData) {
						count = count + 1;
						if(hitsData[i] !=null)
							{
							var link = hitsData[i].id;
							var title = hitsData[i].title;
							if (typeof title == 'undefined') {
								title = link;
							}
							var description = hitsData[i].content[0].slice(0, 200);
							var dat = "<blockquote> <p><a href='" + link + "'>" +
								title +
								"</a><br><span class='linkclass'>" + link + "</span></p> <small><i>" +
								description +
								"</i></small></blockquote>";
							$(".hits")
								.append(
									"" +
									dat +
									"<br>");
							if (count == 15) {
								break;
							}
							}
					}
	
				}
	

			});
	});



	$(".nav-tabs li").click(
		function () {
			$(".nav-tabs .active").removeClass(
				"active");
			$(this).addClass("active");
			$(".tab-content .active").removeClass(
				"active");
			var name = "#" + this.id + "default";
			$(name).addClass("active");

			//console.log(this.id);
		});
});