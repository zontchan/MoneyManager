/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {

const {url, data, method, responseType, callback} = options;
/*const xhr = new XMLHttpRequest();
xhr.responseType = 'json';
let newURL;
let formData;



if(method.toLowerCase() == 'get'){
    if(data){
        for(let [name, value] of Object.entries(data)){
            //if(name == 'mail') {
                //newURL = this.url + '?' + name + '='+value;

            //}
           // if(name == 'password'){
               // newURL+='&'+name+'='+value;

           // }
            if(name === 'id'){
                name = 'account_id';
            }
            if(!newURL){
                newURL = '/?'+name+'='+value;
            }
                newURL+='&'+name+'='+value;
        }
        try{
            xhr.open(this.method, newURL);
            xhr.send();
            xhr.onreadystatechange = () =>{
                if(xhr.readyState === 4 && xhr.status === 200){
                    callback(null, xhr.response);
                }
            }
        }
        catch (e) {
            callback(e, null);
        }
    }
}
else{
    if(data){
        formData = new FormData();
        for (let [name, value] of Object.entries(data)) {
            formData.append(name, value);
        }
        try {
            xhr.open(this.method, this.url);
            console.log(this.url, this.method);
            xhr.send(formData);
            xhr.onreadystatechange = () =>{
                if(xhr.readyState === 4 && xhr.status === 200){
                    callback(null, xhr.response);
                }
            }
        }
        catch (e) {
            callback(e, null);
            console.log(e);
        }
    }
}
*/




let formData, searchUrl;

const xhr = new XMLHttpRequest();
xhr.responseType = 'json';


if(method.toLowerCase() == 'get') {
    if (data) {
        for(let [key, value] of Object.entries(data)){
            if(key === 'id'){
                key = 'account_id';
            }
            if(!searchUrl){
                searchUrl = '/?'+key+'='+value;
            }
                searchUrl+='&'+key+'='+value;
        }
    }
}
else{
    formData = new FormData;
    if(data) {
        for (let [key, value] of Object.entries(data)) {
            formData.append(key, value);
        }
    }

}

try{
    xhr.open(method, url+(searchUrl||''));
    xhr.send(formData||null);
}
catch(e){
    callback(e);
}


xhr.onload = function (){
    if(xhr.status != 200){
        callback(err, xhr.response);
    }
    else{
        callback(null, xhr.response);
    }

}

xhr.onerror = function (){
 throw Error('Произошла ошибка, запрос не удался');
}
};
