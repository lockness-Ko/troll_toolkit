let menuS = ["m1","m2","m3","m4","m5"];
let channels = [];
let users = [];

document.querySelectorAll("#channelinput").forEach(element => {
    autocomplete(element, []);
});

let cM = (s) => {
    s.className = "active";
    document.querySelectorAll("#"+s.id).forEach((g)=>{g.className = "active"});
    menuS.filter((x)=>{return x!=s.id;}).forEach(element => {
        document.querySelectorAll("#"+element).forEach((g)=>{g.className = ""});
    });
}

let unNuke = (e) => {
    fetch(`/unnuke`);
}

let Nuke = (e) => {
    fetch(`/nuke?channel=${channels.find((x)=>{return x.name == e.parentElement.children[2].children[0].value&&parseInt(x.id)}).id||"all"}&msg=${e.parentElement.children[5].value}`);   
}

let AddBot = (e) => {
    let botList = document.getElementById("botlist");
    botList.innerHTML = "";
    if(e=="j"){
        fetch("/loadbots?id=j").then(x=>{x.json().then((z)=>{
            // console.log(z);
            z.forEach(bottoken => {
                let t = document.createElement("li");
                t.textContent = `${bottoken}`;
                botList.appendChild(t);
            });
        })});
    }else{
        console.log(e.parentElement.children[1].value);
        fetch("/loadbots?id="+e.parentElement.children[1].value).then(x=>{x.json().then((z)=>{
            // console.log(z);
            z.forEach(bottoken => {
                let t = document.createElement("li");
                t.textContent = `${bottoken}`;
                botList.appendChild(t);
            });
        })});
    }
    
}

let AutoReply = (e) => {
    fetch("/autoreply?msg="+e.parentElement.children[1].value);
}

let Message = (e) => {
    fetch(`/saymessage?channel=${channels.find((x)=>{return x.name == e.parentElement.children[2].children[0].value&&parseInt(x.id)}).id}&msg=${e.parentElement.children[5].value}`);   

    // console.log(channels.find((x)=>{return x.name == e.parentElement.children[2].children[0].value&&parseInt(x.id)}).id)
}

let SetServer = (e) => {
    let chanList = document.getElementById("channellist");
    let userList = document.getElementById("userlist");
    chanList.innerHTML = "";
    userList.innerHTML = "";
    fetch("/serverscope?guid="+e.parentElement.children[1].value).then(x=>{x.json().then((z)=>{
        channels = z[0];
        users = z[1];
        z[0].forEach(channel => {
            let t = document.createElement("li");
            t.textContent = `${channel.name}: ${channel.id}`;
            chanList.appendChild(t);
        });
        z[1].forEach(user => {
            let t = document.createElement("li");
            t.textContent = `${user.name}: ${user.id}`;
            userList.appendChild(t);
        });
        
        // autocomplete(document.getElementById("channelinput"), );
        document.querySelectorAll("#channelinput").forEach(element => {
            autocomplete(element, channels.map((x)=>{return x.name;}));
        });
    })});
    e.parentElement.children[1].value = "";
}

// I am back