var sample2 = (function() {
	'use strict';

	var height = 50;
	var width = 100;
	return {
		init: function(twdata) {
			this.data = twdata;
			return this._createView();
		},
		_createView: function() {
			return {
				id: 'workspace',
				gravity: 2,
				type: 'space',
				rows: [this._getSliceGroupDef('1'), {
					template: 'Drag and drop on this zone',
				}],
			};
		},
		_getSliceGroupDef: function(id) {
			return {
				header: '조합 1',
				on: {
					onItemClick: function() {
						if ($$('slice-list-' + id).count() > 0) {
							$$('slice-list-' + id).selectAll();
							teamworks.selectedItem(this.data.items);
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
			return webix.clone({
				id: id,
				view: 'list',
				layout: 'x',
				select: true,
				template: '#title#<br />#tag#',
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
						teamworks.showDataWindow(item);
					},
					onBeforeSelect: function() {
						$$('slice-list-1').unselectAll();
						$$('slice-list-2').unselectAll();
						$$('slice-list-3').unselectAll();
					},
					onAfterSelect: function(rowId) {
						var item = this.getItem(rowId);
						if (item.id === 'plus' || item.id === 'custom') {
							return false;
						}
						teamworks.selectedItem(item);
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
						if (context.from.config.id === 'slice-list'
							|| context.from.config.id === 'function-list') {
							return true;
						}
						if (context.from.config.id !== this.config.id) {
							return false;
						}
					},
				},
			});
		},
	};
})();
