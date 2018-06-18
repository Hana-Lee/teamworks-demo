tw.sample2 = (function() {
	'use strict';

	var height = 50;
	var width = 100;
	return {
		init: function(twdata) {
			this.idCount = 1;
			this.data = twdata;
			return this._createView();
		},
		setupDropZone: function() {
			webix.DragControl.addDrop($$('drop-zone').getNode(), {
				$drop: function() {
					var dragItemId = webix.DragControl.getContext().start;
					var dragItem = webix.DragControl.getContext().from.getItem(dragItemId);
					var newSliceGroup = this.newWorkspaceItem();
					var newListId = newSliceGroup.rows[1].id;
					var newList = $$(newListId);
					if (dragItem.tag) {
						newList.tag = dragItem.tag;
					}
					if (dragItem.type === 'my') {
						var combiList = dragItem.combiList;
						_.forEach(combiList, function(combiInfo) {
							var combiKey = Object.keys(combiInfo)[0];
							var combiId = combiInfo[combiKey];
							var data = tw.data[combiKey];
							newList.add(_.find(data, {id: combiId}));
							newList.addCss(combiId, 'slice_list_' + combiId, true);
						});
						newList.refresh();
						var toolbarId = newSliceGroup.rows[0].cols[0].id;
						$$(toolbarId).define('label', dragItem.value);
						$$(toolbarId).refresh();
					} else {
						newList.add(dragItem);
						newList.addCss(dragItem.id, 'slice_list_' + dragItem.id, true);
						newList.refresh();
					}
				}.bind(this),
			});
		},
		newWorkspaceItem: function() {
			var newSliceGroup = this._getSliceGroupDef(this.idCount);
			$$('workspace').addView(newSliceGroup, this.idCount - 1);
			this.idCount++;
			return newSliceGroup;
		},
		_createView: function() {
			return {
				id: 'workspace',
				type: 'space',
				rows: [{
					id: 'drop-zone',
					template: 'Drop item on this area',
				}],
			};
		},
		_getSliceGroupDef: function(id) {
			return {
				height: 93,
				css: 'slice_list_container',
				rows: [{
					view: 'toolbar',
					css: 'slice_list_toolbar',
					cols: [{
						id: 'toolbar-label-' + id, view: 'label', label: '조합 ' + id, width: 150,
					}, {
						view: 'button', label: '저장', type: 'iconButton', icon: 'save', autowidth: true,
						on: {
							onItemClick: function() {
								if ($$('slice-list-' + id).count() <= 0) {
									webix.alert({
										title: '경고', text: '저장할 내용이 없습니다.',
									});
									return false;
								}
								var saveName = window.prompt('저장할 이름을 입력하세요');
								if (saveName) {
									alert(saveName + ' 으로 저장되었습니다.');
								}
							},
						},
					}, {
						view: 'button', label: '결합', type: 'iconButton', icon: 'play', autowidth: true,
						on: {
							onItemClick: function() {
								var listView = $$('slice-list-' + id);
								var count = listView.count();
								if (count <= 0) {
									webix.alert({title: '경고', text: '슬라이스가 없습니다.'});
								} else if (count === 1 || count === 2) {
									webix.alert({title: '경고', text: '슬라이스가 부족합니다.'});
								} else {
									var exists = listView.find(function(obj) {
										return obj.type === 'option';
									});
									if (!exists || exists.length === 0) {
										webix.alert({title: '경고', text: '결합옵션이 없습니다.'});
									} else {
										var combiData = {};
										var dataList = _.cloneDeep(listView.serialize());
										var tag = null;
										dataList.forEach(function(data) {
											if (data.type !== 'option') {
												combiData[data.value] = data.slice;
											}
											if (!tag) { // 첫번째 슬라이스의 태그를 기준으로 함.
												tag = data.tag;
											}
										});
										tw.main.showDataWindow('조합 결과', combiData, tag);
									}
								}
							},
						},
					}, {
						view: 'button', label: '초기화', type: 'iconButton', icon: 'undo', autowidth: true,
						on: {
							onItemClick: function() {
								$$('slice-list-1').clearAll();
							},
						},
					}, {}],
				}, this._getListDef(id)],
			};
		},
		_getListDef: function(id) {
			return {
				id: 'slice-list-' + id,
				view: 'list',
				layout: 'x',
				select: true,
				css: 'slice_list_box',
				template: function(data) {
					if (data.tag) {
						return data.value + '<br />#' + data.tag;
					} else {
						return data.value;
					}
				},
				scroll: false,
				drag: true,
				type: {height: height, width: width},
				data: [],
				on: {
					onAfterLoad: function() {
					},
					onItemDblClick: function(rowId) {
						var item = _.cloneDeep(this.getItem(rowId));
						if (item.type === 'option') {
							return false;
						}
						var itemData = {};
						itemData[item.value] = item.slice;
						tw.main.showDataWindow(item.value, itemData, item.tag);
					},
					onBeforeSelect: function() {
					},
					onAfterSelect: function(rowId) {
					},
					onBeforeDrop: function(context) {
						if (context.from.config.id === this.config.id) {
							return true;
						}
						var dragItem = context.from.getItem(context.start);
						if (dragItem.type !== 'option') {
							var existsItem = this.getItem(dragItem.id);
							if (existsItem) {
								webix.alert({title: '경고', text: '동일한 슬라이스가 있습니다.'});
								return false;
							}
						}
						if (!this.tag) {
							this.tag = dragItem.tag;
						}
						if (dragItem.type !== 'option' && this.tag !== dragItem.tag) {
							webix.alert({title: '경고', text: '태그가 일치 하지 않습니다'});
							return false;
						}
						if (dragItem.type === 'my') {
							this.clearAll();
							var combiList = dragItem.combiList;
							_.forEach(combiList, function(combiInfo) {
								var combiKey = Object.keys(combiInfo)[0];
								var combiId = combiInfo[combiKey];
								var data = tw.data[combiKey];
								this.add(_.find(data, {id: combiId}));
								this.addCss(combiId, 'slice_list_' + combiId, true);
							}.bind(this));
							this.refresh();
							$$('toolbar-label-1').define('label', dragItem.value);
							$$('toolbar-label-1').refresh();
							return false;
						}
						this.add(dragItem, context.index);
						this.addCss(dragItem.id, 'slice_list_' + dragItem.id, true);
						this.refresh();
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
