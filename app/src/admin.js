tw.admin = (function() {
	'use strict';

	var data = "-- SQL Mode for CodeMirror\nSELECT SQL_NO_CACHE DISTINCT\n\t\t@var1 AS `val1`, @'val2', @global.'sql_mode',\n\t\t1.1 AS `float_val`, .14 AS `another_float`, 0.09e3 AS `int_with_esp`,\n\t\t0xFA5 AS `hex`, x'fa5' AS `hex2`, 0b101 AS `bin`, b'101' AS `bin2`,\n\t\tDATE '1994-01-01' AS `sql_date`, { T \"1994-01-01\" } AS `odbc_date`,\n\t\t'my string', _utf8'your string', N'her string',\n        TRUE, FALSE, UNKNOWN\n\tFROM DUAL\n\t-- space needed after '--'\n\t# 1 line comment\n\t/* multiline\n\tcomment! */\n\tLIMIT 1 OFFSET 0;\n";

	return {
		init: function() {
			return {
				id: 'workspace',
				gravity: 2,
				rows: [{
					view: 'toolbar',
					cols: [{
						view: 'button',
						label: '실행',
						autowidth: true,
						type: 'iconButton',
						icon: 'play',
						on: {
							onItemClick: function() {
								teamworks.selectedItem(twdata.items);
							}
						}
					}, {
						view: 'button',
						label: '중지',
						autowidth: true,
						type: 'iconButton',
						icon: 'stop'
					}]
				}, {
					view: 'codemirror-editor',
					mode: 'sql',
					value: data
				}]
			};
		}
	};
}());