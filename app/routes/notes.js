'use strict';

var Note = require('../models/note');
var moment = require('moment');

exports.index = function(req, res){
  console.log('inside notes.index');
  Note.findByUserIdLimit(req.session.userId, function(notes){
    res.render('user/notes', {title:'Welcome', moment:moment, notes:notes});
  });
};

exports.fresh = function(req, res){
  res.render('notes/new', {title:'New Note'});
};

exports.show = function(req, res){
  Note.findById(req.params.id, function(note){
    res.send({note:note});
  });
};

exports.searchByTitle = function(req, res){
  var title = req.params.title.toString();
  //title = title.replace('-', ' ');
  console.log('inside routes title: '+title);
  Note.findByTitle(req.session.userId, title, function(notes){
    res.send({notes:notes});
  });
};

exports.sortByDate = function(req, res){
  Note.findDate(req.session.userId, function(notes){
    res.send({notes:notes});
  });
};

exports.sortByAlpha = function(req, res){
  Note.findAlpha(req.session.userId, function(notes){
    res.send({notes:notes});
  });
};

exports.create = function(req, res){
  console.log('session UserId: '+req.session.userId);
  req.body.userId = req.session.userId;
  var note = new Note(req.body);
  note.insert(function(){
    Note.findByUserIdLimit(req.session.userId, function(notes){
      res.render('user/notes', {title:'new note created', moment:moment, notes:notes});
    });
  });
};

exports.update = function(req, res){
  var id = req.params.id;
  var pic = req.body.photo.split();
  console.log('pic: '+pic);
  req.body.photo = pic;
  var note = new Note(req.body);
  note.update(id, function(count){
    res.send({count:count});
  });
};

exports.addPic = function(req, res){
  var id = req.params.id;
  Note.findById(id, function(note){
    console.log('after findById: '+note.tags);
    note.tags = note.tags.toString();
    note.userId = note.userId.toString();
    console.log('note.photo: '+note.photo.toString());
    var newNote = new Note({title:note.title, body:note.body, dateCreated:note.dateCreated, photo:note.photo, tags:note.tags, userId:note.userId});
    newNote.addPhoto(req.files.photo.path, function(){
      newNote.update(id, function(count){
        res.redirect('/notes');
      });
    });
  });
};

exports.updateBody = function(req, res){
  var id = req.params.id;
  var body = req.body.body;
  Note.updateBody(id, body, function(count){
    res.send({count:count});
  });
};

exports.destroy = function(req, res){
  Note.findByIdAndDelete(req.params.id, function(){
    res.redirect('/notes');
  });
};
