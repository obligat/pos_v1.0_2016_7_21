'use strict';

describe("format", function () {
    it("format print tags", function () {
        let tags = [
            "0002-1"
        ];
        var result = formatTags(tags);

        expect(result).toEqual([{barcode: "0002", count: 1}]);
    });
});

describe("mergedBarcodes", function () {
    it("merged barcodes into togather", function () {
        let tags = [
            {
                barcode: "eeee",
                count: 1
            },
            {
                barcode: "iiii",
                count: 3
            },
            {
                barcode:"eeee",
                count: 2.3
            }

        ];
        let result = mergeBarcodes(tags);

        expect(result).toEqual([{barcode:"eeee",count:3.3},{barcode:"iiii",count:3}]);
    });
});

describe("getItems",function () {
    it("get items in cart information",function () {
        let countedBarcodes=[{barcode:"ITEM000000",count:3},{barcode:"ITEM000002",count:3}];
        let allItems=[{

            barcode: 'ITEM000000',
            name: '可口可乐',
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
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00

            }];

        let result=getItems(countedBarcodes,allItems);
        expect(result).toEqual([{

            barcode: 'ITEM000000',
            name: '可口可乐',
            unit: '瓶',
            price: 3.00,
            count: 3
        },
            {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50,
                count:3
            }]);
    }) ;
});


describe("getPromontionType",function () {
    it("after promotion subtotal ",function () {

        let cartItems=[
            {

                barcode: 'ITEM000000',
                name: '可口可乐',
                unit: '瓶',
                price: 3.00,
                count: 3
            },
            {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50,
                count:3
            }
        ];
        let result=getPromontionType(cartItems);
        expect(result).toEqual([
            {

                barcode: 'ITEM000000',
                name: '可口可乐',
                unit: '瓶',
                price: 3.00,
                count: 3,
                proType:'BUY_TWO_GET_ONE_FREE'

            },
            {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50,
                count:3,
                proType:'other'
            }
        ]);
    }) ;
});

describe("getSavedSubtotal",function () {
    it("saved subtotal",function () {
        let promotionItems=[
            {

                barcode: 'ITEM000000',
                name: '可口可乐',
                unit: '瓶',
                price: 3.00,
                count: 3,
                proType:'BUY_TWO_GET_ONE_FREE'

            },
            {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50,
                count:3,
                proType:'other'
            }
        ];

        let result=getSavedSubtotal(promotionItems);

        expect(result).toEqual([
            {

                barcode: 'ITEM000000',
                name: '可口可乐',
                unit: '瓶',
                price: 3.00,
                count: 3,
                proType:'BUY_TWO_GET_ONE_FREE',
                savedSubtotal:6

            },
            {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50,
                count:3,
                proType:'other',
                savedSubtotal:16.5
            }
        ])
    }) ;
});


describe("print",function () {
    it("format print cartItems information ",function () {

        let subtotal=[
            {

                barcode: 'ITEM000000',
                name: '可口可乐',
                unit: '瓶',
                price: 3.00,
                count: 3,
                proType:'BUY_TWO_GET_ONE_FREE',
                savedSubtotal:6

            },
            {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50,
                count:3,
                proType:'other',
                savedSubtotal:16.5
            }
        ];
        spyOn(console, 'log');

        print(subtotal);

        const expectText= `***<没钱赚商店>收据***
名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：6.00(元)
名称：苹果，数量：3斤，单价：5.50(元)，小计：16.50(元)
----------------------
总计：22.50(元)
节省：3(元)
**********************`;
        expect(console.log).toHaveBeenCalledWith(expectText);
    })
});

describe("printReceipt",function () {
    it("print finally",function () {
        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ];

        spyOn(console, 'log');

        printReceipt(tags);

        const expectText= `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

        expect(console.log).toHaveBeenCalledWith(expectText);

    });
});
