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

	var inputChange = function(vet, thor) {
		var vetAmount = vet || vetAmountInput.val();
		var nodeType = nodeTypeSelector.val();
		var thorPrice = thor || thorPriceInput.val();

		if($.isNumeric(vetAmount)) {
			var thorPerDay = calculateThor(vetAmount, nodeType);
			var tpdDollars = (thorPerDay*thorPrice).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			thorPerDayDisplay.html(
				thorPerDay.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '1,') + " THOR"
			);
			incomePerDayDisplay.html("$" + tpdDollars);
			
			var thorPerYear = thorPerDay*365;
			var tpyDollars = (thorPerYear*thorPrice).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			thorPerYearDisplay.html(
				thorPerYear.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '1,') + " THOR"
			);
			incomePerYearDisplay.html("$" + tpyDollars);

			if (nodeType === "thrudheim") {
				$(".dollar-reward").append("<p> PLUS 30% of all THOR Power consumed on the blockchain");
			}

			if (!thorRewardDisplay.is(':visible')) {
				thorRewardDisplay.show();
			}
		}
	};

	$(calculateButton).on("click", calculateThor);

	$("#vetamount").keyup(function(event) {
    	// if (event.keyCode === 13) {
     //    	$(calculateButton).click();
    	// }
    	var currentVetAmount = vetAmountInput.val();
    	if (currentVetAmount != vetAmount) {
    		vetAmount = currentVetAmount;
    		inputChange(vetAmount, thorPrice);
    	}
	});

	$("#thorPrice").on('change keyup', function(event) {
		var currentThorPrice = thorPriceInput.val();
    	if (currentThorPrice != thorPrice) {
    		thorPrice = currentThorPrice;
    		inputChange(vetAmount, thorPrice);
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

}($));