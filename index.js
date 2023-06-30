// var clicked;

var submit = document.getElementById('submit');
var container_right = document.getElementById('container_right');
var container_right_clone = document.getElementById('container_right_clone')
var new_question_form = document.getElementsByClassName('new_question_form')[0];

var updateList = function (dataArray) {
    var output = document.getElementById('output');
    dataArray.sort(function (a, b) {
        if (a.favorate && !b.favorate) {
            return -1;
        }
        else if (!a.favorate && b.favorate) {
            return 1;
        }
        else {
            if(a.upvote-a.downvote > b.upvote-b.downvote) return -1;
            else if(a.upvote-a.downvote < b.upvote-b.downvote) return 1;
            else{
                if(a.upvote > b.upvote)return -1;
                else return 1;
            }
        }
    });
    localStorage.setItem('dataArray',JSON.stringify(dataArray));
    var str = '';
    var counter = 0;
    // dataArray = JSON.parse(localStorage.getItem('dataArray'))
    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].favorate===true) {
            str = str + `
            <div class="out_div" id="${counter}" onclick="openDiscussion(this)">
                
                <h5> <b>${dataArray[i].subject} </b></h5>
                <p> ${dataArray[i].question}</p>
                <div class="favorate_up_down">
                    <span onclick="upVote(event,this)"><i>&#128077 ${dataArray[i].upvote}</i></span>
                    <span onclick="downVote(event,this)"><i>&#128078 ${dataArray[i].downvote}</i></span>
                    <span style="color:red"><input id="favorate" type="checkbox" onclick="makeFavorate(event,this)" checked/>&#10084</span>
                </div>
                <small>
                    <p>
                        ${dataArray[i].timeStamp}
                    </p>
                </small>
            </div>
            `
        }
        else {
            str = str + `
            <div class="out_div " id="${counter}" onclick="openDiscussion(this)">
                
                <h5> <b>${dataArray[i].subject} </b></h5>
                <p> ${dataArray[i].question}</p>
                <div class="favorate_up_down" >
                    <span onclick="upVote(event,this)"><i>&#128077 ${dataArray[i].upvote}</i></span>
                    <span onclick="downVote(event,this)"><i>&#128078 ${dataArray[i].downvote}</i></span>
                    <span style="color:red"><input id="favorate" type="checkbox" onclick="makeFavorate(event,this)" />&#10084</span>
                </div>
                <small>
                    <p>
                        ${dataArray[i].timeStamp}
                    </p>
                </small>
            </div>
            `
        }
        localStorage.setItem('dataArray',JSON.stringify(dataArray));
        counter++;
    }
    output.innerHTML = str;
}

new_question_form.addEventListener('click', () => {
    container_right.style.display = "block"
    container_right_clone.style.display = 'none'
})

function makeFavorate(event,element) {
    event.stopPropagation()
    dataArray = JSON.parse(localStorage.getItem('dataArray'));
    if (element.checked) {
        dataArray[parseInt(element.parentNode.parentNode.parentNode.id)].favorate = true;
    }
    else {
        dataArray[parseInt(element.parentNode.parentNode.parentNode.id)].favorate = false;
    }
    updateList(dataArray);
}

function openDiscussion(element) {
    dataArray = JSON.parse(localStorage.getItem('dataArray'));
    clicked = parseInt(element.id);
    container_right.style.display = "none"
    container_right_clone.style.display = 'block'
    var str = `
        <h4><b>Topic: ${dataArray[clicked].subject}</b></h4>
        <p>Q. ${dataArray[clicked].question}</p>
        <span><i>Likse: ${dataArray[clicked].upvote}</i></span>
        <span"><i>Dislikes: ${dataArray[clicked].downvote}</i></span>
        <button class="${clicked}" id="resolve">Resolve</button>
    `;
    document.getElementById('content').innerHTML = str;
    
    //to resolve
    var resolve = document.getElementById('resolve');
    resolve.addEventListener('click', () => {
        dataArray = JSON.parse(localStorage.getItem('dataArray'));
        if (dataArray.length) {
            dataArray.splice(clicked, 1);
            container_right.style.display = "block"
            container_right_clone.style.display = 'none'
            updateList(dataArray);
        }
    })
    printResponses(clicked);
    
    //for adding response
    var response_submit = document.getElementById('addResponse_btn');
    response_submit.addEventListener('click', () => {
        dataArray = JSON.parse(localStorage.getItem('dataArray'));
        
        var name = document.getElementById('name').value;
        var comment = document.getElementById('comment').value;
        var like =0;
        var dislike=0;
        document.getElementById('name').value = '';
        document.getElementById('comment').value = '';
        if (name == '' || comment == '') return;
        
        var responses = dataArray[clicked].allResponse;

        responses.push({ name, comment,like ,dislike});
        
        dataArray[clicked].allResponse = responses;
        localStorage.setItem('dataArray',JSON.stringify(dataArray))
        printResponses(clicked);
    })
}

function upVote(event,element){
    event.stopPropagation()
    dataArray = JSON.parse(localStorage.getItem('dataArray'));
    var like = dataArray[parseInt(element.parentNode.parentNode.id)].upvote;
    dataArray[parseInt(element.parentNode.parentNode.id)].upvote = like+1;
    updateList(dataArray);
}
function downVote(event,element){
    event.stopPropagation()
    dataArray = JSON.parse(localStorage.getItem('dataArray'));
    var dislike = dataArray[parseInt(element.parentNode.parentNode.id)].downvote;
    dataArray[parseInt(element.parentNode.parentNode.id)].downvote = dislike+1;
    updateList(dataArray);
}

var printResponses = function (clicked) {
    dataArray = JSON.parse(localStorage.getItem('dataArray'))
    
    var responseDiv = document.getElementById('response');
    var responses = dataArray[clicked].allResponse;
    //sort response and set to responses map
    responses.sort(function(a,b){
        if(a.like-a.dislike > b.like-b.dislike) return -1;
        else if(a.like-a.dislike < b.like-b.dislike) return 1;
        else{
            if(a.like > b.like)return -1;
            else return 1;
        }
    })
    
    dataArray[clicked].allResponse = responses;
    localStorage.setItem('dataArray',JSON.stringify(dataArray));
    var str = '';
    for (let i = 0; i < responses.length; i++) {
        str = str + `
            <div class="unit_response">
                <h3>${responses[i].name}</h3>
                <p>${responses[i].comment}</p>
                <span onclick="likeComment(${clicked},${i})"><i>&#128077 ${responses[i].like}</i></span>
                <span onclick="dislikeComment(${clicked},${i})"><i>&#128078 ${responses[i].dislike}</i></span>
            </div>
        `
    }
    responseDiv.innerHTML = str;
    return;
}
function likeComment(clicked,idx){
    // allResponse = new Map(JSON.parse(localStorage.getItem('allResponse')))
    // var response = allResponse.get(key);
    dataArray = JSON.parse(localStorage.getItem('dataArray'))
    responses = dataArray[clicked].allResponse;
    var like = responses[idx].like;
    responses[idx].like = like+1;
    dataArray[clicked].allResponse = responses;
    localStorage.setItem('dataArray',JSON.stringify(dataArray));
    printResponses(clicked);
}
function dislikeComment(clicked,idx){
    // allResponse = new Map(JSON.parse(localStorage.getItem('allResponse')))
    // var response = allResponse.get(key);
    dataArray = JSON.parse(localStorage.getItem('dataArray'));
    responses = dataArray[clicked].allResponse;
    var dislike = responses[idx].dislike;
    responses[idx].dislike = dislike+1;
    dataArray[clicked].allResponse = responses;
    localStorage.setItem('dataArray',JSON.stringify(dataArray));
    printResponses(clicked)
}
submit.addEventListener('click', () => {
    var subject = document.getElementById('subject').value;
    var question = document.getElementById('question').value;
    var favorate = false;
    var upvote = 0;
    var downvote = 0;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var timeStamp = date+' '+time;
    var allResponse = [];
    if (subject == '' || question == '') return;
    
    var dataArray = [];
    dataArray = JSON.parse(localStorage.getItem('dataArray'));
    
    dataArray.push({ subject, question, favorate ,upvote,downvote, timeStamp ,allResponse});
    document.getElementById('subject').value = '';
    document.getElementById('question').value = '';
    updateList(dataArray);
})

const search = document.getElementById('search');
function searching(){
    var word = ((search.value).trim()).toLowerCase();
    dataArray = JSON.parse(localStorage.getItem('dataArray'));
    var output = document.getElementById('output');
    var str = '';
    var counter=0;
    for(let i=0;i<dataArray.length;i++){
        var ques = (dataArray[i].question).toLowerCase();
        var sub = (dataArray[i].subject).toLowerCase();
        var data = ques+sub;
        if(data.includes(word)){
            if (dataArray[i].favorate===true) {
                str = str + `
                <div class="out_div" id="${counter}" >
                    
                    <h5 onclick="openDiscussion(this)"> <b>${dataArray[i].subject} </b></h5>
                    <p onclick="openDiscussion(this)"> ${dataArray[i].question}</p>
                    <div class="favorate_up_down">
                        <span onclick="upVote(this)"><i>&#128077 ${dataArray[i].upvote}</i></span>
                        <span onclick="downVote(this)"><i>&#128078 ${dataArray[i].downvote}</i></span>
                        <span style="color:red"><input id="favorate" type="checkbox" onclick="makeFavorate(this)" checked/>&#10084</span>
                    </div>
                    <small>
                        <p>
                            ${dataArray[i].timeStamp}
                        </p>
                    </small>
                </div>
                `
            }
            else{
                str = str + `
                <div class="out_div " id="${counter}" >
                    <h5 onclick="openDiscussion(this)"> <b>${dataArray[i].subject} </b></h5>
                    <p onclick="openDiscussion(this)"> ${dataArray[i].question}</p>
                    <div class="favorate_up_down" >
                        <span onclick="upVote(this)"><i>&#128077 ${dataArray[i].upvote}</i></span>
                        <span onclick="downVote(this)"><i>&#128078 ${dataArray[i].downvote}</i></span>
                        <span style="color:red"><input id="favorate" type="checkbox" onclick="makeFavorate(this)" />&#10084</span>
                    </div>
                    <small>
                        <p>
                            ${dataArray[i].timeStamp}
                        </p>
                    </small>
                </div>
                `
            }
        }
        counter++;
    }
    output.innerHTML = str;
}

if(localStorage.getItem('dataArray')===null){
    var dataArray=[];
    localStorage.setItem('dataArray',JSON.stringify(dataArray));
}
else{
    dataArray = JSON.parse(localStorage.getItem('dataArray'));
    updateList(dataArray);
}


