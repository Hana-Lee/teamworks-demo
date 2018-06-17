/* global sample1:true, sample2:true, admin:true */
var teamworks = (function() {
	'use strict';
	return {
		init: function(container, data) {
			this.selectedView = sample2;
			this.data = data;
			this.setupView(container);
			if (this.selectedView.setupDropZone) {
				this.selectedView.setupDropZone();
			}
		},
		_updateWorkspace: function() {
			if (this.selectedView === sample1 || this.selectedView === admin) {
				$$('function-list-container').hide();
			} else {
				$$('function-list-container').show();
			}
			if (this.selectedView === admin) {
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
								this.selectedView = sample1;
								this._updateWorkspace();
							}.bind(this),
						},
					}, {
						view: 'button',
						value: 'Sample2',
						autowidth: true,
						on: {
							onItemClick: function() {
								this.selectedView = sample2;
								this._updateWorkspace();
							}.bind(this),
						},
					}, {
						view: 'button',
						value: 'Admin',
						autowidth: true,
						on: {
							onItemClick: function() {
								this.selectedView = admin;
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
								view: 'list',
								template: '#title# #tag#',
								select: true,
								drag: 'source',
								data: this.data.items,
							},
						}, {
							view: 'resizer',
						}, {
							header: '펑션목록',
							id: 'function-list-container',
							body: {
								id: 'function-list',
								view: 'list',
								template: '#title#',
								select: true,
								drag: 'source',
								data: this.data['function-list'],
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
							hidden: this.selectedView !== admin,
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