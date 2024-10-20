const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  fs.readdir(`./files`, function (err, files) {
    const message = req.query.message || ""; // Capture the message from the query string
    res.render("index", { files: files, message: message });
  });
});

app.post("/create", function (req, res) {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.detail,
    function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    }
  );
});

app.get("/file/:filename", function (req, res) {
  fs.readFile(
    `./files/${req.params.filename}`,
    "utf-8",
    function (err, fileData) {
      if (err) {
        console.log(err);
      } else {
        res.render("show", {
          filename: req.params.filename,
          fileData: fileData,
        });
      }
    }
  );
});

app.get("/edit/:filename", function (req, res) {
  fs.readFile(
    `./files/${req.params.filename}`,
    "utf-8",
    function (err, fileData) {
      if (err) {
        console.log(err);
      } else {
        res.render("edit", {
          filename: req.params.filename,
          fileData: fileData,
        });
      }
    }
  );
});

app.post("/update/:filename", function (req, res) {
  const oldPath = `./files/${req.params.filename}`;
  const newPath = `./files/${req.body.newName}`;

  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      console.log(err);
    } else {
      // Redirect with a success message
      res.redirect("/?message=File updated successfully");
    }
  });
});

// app.post("file/:filename", function (req, res) {
//   fs.unlink(`./files/${req.params.filename}`, function (err) {
//     if (err) {
//       console.log(err);
//       throw err;
//     } else {
//       res.render("index");
//     }
//   });
// });

app.get("/test", function (res, req) {
  req.send("hello worldtest");
});

app.listen(3000);
