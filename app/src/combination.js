tw.combination = (function() {
	'use strict';

	return {
		apply: function(data, type, tag) {
			switch (type) {
				case 'basic':// 단순조합
					return this._basicCombination(data, tag);
				case 'condition':// 조건조합
					return this._conditionCombination(data, tag);
				case 'detail':// 고급조합
					return this._detailCombination(data, tag);
				case 'custom':// 기타조합
					return this._customCombination(data, tag);
				default:
					return this._basicCombination(data, tag);
			}
		},
		_basicCombination: function(data, tag) {
			if (!data) {
				return null;
			}

			if (data.length === 1) {
				return data[0];
			}

			var combinationData = [];
			var count = 0;
			_.forEach(data, function(sliceList) {
				if (count === 0) {
					combinationData = combinationData.concat(sliceList);
				} else {
					_.forEach(combinationData, function(combiSlice) {
						var tagValue = combiSlice[tag];
						var condition = {};
						condition[tag] = tagValue;
						var existsSlice = _.find(sliceList, condition);
						if (existsSlice) {
							_.assignIn(combiSlice, existsSlice);
						}
					});
				}
				count++;
			});

			return combinationData;
		},
		_conditionCombination: function(data, tag) {
		},
		_detailCombination: function(data, tag) {
		},
		_customCombination: function(data, tag) {
		},
	};
}());