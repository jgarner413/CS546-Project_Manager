
function getTime(){
    try {
        var x = document.getElementsByClassName("timespent");
        console.log("!!!!!!!!!!")
        console.log(x)

    } catch (error) {
        console.log(error)
    }

}

function attempts(){
    let input = document.getElementById("deadline").value;
    if(input){
        let attempt = document.getElementById("li");
        if (palindromeChecker(input)){
            attempt.setAttribute("class", "is-palindrome")
        }
        else{
            attempt.setAttribute("class", "not-palindrome")
        }
        let text = document.createTextNode(input);
        attempt.appendChild(text);
        document.getElementById("attempts").appendChild(attempt);
        document.getElementById("phrase").innerHTML = "";
    }
    else{
        alert("No input found")
    }
};
function dateCheck(initialDate){
    let today = new Date();
    if(Date.parse(initialDate) < Date.parse(today)){
        return true;
    } else {
        return false
        }
    };

