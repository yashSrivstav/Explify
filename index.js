var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var assert = require('assert');
var path = require('path');
var alert = require('alert');
var multer = require('multer');

const { response } = require("express");
const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect('mongodb://localhost:27017/ExplifyDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"))

app.post("/SignUp", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.pass;
    var re = req.body.re_pass;

    db.collection('students').findOne({ email: email }, function (err, foundObject) {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        else {
            if (foundObject != null) {
                alert("Email already exist");
                return res.redirect('/indexFolder/SignUp-SignIN/SignUp.html');
            }
            else {
                if (password === re) {
                    var data = {
                        "name": name,
                        "email": email,
                        "password": password
                    }


                    db.collection('students').insertOne(data, (err, collection) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Record Inserted Successfully");
                    });

                    return res.redirect('/indexFolder/ProfileUpdateStu/oneTimeUpdation.html')
                }
                else {
                    alert("Password dosn't match");
                    return res.redirect('/indexFolder/SignUp-SignIN/SignUp.html');
                }
            }
        }
    })
})

app.post("/ContactUs", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var subject = req.body.subject;
    var message = req.body.message;

    var data = {
        "name": name,
        "email": email,
        "subject": subject,
        "message": message
    }
    db.collection('contactUs').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Successfully");
    });
    alert("Message Sent Successfully");
    return res.redirect('/indexFolder/index.html');

})

app.post("/SignUporg", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.pass;
    var re = req.body.re_pass;
    db.collection('organizations').findOne({ email: email }, function (err, foundObject) {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        else {
            if (foundObject != null) {
                alert("Email already exist");
                return res.redirect('/indexFolder/SignUp-SignIN/SignUporg.html');
            }
            else {
                if (password === re) {
                    var data = {
                        "name": name,
                        "email": email,
                        "password": password
                    }


                    db.collection('organizations').insertOne(data, (err, collection) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Record Inserted Successfully");
                    });

                    return res.redirect('/indexFolder/OrganizationDash/OrganizationDash.html')
                }
                else {
                    alert("Password doesn't Match");
                    return res.redirect('/indexFolder/SignUp-SignIN/SignUporg.html');
                }
            }
        }
    })


})
var Storage = multer.diskStorage({
    destination: "./public/upload/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: Storage
}).single('myfile');

app.post("/oneTimeedit", upload, (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var expertise = req.body.expertise;
    var course = req.body.course;
    var about = req.body.about;
    var skills = req.body.skills;
    var exp = req.body.exp;
    var img = req.file.filename;

    var data = {
        "name": name,
        "email": email,
        "expertise": expertise,
        "course": course,
        "about": about,
        "skills": skills,
        "exp": exp,
        "img": img
    }


    db.collection('studentprofile').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('/indexFolder/StudentDash/dashboard.html');
})

app.post("/createJob", (req, res) => {
    var Orgname = req.body.name;
    var Email = req.body.email;
    var Designation = req.body.desig;
    var SkillsReq = req.body.skillsreq;
    var Stipend = req.body.stipend;
    var Description = req.body.description;
    var Orgabout = req.body.aboutorg;

    var data = {
        "Orgname": Orgname,
        "Email": Email,
        "Designation": Designation,
        "SkillsReq": SkillsReq,
        "Stipend": Stipend,
        "DesDescription": Description,
        "Orgabout": Orgabout
    }


    db.collection('jobs').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('/indexFolder/OrganizationDash/OrganizationDash.html');
})


app.post("/SignIn", (req, res) => {
    var resultArr = [];
    var email = req.body.your_email;
    var password = req.body.your_pass;
    var cursor = db.collection('students').find();
    cursor.forEach(function (doc) {
        assert.notEqual(null, doc);
        resultArr.push(doc);
    }, function (err, doc) {
        assert.equal(null, err);
        // console.log(resultArr);
        for (let i = 0; i < resultArr.length; i++) {
            if (resultArr[i].email === email && resultArr[i].password === password) {
                return res.redirect("/indexFolder/StudentDash/dashboard.html");
            }
            else {
                continue;
            }
        }
        alert("Wrong Credentials");
        return res.redirect("/indexFolder/SignUp-SignIN/SignIn.html");
    });
});
app.post("/SignInorg", (req, res) => {
    var resultArr = [];
    var email = req.body.your_email;
    var password = req.body.your_pass;
    var cursor = db.collection('organizations').find();
    cursor.forEach(function (doc) {
        assert.notEqual(null, doc);
        resultArr.push(doc);
    }, function (err, doc) {
        assert.equal(null, err);
        // console.log(resultArr);
        for (let i = 0; i < resultArr.length; i++) {
            if (resultArr[i].email === email && resultArr[i].password === password) {
                return res.redirect("/indexFolder/OrganizationDash/OrganizationDash.html");
            }
            else {
                continue;
            }
        }
        alert("Wrong Credentials");
        return res.redirect("/indexFolder/SignUp-SignIN/SignInorg.html");
    });
});

app.post('/updatePassStu', function (req, res) {
    var email = req.body.email;
    var currentP = req.body.psw;
    var updatedP = req.body.neWpsw;
    var updatedPc = req.body.pswrepeat;


    db.collection('students').findOne({ email: email }, function (err, foundObject) {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        else {
            if (foundObject.password === currentP) {
                if (updatedP === updatedPc) {
                    var data = {
                        $set: { "password": updatedP }
                    }
                    db.collection('students').updateOne(foundObject, data, function (err, result) {
                        if (err) {
                            throw err;
                        }
                        else {
                            console.log("one record updated");
                            alert("Password Updated");
                            return res.redirect('/indexFolder/ProfileUpdateStu/accountSettings.html');
                        }
                    });
                    // foundObject.password = updatedP;
                }
                else {
                    alert("New Password dosn't match");
                    return res.redirect('/indexFolder/ProfileUpdateStu/accountSettings.html');
                }
            }
            else {
                alert("Password dosn't match to the old password");
                return res.redirect('/indexFolder/ProfileUpdateStu/accountSettings.html');

            }
        }
    });

});

app.post('/updatePassOrg', function (req, res) {
    var email = req.body.email;
    var currentP = req.body.psw;
    var updatedP = req.body.neWpsw;
    var updatedPc = req.body.pswrepeat;


    db.collection('organizations').findOne({ email: email }, function (err, foundObject) {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        else {
            if (foundObject.password === currentP) {
                if (updatedP === updatedPc) {
                    var data = {
                        $set: { "password": updatedP }
                    }
                    db.collection('organizations').updateOne(foundObject, data, function (err, result) {
                        if (err) {
                            throw err;
                        }
                        else {
                            console.log("one record updated");
                            alert("Password Updated");
                            return res.redirect('/indexFolder/ProfileOrg/accountSettings.html');
                        }
                    });
                    // foundObject.password = updatedP;
                }
                else {
                    alert("New Password dosn't match");
                    return res.redirect('/indexFolder/ProfileOrg/accountSettings.html');
                }
            }
            else {
                alert("Password dosn't match to the old password");
                return res.redirect('/indexFolder/ProfileOrg/accountSettings.html');

            }
        }
    });

});

app.post('/personalUpdateStu', upload, function (req, res) {
    var expertise = req.body.expertise;
    var email = req.body.email;
    var course = req.body.course;
    var about = req.body.about;
    var skills = req.body.skills;
    var exp = req.body.exp;
    console.log(req.file);
    if (req.file != undefined) {
        var img = req.file.filename;
    }

    db.collection('studentprofile').findOne({ email: email }, function (err, foundObject) {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        else {
            if (req.file != undefined) {
                var data = {
                    $set: { "expertise": expertise, "course": course, "about": about, "skills": skills, "exp": exp, "img": img }
                }
            }
            else {
                var data = {
                    $set: { "expertise": expertise, "course": course, "about": about, "skills": skills, "exp": exp }
                }
            }

            db.collection('studentprofile').updateOne(foundObject, data, function (err, result) {
                if (err) {
                    throw err;
                }
                else {
                    console.log("one record updated");
                    alert("Records Updated Successfully");
                    return res.redirect('/indexFolder/ProfileUpdateStu/index.html');
                }
            });
            // foundObject.password = updatedP;
        }

    });

});

app.get("/api", (req, res) => {
    var arr = [];
    var cursor = db.collection('students').find();
    cursor.forEach(function (doc) {
        assert.notEqual(null, doc);
        arr.push(doc);
    }, function (err, doc) {
        assert.equal(null, err);
        res.json({ test: arr });
    });

});
app.get("/Orgapi", (req, res) => {
    var arr = [];
    var cursor = db.collection('organizations').find();
    cursor.forEach(function (doc) {
        assert.notEqual(null, doc);
        arr.push(doc);
    }, function (err, doc) {
        assert.equal(null, err);
        res.json({ test: arr });
    });

});
app.get("/edit", (req, res) => {
    var arr = [];
    var cursor = db.collection('studentprofile').find();
    cursor.forEach(function (doc) {
        assert.notEqual(null, doc);
        arr.push(doc);
    }, function (err, doc) {
        assert.equal(null, err);
        res.json({ test: arr });
    });

});
app.get("/jobsData", (req, res) => {
    var arr = [];
    var cursor = db.collection('jobs').find();
    cursor.forEach(function (doc) {
        assert.notEqual(null, doc);
        arr.push(doc);
    }, function (err, doc) {
        assert.equal(null, err);
        res.json({ test: arr });
    });

});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('/indexFolder/index.html');
}).listen(3000);


console.log("Listening on PORT 3000");
