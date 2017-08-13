var uuid = require("uuid");
var db = require("../app").bucket;
var config = require("../config");
var N1qlQuery = require('couchbase').N1qlQuery;
 
function RecordModel() { };
RecordModel.save = function(data, callback) {
    var jsonObject = {
        name: data.name,
        email: data.email,
		imageURL:data.imageURL
    }
    var documentId = data.document_id ? data.document_id : uuid.v4();
    db.upsert(documentId, jsonObject, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
		
		//var ans ={"userID":documentId, "responseCode":"1"};
		var ans={"status":"Authenticated","userID":documentId,"responseCode":"1"};
		
        callback(null, ans);
    });
}
RecordModel.update = function(documentId,doc, callback) {
	//console.log(doc);
		RecordModel.getByDocumentId(documentId, function(error, result) {
			if (error) {
				return res.status(400).send(error);
			} else {
				
				
				 db.replace(documentId,doc ,function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, {"responseCode":"1"});
    });
		
			}
		});
}
RecordModel.getByDocumentId = function(documentId, callback) {
    var statement = "SELECT name, email, imageURL " +
                    "FROM `" + config.couchbase.bucket + "` AS users " +
                    "WHERE META(users).id = $1";
    var query = N1qlQuery.fromString(statement);
    db.query(query, [documentId], function(error, result) {
        if(error) {
            return callback(error, null);
        }
		var ans={"info":result[0], "responseCode":"1"};	
        callback(null, ans);
		console.log(result);
    });
};
RecordModel.delete = function(documentId, callback) {
    db.remove(documentId, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, {"responseCode":"1"});
    });
};
RecordModel.getAll = function(callback) {
    var statement = "SELECT META(users).id, firstname, lastname, email " +
                    "FROM `" + config.couchbase.bucket + "` AS users";
    var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};
module.exports = RecordModel;