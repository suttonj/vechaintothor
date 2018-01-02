(function($) {	
	
	var calculateButton = $("#thorcalculate");
	var B = 0.00042;
	var NB = 0.00015; //TODO: this value will change next year at the latest
	var thorPrice = 2;
		
	var topVetBid = 0.00015; // update via API
	var btcUsdt = 10000; // update via API

	var vetUsdt = topVetBid / btcUsdt;

	var calculateThor = function(vet, nodeType) {
		var A = (nodeType == "thrudheim");
		var M = (nodeType == "mjolnir");
		var T = (nodeType == "thunder");
		var S = (nodeType == "strength");

		var bonus = (A || M) ? 2 : (T ? 1.5 : (S ? 1 : 0));
		return (B + (NB * bonus)) * vet;
	};

	$(calculateButton).on("click", function() {
		this.calculatePayouts();
		
		// TODO - these ticker queries should just be on a timer methinks
		var vetTicker = new ticker("https://api.binance.com");
		vetTicker.get("/api/v1/depth/?symbol=VETBTC", function(response) {
			var info = JSON.parse(response.body);			
			if (info.bids.length > 0 && info.bids[0].length > 0) {
				topVetBid = info.bids[0][0]; // see binance api
				vetUsdt = topVetBid / btcUsdt;
			}
			vetUsdt = topVetBid / btcUsdt;
		});

		var btcTicker = new ticker("https://api.binance.com");
		btcTicker.get("/api/v1/depth/?symbol=BTCUSDT", function(response) {
			var info = JSON.parse(response.body);			
			if (info.bids.length > 0 && info.bids[0].length > 0) {
				btcUsdt = info.bids[0][0]; // see binance api
				vetUsdt = topVetBid / btcUsdt;
			}
		});

	});

	var calculatePayouts = function() {		
		if($.isNumeric(vetAmount)) {
			var thorPerDay = calculateThor(vetAmount, nodeType);
			var tpdDollars = (thorPerDay*thorPrice).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			$("#thorPerDay").html(
				thorPerDay.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '1,') + " THOR"
			);
			$("#incomePerDay").html("$" + tpdDollars);
			
			var thorPerYear = thorPerDay*365;
			var tpyDollars = (thorPerYear*thorPrice).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			$("#thorPerYear").html(
				thorPerYear.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '1,') + " THOR"
			);
			$("#incomePerYear").html("$" + tpyDollars);

			if (nodeType === "thrudheim") {
				$("#thorRewardPerYear").append("<p> PLUS 30% of all THOR Power consumed on the blockchain");
			}

			$("#thorReward").show();
		}
	}

	$("#vetamount").keyup(function(event) {
    	if (event.keyCode === 13) {
        	$(calculateButton).click();
    	}
	});

	$("#vetamount").on('change', function(event) {
    	var vet = $(this).val();
		if (vet >= 150000) {
			$("#nodeSelector").val('mjolnir');
		} else if (vet >= 50000) {
			$("#nodeSelector").val('thunder');
		} else if (vet >= 10000) {
			$("#nodeSelector").val('strength');
		}
		else {
			$("#nodeSelector").val('none');
		}
	});

	// dummy file for ticker that can evolve into full api endpoint support in the future
	var ticker = function(url) {
    	this.get = function(url, callback) {
			var httpReq = new XMLHttpRequest();
			httpReq.onreadystatechange = function() {
				if (httpReq.readyState == 4 && httpReq.status == 200) {
					callback(httpReq.responseText);
				}
			}
			httpReq.open("GET", url, true);
			httpReq.send( null );
   	 	}
	}
}($));

