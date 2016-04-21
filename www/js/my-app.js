// 
var db = null;

document.addEventListener("deviceready", function(){
    
    db = window.sqlitePlugin.openDatabase({name: "note.db"});
    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS note (name text primary key, data text)");
    }, function(err){
        alert("An error occurred while initializing the app");
    });
}, false);

function add()
{
    var name = document.getElementById("name").value;
    var text = document.getElementById("note-text").value;

    if(name == "")
    {
        alert("Please enter name");
        return;
    }

    if(text == "")
    {
        alert("Please enter text");
        return;
    }

    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO note (name, data) VALUES (?,?)", [name, text], function(tx,res){
            alert("Note Added");    
        });
    }, function(err){
        alert("An error occured while saving the note");
    });
}