'use strict';

function loadAllItems() {
    return [
        {
            barcode: 'ITEM000000',
            name: '可口可乐',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000002',
            name: '苹果',
            unit: '斤',
            price: 5.50
        },
        {
            barcode: 'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00
        },
        {
            barcode: 'ITEM000004',
            name: '电池',
            unit: '个',
            price: 2.00
        },
        {
            barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50
        }
    ];
}

function loadPromotions() {
    return [
        {
            type: 'BUY_TWO_GET_ONE_FREE',
            barcodes: [
                'ITEM000000',
                'ITEM000001',
                'ITEM000005'
            ]
        }
    ];
}


function formatTags(tags) {
    let formatedTags = [];
    formatedTags = tags.map(function (tag) {
        let arr = tag.split("-");
        return {
            barcode: arr[0],
            count: parseFloat(arr[1]) || 1
        }
    });
    return formatedTags;
}

function mergeBarcodes(formatedTags) {
    let mergedBarcodes = [];
    mergedBarcodes = formatedTags.reduce(function (cur, newArr) {
        let exist = cur.find(function (item) {
            return item.barcode === newArr.barcode;
        });
        if (!exist) {
            exist = Object.assign({}, newArr, {count: 0});
            cur.push(exist);
        }
        exist.count += newArr.count;
        return cur;
    }, []);

    return mergedBarcodes;
}

function getItems(mergedBarcodes, allItems) {
    let cartItems = [];
    for (let i = 0; i < allItems.length; i++) {
        let exist = mergedBarcodes.find(function (item) {
            return item.barcode === allItems[i].barcode;
        });
        if (exist) {
            cartItems.push(Object.assign({}, allItems[i], {count: exist.count}));
        }
    }
    return cartItems;
}

function getPromontionType(cartItems) {
    let proInfo = loadPromotions();
    let proInfoItems = [];
    var barcodes = proInfo[0].barcodes;

    for (let i = 0; i < cartItems.length; i++) {
        var bol = barcodes.find(function (barcode) {
            return barcode === cartItems[i].barcode;
        });
        if (bol) {
            proInfoItems.push(Object.assign({}, cartItems[i], {proType: "BUY_TWO_GET_ONE_FREE"}));
        } else {
            proInfoItems.push(Object.assign({}, cartItems[i], {proType: "other"}));
        }
    }
    return proInfoItems;
}

function getSavedSubtotal(proInfoItems) {
    let savedSubItems = [];

    for (let i = 0; i < proInfoItems.length; i++) {
        let subtotal = proInfoItems[i].price * proInfoItems[i].count;
        let savedMoney = proInfoItems[i].price * parseInt(proInfoItems[i].count / 3);
        if (proInfoItems[i].proType === 'BUY_TWO_GET_ONE_FREE') {

            savedSubItems.push(Object.assign({}, proInfoItems[i], {savedSubtotal: subtotal - savedMoney}));
        }
        else {
            savedSubItems.push(Object.assign({}, proInfoItems[i], {savedSubtotal: subtotal}));

        }
    }

    return savedSubItems;
}

function print(savedSubItems) {
    let savedMoney = 0;
    let total = 0;
    let text = '***<没钱赚商店>收据***\n';

    for (let i = 0; i < savedSubItems.length; i++) {
        text += "名称：" + savedSubItems[i].name + "，数量：" + savedSubItems[i].count + savedSubItems[i].unit + "，单价：" + savedSubItems[i].price.toFixed(2) + "(元)，小计：" + savedSubItems[i].savedSubtotal.toFixed(2) + "(元)\n";
        total += savedSubItems[i].savedSubtotal;
        savedMoney += savedSubItems[i].count * savedSubItems[i].price - savedSubItems[i].savedSubtotal;
    }
    text += "----------------------\n" +
        "总计：" + total.toFixed(2) + "(元)\n" +
        "节省：" + savedMoney.toFixed(2) + "(元)\n" +
        "**********************";
    console.log(text);
}


function printReceipt(tags) {
    let allItems = loadAllItems();
    let proInfo = loadPromotions();
    let formatedTags = formatTags(tags);
    let mergedBarcodes = mergeBarcodes(formatedTags);
    let cartItems = getItems(mergedBarcodes, allItems);
    let proInfoItems = getPromontionType(cartItems);
    let savedSubItems = getSavedSubtotal(proInfoItems);
    print(savedSubItems);
}