var teamworks = (function() {
    var itemViewList = [];
    return {
        init: function(container, data) {
            this.data = data;
            this.setupView(container);
            this.setupDropZone();
        },
        setupDropZone : function() {
            webix.DragControl.addDrop($$('workspace').getNode(), {
                $drop : function() {
                    var dragItemId = webix.DragControl.getContext().start;
                    var dragItem = webix.DragControl.getContext().from.getItem(dragItemId);
                    this._createDragableItem(dragItem);                    
                }.bind(this)
            });
        },
        _createDragableItem : function(data) {
            var itemId = 'snap-item-' + data.id;
            if (document.querySelector('#' + itemId)) {
                webix.alert({title : '경고', text : '이미 존재하는 아이템입니다'});
                return false;
            }
            var item = document.createElement('div');
            item.id = 'snap-item-' + data.id;
            item.className = 'snap-item';
            item.style.backgroundColor = this._getRandomColor();
            item.textContent = "Item " + data.id;
            item.onclick = function(e) {
                itemViewList.forEach(function(elem) {
                    elem.style.border = 'none';
                });
                e.target.style.border = '3px solid pink';
                $$('datatable1').parse(e.target.data);
            }
            item.data = data;
            $$('tab1').getNode().childNodes[0].appendChild(item);
            itemViewList.push(item);

            this._setupDragableItem(data);
        },
        _getRandomColor : function() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          },
        _setupDragableItem : function(data) {
            var elem = document.querySelector("#snap-item-" + data.id);
            var x = 0, y = 0;
            interact(elem).draggable({
                onmove : window.dragMoveListener,
                snap: {
                    targets:[
                        interact.createSnapGrid({x:10, y:10}),
                        // {x:300, y:300, range:Infinity}
                        
                    ],
                    // range: Infinity,
                    relativePoints:[{x:1, y:1}]
                },
                // inertia: true,
                restrict: {
                    restriction : elem.parentNode,
                    elementRect : {top: 0, left: 0, bottom: 1, right: 1},
                    // endOnly: true
                }
            }).on('dragmove', function(ev) {
                x += ev.dx, y += ev.dy;
                ev.target.style.webkitTransform = ev.target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            });
        },
        setupView : function(container) {
            webix.ui({
                container : container,
                rows : [{
                    view : 'toolbar',
                    cols : [{
                        view : 'label', label : 'Team Works', width : 350
                    }, {
                        view : 'button', value : 'New', autowidth : true
                    }, {
                        view : 'button', value : 'Save', autowidth : true
                    }]
                }, {
                    cols : [{
                        header : 'Item List',
                        body : {
                            view : 'list',
                            template : '#title#',
                            select : true,
                            drag : 'source',
                            data : this.data.items
                        }
                    }, {
                        gravity : 5,
                        rows : [{
                            id : 'workspace',
                            gravity : 2,
                            view : 'tabview',
                            tabbar : {
                                optionWidth : 150
                            },
                            cells : [{
                                header : 'Tab1',
                                body : {
                                    id : 'tab1',
                                    template : 'workspace'
                                }
                            }, {
                                header : 'Tab2',
                                body : {
                                    id : 'tab2',
                                    template : 'workspace2'
                                }
                            }]
                        }, {view : 'resizer'}, {
                            header : 'Data Viewer',
                            body : {
                                id : 'datatable1',
                                view : 'datatable',
                                columns : [{
                                    id : 'id', header : 'ID', fillspace : true
                                }, {
                                    id : 'value', header : 'VALUE', fillspace : true
                                }, {
                                    id : 'code', header : 'CODE', fillspace : true
                                }]
                            }
                        }]
                    }]
                }]
            });
        }
    };
}())