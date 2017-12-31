(function($) {
	var calculateButton = $("#thorcalculate");
	var B = 0.00042;
	var NB = 0.00015; //TODO: this value will change next year at the latest
	var thorDollarPrice = 5;
	var isAuthorityNode = false;
	var isMjolnirNode = false;
	var isThunderNode = true;
	var isStrengthNode = false;

	var calculateThor = function(vet, A, M, T, S) {
		var bonus = (A || M) ? 2 : (T ? 1.5 : (S ? 1 : 0));
		var thorPerDay = (B + (NB * bonus)) * vet;
		var thorPerYear = thorPerDay * 365;
		var dollarPerYear = thorPerYear * thorDollarPrice;

		return "You will generate " + thorPerDay + " Thor per day, " + thorPerYear +
			" Thor per year, which equals $" + dollarPerYear + " per year at $5 per Thor";
	};

	$(calculateButton).on("click", function() {
		var vetAmount = $("#vetamount").val();
		if($.isNumeric(vetAmount)) {
			var thorAmount = calculateThor(vetAmount, isAuthorityNode, isMjolnirNode, isThunderNode, isStrengthNode);
			alert(thorAmount);
		}
	});

}($));