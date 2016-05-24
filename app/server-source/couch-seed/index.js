var nano = require('nano')('http://10.211.55.74:5984');

exports.initCouchdb = function() {
    if(nano) {
        var configs = undefined;
        
        nano.db.list(function(err, body) {
            if(err) {
                console.log(err);
                return;
            }
            // body is an array 
            body.forEach(function(db) {
                console.log(db);
            });
        });
        
        nano.db.get('configs', function(err, body) {
            if (!err) {
                configs = nano.use('configs');
                console.log("here we are\n" + body);
                seedConfigsDb();
            }
            else {
                nano.db.create('configs', function(err, body) {
                    if (!err) {
                        console.log('database configs created!');
                        configs = nano.use('configs');
                        seedConfigsDb();
                    }
                });            
            }
        });
        
        //configs = nano.use('configs');
        
        function seedConfigsDb() {
            if(configs) {
                console.log('before insert into configs...');
                configs.insert({ ip_address: '192.168.10.1', tags:['common', 'nano', 'tech'] }, function(err, body) {
                    if (!err)
                        console.log(body);
                    else {
                        console.log(err);
                    }
                    });
            }
            else {
                console.log('something wrong with configs.');
            }           
        }

        
        /*
        var configs = nano.use('configs');

        configs.list(function(err, body) {
            if (!err) {
                body.rows.forEach(function(doc) {
                    console.log(doc);
                });
            }
        });
        */
    }
};