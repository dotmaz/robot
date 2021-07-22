// Include jQuery
(function(){
    function show(elem){
        try{
            elem.style.display = "block";
        }catch(error){
            return false;
        }
        return true;
    }
    function hide(elem){
        try{
            elem.style.display = "none";
        }catch(error){
            return false;
        }
        return true;
    }

    var widget_open = false;
    var widget_uuid = "robot-widget-" + Date.now().toString();
    attachjQuery();
    
    function attachjQuery(){
        let elem = document.createElement('script');
        elem.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
        elem.onload = attachStylesheet;
        document.body.append(elem);
    }
    function attachStylesheet(){
        let elem = document.createElement('link');
        elem.rel = "stylesheet";
        elem.href = "http://localhost:3000/robot_styles.css";
        elem.onload = attachWidget;
        document.body.append(elem);
    }
    function attachWidget(){
        let btn = document.createElement('a');
        btn.innerText = "Open Robot"
        btn.classList.add('robot-widget-button');
        btn.onclick = openWidget;
        document.body.append(btn);

        let elem = document.createElement('div');
        elem.id = widget_uuid;
        elem.classList.add('robot-widget');
        elem.style.display = "none";
        elem.innerHTML = `
            <h2>Robot</h2>
            <p>What would you like to do?</p>
            <input type="text">
            <button onclick="submit()">Submit</button>
        `
        document.body.append(elem);
    }
    
    function openWidget(){
        if(widget_open){
            hide(document.getElementById(widget_uuid));
            widget_open = false;
        }else{
            show(document.getElementById(widget_uuid));
            widget_open = true;
        }
    }

    
})();

function submit(){
    $.ajax({
        type: 'POST',
        url: "http://localhost:3000/message",
        data: {
            message: document.querySelector('input').value
        },
        success: function(res){
            console.log(res);
        },
        error: function(error){
            console.log(error);
        }});
}