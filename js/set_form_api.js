
/*////////////////////////////////////////////////
//*form-api set_form_api 
//*作成2013.04.01
////////////////////////////////////////////////*/

//================================================
//エラー文言セット
//================================================

//未入力エラーの文言------------------------------
Err_msg = new Array(30);
Err_msg[0] = "名前の入力が有りません";					//名前
Err_msg[1] = "カタカナの入力が有りません";			//カタカナ
Err_msg[2] = "郵便番号の入力が有りません";			//郵便番号
Err_msg[3] = "住所の入力が有りません";					//住所
Err_msg[4] = "電話番号の入力が有りません";			//電話番号
Err_msg[5] = "メールアドレスの入力が有りません";//メールアドレス


//エラーポップアップの内容-----------------------
var Err_msg_alert = "入力項目の内容が正しくありません。";//30件以上の動的アンケートが発生した時点ではこちらが利用される。


//指定型式エラー文言-----------------------------
Err_type_msg = new Array(10);
Err_type_msg[0] = "未入力エラー";												//未入力
Err_type_msg[1] = "正しいメールアドレスではありません"; //メール
Err_type_msg[2] = "正しいURLではありません";						//URL
Err_type_msg[3] = "[0～9]と[-]で入力して下さい";				//郵便番号
Err_type_msg[4] = "[0～9]と[-]で入力して下さい";				//電話
Err_type_msg[5] = "[0～9]で入力して下さい";							//半角数値
Err_type_msg[6] = "半角英字のみで入力して下さい";				//半角英字
Err_type_msg[7] = "半角英数のみで入力して下さい";				//半角英数
Err_type_msg[8] = "半角英数記号のみで入力して下さい";		//半角英数記号
Err_type_msg[9] = "全角のみで入力して下さい";						//全角
Err_type_msg[10] = "";																	//予備


//メールアドレス確認不一致エラー-----------------
var Err_mailaddr_msg = "確認メールアドレスと合致しません。お確かめください。";


//エラー文言セット終了---------------------------

/*////////////////////////////////////////////////
//*form-api createHttpRequest 
//*作成2013.04.01
//*XMLHttpRequestの生成
//*for ie7, Mozilla, FireFox, Opera8,Chrome
////////////////////////////////////////////////*/
function createHttpRequest() {


    if (window.XMLHttpRequest) {
        try {
            return new XMLHttpRequest();
        } catch (e) {
            return false;
        }
    } else if (window.ActiveXObject) {		//結局IE9以降は非対応…一応追記
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e2) {
                return false;
            }
        }
    } else {
        return false;
    }
}


var objReq;   //グローバルXMLHttpRequestオブジェクト
var g_innerid;//グローバルInnerHTMLオブジェクト g_innerid
var s_xml;    //グローバルxmlテキスト

/*////////////////////////////////////////////////
//*form-api set_form_api
//*作成2013.04.01
//*内容 /openメソッド操作
//*引数1/id　　  /送信formID
//*引数2/method　/GET POST
//*引数3/api　　 /GET取得先 POST送信先[conf/comp]
//*引数4/async　 /同期 非同期
//*引数5/innerid /出力先id
////////////////////////////////////////////////*/
function set_form_api(id, method, api, async,innerid) {

		//----------------------------------------------------------------------------------------------------------------------------------------
		//入力チェック機能2013.05.15追加
		/*
		//　各種データの入力値チェックを行う
		//
		*/


		try{
	    var mail_val      = document.getElementById("input_fix6").value;					//
	    var mailCheak_val = document.getElementById("input_fix6-mailconf").value; //

			//入力値が合致していない場合は赤字出力
			if(mail_val == mailCheak_val){
				document.getElementById("mail_err").innerHTML = '<p id="mail_err"></p>';

			}else{
				document.getElementById("mail_err").innerHTML = '<p id="mail_err">'+Err_mailaddr_msg+'</p>';

				alert(Err_mailaddr_msg);//未入力があった場合アラートを上げる。不要であればコメントアウト
				return;
			}

			var jc_flg =  JsCheak();

			//チェック通らない場合はエンド
			if(jc_flg=="false"){
				return;
			}

		}catch(e){
		}


		//----------------------------------------------------------------------------------------------------------------------------------------

		g_innerid = innerid;//グローバル変数に出力先IDセット
		var fid = "#"+id;
		var formData = new FormData(document.querySelector(fid));//formID

    objReq = createHttpRequest();
		wait();//高速処理の場合、apiのレスポンスが届く前に終わるケースが有る為1秒waitを掛けている。

    if (objReq == false) {
     return null;
    }else{

		}

    objReq.onreadystatechange = procReqChange;//サーバレスポンス取得

    if (method == 'GET') {
        api = api + encodeURI(formData);
    }

    objReq.open(method, api, async);

    if (method == 'POST') {
        //objReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    objReq.send(formData);
}

/*////////////////////////////////////////////////
//*form-api procReqChange 
//*作成2013.04.01
//*コールバック処理 
//*onreadystatechangeに変更があった時処理開始
////////////////////////////////////////////////*/
function procReqChange() {

    if (objReq.readyState == 4) {
      if (objReq.status == 200) {
        var obj = document.getElementById(g_innerid);//global変数使わないとエラーという罠。
        //obj.innerHTML = objReq.responseText;				 //InnerHTMLに追記(用途によっては不要)
        s_xml = objReq.responseText;								 //グローバル変数に受信テキスト設定

				alert("readyState  :" + objReq.readyState);
				alert("status      :" + objReq.status);
				alert("statusText  :" + objReq.statusText);
				alert("responseText:" + objReq.responseText);//APIからの折り返しxmlをalertテキストで表示する。
				alert("responseXML :" + objReq.responseXML);

				//OKパラメータを受け取ったらInnerhtmlで描画しているタグを書き換え
				//ただし、全部が全部、Ajax使うわけではないので後に切り替えが必要

				//////////////////////////////////////////////////////////////
				//XML OK/NG分岐
				//////////////////////////////////////////////////////////////
				var xmldoc = objReq.responseXML;

				try{//エラー判定
					judgment = xmldoc.getElementsByTagName('message');
					judgment_flg = "true";//エラー有り
					err_flg_xml = "true";//エラー有り
					g_flg = "false";

					//エラーだった場合はアンケート項の総数が必要
					err_count_array = xmldoc.getElementsByTagName('input_count');
					err_count = err_count_array[0].textContent;

				}catch(e){
					judgment_flg = "false";//エラー無し
					err_flg_xml = "false";//エラー有り
					g_flg = "true";
				}

				//var err_flg_xml = xmldoc.getElementsByTagName('error');//エラー種別を出す場合は利用
				var conf_input_flg = xmldoc.getElementsByTagName('conf_input');
				var comp_input_flg = xmldoc.getElementsByTagName('comp_input');


				//エラー処理開始=======================================================
				if(judgment_flg=="true"){

					//エラータグ取得
					Err_flg = new Array(err_count);
					//固定フォーム用
					Err_flg[0] = xmldoc.getElementsByTagName('name_err');
					Err_flg[0]['name'] = 'name_err';
					Err_flg[1] = xmldoc.getElementsByTagName('nickname_err');
					Err_flg[1]['name'] = 'nickname_err';
					Err_flg[2] = xmldoc.getElementsByTagName('zipcode_err');
					Err_flg[2]['name'] = 'zipcode_err';
					Err_flg[3] = xmldoc.getElementsByTagName('address_err');
					Err_flg[3]['name'] = 'address_err';
					Err_flg[4] = xmldoc.getElementsByTagName('tel_err');
					Err_flg[4]['name'] = 'tel_err';
					Err_flg[5] = xmldoc.getElementsByTagName('mail_err');
					Err_flg[5]['name'] = 'mail_err';

					//動的フォーム用(追加した分だけ増加)
					z=1;
					for(i=6; i < err_count; i++){
						err_set_obj = 'input_dynamic'+z;
						Err_flg[i] = xmldoc.getElementsByTagName(err_set_obj);
						Err_flg[i]['name'] = err_set_obj+'_e';
						z++;
					}


					//ERROR----------------------------------------------------
					//エラー表示部分の初期化処理(未入力状態から脱した時、エラー文言が残る為実施)
					try{
						for (i=0;i<err_count;i++){
							try{
								document.getElementById(Err_flg[i]['name']).innerHTML = '<p id="'+Err_flg[i]['name']+'" class="aswr" ></p>';
							}catch(e){
							}
						}

					}catch(e){
					}

					//未入力チェック
					try{

						for (i=0;i<err_count;i++){
							try{

								try{
									if(Err_msg[i]=="CCC"){//25件を超える入力が来た時に空チェックを行う。20140421
									}
									Err_mesage = Err_msg[i];
								}catch(e){
									Err_mesage = Err_msg_alert;
								}

								Err_mesage = Err_msg_alert;

								err_flg_xml = Uninput_chk(Err_flg[i][0].textContent,Err_mesage,err_flg_xml,Err_flg[i]['name']);
							}catch(e){
							}
						}//for-end

					}catch(e){
					}

				}//err処理end==========================================================


				if(err_flg_xml=="false"){// true = err有り : false=err無し
					//CONF-----------------------------------------------------
					try{
						//エラー文言を引き出す
						conf_input_flg = conf_input_flg[0].textContent;
						conf_input_flg = "true";
					}catch(e){
						conf_input_flg = "false";
					}
					if(conf_input_flg=="true"){
						g_flg = "true";
					}else{
					}

					//COMP-----------------------------------------------------
					if(g_flg=="false"){
						try{
							//エラー文言を引き出す
							comp_input_flg = comp_input_flg[0].textContent;
							comp_input_flg = "true";
						}catch(e){
				　   //throw e;
							comp_input_flg = "false";
						}
						if(comp_input_flg=="true"){
							g_flg = "true";
						}else{
						}
					}

				}else{
					alert(Err_msg_alert);//未入力があった場合アラートを上げる。不要であればコメントアウト
				}//ここまでがOKNG分岐-----------------------------------------


				//以降が入力値変更
				if(g_flg=="true"){

					//ステータス確認
					if(document.getElementById("put_status").value=="conf"){

					disabled_all();//取得xmlデータから確認へ遷移できるか判定する。

					/*************************************************************************
					* ■3ページ構成処理作成
					*　　①入力情報の全てを収集する。(全て入力済みとする)
					*　　②出力先htmlタグとマッチ
					*　　③div操作にて開閉を行い、入力情報たちは隠す
					*　　④戻る時は閉じたdivを元に戻し、開いた確認画面を
					*　　　閉じる。(閉じておいたものって開いたら残るんか？)
					**************************************************************************/

					//===IDリスト作成===
					//id先頭
					var fixstrid = 'input_fix';
					var dynamicstrid = 'input_dynamic';
					
				  //カウンター
				  var dynamic_count = 0;

					//idリスト
					var fix_array = new Array();
					var dynamic_array = new Array();

					//intput
					inputObj = document.getElementsByTagName('input');

					matchObj_fix= new RegExp(fixstrid);
					matchObj_dynamic= new RegExp(dynamicstrid);

					for(i=0; i < inputObj.length; i++){
						if(inputObj[i].id.match(matchObj_fix)){
							//名前リストArray
							fix_array[i] = inputObj[i].id;
						}
					}
					
					for(i=0; i < inputObj.length; i++){
						if(inputObj[i].id.match(matchObj_dynamic)){
							//名前リストArray
							if(inputObj[i].id === undefined){

							}else{
								dynamic_array[i] = inputObj[i].id;
							}
						}
						dynamic_count = i;
					}
					//--------------------------------------------------------
					//textarea
					//textareaタグ収集
					textareaObj = document.getElementsByTagName('textarea');

					//textareaタグ分
					for(i=0; i < textareaObj.length; i++){
						//先行id数継承
						dynamic_count = dynamic_count + 1;
						//textareaからidマッチング
						if(textareaObj[i].id.match(matchObj_dynamic)){
							//array追加
							if(inputObj[i].id===undefined){
							}else{
								dynamic_array[dynamic_count] = textareaObj[i].id;
							}
						}
					}
					//--------------------------------------------------------
					//select

					//selectタグ収集
					selectObj = document.getElementsByTagName('select');

					//selectタグ分
					for(i=0; i < selectObj.length; i++){

						//先行id数継承
						dynamic_count = dynamic_count + 1;

						//selectからidマッチング
						if(selectObj[i].id.match(matchObj_dynamic)){
							//array追加
							if(inputObj[i].id===undefined){
							}else{
								dynamic_array[dynamic_count] = selectObj[i].id;
							}
						}
					}
					//dynamic-array-sort-------------------------------------------
					var dynamic_array_sort = new Array();
					var ii = 0;
					for(i=0; i < dynamic_array.length; i++){

						if(dynamic_array[i]===undefined){
						}else{
							dynamic_array_sort[ii] = dynamic_array[i];
							ii++;
						}
					}
					//fix-array-sort----------------------------------------------
					var fix_array_sort = new Array();
					var ii = 0;
					for(i=0; i < fix_array.length; i++){
						if(fix_array[i]===undefined){
						}else{
							fix_array_sort[ii] = fix_array[i];
							ii++;
						}
					}

					//--------------------------------------------------------
					//■固定値Array化
					var fix_array_str = new Array();
					var fixname_val = "";
					var fixname_str = "";

					for(i=0; i < fix_array_sort.length; i++){
						//idからvalue取得
						fixname_val = $F(fix_array_sort[i]);
						//id名取得
						fixname_str = fix_array_sort[i];
						//idをarray名に変更したarryにvalueを追加
						fix_array_str[fixname_str] = fixname_val;
					}

					//動的値Array化=======================================================
					//Arrayの配列名をid名にし、value値を仕込む
					//タグ種別の合わせて
					var dynamic_array_str = new Array();
					var element = "";
					var dynamic_val = "";
					var dynamic_str = "";

					for(i=0; i < dynamic_array_sort.length; i++){

						untaget = "true";

						try{
							//ここで不要なデータ排除を行う
							//input_dynamic　と　macht しなかったら入れない。
							if (dynamic_array_sort[i].match(/input_dynamic/)){
							}else{
							}
						}catch(e){
							//throw e;
							alert(e);
						}finally{
							// 終了処理
						}

						tag_name = document.getElementById(dynamic_array_sort[i]);
						tag_name = tag_name.tagName;

						//タグ割り振り
						switch(tag_name){
							case "INPUT":
								break;

							case "SELECT":
								try{

									//idからvalue取得
									var selget = document.getElementsByName(dynamic_array_sort[i])[1];
									sel_val = selget.options[selget.selectedIndex].value;

									//id名取得
									dynamic_str = dynamic_array_sort[i];

									//idをarray名に変更したarryにvalueを追加
									dynamic_array_str[dynamic_str] = sel_val;


								}catch(e){
									alert(e);
								}finally{
									// 終了処理
								}

								break;

							case "TEXTAREA":
								//idからvalue取得
								dynamic_val = $F(dynamic_array_sort[i]);
								//id名取得
								dynamic_str = dynamic_array_sort[i];
								//idをarray名に変更したarryにvalueを追加
								dynamic_array_str[dynamic_str] = dynamic_val;
								break;

							default:
								untaget = "false";
						    break;
						}
						tag_name = "";//初期化

						if(untaget=="false"){//指定タグ以外が処理に入った場合は飛ばす。
					    break;
						}

						//タグのtypeを取得する[text,radio,checkbox]
						element = document.getElementById(dynamic_array_sort[i]);
						element = element.getAttribute("type");

						switch(element){
							case "text":
								//idからvalue取得
								dynamic_val = $F(dynamic_array_sort[i]);
								//id名取得
								dynamic_str = dynamic_array_sort[i];
								//idをarray名に変更したarryにvalueを追加
								dynamic_array_str[dynamic_str] = dynamic_val;
						    break;

							case "radio":
								//idからvalue取得
								var radiogets = document.getElementsByName(dynamic_array_sort[i]);
								for (z = 0; z < radiogets.length; z++) {
								  if (radiogets[z].checked) {
								    _val = radiogets[z].value;
								  }
								}


								//id名取得
								dynamic_str = dynamic_array_sort[i];

								//idをarray名に変更したarryにvalueを追加
								dynamic_array_str[dynamic_str] = _val;

								break;

							case "checkbox":

								//========================================================================
								//idからvalue取得
								var chkObj = document.getElementById(dynamic_array_sort[i]);
								if (chkObj.checked){
									chk_val = chkObj.value;

									//id名取得(チェックボックスだけはname名を利用する)★
									//ただし後方　[　以降は切る
									point = chkObj.name.indexOf("[cheackbox]",0);

									cut_str = chkObj.name.substring(0,point);

									dynamic_str = cut_str;

									//idをarray名に変更したarryにvalueを追加
									if(isset(dynamic_array_str[dynamic_str])){
										//値があれば連結する。
										dynamic_array_str[dynamic_str] += chk_val + "/";
									}else{
										//undefaindだったら空を入れる。
										dynamic_array_str[dynamic_str] = "";
										dynamic_array_str[dynamic_str] += chk_val + "/";
									}

									chk_val = "";//初期化

									//alert("checkbox:THEM-end");

								}else{

									//idをarray名に変更したarryにvalueを追加
									if(isset(dynamic_array_str[dynamic_str])){
										//値があれば連結する。
										dynamic_array_str[dynamic_str] += chk_val + "/";
									}else{
										//undefaindだったら空を入れる。
										dynamic_array_str[dynamic_str] = "";
										dynamic_array_str[dynamic_str] += chk_val + "/";
									}
								}


								//========================================================================
						    break;
							default:
						    break;
						}

						element = "";//初期化
					}

					//★★★labelへパラメータセット★★★

					//divの解放　allform_conf
					document.getElementById("allform_post").style.display="none";
					document.getElementById("allform_conf").style.display="block";

					//labelに紐づくIDに対してvalueを設定する。
					try{
						document.getElementById("conf_name").innerHTML = '<p id="conf_name" class="aswr" >'+fix_array_str['input_fix1']+'</p>';
					}catch(e){
					}finally{
					}

					try{
						document.getElementById("conf_nickname").innerHTML = '<p id="conf_nickname" class="aswr" >'+fix_array_str['input_fix2']+'</p>';
					}catch(e){
					}finally{
					}

					try{
						document.getElementById("conf_zipcode").innerHTML = '<p id="conf_zipcode" class="aswr" >'+fix_array_str['input_fix3']+'</p>';
					}catch(e){
					}finally{
					}

					try{
						document.getElementById("conf_address").innerHTML = '<p id="conf_address" class="aswr" >'+fix_array_str['input_fix4']+'</p>';
					}catch(e){
					}finally{
					}

					try{
						document.getElementById("conf_tel").innerHTML = '<p id="conf_tel" class="aswr" >'+fix_array_str['input_fix5']+'</p>';
					}catch(e){
					}finally{
					}

					try{
						document.getElementById("conf_email").innerHTML = '<p id="conf_email" class="aswr" >'+fix_array_str['input_fix6']+'</p>';
					}catch(e){
					}finally{
					}

				  for (var prop in dynamic_array_str){
						label_ids = prop + "_n";
						if (label_ids.match(/_n_n/)){
						}else{
							document.getElementById(label_ids).innerHTML = '<p id="'+label_ids+'" class="aswr" >'+dynamic_array_str[prop]+'</p>';
						}
				  }

					/**************************************************************************/

					}else if (document.getElementById("put_status").value=="comp"){
						document.getElementById("allform").style.display="none";
						document.getElementById("allform_comp").style.display="block";
		        var allform = document.getElementById('allform_comp');		 //global変数使わないとエラーという罠。
					}

				}//xmlの戻りがNGだった場合スルーする20130501

      } else {

				/*
        alert("ERROR: " + objReq.statusText);
				alert("readyState  :" + objReq.readyState);
				alert("status      :" + objReq.status);
				alert("statusText  :" + objReq.statusText);
				alert("responseText:" + objReq.responseText);
				alert("responseXML :" + objReq.responseXML);
				*/
      }
    }else{
		}
}

//確認ボタン
function disabled_all(){

	var all = document.all;
	for ( i=0 ; i <all.length ; ++i ){
		var el= all(i);
		if ( el.tagName == "INPUT" ){
			if(el.type!="hidden"){
				el.readOnly=true;
			}
		}

		if ( el.tagName == "TEXTAREA" ){
				el.readOnly=true;
		}

		if ( el.tagName == "SELECT" ){
				el.readOnly=true;
		}
	}

	//送信プロパティの変更
	document.getElementById("put_status").value = "comp";				//hidden

	//書き換え対象
	var button = document.getElementById("send_c");
	button.textContent = "完了";																//ボタン名
}


//戻るボタン
function disabled_reall(){//readOnly
	var all = document.all;

	for ( i=0 ; i <all.length ; ++i ){
		var el= all(i);
		if ( el.tagName == "INPUT" ){
			el.readOnly=false;
		}

		if ( el.tagName == "TEXTAREA" ){
			el.readOnly=false;
		}

		if ( el.tagName == "SELECT" ){
			el.readOnly=false;
		}
	}

	//送信プロパティの変更
　document.getElementById("put_status").value="conf";

	//書き換え対象
	var button = document.getElementById("send_c");
	button.textContent = "確認する";//ボタン名

	//描画戻し
	document.getElementById("allform_post").style.display="block";
	document.getElementById("allform_conf").style.display="none";

}

//issetの役割
function isset( data ){
    return ( typeof( data ) != 'undefined' );
}

//初期化ボタン
function initialize_input(){
	location.href = location.href;
}


//必須任意チェック
// return false :エラー有り
// return true  :エラー無し
function JsCheak(){

 var Js_cheak_flg = "true";

 //エラーメッセージ群
 var fix_errmsg = new Array();
 var dynamic_errmsg = new Array();

 //出力ID
 var fix_ids = new Array();
 var dynamic_ids = new Array();



	try{

	 //まず固定値から。
	 //fixidセット
	 for (i=1;i<7;i++){
	　fix_ids[i] = "input_fix"+i+"_c";
	 }


	}catch(e){
		//throw e;
		//alert(e);
	}


	try{

	 //データ取得
	 for (i=1;i<7;i++){
    var ids_name = fix_ids[i];
		var fixname_val = $F(ids_name);
	  if(fixname_val.value == "enp"){
		}else{
		}
	 }

	}catch(e){
		//throw e;
		//alert(e);
	}
 return Js_cheak_flg;

}

//未入力チェック＆エラー文言の表示
function Uninput_chk(Err_flg,Err_msgf,all_err_flg,tag_id){

	try{

		//エラー内容判定
		//[-]未入力チェック
		if(Err_flg=="Err"){
			all_err_flg = "true";
			document.getElementById(tag_id).innerHTML = '<p id="'+tag_id+'" class="aswr" >'+Err_type_msg[0]+'</p>';
		}

		//[3]数値と"-"エラー 郵便番号
		if(Err_flg=="Err_Num1"){
			all_err_flg = "true";
			document.getElementById(tag_id).innerHTML = '<p id="'+tag_id+'" class="aswr" >'+Err_type_msg[3]+'</p>';
		}

		//[4]数値と"-"エラー　電話
		if(Err_flg=="Err_Num2"){
			all_err_flg = "true";
			document.getElementById(tag_id).innerHTML = '<p id="'+tag_id+'" class="aswr" >'+Err_type_msg[4]+'</p>';
		}


		//[1]英数メールエラー
		if(Err_flg=="Err_En"){
			all_err_flg = "true";
			document.getElementById(tag_id).innerHTML = '<p id="'+tag_id+'" class="aswr" >'+Err_type_msg[1]+'</p>';
		}


		//[2]URL
		if(Err_flg=="Err_Url"){
			all_err_flg = "true";
			document.getElementById(tag_id).innerHTML = '<p id="'+tag_id+'" class="aswr" >'+Err_type_msg[2]+'</p>';
		}


		//[5]半角数値
		if(Err_flg=="Err_Num"){
			all_err_flg = "true";
			document.getElementById(tag_id).innerHTML = '<p id="'+tag_id+'" class="aswr" >'+Err_type_msg[5]+'</p>';
		}


		//[6]半角英字
		if(Err_flg=="Err_Enstr"){
			all_err_flg = "true";
			document.getElementById(tag_id).innerHTML = '<p id="'+tag_id+'" class="aswr" >'+Err_type_msg[6]+'</p>';
		}

		//[7]半角英数
		if(Err_flg=="Err_EnNum"){
			all_err_flg = "true";
			document.getElementById(tag_id).innerHTML = '<p id="'+tag_id+'" class="aswr" >'+Err_type_msg[7]+'</p>';
		}


		//[8]半角英数記号
		if(Err_flg=="Err_EnNum_P"){
			all_err_flg = "true";
			document.getElementById(tag_id).innerHTML = '<p id="'+tag_id+'" class="aswr" >'+Err_type_msg[8]+'</p>';
		}


		//[9]全角
		if(Err_flg=="Err_Fullsize"){
			all_err_flg = "true";
			document.getElementById(tag_id).innerHTML = '<p id="'+tag_id+'" class="aswr" >'+Err_type_msg[9]+'</p>';
		}



		//エラーフラグが立っていなかったら空を返す。
		if(all_err_flg!="true"){
			document.getElementById(tag_id).innerHTML = '<p id="'+tag_id+'" class="aswr" ></p>';
		}

	}catch(e){
	}

	return all_err_flg;

}

//処理が早すぎる為APIパラメータを掴めない
function wait(){
	setTimeout( function() {
		""
	}, 3000);
}
