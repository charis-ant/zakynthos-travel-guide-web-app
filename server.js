var express = require("express");
var sessions = require("express-session");
var bodyParser = require("body-parser");
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = "mongodb://localhost/";

app.listen(8888, function(){
    console.log("Server running at http://127.0.0.1:8888/");
});

app.use(express.static(__dirname));
app.set('view engine', 'ejs');

app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));

/* START PAGE */
app.get("/", function(req, res){
    res.render('fior_di_levante_home');
});

/* HOME PAGE */
app.get("/fior_di_levante_home", function(req, res){
    res.render('fior_di_levante_home');
});

/* ADMIN HOME PAGE */
app.get("/fior_di_levante_admin_home", function(req, res){
    res.render('fior_di_levante_admin_home');
});

/* RATING PAGE USER */
app.get("/fior_di_levante_rating", function(req, res){
    res.render('fior_di_levante_rating');
});

/* PRIVACY POLICY PAGE */
app.get("/fior_di_levante_privacy_policy", function(req, res){
    res.render('fior_di_levante_privacy_policy');
});

/* TERMS & CONDITIONS PAGE */
app.get("/fior_di_levante_terms_conditions", function(req, res){
    res.render('fior_di_levante_terms_conditions');
});

/* SESSION */
app.use(sessions({
    secret: "thisismysecretekey4twp31fdlwp",
    saveUninitialized:true,
    resave: false 
}));

/* SIGN UP & SIGN IN */
app.get("/fior_di_levante_sign", function(req, res){
    res.render('fior_di_levante_sign');
});

/* REGISTER */
app.post('/register',function(req,res){
    var name = req.body.name;
    var surname = req.body.surname;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var users = dbo.collection("users");
            var data = {"name": name, "surname":surname, "username":username, "email":email, "password":password};
            users.findOne({"email":email}, function(err1, query_result_1){
                if (err1){
                    console.log("Error selecting document");
                    throw err1;
                }else{
                    console.log("Document selected successfully");
                    if (query_result_1 == null){
                        users.insertOne(data, function(err2, query_result_2){
                            if (err2){
                                console.log('Error inserting document');
                                throw err2;
                            }else{
                                console.log('New document inserted successfully');
                                console.log("Registered");
                                session=req.session;
                                session.email = req.body.email;
                                app.locals.user_email = session.email;
                                if (username == "admin"){
                                    res.redirect('fior_di_levante_admin_home');
                                }else{
                                    res.redirect('fior_di_levante_home');
                                }
                            }
                            db.close();
                        });
                    }else{
                        console.log("User email already in use");
                        res.redirect('fior_di_levante_sign');
                    }
                }
            });
        }
    });     
});

/* LOGIN */
app.post('/login',function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var users = dbo.collection("users");
            users.findOne({"email":email, "password":password}, function(err1, query_result_1){
                if (err1){
                    console.log("Error selecting document");
                    throw err1;
                }else{
                    console.log("Document selected successfully");
                    if (query_result_1 != null){
                        session=req.session;
                        session.email = req.body.email;
                        app.locals.user_email = session.email;
                        console.log("Logged In");
                        if (query_result_1['username'] == "admin"){
                            res.redirect('fior_di_levante_admin_home');
                        }else{
                            res.redirect('fior_di_levante_home');
                        }
                    }else{
                        console.log("Login not successful");
                        res.redirect('fior_di_levante_sign');
                    }
                }
                db.close();  
            });
        }
    });     
});

/* LOGOUT */
app.get('/logout',(req,res) => {
    req.session.destroy();
    app.locals.user_email = undefined;
    res.redirect('/fior_di_levante_home');
});

/* GET LANDMARKS - USER */
app.get("/fior_di_levante_zakynthos", function(req, res){
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var landmarks = dbo.collection("landmarks");
            landmarks.find({}).toArray(
            function(err1, rows){
                if (err1){
                    console.log("Error selecting");
                    throw err1;
                }else{
                    console.log("Selected successfully");
                    res.render('fior_di_levante_zakynthos', {data:rows});
                }
                db.close();  
            });
        }
    });
});

/* GET ACCOMMODATIONS - USER */
app.get("/fior_di_levante_accommodation", function(req, res){
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var accommodations = dbo.collection("accommodations");
            accommodations.find({}).toArray(
            function(err1, rows){
                if (err1){
                    console.log("Error selecting");
                    throw err1;
                }else{
                    console.log("Selected successfully");
                    res.render('fior_di_levante_accommodation', {data:rows});
                }
                db.close();  
            });
        }
    });
});

/* GET EVENTS - USER */
app.get("/fior_di_levante_events", function(req, res){
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var events = dbo.collection("events");
            events.find({}).toArray(
            function(err1, rows){
                if (err1){
                    console.log("Error selecting");
                    throw err1;
                }else{
                    console.log("Selected successfully");
                    res.render('fior_di_levante_events', {data:rows});
                }
                db.close();  
            });
        }
    });
});

/* ACCOMMODATION RESERVATION PAGE - USER */
app.get("/fior_di_levante_accommodation_reservation", function(req, res){
    var name = req.query.document_name;
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var accommodations = dbo.collection("accommodations");
            accommodations.findOne({"name":name}, function(err1, query_result){
                if (err1){
                    console.log("Error selecting");
                    throw err1;
                }else{
                    console.log("Selected successfully");
                    res.render('fior_di_levante_accommodation_reservation', {data:query_result});
                }
                db.close();  
            });
        }
    });
});

/* ACCOMMODATION RESERVATION - USER */
app.post("/add_accommodation_reservation", function(req, res){
    var email = req.app.locals.user_email;
    var accommodation_name = req.body.accommodation_name;
    var check_in = req.body.checkInDay;
    var check_out = req.body.checkOutDay;
    var number_of_people = req.body.persons;
    var name = req.body.name;
    var surname = req.body.surname;
    var dob = req.body.dob;
    var id = req.body.id_number;
    var total = req.body.total;
    var card = req.body.cardType;
    var card_name = req.body.cardName;
    var card_digits_1 = req.body.digits1;
    var card_digits_2 = req.body.digits2;
    var card_digits_3 = req.body.digits3;
    var card_digits_4 = req.body.digits4;
    var card_number = card_digits_1 + card_digits_2 + card_digits_3 + card_digits_4;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var reservations = dbo.collection("reservations");
            var data = {"email": email, "accommodation": accommodation_name, "checkIn": check_in, "checkOut":check_out, "people":number_of_people, "name":name, "surname":surname, "dob":dob, "id":id, "total":total, "card":card, "name on card": card_name, "card number":card_number, "status":"reserved", "type":"accommodation"};
            reservations.insertOne(data, function(err1, query_result){
                if (err1){
                    console.log('Error inserting document');
                    throw err1;
                }else{
                    console.log('New document inserted successfully');
                    res.redirect('fior_di_levante_home');
                }
                db.close();
            });
        }
    }); 
});

/* EVENT RESERVATION PAGE - USER */
app.get("/fior_di_levante_event_reservation", function(req, res){
    var name = req.query.document_name;
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var events = dbo.collection("events");
            events.findOne({"name":name}, function(err1, query_result){
                if (err1){
                    console.log("Error selecting");
                    throw err1;
                }else{
                    console.log("Selected successfully");
                    res.render('fior_di_levante_event_reservation', {data:query_result});
                }
                db.close();  
            });
        }
    });
});

/* ADD EVENT TICKET - USER */
app.post("/add_event_tickets", function(req, res){
    var email = req.app.locals.user_email;
    var event_name = req.body.event_name;
    var event_date = req.body.event_date;
    var number_of_tickets = req.body.tickets;
    var parsed_number_of_tickets = parseInt(number_of_tickets);
    var name = req.body.name;
    var surname = req.body.surname;
    var total = req.body.total;

    console.log("parsed_number_of_tickets "+parsed_number_of_tickets);

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var reservations = dbo.collection("reservations");
            var data = {"email": email, "event":event_name,"date":event_date, "tickets":parsed_number_of_tickets, "name":name, "surname":surname, "total":total, "type":"event"};
            reservations.insertOne(data, function(err1, query_result_1){
                if (err1){
                    console.log('Error inserting document');
                    throw err1;
                }else{
                    console.log('New document inserted successfully reservation event');
                    var events = dbo.collection("events");
                    events.updateOne({"name":event_name}, {$inc: {"tickets": parsed_number_of_tickets}}, function(err2, query_result2){
                        if (err2){
                            console.log("Error increasing document field");
                            throw err1;
                        }else{
                            app.locals.reservation_id = query_result_1.insertedId;
                            console.log("Document field updated successfully");
                            res.redirect('fior_di_levante_e_ticket');
                        }
                        db.close();  
                    });
                }
            });
        }
    }); 
});

/* GET E-TICKET - ADMIN */
app.get("/fior_di_levante_e_ticket", function(req, res){
    var reservation_id = req.app.locals.reservation_id;
    
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var reservations = dbo.collection("reservations");
            reservations.findOne({"_id":new ObjectId(reservation_id)}, function(err1, rows){
                if (err1){
                    console.log("Error selecting");
                    throw err1;
                }else{
                    console.log("Selected successfully");
                    res.render('fior_di_levante_e_ticket', {data:rows});
                }
                db.close();  
            });
        }
    });
});

/* GET ACTIVITIES - USER */
app.get("/fior_di_levante_activities", function(req, res){
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var activities = dbo.collection("activities");
            activities.find({}).toArray(
            function(err1, rows){
                if (err1){
                    console.log("Error selecting");
                    throw err1;
                }else{
                    console.log("Selected successfully");
                    res.render('fior_di_levante_activities', {data:rows});
                }
                db.close();  
            });
        }
    });
});

/* GET ACTIVITIES SEARCH - USER */
app.post("/search", function(req, res){
    var search_input = req.body.search_input;
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var activities = dbo.collection("activities");
            var regex_search = new RegExp(search_input, "i");
            var condition = {"name": {$regex : regex_search}};
            activities.find(condition).toArray(
            function(err1, rows){
                if (err1){
                    console.log("Error selecting");
                    throw err1;
                }else{
                    console.log("Selected successfully");
                    res.render('fior_di_levante_activities', {data:rows});
                }
                db.close();  
            });
        }
    });
});

/* GET USER (PROFILE) - USER */
app.get("/fior_di_levante_profile", function(req, res){
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var users = dbo.collection("users");
            users.findOne({"email":req.app.locals.user_email}, function(err1, query_result){
                if (err1){
                    console.log("Error selecting");
                    throw err1;
                }else{
                    console.log("Selected successfully");
                    res.render('fior_di_levante_profile', {data:query_result});
                }
                db.close();  
            });
        }
    });
});

/* UPDATE USER (PROFILE) - USER */
app.post('/edit_profile',function(req,res){
    var name = req.body.name;
    var surname = req.body.surname;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var users = dbo.collection("users");
            var new_values = {$set:{"name": name, "surname":surname, "username":username, "email":email, "password":password}};
            users.updateOne({"email":req.app.locals.user_email}, new_values, function(err1, query_result){
                if (err1){
                    console.log("Error updating document");
                    throw err1;
                }else{
                    console.log("Document updated successfully");
                    res.redirect('fior_di_levante_profile');
                }
                db.close();  
            });
        }
    });     
});

/* GET ACTIVITIES OPTIONS IN DAY PLANNER - USER */
app.get("/fior_di_levante_day_planner", function(req, res){
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var activities = dbo.collection("activities");
            activities.find({}).toArray(
            function(err1, rows){
                if (err1){
                    console.log("Error selecting");
                    throw err1;
                }else{
                    console.log("Selected successfully");
                    res.render('fior_di_levante_day_planner', {data:rows});
                }
                db.close();  
            });
        }
    });
});

/* DAY PLANNER ADD TO ITINERARY - USER*/
app.post("/add_to_itinerary",function(req,res){
    var email = req.body.email;
    var day = req.body.day;
    var time = req.body.activity_time;
    var activity = req.body.activity;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var itineraries = dbo.collection("itineraries");
            var data = {"email": email, "date": day, "time":time, "activity":activity};
            itineraries.insertOne(data, function(err1, query_result){
                if (err1){
                    console.log('Error inserting document');
                    throw err1;
                }else{
                    console.log('New document inserted successfully');
                    res.redirect('fior_di_levante_day_planner');
                }
                db.close();
            });
        }
    });     
});

/* GET USERS - ADMIN */
app.get("/fior_di_levante_admin_users", function(req, res){
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var users = dbo.collection("users");
            users.find({}).toArray(
            function(err1, rows){
                if (err1){
                    console.log("Error selecting");
                    throw err1;
                }else{
                    console.log("Selected successfully");
                    res.render('fior_di_levante_admin_users', {data:rows});
                }
                db.close();  
            });
        }
    });
});

/* ADD USER INFO - ADMIN */
app.post('/add_user_info',function(req,res){
    var email = req.body.email;
    var field_name = req.body.field_name;
    var field_value = req.body.field_value;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var users = dbo.collection("users");
            users.updateOne({"email":email}, {$set:{[field_name]:field_value}}, function(err1, query_result){
                if (err1){
                    console.log('Error inserting new field in document');
                    throw err1;
                }else{
                    console.log('New field inserted successfully');
                    res.redirect('fior_di_levante_admin_users');
                }
                db.close();
            });
        }
    });     
});

/* UPDATE USER - ADMIN */
app.post('/update_user',function(req,res){
    var name = req.body.name;
    var surname = req.body.surname;
    var username = req.body.username;
    var email = req.body.email;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var users = dbo.collection("users");
            var new_values = {$set:{"name": name, "surname":surname, "username":username}};
            users.updateOne({"email":email}, new_values, function(err1, query_result){
                if (err1){
                    console.log("Error updating document");
                    throw err1;
                }else{
                    console.log("Document updated successfully");
                    res.redirect('fior_di_levante_admin_users');
                }
                db.close();  
            });
        }
    });     
});

/* DELETE USER - ADMIN */
app.post('/delete_user',function(req,res){
    var email = req.body.email;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var users = dbo.collection("users");
            users.deleteOne({"email":email}, function(err1, query_result){
                if (err1){
                    console.log("Error deleting document");
                    throw err1;
                }else{
                    console.log("Document deleted successfully");
                    res.redirect('fior_di_levante_admin_users');
                }
                db.close();  
            });
        }
    });     
});

/* GET LANDMARKS - ADMIN */
app.get("/fior_di_levante_admin_zakynthos", function(req, res){
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var landmarks = dbo.collection("landmarks");
            landmarks.find({}).toArray(
            function(err1, rows){
                if (err1){
                    console.log("Error selecting");
                    throw err1;
                }else{
                    console.log("Selected successfully");
                    res.render('fior_di_levante_admin_zakynthos', {data:rows});
                }
                db.close();  
            });
        }
    });
});

/* ADD LANDMARK - ADMIN */
app.post('/add_landmark',function(req,res){
    var name = req.body.name;
    var description = req.body.description;
    var image = req.body.url;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var landmarks = dbo.collection("landmarks");
            var data = {"name": name, "description":description, "image":image};
            landmarks.insertOne(data, function(err1, query_result){
                if (err1){
                    console.log('Error inserting document');
                    throw err1;
                }else{
                    console.log('New document inserted successfully');
                    res.redirect('fior_di_levante_admin_zakynthos');
                }
                db.close();
            });
        }
    });     
});

/* UPDATE LANDMARK - ADMIN */
app.post('/update_landmark',function(req,res){
    var name = req.body.name;
    var updated_name = req.body.updated_name;
    var description = req.body.description;
    var image = req.body.url;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var landmarks = dbo.collection("landmarks");
            var new_values = {$set:{"name": updated_name, "description":description, "image":image}};
            landmarks.updateOne({"name":name}, new_values, function(err1, query_result){
                if (err1){
                    console.log("Error updating document");
                    throw err1;
                }else{
                    console.log("Document updated successfully");
                    res.redirect('fior_di_levante_admin_zakynthos');
                }
                db.close();  
            });
        }
    });     
});

/* REMOVE LANDMARK - ADMIN */
app.post('/remove_landmark',function(req,res){
    var name = req.body.name;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var landmarks = dbo.collection("landmarks");
            landmarks.deleteOne({"name":name}, function(err1, query_result){
                if (err1){
                    console.log("Error deleting document");
                    throw err1;
                }else{
                    console.log("Document deleted successfully");
                    res.redirect('fior_di_levante_admin_zakynthos');
                }
                db.close();  
            });
        }
    });     
});

/* GET RESERVATIONS - ADMIN */
app.get("/fior_di_levante_admin_reservations", function(req, res){
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var reservations = dbo.collection("reservations");
            reservations.find({"type":"accommodation"}).toArray(
            function(err1, rows){
                if (err1){
                    console.log("Error selecting");
                    throw err1;
                }else{
                    console.log("Selected successfully");
                    res.render('fior_di_levante_admin_reservations', {data:rows});
                }
                db.close();  
            });
        }
    });
});

/* CANCEL RESERVATION - ADMIN */
app.get("/cancel_reservation", function(req, res){
    var document_id = req.query.cancel_id;
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var reservations = dbo.collection("reservations");
            var new_value = {$set:{"status":"cancelled"}};
            reservations.updateOne({"_id":new ObjectId(document_id)}, new_value, function(err1, query_result){
                if (err1){
                    console.log("Error updating document");
                    throw err1;
                }else{
                    console.log("Document updated successfully");
                    res.redirect('fior_di_levante_admin_reservations');
                }
                db.close();  
            });
        }
    });
});

/* GET EVENTS - ADMIN */
app.get("/fior_di_levante_admin_events", function(req, res){
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var events = dbo.collection("events");
            events.find({}).toArray(
            function(err1, rows){
                if (err1){
                    console.log("Error selecting");
                    throw err1;
                }else{
                    console.log("Selected successfully");
                    res.render('fior_di_levante_admin_events', {data:rows});
                }
                db.close();  
            });
        }
    });
});

/* ADD EVENT - ADMIN */
app.post('/add_event',function(req,res){
    var name = req.body.name;
    var date = req.body.date;
    var description = req.body.description;
    var map = req.body.map;
    var image = req.body.url;
    var price = req.body.price;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var events = dbo.collection("events");
            var data = {"name": name, "date":date, "description":description, "map":map, "image":image, "price":price, "tickets":0};
            events.insertOne(data, function(err1, query_result){
                if (err1){
                    console.log('Error inserting document');
                    throw err1;
                }else{
                    console.log('New document inserted successfully');
                    res.redirect('fior_di_levante_admin_events');
                }
                db.close();
            });
        }
    });     
});

/* UPDATE EVENT - ADMIN */
app.post('/update_event',function(req,res){
    var name = req.body.name;
    var updated_name = req.body.updated_name;
    var date = req.body.date;
    var description = req.body.description;
    var map = req.body.map;
    var image = req.body.url;
    var price = req.body.price;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var events = dbo.collection("events");
            var new_values = {$set:{"name": updated_name, "date":date, "description":description, "map":map, "image":image, "price":price}};
            events.updateOne({"name":name}, new_values, function(err1, query_result){
                if (err1){
                    console.log("Error updating document");
                    throw err1;
                }else{
                    console.log("Document updated successfully");
                    res.redirect('fior_di_levante_admin_events');
                }
                db.close();  
            });
        }
    });     
});

/* REMOVE EVENT - ADMIN */
app.post('/remove_event',function(req,res){
    var name = req.body.name;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var events = dbo.collection("events");
            events.deleteOne({"name":name}, function(err1, query_result){
                if (err1){
                    console.log("Error deleting document");
                    throw err1;
                }else{
                    console.log("Document deleted successfully");
                    res.redirect('fior_di_levante_admin_events');
                }
                db.close();  
            });
        }
    });     
});

/* GET ACTIVITIES - ADMIN */
app.get("/fior_di_levante_admin_activities", function(req, res){
    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var activities = dbo.collection("activities");
            activities.find({}).toArray(
            function(err1, rows){
                if (err1){
                    console.log("Error selecting");
                    throw err1;
                }else{
                    console.log("Selected successfully");
                    res.render('fior_di_levante_admin_activities', {data:rows});
                }
                db.close();  
            });
        }
    });
});

/* ADD ACTIVITY - ADMIN */
app.post('/add_activity',function(req,res){
    var name = req.body.name;
    var category = req.body.category;
    var image = req.body.url;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var activities = dbo.collection("activities");
            var data = {"name": name, "category":category, "image":image};
            activities.insertOne(data, function(err1, query_result){
                if (err1){
                    console.log('Error inserting document');
                    throw err1;
                }else{
                    console.log('New document inserted successfully');
                    res.redirect('fior_di_levante_admin_activities');
                }
                db.close();
            });
        }
    });     
});

/* UPDATE ACTIVITY - ADMIN */
app.post('/update_activity',function(req,res){
    var name = req.body.name;
    var updated_name = req.body.updated_name;
    var category = req.body.category;
    var image = req.body.url;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var activities = dbo.collection("activities");
            var new_values = {$set:{"name": updated_name, "category":category, "image":image}};
            activities.updateOne({"name":name}, new_values, function(err1, query_result){
                if (err1){
                    console.log("Error updating document");
                    throw err1;
                }else{
                    console.log("Document updated successfully");
                    res.redirect('fior_di_levante_admin_activities');
                }
                db.close();  
            });
        }
    });     
});

/* REMOVE ACTIVITY - ADMIN */
app.post('/remove_activity',function(req,res){
    var name = req.body.name;

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('MongoDB connection failed!');
            throw err;
        }else{
            console.log('MongoDB connection successful!');
            var dbo = db.db("zakynthosDB");
            var activities = dbo.collection("activities");
            activities.deleteOne({"name":name}, function(err1, query_result){
                if (err1){
                    console.log("Error deleting document");
                    throw err1;
                }else{
                    console.log("Document deleted successfully");
                    res.redirect('fior_di_levante_admin_activities');
                }
                db.close();  
            });
        }
    });     
});