if (!window.tw) {
	window.tw = {};
}
tw.main = (function() {
	'use strict';
	return {
		init: function(container, data) {
			this.selectedView = tw.sample2;
			this.data = data;
			this.setupView(container);
			if (this.selectedView.setupDropZone) {
				this.selectedView.setupDropZone();
			}
		},
		_updateWorkspace: function() {
			if (this.selectedView === tw.admin) {
				$$('dataview-container').show();
			} else {
				$$('dataview-container').hide();
			}
			$$('datatable1').clearAll();
			$$('workspace-container').removeView($$('workspace'));
			$$('workspace-container').addView(this.selectedView.init(this.data), 0);
			if (this.selectedView.setupDropZone) {
				this.selectedView.setupDropZone();
			}
		},
		selectedItem: function(data) {
			$$('datatable1').clearAll();
			$$('datatable1').parse(data);
		},
		showDataWindow: function(title, data, tag) {
			var dataWindow = webix.ui({
				view: 'window',
				id: 'my_win',
				head: {
					view: 'toolbar', cols: [
						{view: 'label', label: '미리보기 - ' + title + ' (#' + tag + ')'},
						{
							view: 'button', label: '', type: 'icon', icon: 'close', width: 30, hotkey: 'esc',
							click: function() {
								dataWindow.close();
							},
						},
					],
				},
				width: 800,
				height: 500,
				modal: true,
				move: true,
				position: 'center',
				resize: true,
				body: {
					type: 'space',
					rows: [{
						view: 'datatable',
						footer: true,
						resizeColumn: true,
						data: this._createData(data, tag),
						columns: this._createColumns(data, tag),
					}],
				},
			});
			dataWindow.show();
		},
		_createData: function(data, tag) {
			var concatData = [];
			_.forEach(data, function(slice) {
				concatData.push(_.cloneDeep(slice));
			});
			return tw.combination.apply(concatData, 'basic', tag);
		},
		_createColumns: function(data, tag) {
			var columnsDef = [];
			var count = 1;
			var rCount = 0;
			_.forEach(data, function(sliceList) {
				_.forEach(sliceList[0], function(slice, key) {
					if (_.find(columnsDef, {id: key})) {
						return true;
					}
					var column = {
						id: key,
						header: '<span class="tooltip" data-tooltip="' + key + '" title="' + key + '">' + key + '</span>',
						adjust: 'data',
						footer: {text: 'Total : ' + _.size(sliceList), colspan: 3},
					};
					if (rCount > 0) {
						column.footer = '';
					}
					if (tag === key) {
						column.css = 'tag_column';
					} else if (_.size(data) > 1) {
						column.css = 'slice_list_' + count;
					}
					columnsDef.push(column);
					rCount++;
				});
				count++;
			});
			return columnsDef;
		},
		setupView: function(container) {
			webix.ui({
				container: container,
				rows: [{
					view: 'toolbar',
					cols: [{
						view: 'label',
						label: 'Team Works',
						width: 350,
					}, {
						view: 'button',
						value: 'Sample1',
						autowidth: true,
						on: {
							onItemClick: function() {
								this.selectedView = tw.sample1;
								this._updateWorkspace();
							}.bind(this),
						},
					}, {
						view: 'button',
						value: 'Sample2',
						autowidth: true,
						on: {
							onItemClick: function() {
								this.selectedView = tw.sample2;
								this._updateWorkspace();
							}.bind(this),
						},
					}, {
						view: 'button',
						value: 'Admin',
						autowidth: true,
						on: {
							onItemClick: function() {
								this.selectedView = tw.admin;
								this._updateWorkspace();
							}.bind(this),
						},
					}],
				}, {
					view: 'toolbar',
					cols: [{
						view: 'button',
						label: '신규',
						autowidth: true,
						type: 'iconButton',
						icon: 'file',
						on: {
							onItemClick: function() {
								if (this.selectedView.newWorkspaceItem) {
									this.selectedView.newWorkspaceItem();
								}
							}.bind(this),
						},
					}, {
						view: 'button',
						label: '저장',
						autowidth: true,
						type: 'iconButton',
						icon: 'save',
					}],
				}, {
					cols: [{
						rows: [{
							header: '목록',
							width: 230,
							body: {
								id: 'slice-list',
								view: 'tree',
								select: true,
								drag: 'source',
								template: function(obj, common) {
									var icon;
									if (obj.open) {
										icon = '<div class="webix_tree_folder_open"></div>';
									} else {
										icon = '<div class="webix_tree_folder"></div>';
										if (obj.$level === 1) {
											icon = '<div class="webix_tree_folder"></div>';
										} else {
											icon = '<div class="webix_tree_file"></div>';
										}
									}
									var label = null;
									if (obj.tag) {
										label = '<span>' + obj.value + ' #' + obj.tag + '</span>';
									} else {
										label = '<span>' + obj.value + '</span>';
									}
									return common.icon(obj, common) + icon + label;
								},
								data: [{
									id: 'slice-list', value: '슬라이스', open: true, data: tw.data.sliceList,
								}, {
									id: 'option-list', value: '결합옵션', open: true, data: tw.data.optionList,
								}, {
									id: 'my-slice-list', value: 'My slice', open: true, data: tw.data.mySliceList,
								}],
							},
						}],
					}, {
						view: 'resizer',
					}, {
						gravity: 5,
						id: 'workspace-container',
						rows: [this.selectedView.init(this.data), {
							view: 'resizer',
						}, {
							header: 'Data Viewer',
							id: 'dataview-container',
							hidden: this.selectedView !== tw.admin,
							body: {
								id: 'datatable1',
								view: 'datatable',
								autoConfig: true,
							},
						}],
					}],
				}],
			});
		},
	};
}());