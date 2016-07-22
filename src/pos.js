'use strict';


function formatTags(tags) {
    let formatedTags = tags.map(function (tag) {
        let arr = tag.split("-");
        return {
            barcode: arr[0],
            count: parseFloat(arr[1]) || 1
        }
    });
    return formatedTags;
}

function mergeBarcodes(formatedTags) {
    let mergedBarcodes = formatedTags.reduce(function (cur, newArr) {
        let existBarcodes = cur.find(function (item) {
            return item.barcode === newArr.barcode;
        });
        if (!existBarcodes) {
            existBarcodes = Object.assign({}, newArr, {count: 0});
            cur.push(existBarcodes);
        }
        existBarcodes.count += newArr.count;
        return cur;
    }, []);
    return mergedBarcodes;
}

function getItems(countedBarcodes, allItems) {
    let cartItems = [];
    for (let i = 0; i < countedBarcodes.length; i++) {
        for (let j = 0; j < allItems.length; j++) {
            if (countedBarcodes[i].barcode === allItems[j].barcode) {
                cartItems.push(Object.assign({}, allItems[j], {count: countedBarcodes[i].count}));
            }
        }
    }
    return cartItems;
}

function getSubtotal(cartItems) {
    let subtotaledItems = [];
    for (let i = 0; i < cartItems.length; i++) {
        let subtotal = cartItems[i].price * cartItems[i].count;
        subtotaledItems.push(Object.assign({}, cartItems[i], {subtotal: subtotal}));
    }

    return subtotaledItems;
}

function getSavedSubtotal(promotionedBarcodes, cartItems) {
    let savedSubtotalItems = [];
    /*for (let i=0; i < promotionedBarcodes.length; i++) {
     for(let j=0;j<cartItems.length;j++ ){
     if(promotionedBarcodes.barcode[i]===cartItems[j].barcode && cartItems[j].count/3!==0){
     savedSubtotalItems.push(Object.assign({},cartItems[j],{savedSubtotal:cartItems[j].price*(cartItems[j].count-cartItems[j].count/3)}));
     }
     else {
     savedSubtotalItems.push(Object.assign({},cartItems[j],{savedSubtotal:cartItems[j].price*cartItems[j].count}));

     }
     }*/
  /*  for(let i=0;i<promotionedBarcodes[0].barcodes.length;i++){
     for(let j=0;j<cartItems.length;j++){
     let existPromotion=cartItems.find(function (item) {
     return (item.barcode===promotionedBarcodes[0].barcodes[i]&& item.count/3!==0);
     });

     if(existPromotion){
     savedSubtotalItems.push(Object.assign({},cartItems[j],{savedSubtotal:cartItems[j].price*(cartItems[j].count-cartItems[j].count/3)}));
     }
     else {
     savedSubtotalItems.push(Object.assign({},cartItems[j],{savedSubtotal:cartItems[j].price*cartItems[j].count}));
     }
     }
     }*/
    for (let j = 0; j <cartItems.length ; j++) {
        let existPromotion=cartItems[j].barcode===promotionedBarcodes[0].barcodes[j]&& cartItems[j].count/3!==0;
       
        if(existPromotion){
            savedSubtotalItems.push(Object.assign({},cartItems[j],{savedSubtotal:cartItems[j].price*(cartItems[j].count-cartItems[j].count/3)}));
        }
        else {
            savedSubtotalItems.push(Object.assign({},cartItems[j],{savedSubtotal:cartItems[j].price*cartItems[j].count}));
        }
    }


    return savedSubtotalItems;
}

// console.log(JSON.stringify(savedSubtotalItems, null, 4));

function getTotal(subtotaledItems) {
    let total = 0;
    for (let i = 0; i < subtotaledItems.length; i++) {
        total += subtotaledItems[i].subtotal;
    }
    return total;
}

function getSavedMoney(subtotaledItems, savedSubtotaledItems) {
    let savedMoney = 0;
    for (let i = 0; i < subtotaledItems.length; i++) {
        savedMoney += (subtotaledItems[i].subtotal - savedSubtotaledItems[i].savedSubtotal);
    }
    return savedMoney;
}

function print(savedSubtotaledItems, total, savedMoney) {
    console.log("***<没钱赚商店>收据***\n");
    for (let i = 0; i < savedSubtotaledItems.length; i++) {
        console.log(
            "名称:" + savedSubtotaledItems[i].name +
            ", 数量:" + savedSubtotaledItems[i].count + savedSubtotaledItems[i].unit +
            ",单价:" + savedSubtotaledItems[i].price +
            "（元）,小计：" + savedSubtotaledItems[i].savedSubtotal + "（元）\n"
        );
    }
    console.log("----------------------\n");
    console.log("总计: " + total + "（元）\n" + "节省: " + savedMoney + "（元）\n" + "**********************");
}