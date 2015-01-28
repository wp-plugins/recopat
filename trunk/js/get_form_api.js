/*////////////////////////////////////////////////
//*form-api XML呼び出しJavaScript 
//*作成2013.03.29
////////////////////////////////////////////////*/

/*////////////////////////////////////////////////
//*form-api get_form_api
//*作成2013.04.01
//*内容 /apiデータ取得
//*引数1/api　　 /GET取得先
//*引数2/innerid /出力先id
////////////////////////////////////////////////*/
var g_xml;    //グローバルxmlテキスト
function get_form_api(api,innerid){

  var result;
	var innerid;
	var xmlHttp = new XMLHttpRequest();

	xmlHttp.open("GET", api, true);
	xmlHttp.onload = function() {

		if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			/*
			alert("readyState  :" + xmlHttp.readyState);
			alert("status      :" + xmlHttp.status);
			alert("statusText  :" + xmlHttp.statusText);
			alert("responseText:" + xmlHttp.responseText);
			alert("responseXML :" + xmlHttp.responseXML);
			*/
			/*
			alert("this-readyState  :" + this.readyState);
			alert("this-status      :" + this.status);
			alert("this-statusText  :" + this.statusText);
			alert("this-responseXML :" + this.responseXML);
			*/

			result = this.response;				//xmlデータ取得
			xmldoc = this.responseXML;		//hidden書き換え
			g_xml = result;								//グローバル変数に受信テキスト設定

			// xml取得 //
			var status_array = new Array();
			var fix_array = new Array();
			var dynamic_array = new Array();

			//xmlパラメータをArray化
			status_array = get_status(xmldoc);


			if(innerid!=""){
				get_form_api_html(status_array,fix_array,dynamic_array,innerid,result);
			}

			//描画判定
			//alert(status_array['sta']);

			switch(status_array['sta']){
				case "conf":
					document.getElementById("allform").style.display="block";
					document.getElementById("allform_conf").style.display="none";
					document.getElementById("allform_comp").style.display="none";
			    break;

				/*
				case "comp":
					document.getElementById("allform").style.display="none";
					document.getElementById("allform_conf").style.display="block";
					document.getElementById("allform_comp").style.display="none";
			    break;
				*/

				default:
			    break;
			}

			document.getElementById('put_session').value = status_array["session"];//セッションの追記

		}else{
			//alert("ELSE");
			//alert("this-readyState  :" + this.readyState);
			//alert("this-status      :" + this.status);
			//alert("this-statusText  :" + this.statusText);
			//alert("this-responseText:" + this.responseText);
			//alert("this-responseXML :" + this.responseXML);
		}
	};
	xmlHttp.send();
}

/*////////////////////////////////////////////////
//*form-api_html htmlの生成を行う場合の処理
//*作成2013.04.26
//* status_array :ステータスarray
//* fix_array    :固定データ
//* dynamic_array:動的データ
//* innerid　　　:html出力先ID
//* result       :
//* 20140502現在　サンプルhtml発行の場合利用しない。
////////////////////////////////////////////////*/
function get_form_api_html(status_array,fix_array,dynamic_array,innerid){

		//InnerHTML出力先 ⇒ 第二引数利用があった場合はページに出力する
		var fid = "#"+innerid;

		//html生成の部============================================================================================================================================
		var htmloutput = "";
		var htmloutput_on = "";

		//固定パラメータ1
		htmloutput = "<div id='allform'><label>title:"+fix_array[0]+"</label><br /><br />";

		htmloutput = htmloutput + '<form name="form1" action="https://formasp.r-ako.com/reg/" method="post" id="formtest">';
		htmloutput = htmloutput + '	<input type="hidden" name="site_id" value="'+status_array["sid"]+'" />';
		htmloutput = htmloutput + '	<input type="hidden" name="form_id" value="'+status_array["fid"]+'" />';
		htmloutput = htmloutput + '	<input type="hidden" name="session" value="'+status_array["session"]+'" />';//セッション抜出
		htmloutput = htmloutput + '	<input type="hidden" id="status_c" name="status" value="'+status_array["sta"]+'" />';

		//固定フォーム
		for(i=1;i < fix_array.length;i++){
			htmloutput = htmloutput + "<label>"+fix_array[i]["label"]+"</label><br /><br />";
			htmloutput = htmloutput + '	<input type="'+fix_array[i]["type"]+'" name="input_fix'+i+'" value="" /><br /><br />';
		}

		//動的フォーム
		for(i=1;i < dynamic_array.length;i++){

			htmloutput = htmloutput + "<label>"+dynamic_array[i]["title"]+"</label><br /><br />";

			switch(dynamic_array[i]["type"]){
				case "text":
					htmloutput = htmloutput + '	<input type="'+dynamic_array[i]["type"]+'" name="input_dynamic'+i+'" size="'+dynamic_array[i]["value"]+'" value="" /><br /><br />';
			    break;
				case "textarea":
					htmloutput = htmloutput + '	<textarea name="input_dynamic'+i+'" cols=35 rows=4></textarea><br /><br />';

			    break;
				case "check":
					for(r=1;r < dynamic_array[i]['option'].length;r++){
						htmloutput = htmloutput + '	<input type="checkbox" name="input_dynamic'+i+'[cheackbox][]" value="'+r+'" />'+dynamic_array[i]['option'][r]+'<br /><br />';
					}
			    break;
				case "radio":

					checked = "checked";

					for(r=1;r < dynamic_array[i]['option'].length;r++){
						if(r!=1){
							checked = "";
						}
						htmloutput = htmloutput + '	<input type="radio" name="input_dynamic'+i+'" value="'+r+'" '+checked+' />'+dynamic_array[i]['option'][r]+'<br /><br />';
					}
			    break;

				case "select":
					htmloutput = htmloutput + '	<select name="input_dynamic'+i+'">';
					for(r=1;r < dynamic_array[i]['option'].length;r++){
						htmloutput = htmloutput + '<option value="'+r+'">'+dynamic_array[i]['option'][r]+'</option>';
					}
					htmloutput = htmloutput + '	</select><br />';
			    break;
				default:
				    break;
			}//sw-end

		}
		//固定パラメータ2
		htmloutput_on = "set_form_api('formtest', 'POST', 'https://formasp.r-ako.com/reg/index.php', true,'statxml'); return false;";
		htmloutput = htmloutput + '	<br /><br /><button type="button" name="send" value="https://formasp.r-ako.com/reg/" id="send_c" onClick="'+ htmloutput_on +'">確認する</button>';//onclickは””


		//「戻るボタン」
		htmloutput_on = "none_disabled_all(); return false;";
		htmloutput = htmloutput + '	<br /><br /><button type="button" name="ret" value="" id="retune_c" onClick="'+ htmloutput_on +'" disabled="disabled" >戻る</button>';
		htmloutput = htmloutput + '</form></div>';


		//処理落ち回避
		if(fid=="#"){//第二引数が存在した場合はページ描画をする。
		}else{
			document.querySelector(fid).innerHTML = htmloutput;
		}
		//html生成の部-完了========================================================================================================================================

}


/*////////////////////////////////////////////////
//*form-api_ie XML呼び出しJavaScript IE8,9,10対応
//*作成2013.03.29
////////////////////////////////////////////////*/
function get_form_api_ie(api,innerid){
	var xhr = window.XDomainRequest ? new XDomainRequest : new XMLHttpRequest;
	try {
		xhr.onload = function() {

			var fid = "#"+innerid;

			document.querySelector(fid).innerHTML = xhr.responseText;
		};
		
		// xhr.onreadystatechange = function() {
		// 	console.log(xhr.readyState);
		// 	console.log(xhr.status);
		// 	
		// 	if (xhr.readyState === 4 && xhr.status === 200) {
		// 		console.log("aaa");
		// 	}
		// }
		
		//xhr.open("GET", "https://lab.hisasann.com/XHR2/json.json");
		xhr.open("GET", api);
		xhr.send(null);
	} catch (e) { 
		//alert(e.message); 
	}
}

/*////////////////////////////////////////////////
//*window_stat ブラウザ種別判定
//*作成2013.03.29
////////////////////////////////////////////////*/

function window_stat(){

	var userAgent = window.navigator.userAgent.toLowerCase();

	if (userAgent.indexOf('opera') != -1) {
		//alert("opera");
	} else if (userAgent.indexOf('msie') != -1) {
		//alert("ie");
	} else if (userAgent.indexOf('chrome') != -1) {
		//alert("chrome");
	} else if (userAgent.indexOf('safari') != -1) {
		//alert("safari");
	} else if (userAgent.indexOf('gecko') != -1) {
		//alert("gecko");
	} else {
		//alert("false");
	}
}

/*////////////////////////////////////////////////
//*get_form_xml ブラウザ自動判定　XML呼び出し
//*作成2013.03.29
////////////////////////////////////////////////*/

function get_form_xml(api,innerid){

	var userAgent = window.navigator.userAgent.toLowerCase();
	var ie_flg = "1";

	if (userAgent.indexOf('opera') != -1) {
	} else if (userAgent.indexOf('msie') != -1) {
	  ie_flg = "2";
	} else if (userAgent.indexOf('chrome') != -1) {
	} else if (userAgent.indexOf('safari') != -1) {
	} else if (userAgent.indexOf('gecko') != -1) {
	} else {
	}

	if(ie_flg=="1"){
		get_form_api(api,innerid);
	}else{
		get_form_api(api,innerid);
	}

}


/*////////////////////////////////////////////////
//*get_status ステータス取得
//*作成2013.04.11
////////////////////////////////////////////////*/
function get_status(xmldoc){

	var status_array = new Array();

	var domain = xmldoc.getElementsByTagName('domain');
	var sid = xmldoc.getElementsByTagName('sid');
	var sta = xmldoc.getElementsByTagName('sta');
	var fid = xmldoc.getElementsByTagName('fid');
	var session = xmldoc.getElementsByTagName('session');

	status_array['domain'] = domain[0].textContent;
	status_array['sid'] = sid[0].textContent;

	switch(sta[0].textContent){
		case "post":
				sta_str = "conf";
		    break;
		case "conf":
				sta_str = "comp";
		    break;
		default:
		    break;
	}

	status_array['sta'] = sta_str;
	status_array['fid'] = fid[0].textContent;
	status_array['session'] = session[0].textContent;

	return status_array;
}