'use strict';

//現在地のURL
const current = window.location.href;

//index.html・category.html・product.html・search.html・data.jsonのURL
const url_1 = 'http://127.0.0.1:5500/index.html';
const url_2 = 'http://127.0.0.1:5500/category.html?';
const url_3 = 'http://127.0.0.1:5500/product.html?';
const url_search = 'http://127.0.0.1:5500/search.html?';
const url_json = '../data/json/data.json';

//検索BOXの要素を取得
let search = document.querySelector('#autoComplete');
let submit = document.querySelector('#submit');

//検索したワードが含まれるproductが全て入る配列
let search_arr = [];

//いずれかのキーが離された時
search.addEventListener('keyup', () => {
});

// //Enterキーが押された時
search.addEventListener("keydown", test_event);
function test_event(e) {
    if (e.key === "Enter") {
        sessionStorage.setItem('search', search.value)
        location.href = url_search + 'page=1';
    }
    return false;
}

//検索ボタンが押された時
submit.addEventListener('click', () => {
    sessionStorage.setItem('search', search.value)
    location.href = url_search + 'page=1';
});

$(document).ready(function () {
    $.ajax({ url: url_json, datatype: 'json' })
        .done(function (data) {
            data.forEach(function (item, index) {

                //index.htmlで.category[0]をクリックするとcategory.htmlへ
                //category.htmlで.category[0]をクリックするとproduct.htmlへ
                $('.' + item.category[0]).on('click', function () {
                    if (current == url_1) { location.href = url_2 + 'category=' + item.category[0]; }
                    else { location.href = url_3 + 'category=' + item.category[0] + '&page=1'; }
                });

                //ここから現在地がcategory.htmlの場合-------------------------------------------------------------------------------------------------------------------
                if (current == url_2 + 'category=' + item.category[0]) {

                    //パンくずリストに現在地を追加
                    let breadcrumb_2html = document.querySelector('#breadcrumb_2html')
                    $(breadcrumb_2html).attr('href', current);
                    breadcrumb_2html.textContent = item.category[1];

                    //product.html遷移時に表示するデータを保存
                    localStorage.setItem('breadcrumb_2html', current);
                    localStorage.setItem('text_2html', item.category[1]);

                    //h2見出しにcategory[1]テキストを追加
                    $('h2').text(item.category[1]);


                    for (let i = 0; i < Math.ceil(item.detail.length / 5); i++) {
                        let box2_element = document.querySelector('.box2');
                        let add_ul = document.createElement('ul');
                        $(add_ul).attr('id', 'ul' + i);
                        box2_element.append(add_ul);
                        for (let j = 0; j < 5; j++) {

                            let add_li = document.createElement('li');

                            let add_img = document.createElement('img');
                            $(add_img).attr('id', 'img' + (j + i * 5));
                            let add_p = document.createElement('p');
                            $(add_p).attr('id', 'p' + (j + i * 5));

                            add_ul.append(add_li);
                            if (j + i * 5 < item.detail.length) {
                                add_li.append(add_img);
                                add_li.append(add_p);
                            }
                        }
                    }




                    //detailをすべて追加するfor文
                    for (let i = 0; i < item.detail.length; i++) {
                        //img要素にclass名を追加
                        let img_element = document.querySelector('#img' + i);
                        $(img_element).attr('class', item.category[0] + i);
                        //ｐ要素にclass名を追加
                        let p_element = document.querySelector('#p' + i);
                        $(p_element).attr('class', item.category[0] + i);
                        //img要素に写真を、p要素にテキストを追加
                        $('#img' + i).attr('src', item.detail[i][0]);
                        $('#p' + i).text(item.detail[i][1]);
                    }
                }
                //ここまで現在地がcategory.htmlの場合-------------------------------------------------------------------------------------------------------------------

                //productが含まれているデータのみを取得
                if (item.product != null) {

                    //product.htmlのproduct情報を特定する
                    if (current.indexOf(url_3 + 'category=' + item.category[0]) != -1) {
                        console.log(item.product.length)

                        //ページ数分回すfor文
                        let page_limit = Math.ceil(item.product.length / 20);
                        for (let page_num = 1; page_num <= page_limit; page_num++) {
                            //ここから現在地がproduct.htmlの場合-------------------------------------------------------------------------------------------------------------------
                            if (current == url_3 + 'category=' + item.category[0] + '&page=' + page_num) {
                                //パンくずリストにcategory.htmlで保存したデータを追加
                                let breadcrumb_2html = document.querySelector('#breadcrumb_2html')
                                $(breadcrumb_2html).attr('href', localStorage.getItem('breadcrumb_2html'));
                                breadcrumb_2html.textContent = localStorage.getItem('text_2html');

                                //パンくずリストに現在地を追加
                                let breadcrumb_3html = document.querySelector('#breadcrumb_3html')
                                $(breadcrumb_3html).attr('href', url_3 + 'category=' + item.category[0] + '&page=1');
                                breadcrumb_3html.textContent = item.category[1];

                                //h2見出しにcategory[1]テキストを追加
                                $('h2').text(item.category[1] + '：' + item.product.length + '件');

                                let row_limit = Math.ceil(item.product.length / 5 + (page_num - 1) * -4);
                                for (let i = 0; i < row_limit; i++) {
                                    if (row_limit > 4) { row_limit = 4 }
                                    let box2_element = document.querySelector('.box2');
                                    let add_ul = document.createElement('ul');
                                    let add_ul2 = document.createElement('ul');
                                    $(add_ul).attr('id', 'ul' + i);
                                    box2_element.append(add_ul);
                                    box2_element.append(add_ul2);
                                    for (let j = 0; j < 5; j++) {

                                        let add_li = document.createElement('li');
                                        let add_li2 = document.createElement('li');

                                        let add_img = document.createElement('img');
                                        $(add_img).attr('id', 'img' + (j + i * 5));

                                        let add_h3 = document.createElement('h3');
                                        $(add_h3).attr('id', 'name' + (j + i * 5));

                                        let add_p = document.createElement('p');
                                        $(add_p).attr('id', 'maker' + (j + i * 5));

                                        let add_div = document.createElement('div');
                                        $(add_div).attr('id', 'field' + (j + i * 5));
                                        $(add_div).attr('class', 'field');
                                        add_ul.append(add_li);
                                        add_ul2.append(add_li2);
                                        if (j + i * 5 + ((page_num - 1) * 20) < item.product.length) {
                                            add_ul.append(add_li);
                                            add_ul2.append(add_li2);
                                            add_li.append(add_img);
                                            add_li.append(add_h3);
                                            add_li.append(add_p);
                                            add_li2.append(add_div);
                                        }
                                    }
                                }

                                //productをすべて追加するfor文
                                let prod_limit = item.product.length + (page_num - 1) * -20;
                                for (let i = 0; i < prod_limit; i++) {
                                    if (prod_limit > 20) { prod_limit = 20 }

                                    //button要素(up)を作成
                                    let add_downbutton = document.createElement('button');
                                    add_downbutton.textContent = '－';
                                    $(add_downbutton).attr('class', 'down_button');
                                    $(add_downbutton).attr('id', 'down' + i);

                                    //input要素(在庫数)を作成
                                    let add_input = document.createElement('input');
                                    $(add_input).attr('type', 'text');
                                    $(add_input).attr('class', 'inputtext');
                                    $(add_input).attr('id', 'stock' + i);

                                    //button要素(down)を作成
                                    let add_upbutton = document.createElement('button');
                                    add_upbutton.textContent = '＋';
                                    $(add_upbutton).attr('class', 'up_button');
                                    $(add_upbutton).attr('id', 'up' + i);

                                    //div要素(#field)の中に作成した3つの要素を追加
                                    let field_element = document.querySelector('#field' + i);
                                    let stock_element = document.querySelector('.ul_stock');

                                    field_element.append(add_downbutton);
                                    field_element.append(add_input);
                                    field_element.append(add_upbutton);

                                    //productのindex番号
                                    let prod_num = ((page_num - 1) * 20) + i

                                    //productの写真・名前・メーカー・在庫数を追加
                                    $('#img' + i).attr('src', item.product[prod_num][0]);
                                    $('#name' + i).text(item.product[prod_num][1]);
                                    $('#maker' + i).text(item.product[prod_num][2]);
                                    $('#stock' + i).attr('placeholder', 0);
                                    $('#stock' + i).attr('value', localStorage.getItem(item.product[prod_num][1]));

                                    //ダウンボタンをクリックすると在庫数を-1
                                    let downbutton_element = document.querySelector('#down' + i);
                                    downbutton_element.addEventListener('click', (event) => {
                                        if (input_element.value > 0) {
                                            input_element.value--;
                                            localStorage.setItem(item.product[prod_num][1], input_element.value);
                                        }
                                    });

                                    //input要素に入力した文字を反映
                                    let input_element = document.querySelector('#stock' + i);
                                    input_element.addEventListener('keyup', () => {
                                        input_element.innerHTML = input_element.value;
                                        localStorage.setItem(item.product[prod_num][1], input_element.value);
                                    });

                                    //アップボタンをクリックすると在庫数を+1
                                    let upbutton_element = document.querySelector('#up' + i);
                                    upbutton_element.addEventListener('click', (event) => {
                                        input_element.value++;
                                        localStorage.setItem(item.product[prod_num][1], input_element.value);
                                    });
                                };
                                // 在庫数リセット
                                // localStorage.clear();


                                //span要素(前へ)を作成
                                let add_prev = document.createElement('span');
                                add_prev.textContent = '前へ';
                                $(add_prev).attr('id', 'prev');

                                //span要素(次へ)を作成
                                let add_next = document.createElement('span');
                                add_next.textContent = '次へ';
                                $(add_next).attr('id', 'next');

                                //div要素(.navipage)取得
                                let navipage_element = document.querySelector('.navipage');

                                //productが1ページで収まる場合は「前へ」・ページ数・「次へ」を表示しない
                                if (item.product.length > 20) {

                                    //作成するページ数分回すfor文
                                    for (let i = 0; i < page_limit + 1; i++) {

                                        //span要素(数字)を作成
                                        let add_span = document.createElement('span');
                                        add_span.textContent = i + 1;
                                        $(add_span).attr('class', 'span' + i);

                                        //span要素(ページ数表示)の現在地を取得し.navipage_currentを追加
                                        let current_span = document.querySelector('.span' + (page_num - 1));
                                        $(current_span).attr('id', 'current_span');

                                        if (i + 1 != page_limit + 1) {
                                            //div要素(navipage)の中に追加
                                            navipage_element.append(add_span);
                                        }

                                        //「前へ」をクリックすると現在地を-1
                                        add_prev.addEventListener('click', (event) => {
                                            location.href = url_3 + 'category=' + item.category[0] + '&page=' + (page_num - 1);
                                        });
                                        //クリックした数字のページまで遷移
                                        add_span.addEventListener('click', (event) => {
                                            location.href = url_3 + 'category=' + item.category[0] + '&page=' + (i + 1);
                                        });
                                        //「次へ」をクリックすると現在地を+1
                                        add_next.addEventListener('click', (event) => {
                                            location.href = url_3 + 'category=' + item.category[0] + '&page=' + (page_num + 1);
                                        });
                                    };

                                    //最大値 - 現在地 = 4未満
                                    if (7 < page_limit && page_limit - page_num < 4) {
                                        for (let i = 0; i < page_limit - 7; i++) {
                                            document.querySelector('.span' + i).remove()
                                        }
                                        let add_spanmin = document.createElement('span');
                                        add_spanmin.textContent = 1;
                                        $(add_spanmin).attr('id', 'spanmin');
                                        navipage_element.prepend(add_spanmin);

                                        add_spanmin.addEventListener('click', (event) => {
                                            location.href = url_3 + 'category=' + item.category[0] + '&page=1';
                                        });
                                    }

                                    //現在地5以上 && 最大値が現在地+4以上   (現在地5~)
                                    else if (7 < page_limit && 4 < page_num && page_num + 3 < page_limit) {

                                        //現在地+4以降全部削除
                                        for (let i = 0; i < page_limit - (page_num + 3); i++) {
                                            document.querySelector('.span' + (page_num + 3 + i)).remove()
                                        }
                                        let add_spanmin = document.createElement('span');
                                        add_spanmin.textContent = 1;
                                        $(add_spanmin).attr('id', 'spanmin');
                                        navipage_element.prepend(add_spanmin);

                                        add_spanmin.addEventListener('click', (event) => {
                                            location.href = url_3 + 'category=' + item.category[0] + '&page=1';
                                        });

                                        //現在地-4以降全部削除
                                        for (let i = 0; i < page_num - 4; i++) {
                                            document.querySelector('.span' + i).remove()
                                        }
                                        let add_spanmax = document.createElement('span');
                                        add_spanmax.textContent = page_limit;
                                        $(add_spanmax).attr('id', 'spanmax');
                                        navipage_element.append(add_spanmax);

                                        add_spanmax.addEventListener('click', (event) => {
                                            location.href = url_3 + 'category=' + item.category[0] + '&page=' + page_limit;
                                        });
                                    }
                                    //現在地1~4
                                    else if (7 < page_limit) {
                                        for (let i = 0; i < page_limit - 7; i++) {
                                            document.querySelector('.span' + (7 + i)).remove()
                                        }
                                        let add_spanmax = document.createElement('span');
                                        add_spanmax.textContent = page_limit;
                                        $(add_spanmax).attr('id', 'spanmax');
                                        navipage_element.append(add_spanmax);

                                        add_spanmax.addEventListener('click', (event) => {
                                            location.href = url_3 + 'category=' + item.category[0] + '&page=' + page_limit;
                                        });
                                    }

                                    //現在地が2以上の場合は「前へ」をdiv要素(navipage)の中に追加
                                    if (page_num > 1) {
                                        navipage_element.prepend(add_prev);
                                    }

                                    //現在地が最後のページでない場合は「次へ」をdiv要素(navipage)の中に追加
                                    if (item.product.length / page_num > 20) {
                                        navipage_element.append(add_next);
                                    };
                                };
                            };
                        };
                    };
                    //ここまで現在地がproduct.htmlの場合-------------------------------------------------------------------------------------------------------------------

                    //検索したワードが含まれているproduct全てautoCompleteJSに入れる
                    for (let i = 0; i < item.product.length; i++) {
                        if (item.product[i][1].indexOf(sessionStorage.getItem('search')) != -1) {
                            search_arr.push(item.product[i])
                        }
                        autoCompleteJS.feedback.push(item.product[i][1])
                    }
                };
            });


            //ここから現在地がsearch.htmlの場合--------------------------------------------------------------------------------------------------------------

            //検索したワードがproductに含まれていなかった場合
            if (search_arr.length == 0 && current == url_search + 'page=1') {
                $('h2').text('「' + sessionStorage.getItem('search') + '」の検索結果：' + '0件');
                $(search).attr('value', sessionStorage.getItem('search'))
            }

            //検索したワードがproductに含まれていた場合
            let search_limit = Math.ceil(search_arr.length / 20);
            for (let page_num = 1; page_num <= search_limit; page_num++) {
                if (current == url_search + 'page=' + page_num) {
                    $(search).attr('value', sessionStorage.getItem('search'))
                    $('h2').text('「' + sessionStorage.getItem('search') + '」の検索結果：' + search_arr.length + '件');

                    let row_limit = Math.ceil(search_arr.length / 5 + (page_num - 1) * -4);
                    for (let i = 0; i < row_limit; i++) {
                        if (row_limit > 4) { row_limit = 4 }
                        let box2_element = document.querySelector('.box2');
                        let add_ul = document.createElement('ul');
                        let add_ul2 = document.createElement('ul');
                        $(add_ul).attr('id', 'ul' + i);
                        box2_element.append(add_ul);
                        box2_element.append(add_ul2);
                        for (let j = 0; j < 5; j++) {

                            let add_li = document.createElement('li');
                            let add_li2 = document.createElement('li');

                            let add_img = document.createElement('img');
                            $(add_img).attr('id', 'img' + (j + i * 5));

                            let add_h3 = document.createElement('h3');
                            $(add_h3).attr('id', 'name' + (j + i * 5));

                            let add_p = document.createElement('p');
                            $(add_p).attr('id', 'maker' + (j + i * 5));

                            let add_div = document.createElement('div');
                            $(add_div).attr('id', 'field' + (j + i * 5));
                            $(add_div).attr('class', 'field');
                            add_ul.append(add_li);
                            add_ul2.append(add_li2);
                            if (j + i * 5 + ((page_num - 1) * 20) < search_arr.length) {
                                add_ul.append(add_li);
                                add_ul2.append(add_li2);
                                add_li.append(add_img);
                                add_li.append(add_h3);
                                add_li.append(add_p);
                                add_li2.append(add_div);
                            }
                        }
                    }

                    let search_length = search_arr.length + (page_num - 1) * -20;
                    for (let i = 0; i < search_length; i++) {
                        if (search_length > 20) { search_length = 20 }

                        //button要素(up)を作成
                        let add_downbutton = document.createElement('button');
                        add_downbutton.textContent = '－';
                        $(add_downbutton).attr('class', 'down_button');
                        $(add_downbutton).attr('id', 'down' + i);

                        //input要素(在庫数)を作成
                        let add_input = document.createElement('input');
                        $(add_input).attr('type', 'text');
                        $(add_input).attr('class', 'inputtext');
                        $(add_input).attr('id', 'stock' + i);

                        //button要素(down)を作成
                        let add_upbutton = document.createElement('button');
                        add_upbutton.textContent = '＋';
                        $(add_upbutton).attr('class', 'up_button');
                        $(add_upbutton).attr('id', 'up' + i);

                        //div要素(#field)の中に作成した3つの要素を追加
                        let field_element = document.querySelector('#field' + i);
                        field_element.append(add_downbutton);
                        field_element.append(add_input);
                        field_element.append(add_upbutton);

                        //productのindex番号
                        let arr_num = ((page_num - 1) * 20) + i

                        //productの写真・名前・メーカー・在庫数を追加
                        $('#img' + i).attr('src', search_arr[arr_num][0]);
                        $('#name' + i).text(search_arr[arr_num][1]);
                        $('#maker' + i).text(search_arr[arr_num][2]);
                        $('#stock' + i).attr('placeholder', 0);
                        $('#stock' + i).attr('value', localStorage.getItem(search_arr[arr_num][1]));

                        //ダウンボタンをクリックすると在庫数を-1
                        let downbutton_element = document.querySelector('#down' + i);
                        downbutton_element.addEventListener('click', (event) => {
                            if (input_element.value > 0) {
                                input_element.value--;
                                localStorage.setItem(search_arr[arr_num][1], input_element.value);
                            }
                        });

                        //input要素に入力した文字を反映
                        let input_element = document.querySelector('#stock' + i);
                        input_element.addEventListener('keyup', () => {
                            input_element.innerHTML = input_element.value;
                            localStorage.setItem(search_arr[arr_num][1], input_element.value);
                        });

                        //アップボタンをクリックすると在庫数を+1
                        let upbutton_element = document.querySelector('#up' + i);
                        upbutton_element.addEventListener('click', (event) => {
                            input_element.value++;
                            localStorage.setItem(search_arr[arr_num][1], input_element.value);
                        });
                    };
                    // 在庫数リセット
                    // localStorage.clear();


                    //span要素(前へ)を作成
                    let add_prev = document.createElement('span');
                    add_prev.textContent = '前へ';
                    $(add_prev).attr('id', 'prev');

                    //span要素(次へ)を作成
                    let add_next = document.createElement('span');
                    add_next.textContent = '次へ';
                    $(add_next).attr('id', 'next');

                    //div要素(.navipage)取得
                    let navipage_element = document.querySelector('.navipage');

                    //productが1ページで収まる場合は「前へ」・ページ数・「次へ」を表示しない
                    if (search_arr.length > 20) {

                        //作成するページ数分回すfor文
                        for (let i = 0; i < search_limit + 1; i++) {

                            //span要素(数字)を作成
                            let add_span = document.createElement('span');
                            add_span.textContent = i + 1;
                            $(add_span).attr('class', 'span' + i);

                            //span要素(ページ数表示)の現在地を取得し.navipage_currentを追加
                            let current_span = document.querySelector('.span' + (page_num - 1));
                            $(current_span).attr('id', 'current_span');

                            if (i + 1 != search_limit + 1) {
                                //div要素(navipage)の中に追加
                                navipage_element.append(add_span);
                            }

                            //「前へ」をクリックすると現在地を-1
                            add_prev.addEventListener('click', (event) => {
                                location.href = url_search + 'page=' + (page_num - 1);
                            });
                            //クリックした数字のページまで遷移
                            add_span.addEventListener('click', (event) => {
                                location.href = url_search + 'page=' + (i + 1);
                            });
                            //「次へ」をクリックすると現在地を+1
                            add_next.addEventListener('click', (event) => {
                                location.href = url_search + 'page=' + (page_num + 1);
                            });
                        };

                        //最大値 - 現在地 = 4未満
                        if (7 < search_limit && search_limit - page_num < 4) {
                            for (let i = 0; i < search_limit - 7; i++) {
                                document.querySelector('.span' + i).remove()
                            }
                            let add_spanmin = document.createElement('span');
                            add_spanmin.textContent = 1;
                            $(add_spanmin).attr('id', 'spanmin');
                            navipage_element.prepend(add_spanmin);

                            add_spanmin.addEventListener('click', (event) => {
                                location.href = url_search + 'page=1';
                            });
                        }

                        //現在地5以上 && 最大値が現在地+4以上   (現在地5~)
                        else if (7 < search_limit && 4 < page_num && page_num + 3 < search_limit) {

                            //現在地+4以降全部削除
                            for (let i = 0; i < search_limit - (page_num + 3); i++) {
                                document.querySelector('.span' + (page_num + 3 + i)).remove()
                            }
                            let add_spanmin = document.createElement('span');
                            add_spanmin.textContent = 1;
                            $(add_spanmin).attr('id', 'spanmin');
                            navipage_element.prepend(add_spanmin);

                            add_spanmin.addEventListener('click', (event) => {
                                location.href = url_search + 'page=1';
                            });

                            //現在地-4以降全部削除
                            for (let i = 0; i < page_num - 4; i++) {
                                document.querySelector('.span' + i).remove()
                            }
                            let add_spanmax = document.createElement('span');
                            add_spanmax.textContent = search_limit;
                            $(add_spanmax).attr('id', 'spanmax');
                            navipage_element.append(add_spanmax);

                            add_spanmax.addEventListener('click', (event) => {
                                location.href = url_search + 'page=' + search_limit;
                            });
                        }

                        //現在地1~4
                        else if (7 < search_limit) {
                            for (let i = 0; i < search_limit - 7; i++) {
                                document.querySelector('.span' + (7 + i)).remove()
                            }
                            let add_spanmax = document.createElement('span');
                            add_spanmax.textContent = search_limit;
                            $(add_spanmax).attr('id', 'spanmax');
                            navipage_element.append(add_spanmax);

                            add_spanmax.addEventListener('click', (event) => {
                                location.href = url_search + 'page=' + search_limit;
                            });
                        }

                        //現在地が2以上の場合は「前へ」をdiv要素(navipage)の中に追加
                        if (page_num > 1) {
                            navipage_element.prepend(add_prev);
                        }

                        //現在地が最後のページでない場合は「次へ」をdiv要素(navipage)の中に追加
                        if (search_arr.length / page_num > 20) {
                            navipage_element.append(add_next);
                        };
                    };
                };
            };
        });

});