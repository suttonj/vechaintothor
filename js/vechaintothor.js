(function($) {	
	
	var calculateButton = $("#thorcalculate");
	var vetAmountInput = $("#vetamount");
	var thorPriceInput = $("#thorPrice");
	var nodeTypeSelector = $("#nodeSelector");

	var thorPerDayDisplay = $("#thorPerDay");
	var incomePerDayDisplay = $("#incomePerDay");
	var thorPerYearDisplay = $("#thorPerYear");
	var incomePerYearDisplay = $("#incomePerYear");
	var thorRewardDisplay = $("#thorReward");
	var topVetBid = $("#vetBtcPrice");
	var btcUsdt = $("#btcUsdtPrice");
	var vetUsdt = $("#vetUsdtPrice");	

	var B = 0.00042;
	var NB = 0.00015; //TODO: this value will change next year at the latest
	var thorPrice = 2;			
	var vetAmount = 0;

	var calculateThor = function(vet, nodeType) {
		var A = (nodeType == "thrudheim");
		var M = (nodeType == "mjolnir");
		var T = (nodeType == "thunder");
		var S = (nodeType == "strength");

		var bonus = (A || M) ? 2 : (T ? 1.5 : (S ? 1 : 0));
		return (B + (NB * bonus)) * vet;
	};

	$(document).ready = function() {		
		var binanceTicker = new ticker("https://api.binance.com");
		binanceTicker.get("/api/v1/depth/?symbol=VETBTC", function(response) {
			var info = JSON.parse(response.body);			
			if (info.bids.length > 0 && info.bids[0].length > 0) {
				topVetBid = info.bids[0][0]; // see binance api
				vetUsdt = topVetBid / btcUsdt;
			}
		});
		
		binanceTicker.get("/api/v1/depth/?symbol=BTCUSDT", function(response) {
			var info = JSON.parse(response.body);			
			if (info.bids.length > 0 && info.bids[0].length > 0) {
				btcUsdt = info.bids[0][0]; // see binance api
				vetUsdt = topVetBid / btcUsdt;
			}
		});
	}

	var inputChange = function(vet, thor) {
		var vetAmount = vet || vetAmountInput.val();
		var nodeType = nodeTypeSelector.val();
		var thorPrice = thor || thorPriceInput.val();
		console.log("calculating")

		if($.isNumeric(vetAmount)) {
			var thorPerDay = calculateThor(vetAmount, nodeType);
			var tpdDollars = (thorPerDay*thorPrice).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			thorPerDayDisplay.html(
				thorPerDay.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '1,') + " THOR / $" + tpdDollars
			);
			
			var thorPerYear = thorPerDay*365;
			var tpyDollars = (thorPerYear*thorPrice).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			thorPerYearDisplay.html(
				thorPerYear.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '1,') + " THOR / $" + tpyDollars 
			);

			if (nodeType === "thrudheim") {
				$(".thrudheim-reward").css("display", "block");
			} else {
				$(".thrudheim-reward").css("display", "none");
			}

			if (!thorRewardDisplay.is(':visible')) {
				thorRewardDisplay.show();
			}
		}
	};

	//$(calculateButton).on("click", inputChange(vetAmount, thorPrice));

	$("#thorPrice").on('change keyup', function(event) {
		var currentThorPrice = thorPriceInput.val();
    	if (currentThorPrice != thorPrice) {
    		thorPrice = currentThorPrice;
    		inputChange(vetAmount, thorPrice);
    	}
	});

	$("#vetamount").on('change keyup', function(event) {
		var vet = $(this).val();
		if (vet >= 250000) {
			$("#nodeSelector").val('thrudheim');
		} else if (vet >= 150000) {
			$("#nodeSelector").val('mjolnir');
		} else if (vet >= 50000) {
			$("#nodeSelector").val('thunder');
		} else if (vet >= 10000) {
			$("#nodeSelector").val('strength');
		}
		else {
			$("#nodeSelector").val('none');
		}

		if (vet != vetAmount) {
			vetAmount = vet;
			inputChange(vetAmount, thorPrice);
		}
	});

	// dummy ticker that can evolve into full api endpoint support in the future
	var ticker = function(apiBaseUrl) {
		var apiUrl = apiBaseUrl;
    	this.get = function(url, callback) {
			var httpReq = new XMLHttpRequest();
			httpReq.onreadystatechange = function() {
				if (httpReq.readyState == 4 && httpReq.status == 200) {
					callback(httpReq.responseText);
				}
			}
			httpReq.open("GET", apiUrl + url, true);
			httpReq.send( null );
   	 	}
	}
}($));

