/* global sample1:true, sample2:true, admin:true */
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
		showDataWindow: function(data) {
			var dataWindow = webix.ui({
				view: 'window',
				id: 'my_win',
				head: '데이터 뷰 - 슬라이스 ' + data.id,
				width: 800,
				height: 500,
				modal: true,
				move: true,
				position: 'center',
				body: {
					type: 'space',
					rows: [{
						view: 'datatable',
						autoConfig: true,
						data: data,
					}, {
						cols: [{}, {
							view: 'button',
							label: '닫기',
							autowidth: true,
							on: {
								onItemClick: function() {
									dataWindow.close();
								},
							},
						}],
					}],
				},
			});
			dataWindow.show();
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
							header: '슬라이스목록',
							body: {
								id: 'slice-list',
								view: 'tree',
								// template: '#title# #tag#',
								select: true,
								drag: 'source',
								// data: this.data.sliceTreeList,
								data: [{
									id: 'slice-list', value: '슬라이스', data: tw.data.sliceList,
								}, {
									id: 'option-list', value: '결합옵션', data: tw.data.optionList,
								}, {
									id: 'my-slice-list', value: 'My slice', data: tw.data.mySliceList,
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