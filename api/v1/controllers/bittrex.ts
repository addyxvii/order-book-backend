const bittrex = require('node-bittrex-api'); 

bittrex.getorderbook( { market : 'BTC-ETH', depth : 10, type : 'both' }, function( data: any ) {

    data.result.buy.forEach(function(dataset: any) { console.log(dataset); });
    data.result.sell.forEach(function(dataset: any) { console.log(dataset); });
});





