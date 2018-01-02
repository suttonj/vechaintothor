(function($) {
	var calculateButton = $("#thorcalculate");
	var B = 0.00042;
	var NB = 0.00015; //TODO: this value will change next year at the latest
	var thorPrice = 2;

	var calculateThor = function(vet, nodeType) {
		var A = (nodeType == "thrudheim");
		var M = (nodeType == "mjolnir");
		var T = (nodeType == "thunder");
		var S = (nodeType == "strength");

		var bonus = (A || M) ? 2 : (T ? 1.5 : (S ? 1 : 0));
		return (B + (NB * bonus)) * vet;
	};

	$(calculateButton).on("click", function() {
		var vetAmount = $("#vetamount").val();
		var nodeType = $("#nodeSelector").val();
		thorPrice = $("#thorPrice").val() || thorPrice;

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
	});

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

}($));