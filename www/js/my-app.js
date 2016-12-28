// 
var db = null;
// var $$ = Dom7;
var url = 'http://mbcmplk.pe.hu/index.php/';
// var url = 'http://localhost/project/web/mbapi/CodeIgniter-3.1.2/';
$$.ajaxSetup({
    headers: {
        'Authorization': 'JANCUKKEY',
        'Accept': 'application/json'
    }
});

var mainView = myApp.addView('.view-main');
myApp.onPageInit('create-order', function (page) {
    $$.ajax({
        method: 'GET',
        url: url + 'meja?format=json',
        success: function (data, status, xhr) {
            var fruits = JSON.parse(data);

            $$.each(fruits, function (index, value) {
                console.log(value);
                var dafuk = "<li><a href=\"#\" class=\"item-link item-content\" id=\"pilih-meja\" data-value=\"" + value.id + "\">" +
                    "<div class=\"item-media\"><i class=\"icon icon-restaurant\"></i></div>" +
                    "<div class=\"item-inner\">" +
                    "<div class=\"item-title\">" + value.Posisi +
                    "</div>" +
                    "<div class=\"item-after\">" + value.Nomor + "</div>" +
                    "</div></a></li>";
                $$("#list-meja").append(dafuk);
                $$('#pilih-meja').on('click', function (e) {
                    var data = {
                        "meja_id": $$(this).data('value'),
                        "pemesan": "null",
                        "pelayan": 1
                    };
                    create_order(data);
                    console.log($$(this).data('value'));
                });
            });
        },
        error: function (err) {
            console.log(err);
        }
    });

    // $$.get(url + 'menu?format=json', {}, function (data) {
    //         // $$('.articles').html(data);
    //         console.log(data);
    //     },
    //     function (err) {
    //         console.log(err);
    //     }
    // );
});
myApp.onPageInit('list-meja', function (page) {
    $$.ajax({
        method: 'GET',
        url: url + 'meja?format=json',
        success: function (data, status, xhr) {
            var fruits = JSON.parse(data);

            $$.each(fruits, function (index, value) {
                console.log(value);
                var dafuk = "<li><a href=\"#\" class=\"item-link item-content\">" +
                    "<div class=\"item-media\"><i class=\"icon icon-restaurant\"></i></div>" +
                    "<div class=\"item-inner\">" +
                    "<div class=\"item-title\">" + value.Posisi +
                    "</div>" +
                    "<div class=\"item-after\">" + value.Nomor + "</div>" +
                    "</div></a></li>";
                $$("#list-meja").append(dafuk);
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
});

myApp.onPageInit('post-order-detail', function (page) {
    $$('#build-order').on('click', function (e) {
        var formData = myApp.formToData('#detail');
    });
    var order_detail = [];
    $$(".swipeout").on("click", function (page) {
        var menu_id = $$(this).data('menu');
        console.log(menu_id);
    });
    
    // $$("select.jumlah").change(function (e) {
    //     var jumlah = $$(this).value();
    //     var target = $$(this).data('target');
    //     console.log(jumlah);
    //     console.log(target);
    //     $$("#" + target).data('jumlah').value(jumlah);
    // });
});
document.addEventListener("deviceready", function () {

    db = window.sqlitePlugin.openDatabase({
        name: "note.db"
    });
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS note (name text primary key, data text)");
    }, function (err) {
        alert("An error occurred while initializing the app");
    });
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO note (name, data) VALUES (?,?)", ['name', 'gembus juiaan'], function (tx, res) {

            }).then(function (data) {
                return tx.executeSql("SELECT * from note ");
            })
            .then(function (user) {
                return user;
            });
    });
}, false);

function create_order(dt) {
    var view = 'post-order-detail.html';
    var url2 = url + 'orders?format=json';

    $$.post(url2, dt, function (data) {
        // $$('.login').html(data);
        console.log(data);
        var order = JSON.parse(data);
        var detail = order.result;
        if (order.code === true) {
            $$.ajax({
                method: 'GET',
                url: url + 'menu/makanan?format=json',
                success: function (data, status, xhr) {
                    var makanan = JSON.parse(data);
                    var option = generate_option_number();
                    $$.ajax({
                        method: 'GET',
                        url: url + 'menu/minuman?format=json',
                        success: function (dt, status, xhr) {
                            var minuman = JSON.parse(dt);
                            mainView.router.load({
                                url: view,
                                context: {
                                    order_number: detail.nomor_order,
                                    id: detail.id,
                                    makanan: makanan,
                                    minuman: minuman
                                }
                            });
                        }
                    });
                },
                error: function (err) {
                    console.log(err);
                }
            });
        } else {
            myApp.alert('something wrong');
        }
    });
    // $$.ajax({
    //     method: 'POST',
    //     data: dt,
    //     success: function (data, status, xhr) {
    //         var order = JSON.parse(data);
    //         if (order.code === true) {
    //             mainView.router.loadPage(view);
    //         } else {
    //             myApp.alert('something wrong');
    //         }
    //     },
    //     error: function (err) {
    //         console.log(err);
    //         myApp.alert('something wrong bro');
    //     }
    // });
}

function generate_option_number() {
    var number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    var option = '';
    $$.each(number, function (x, xy) {
        option += "<option value='" + xy + "'>" + xy + "</option>";
    });
    return option;
}