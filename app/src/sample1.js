tw.sample1 = (function() {
	'use strict';

	var itemViewList = [];
	var selectedViewList = {};
	return {
		init: function() {
			itemViewList = [];
			selectedViewList = {};
			return {
				id: 'workspace',
				gravity: 2,
				view: 'tabview',
				tabbar: {
					optionWidth: 150
				},
				cells: [{
					header: 'Tab1',
					body: {
						id: 'tab1',
						template: 'workspace'
					}
				}, {
					header: 'Tab2',
					body: {
						id: 'tab2',
						template: 'workspace2'
					}
				}]
			};
		},
		setupDropZone: function() {
			webix.DragControl.addDrop($$('workspace').getNode(), {
				$drop: function() {
					var dragItemId = webix.DragControl.getContext().start;
					var dragItem = webix.DragControl.getContext().from.getItem(dragItemId);
					var newItem = this._createDragableItem(dragItem);
					this.ds.addSelectables(newItem);
				}.bind(this)
			});

			this._setupDragArea();
		},
		_setupDragArea: function() {
			var node = $$('tab1').getNode();
			this.ds = new DragSelect({
				selectables: document.querySelector('.snap-item'),
				area: node,
				multiSelectMode: true,
				onElementSelect: function(element) {
					element.style.border = "3px solid red";
					selectedViewList[element.id] = element;

					if (Object.keys(selectedViewList).length > 1) {
						teamworks.selectedItem(twdata.items);
					} else if (Object.keys(selectedViewList).length === 1) {
						teamworks.selectedItem(element.data);
					} else {
						teamworks.selectedItem([]);
					}
				},
				onElementUnselect: function(element) {
					element.style.border = "";
					delete selectedViewList[element.id];

					if (Object.keys(selectedViewList).length > 1) {
						teamworks.selectedItem(twdata.items);
					} else if (Object.keys(selectedViewList).length === 1) {
						teamworks.selectedItem(element.data);
					} else {
						teamworks.selectedItem([]);
					}
				}
			});
		},
		_createDragableItem: function(data) {
			var itemId = 'snap-item-' + data.id;
			if (document.querySelector('#' + itemId)) {
				webix.alert({
					title: '경고',
					text: '이미 존재하는 아이템입니다'
				});
				return false;
			}
			var item = document.createElement('div');
			item.id = 'snap-item-' + data.id;
			item.className = 'snap-item';
			item.style.backgroundColor = this._getRandomColor();
			item.textContent = "슬라이스 " + data.id + "<br />" + data.tag;
			item.ondblclick = function() {
				teamworks.showDataWindow(data);
			}
			// item.onmousedown = function(e) {
			//   e.preventDefault();
			//   this.ds.break();
			//   this.ds.stop();
			//   return false;
			// }.bind(this);
			// item.onclick = function (e) {
			//   this.ds.break();
			//   itemViewList.forEach(function (elem) {
			//     elem.style.border = 'none';
			//   });
			//   e.target.style.border = '3px solid pink';
			//   teamworks.selectedItem(e.target.data);
			// }.bind(this)
			item.data = data;
			$$('tab1').getNode().childNodes[0].appendChild(item);
			itemViewList.push(item);

			this._setupDragableItem(data);

			return item;
		},
		_getRandomColor: function() {
			var letters = '0123456789ABCDEF';
			var color = '#';
			for (var i = 0; i < 6; i++) {
				color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
		},
		_setupDragableItem: function(data) {
			var elem = document.querySelector("#snap-item-" + data.id);
			var x = 0,
				y = 0;
			interact(elem).draggable({
				onmove: window.dragMoveListener,
				snap: {
					targets: [
						interact.createSnapGrid({
							x: 10,
							y: 10
						}),
						// {x:300, y:300, range:Infinity}

					],
					// range: Infinity,
					relativePoints: [{
						x: 1,
						y: 1
					}]
				},
				// inertia: true,
				restrict: {
					restriction: elem.parentNode,
					elementRect: {
						top: 0,
						left: 0,
						bottom: 1,
						right: 1
					},
					// endOnly: true
				}
			}).on('dragmove', function(ev) {
				this.ds.break();
				this.ds.stop();
				x += ev.dx, y += ev.dy;
				ev.target.style.webkitTransform = ev.target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
			}.bind(this)).on('dragend', function(ev) {
				this.ds.start();
			}.bind(this));
		},
		newWorkspaceItem: function() {
		}
	};
}());