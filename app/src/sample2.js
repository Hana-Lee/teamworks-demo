tw.sample2 = (function() {
	'use strict';

	var height = 50;
	var width = 100;
	return {
		init: function(twdata) {
			this.data = twdata;
			return this._createView();
		},
		newWorkspaceItem: function() {
			var newSliceGroup = this._getSliceGroupDef('2');
			$$('workspace').addView(newSliceGroup, 1);
		},
		_createView: function() {
			return {
				id: 'workspace',
				view: 'accordion',
				type: 'space',
				rows: [this._getSliceGroupDef('1'), {
					template: 'Drag and drop on this zone',
				}],
			};
		},
		_getSliceGroupDef: function(id) {
			return {
				view: 'accordionitem',
				header: '조합 ' + id,
				on: {
					onItemClick: function() {
						if ($$('slice-list-' + id).count() > 0) {
							$$('slice-list-' + id).selectAll();
							tw.main.selectedItem(this.data.sliceList);
						} else {
							webix.alert({title: '경고', text: '아이템이 없습니다.'});
						}
						return false;
					}.bind(this),
				},
				body: this._getListDef('slice-list-' + id),
			};
		},
		_getListDef: function(id) {
			return {
				id: id,
				view: 'list',
				layout: 'x',
				select: true,
				template: function(data) {
					return data.value;
				},
				scroll: false,
				drag: true,
				type: {height: height, width: width},
				data: [],
				on: {
					onItemDblClick: function(rowId) {
						var item = this.getItem(rowId);
						if (item.id === 'plus' || item.id === 'custom') {
							return false;
						}
						tw.main.showDataWindow(item);
					},
					onBeforeSelect: function() {
					},
					onAfterSelect: function(rowId) {
						var item = this.getItem(rowId);
						if (item.id === 'plus' || item.id === 'custom') {
							return false;
						}
						tw.main.selectedItem(item);
					},
					onBeforeDrop: function(context) {
						if (context.from.config.id === this.config.id) {
							return true;
						}
						var dragItem = context.from.getItem(context.start);
						var existsItem = this.getItem(dragItem.id);
						if (context.from.config.id === 'slice-list' && existsItem) {
							webix.alert({
								title: '경고',
								text: '이미 존재하는 아이템입니다',
							});
							return false;
						}
						this.add(webix.copy(dragItem), context.index);
						return false;
					},
					onBeforeDragIn: function(context) {
						if (context.from.config.id === 'slice-list') {
							return true;
						}
						if (context.from.config.id !== this.config.id) {
							return false;
						}
					},
				},
			};
		},
	};
})();
