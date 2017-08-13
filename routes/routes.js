var RecordModel = require("../models/recordmodel");
var crypto = require('crypto');
var password = "IAMGREAT";

var appRouter = function(app) {
	app.post("/api/save", function(req, res) {
    if(!req.body.name) {
        return res.status(400).send({"status": "error", "message": "A firstname is required"});
    } else if(!req.body.email) {
        return res.status(400).send({"status": "error", "message": "A lastname is required"});
    } else if(!req.body.imageURL) {
        return res.status(400).send({"status": "error", "message": "A email is required"});
    }
    RecordModel.save(req.body, function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });
});
app.get("/api/get", function(req, res) {
    if(!req.query.user_id) {
        return res.status(400).send({"status": "error", "message": "A document id is required"});
    }
	console.log(1);
    RecordModel.getByDocumentId(req.query.user_id, function(error, result) {console.log(2);
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });
});

//  LOGIN URL


app.post("/api/login", function(req, res) {
    if(!req.body.hashedValue) {
        return res.status(400).send({"status": "error", "message": "Supply a hashedValue of uname field in request"});
    }if(!req.body.token) {
        return res.status(400).send({"status": "error", "message": "No token provided"});
    }
	
	
     var hash = crypto.createHmac('sha512',password);
    hash.update(req.body.token.name);
    var value = hash.digest('hex');
    var given = req.body.hashedValue;
	
   if(given==value)
    {
      //var ans={"status":"Authenticated","user_id":"123456789","responseCode":"1"};
	  
	  // CALL /api/save
	  RecordModel.save(req.body.token, function(error, result) {
        if(error) {
			
			var ans={"status":"Not Authenticated","user_id":null,"responseCode":"-1"};
			res.status(400).send(ans);
        }
		
		else{
			
        res.status(200).send(result);
		}
	    //res.status(200).send(ans);
	  
	
	  });
	}
	  
	  else{
		var ans={"status":"Not Authenticated","user_id":null,"responseCode":"-1"};
			res.status(400).send(ans);
		
	}
});
	






app.get("/api/get", function(req, res) {
    if(!req.query.user_id) {
        return res.status(400).send({"status": "error", "message": "A document id is required"});
    }
	console.log(1);
    RecordModel.getByDocumentId(req.query.user_id, function(error, result) {console.log(2);
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });
});






app.get("/api/delete", function(req, res) {
    if(!req.query.user_id) {
        return res.status(400).send({"status": "error", "message": "A document id is required"});
    }
    RecordModel.delete(req.query.user_id, function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });
});
app.get("/api/getAll", function(req, res) {
    RecordModel.getAll(function(error, result) {
        if(error) {
            return res.status(400).send(error);
        }
        res.send(result);
    });
});
app.post("/api/update", function(req, res) {
	
	console.log(req.body);
	
	
    if (!req.body.user_id) {
        return res.status(400).send({
            "status": "error",
            "message": "A document id is required"
        });
	}
        RecordModel.update(req.body.user_id, req.body.newObj, function(error, result) {
            if (error) {
                return res.status(400).send(error);
            } else {

                res.send(result);

            }
        });
    
});
};
 
module.exports = appRouter;
//module.exports = appRouter;