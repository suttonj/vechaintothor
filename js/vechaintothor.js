(function($) {
	var calculateButton = $("#thorcalculate");
	var B = 0.00042;
	var NB = 0.00015; //TODO: this value will change next year at the latest
	var thorDollarPrice = 2;
	var isAuthorityNode = false;
	var isMjolnirNode = false;
	var isThunderNode = false;
	var isStrengthNode = false;

	var calculateThor = function(vet, A, M, T, S) {
		var bonus = (A || M) ? 2 : (T ? 1.5 : (S ? 1 : 0));
		return (B + (NB * bonus)) * vet;
	};

	$(calculateButton).on("click", function() {
		var vetAmount = $("#vetamount").val();
		isAuthorityNode = $("#thrudheim").prop('checked');
		isMjolnirNode = $("#mjolnir").prop('checked');
		isThunderNode = $("#thunder").prop('checked');
		isStrengthNode = $("#strength").prop('checked');
		//thorDollarPrice = $("#thorDollarPrice").val() || thorDollarPrice;

		if($.isNumeric(vetAmount)) {
			var thorPerDay = calculateThor(vetAmount, isAuthorityNode, isMjolnirNode, isThunderNode, isStrengthNode);
			var tpdDollars = (thorPerDay*thorDollarPrice).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			$("#thorRewardPerDay").html(
				thorPerDay.toFixed(2) + " THOR per day"
			);
			$("#incomePerDay2").html("$" + tpdDollars);
			$("#incomePerDay5").html("$" + (thorPerDay*5).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
			$("#incomePerDay10").html("$" + (thorPerDay*10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
			$("#incomePerDay25").html("$" + (thorPerDay*25).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));

			var thorPerYear = thorPerDay*365;
			var tpyDollars = (thorPerYear*thorDollarPrice).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			$("#thorRewardPerYear").html(
				thorPerYear.toFixed(2) + " THOR per year"
			);
			$("#incomePerYear2").html("$" + tpyDollars);
			$("#incomePerYear5").html("$" + (thorPerYear*5).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
			$("#incomePerYear10").html("$" + (thorPerYear*10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
			$("#incomePerYear25").html("$" + (thorPerYear*25).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));

			if (isAuthorityNode) {
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

}($));