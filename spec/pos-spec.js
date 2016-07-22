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

describe("getSubtotal",function () {
    it("calculate subtotal",function () {
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
       ] ;
        let result=getSubtotal(cartItems);
        
        expect(result).toEqual([
            {

                barcode: 'ITEM000000',
                name: '可口可乐',
                unit: '瓶',
                price: 3.00,
                count: 3,
                subtotal:9.00
            },
            {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50,
                count:3,
                subtotal:16.5
            }
        ] );
    });
});

describe("getSavedSubtotal",function () {
   it("after promotion subtotal ",function () {
       let promotionedBarcodes=[{
           type: 'BUY_TWO_GET_ONE_FREE',
           barcodes: [
               'ITEM000000',
               'ITEM000001',
               'ITEM000005'
           ]
       }];
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
       ]
       let result=getSavedSubtotal(promotionedBarcodes,cartItems);
       expect(result).toEqual([
           {

               barcode: 'ITEM000000',
               name: '可口可乐',
               unit: '瓶',
               price: 3.00,
               count: 3,
               savedSubtotal:6.00
               
           },
           {
               barcode: 'ITEM000002',
               name: '苹果',
               unit: '斤',
               price: 5.50,
               count:3,
               savedSubtotal:16.5
           }
       ]);
   }) ;
});

describe("getTotal",function () {
    it("get origin total price",function () {
        let subtotaledItems=[
            {

                barcode: 'ITEM000000',
                name: '可口可乐',
                unit: '瓶',
                price: 3.00,
                count: 3,
                subtotal:9.00
            },
            {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50,
                count:3,
                subtotal:16.5
            }
        ];
        let result=getTotal(subtotaledItems);

        expect(result).toBe(25.5)
    })
});

describe("getSavedMoney",function () {
   it("make subtotal money minus savedSubtotal money",function () {
       let subtotal=[
           {

               barcode: 'ITEM000000',
               name: '可口可乐',
               unit: '瓶',
               price: 3.00,
               count: 3,
               subtotal:9.00
           },
           {
               barcode: 'ITEM000002',
               name: '苹果',
               unit: '斤',
               price: 5.50,
               count:3,
               subtotal:16.5
           }
       ];
       let savedSubtotal=[
           {

               barcode: 'ITEM000000',
               name: '可口可乐',
               unit: '瓶',
               price: 3.00,
               count: 3,
               savedSubtotal:6.00

           },
           {
               barcode: 'ITEM000002',
               name: '苹果',
               unit: '斤',
               price: 5.50,
               count:3,
               savedSubtotal:16.5
           }
       ];
       let result=getSavedMoney(subtotal,savedSubtotal);

       expect(result).toBe(3)
   })
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
                savedSubtotal:6.00

            },
            {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50,
                count:3,
                savedSubtotal:16.5
            }
        ];
        let total=25.5;
        let save=3;
        let result=print(subtotal,total,save);
        /*let expectText = "***<没钱赚商店>收据***
        名称:'可口可乐',数量:3瓶,单价:3.00（元）,小计：6（元）
        名称:'苹果',数量:3斤,单价:5.50（元）,小计：16.5（元）
        ----------------------
            总计:25.5（元）
        节省:（元）
        **********************";
          */ const expectText= `***<没钱赚商店>收据***
名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：6.00(元)
名称：苹果，数量：3斤，单价：5.50(元)，小计：16.50(元)
----------------------
总计：25.5(元)
节省：3(元)
**********************`
        expect(result).toHaveBeenCalledWith(expectText);
    })
});

