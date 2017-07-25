var queue = require('node-queue');

queue.createQueue(function(err, myQueue) {
    if(err) {
        console.log('ohhh :-(');
        return;
    }
    // you can now use myQueue variable to go on...

    var timer = setInterval(function(){
            myQueue.getAll(function(err, items) {
                if(err) {
                    console.log('ohhh :-(');
                    return;
                }

                // items is an array of all what is in the queue
                if (items.length == 0 ) {
                    console.log('All work done!');
                    clearInterval(timer);
                    return;
                }
                var firstItem = items[0];
                console.log('the id: ' + firstItem.id);
                console.log('the pushed data: ', firstItem.data);
                console.log('items', items);

            });
        }, 500);

        myQueue.push('myId', { some: 'data' }, function(err) {
            if(err) {
                console.log('ohhh :-(');
                return;
            }
            setTimeout(function(){
                console.log('123');
                myQueue.decrement('myId', function(err, hasBeenRemoved) {
                    if(err) {
                        console.log('ohhh :-(');
                        return;
                    }

                    // Now the workers value is decremented,
                    // but if the workers value after the decrement is 0,
                    // the record will be automatically removed.
                    // You can check this with the flag hasBeenRemoved!

                    if(hasBeenRemoved) {
                        console.log('All workers finished!');
                    }

                });
            }, 1000);


        });




        myQueue.push('myId2', { some: 'data1' }, function(err) {
            if(err) {
                console.log('ohhh :-(');
                return;
            }
            console.log('loading 1');
            setTimeout(function(){
                console.log('1234');
                myQueue.decrement('myId2', function(err, hasBeenRemoved) {
                    if(err) {
                        console.log('ohhh :-(');
                        return;
                    }

                    // Now the workers value is decremented,
                    // but if the workers value after the decrement is 0,
                    // the record will be automatically removed.
                    // You can check this with the flag hasBeenRemoved!

                    if(hasBeenRemoved) {
                        console.log('All workers finished!');
                    }

                });
            }, 3000);
        });



        myQueue.push('myId2', { some: 'data2' }, function(err) {
            if(err) {
                console.log('ohhh :-(');
                return;
            }
            console.log('loading 2');
            setTimeout(function(){
                console.log('123456');
                myQueue.decrement('myId2', function(err, hasBeenRemoved) {
                    if(err) {
                        console.log('ohhh :-(');
                        return;
                    }

                    // Now the workers value is decremented,
                    // but if the workers value after the decrement is 0,
                    // the record will be automatically removed.
                    // You can check this with the flag hasBeenRemoved!

                    if(hasBeenRemoved) {
                        console.log('All workers finished!');
                    }

                });
            }, 2000);
        });

});



