// 
var db = null;

function onBackKeyDown() {
    $$(".back").click();
}
document.addEventListener("backbutton", onBackKeyDown, true);
// var $$ = Dom7;
var url = 'http://mbcmplk.pe.hu/index.php/';
// var url = 'http://localhost/project/web/mbapi/CodeIgniter-3.1.2/';
$$.ajaxSetup({
    headers: {
        'Authorization': 'JANCUKKEY',
        'Accept': 'application/json'
    }
});
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});
myApp.onPageInit('jancuk', function (page) {
    $$.get(url + 'orders/today', null, function (data) {
        var html = '';
        data = JSON.parse(data);
        if (data.length != 0) {
            $$.each(data, function (index, value) {
                var total = parseInt(value.total);
                html +=
                    '<li class="swipeout">' +
                    '<div class="swipeout-content">' +
                    '<a href="#" class="item-link item-content">' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title"> Meja Nomor <b>' + value.nomor + '</b> </div>' +
                    '<div class="item-after"> <strong class="size-24">Rp. ' + total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</strong></div>' +
                    '</div>' +
                    '<div class="item-subtitle">' + value.nomor_order + '</div>' +
                    '<div class="item-text">Atas Nama <b>' + value.pemesan + '</b></div>' +
                    '</div>' +
                    '</a>' +
                    '</div>' +
                    '<div class="swipeout-actions-right"><a href="#" class="bg-green swipeout-overswipe pay" data-order="' + value.id + '">Bayar</a><a href="#" class="bg-orange swipeout-overswipe cancel" data-order="' + value.id + '">Batal</a></div>' +
                    '<div class="swipeout-actions-left"><a href="#" class="bg-blue swipeout-overswipe detail" data-order="' + value.id + '">Lihat Detail</a></div>' +
                    '</div>' +
                    '</li>';
            });
            $$("#order-list").html(html);
            init_home();
        } else {

        }
    });
}).trigger();

function init_home() {
    module_detail_order();
    module_bayar();
}

function init_calculate() {
    $$(".add").on("click", function (page) {
        var menu_id = $$(this).data('target');
        var dt = $$(this).data('dt');
        var value = $$('#' + menu_id).val();
        value = incrementValue(value);
        $$("#" + menu_id).val(value);
        $$("#" + dt).data('jumlah', value);
    });

    $$(".odd").on("click", function (page) {
        var menu_id = $$(this).data('target');
        var dt = $$(this).data('dt');
        var value = $$('#' + menu_id).val();
        value = decrementValue(value);
        $$("#" + menu_id).val(value);
        $$("#" + dt).data('jumlah', value);
    });
}

function module_detail_order() {
    $$('.detail').on('click', function (e) {
        var order_id = $$(this).data('order');
        lihat_detail_order(order_id);
    });
}

function module_bayar() {
    $$('.pay').on('click', function (e) {
        var order_id = $$(this).data('order');
        console.log(order_id + 'jasasas');
        myApp.prompt('Masukan Jumlah Pembayaran?', function (data) {
            if (data !== '') {
                myApp.confirm('Are you sure that your name is ' + data + '?', function () {
                    var dt = {
                        bayar: data
                    };
                    $$.post(url + 'order/bayar' + order_id, dt, function (result) {
                        updatePemesan(order_id, data);
                        saveOrderDetail(order_id);
                    });
                });
            } else {
                myApp.alert('masukan jumlag pembayaran');

            }
        });
    });
}

function lihat_detail_order(order_id) {
    $$.get(url + 'orders/view/' + order_id, null, function (data) {
        data = JSON.parse(data);
        var view = 'detail_order.html';
        var order = data.order,
            detail = data.detail;
        var addData = {
            detail: detail,
            order: order
        };
        get_menu(view, addData);
    });
}

function update_detail_order() {
    $$('.update').on('click', function (e) {
        var id = $$(this).data('od_id');
        var jumlah = $$(this).data('jumlah');
        var data = {
            jumlah: jumlah
        };
        $$.post(url + 'order_detail/update/' + id, data, function (result) {
            myApp.alert('berhasil mengubah detail order');
        });
    });
}

//Now we add our callback for initial page
// Option 2. Using live 'page:init' event handlers for each page (not recommended)
// mainView.router.loadPage('about.html');

myApp.onPageInit('order-detail', function (page) {
    init_calculate();
    init_order_detail();
    update_detail_order();
});

myApp.onPageInit('minuman', function (page) {

});

myApp.onPageInit('dapur', function (page) {

});

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
                var dafuk = "<li><a href=\"#\" class=\"item-link item-content\">" +
                    "<div class=\"item-media\"><i class=\"icon icon-restaurant\"></i></div>" +
                    "<div class=\"item-inner\">" +
                    "<div class=\"item-title\">" + value.Posisi +
                    "</div>" +
                    "<div class=\"item-after\">" + value.Nomor + "</div>" +
                    "</div></a></li>";
                $$("#list-meja").html(dafuk);
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
});

myApp.onPageInit('post-order-detail', function (page) {
    $$('.cart').on('click', function (e) {

        // var formData = (JSON.stringify(myApp.formToJSON('#detail')));
        // console.log(formData);
    });
    var order_detail = [];
    // $$(".swipeout").on("click", function (page) {
    // var menu_id = $$(this).data('menu');
    // console.log(menu_id);
    // });

    init_calculate();
    init_order_detail();
});

function init_order_detail() {
    $$('#build-order').on('click', function (page) {
        var OBJ = [];
        var order_id = $$('#order_id').val();
        $$("form#detail").find('input[name="cart"]').each(function (e) {
            var jumlah = $$(this).data('jumlah');
            if (jumlah > 0) {
                var data = {
                    order_id: order_id,
                    menu_id: $$(this).data('menu'),
                    jumlah: $$(this).data('jumlah'),
                    notes: $$(this).data('notes'),
                    price: $$(this).data('price')
                };
                OBJ.push(data);
            }
        });

        if (OBJ.length !== 0) {
            myApp.prompt('What is your name?', function (data) {
                // @data contains input value
                var order_id = $$("input#order_id").val();
                if (data !== '') {
                    myApp.confirm('Are you sure that your name is ' + data + '?', function () {
                        updatePemesan(order_id, data);
                        saveOrderDetail(order_id, OBJ);
                    });
                } else {
                    myApp.alert('mohon isikan nama');

                }
            });
        } else {
            myApp.alert('data kosong, mohon di isi terlebih dahulu');
        }
    });
}

function saveOrderDetail(order_id, OBJ) {
    $$.post(url + 'order_detail', OBJ, function (dt) {
        mainView.router.load({
            url: 'main.html',
            force: true
        });
    });
}

function updatePemesan(order_id, pemesan) {
    var data = {
        pemesan: pemesan
    };
    $$.post(url + 'orders/savepemesan/' + order_id, data, function (dt) {
        console.log(dt);
    });
}
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
        console.log(detail);
        var addData = {
            order_number: detail.nomor_order,
            id: detail.id
        };
        if (order.code === true) {
            get_menu(view, addData);
        } else {
            myApp.alert('something wrong');
        }
    });
}

function get_menu(view, addData) {
    addData = addData === undefined ? null : addData;
    $$.ajax({
        method: 'GET',
        url: url + 'menu/makanan?format=json',
        success: function (data, status, xhr) {
            var menu = JSON.parse(data);
            var context = {
                minuman: menu.minuman,
                kudapan: menu.kudapan,
                ingkung_goreng: menu.ingkung_goreng,
                ingkung_areh: menu.ingkung_areh,
                camilan: menu.camilan,
                paket: menu.paket
            };
            context = Object.assign(context, addData);
            console.log(context);
            mainView.router.load({
                url: view,
                context: context
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function generate_option_number() {
    var number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    var option = '';
    $$.each(number, function (x, xy) {
        option += "<option value='" + xy + "'>" + xy + "</option>";
    });
    return option;
}

function incrementValue(val) {
    var value = val;
    value = isNaN(value) ? 0 : value;
    value++;
    return value;
}

function decrementValue(val) {
    var value = val;
    value = isNaN(value) ? 0 : value;
    value--;
    value = value <= 0 ? 0 : value;
    return value;
}