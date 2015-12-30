var mongo = require("mongodb").MongoClient, client = require("socket.io").listen(8000).sockets;


mongo.connect("mongodb://127.0.0.1/chat",function(err,db){
		if(err)
			throw err;
		
		client.on("connection",function (socket){
			var col = db.collection('messages');
			var sendStatus = function(s){
				socket.emit('status',s);
			};
			col.find().limit(100).sort({_id:1}).toArray(function(err,res){
				if(err) throw err;
				socket.emit('output',res);
			});
			socket.on("input",function(data){
				var whiteSpace = /^\s*$/;
			if(whiteSpace.test(data.name) || whiteSpace.test(data.message)){
				sendStatus("Name and message is required");
			}
			else{
				col.insert({name : data.name,message : data.message},function(){
					client.emit('output',[data]);
					sendStatus({
						message : "Message Sent",
						clear : true
					});
				});
			}
		});
		});

})
