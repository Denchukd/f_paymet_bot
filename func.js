const TelegramApi = require('node-telegram-bot-api')
const fs = require('fs-js')
const project = require('./project_name.json')
const { request } = require('https')
const { type } = require('os')
const { text } = require('stream/consumers')
const token = '5732856063:AAHffRbevyu2Bvto_q9nT4WY0GslbrEOaJE'
const bot = new TelegramApi(token,{polling:false})


saveMsg= async (fileName,arrData,type)=>{
    fs.exists(fileName, async function(exists) {
        if (exists) {
            console.log("yes file exists");
            fs.readFile(fileName, async function readFileCallback(err, data) {
                if (err) {
                    console.log('error');
                    return ;
                } else {
                    var obj = JSON.parse(data);
                    if (type == 'bot'){ 
                        console.log(arrData);
                       await obj.msgIdToDelete.push(arrData.message_id); 
                    } else {
                        await obj.msgIdToDelete.push(arrData) ;
                    };
                    fs.writeFileSync(fileName, JSON.stringify(obj),(err)=>{console.log(err)});
                    return ;
                };
            });
            return ;
        };
        return ;
    });
    return ;
};
addJsone = async (fileName, arr , chatId)=>{
    await fs.exists(fileName, async function(exists) {
        if (exists) {
            console.log("yes file exists");
            await fs.readFile(fileName, async function readFileCallback(err, data) {
                if (err) {
                    var rez = await bot.sendMessage(chatId,msgErr);
                    await saveMsg(fileName,rez,'bot');
                    return ;
                } else {
                    var obj = JSON.parse(data);
                    if (newReq == false){
                        for(var i = 0 ; i < arr.length ;i++){
                            Object.assign(obj, arr[i]);
                        }
                    } else {
                        for(var i = 0 ; i < arr.length ;i++){
                            Object.assign(obj.request, arr[i]);
                        }
                    }
                    await fs.writeFileSync(fileName, JSON.stringify(obj),(err)=>{console.log(err)});
                    return ;
                };
            });
            return ;
        };
        return ;
    });
    return ;
};

module.exports ={
    addJson : async (fileName,msgOk ,msgErr , arr , chatId , prj , sm , newReq)=>{
        fs.exists(fileName, function(exists) {
            if (exists) {
                console.log("yes file exists");
                fs.readFile(fileName, async function readFileCallback(err, data) {
                    if (err) {
                        var rez = await bot.sendMessage(chatId,msgErr);
                        console.log(rez);
                        saveMsg(fileName,rez,'bot');
                        return ;
                    } else {
                        var obj = JSON.parse(data);
                        if (newReq == false){
                            for(var i = 0 ; i < arr.length ;i++){
                                Object.assign(obj, arr[i]);
                            };
                        } else {
                            for(var i = 0 ; i < arr.length ;i++){
                                Object.assign(obj.request, arr[i]);
                            };
                        };
                        console.log(obj);
                        var rm =  JSON.stringify({
                            keyboard:[[{"text":"Новая заявка"}]] ,
                            is_persistent : true,
                            one_time_keyboard : true ,
                            resize_keyboard:true 
                        });
                        var btn = { reply_markup: rm };
                        console.log(obj);
                        fs.writeFileSync(fileName, JSON.stringify(obj)); 
                        console.log('data add to  file');
                        if (sm == true ){
                            if(prj == true){
                                var rez = await bot.sendMessage(chatId,msgOk, project);
                                console.log(rez);
                                return; //saveMsg(fileName,rez,'bot');
                                
                            } else {
                                var rez = await bot.sendMessage(chatId,msgOk,btn);
                                console.log(rez);
                                return saveMsg(fileName,rez,'bot') ;
                                
                            }
                        };
                        return;
                    };
                });
                return ;
            };
            return ;
        });
        return ;
    }, 
    addProjectJson : (fileName,msgOk ,msgErr , prjName , chatId )=>{
        fs.exists(fileName, async function(exists) {
            if (exists) {
                console.log("yes file exists");
                fs.readFile(fileName,async function readFileCallback(err, data) {
                    if (err) {
                        bot.sendMessage(chatId,msgErr);
                        //await saveMsg(fileName,rez,'bot');
                        return ;
                    } else {
                        var obj = JSON.parse(data);
                        obj.projectName.push([{text:prjName}]);
                        fs.writeFileSync(fileName, JSON.stringify(obj),(err)=>{console.log(err)})
                        bot.sendMessage(chatId,msgOk);
                        //await saveMsg(fileName,rez,'bot');
                        return ;
                    };
                });
                return ;
            };
            return ;
        });
        return;
    },
    createBtn : async (chatId,fileName, userFile,msgOk ,msgErr)=>{
        await fs.exists(fileName, async function(exists) {
            if (exists) {
                await fs.readFile(fileName,async function readFileCallback(err, data) {
                    if (err) {
                        var rez = await bot.sendMessage(chatId,msgErr)
                        return saveMsg(fileName,rez,'bot');
                    } else {
                        var obj = JSON.parse(data);
                        var rm =  JSON.stringify({
                            keyboard:obj.projectName ,
                            is_persistent : true,
                            one_time_keyboard : true ,
                            resize_keyboard:true 
                        });
                        var btn = { reply_markup: rm };
                        var rez = await bot.sendMessage(chatId,msgOk,btn);
                        return saveMsg(userFile,rez,'bot');
                        
                    };
                });
                return ;
            };
            return ;   
        });
        return ;
    },
    sendAppr : async (chatId ,fileName, requestId , text)=>{
        var btn =  { reply_markup : JSON.stringify({
            inline_keyboard : [
                [
                    {text:'Отправить✅' , callback_data : 'true_'+requestId },
                    {text:'Новая заявка❌' , callback_data : 'false_'+requestId },
                ]
            ]
            })
        };
        var rez = await bot.sendMessage(chatId,text,btn)
        await saveMsg(fileName,rez,'bot');
        return ;
    }, 
    requestPaid : async (chatId , fileName, requestId , text , msgErr , textRequest )=>{
        fs.exists('./admins.json', async function(exists) {
            if (exists) {
                fs.readFile('./admins.json', async function readFileCallback(err, data) {
                    if (err) {
                        var rez = await bot.sendMessage(chatId,msgErr)
                        return saveMsg(fileName,rez,'bot'); 
                    } else {
                        var btn =  { reply_markup : JSON.stringify({
                            inline_keyboard : [
                                [
                                    {text:'✅Оплачено✅' , callback_data : 'paid_'+requestId },
                                ]
                            ]
                        })};
                        var allDatas = JSON.parse(data);
                        var allData = {chatId : chatId  , fileName : fileName, name:requestId , msgId : [] };
                        var arr = [bot.sendMessage(chatId,textRequest)];
                        for (var i = 0 ; i < allDatas.admin.length ; i++){
                            arr.push(bot.sendMessage(allDatas.admin[i].chatId,textRequest,btn));
                            console.log(arr);
                        };
                        await Promise.all(arr).then(result=>{
                            for (var u = 0 ; u < result.length ; u++){
                                allData.msgId.push({chatId:result[u].chat.id,id:result[u].message_id}) ;
                            }
                            console.log("answwe" ,allData);
                            allDatas.all_request.push(allData);
                            fs.writeFileSync('./admins.json', JSON.stringify(allDatas),(err)=>{console.log(err)});
                            return ;
                        });
                        return ;
                    };
                });
                return ;
            };
            return ;
        });
        return ;
    },
    saveMsgId : async (fileName,arrData,type)=>{
        fs.exists(fileName, async function(exists) {
            if (exists) {
                console.log("yes file exists");
                fs.readFile(fileName, async function readFileCallback(err, data) {
                    if (err) {
                        return console.log('error');
                    } else {
                        var obj = await JSON.parse(data); 
                        if (type == 'bot'){ 
                            await obj.msgIdToDelete.push(arrData.message_id); 
                        } else if (type == 'user'){
                            await obj.msgIdToDelete.push(arrData); 
                        }; 
                        fs.writeFileSync(fileName, JSON.stringify(obj),(err)=>{console.log(err)});
                        return ;
                    };
                });
                return ;
            }
            return ;
        })
        return ;
    },
    deleteMsg : async (fileName,chatId , part )=>{
        fs.exists(fileName, function(exists) {
            if (exists) {
                console.log("yes file exists");
                fs.readFile(fileName,async function readFileCallback(err, data) {
                    if (err) {
                        return console.log('error');
                    } else {
                        var objt = JSON.parse(data);
                        function onlyUnique(value, index, self) {
                            return self.indexOf(value) === index;
                        }
                        var a = objt.msgIdToDelete ;
                        console.log('all',a);
                        var unique = a.filter(onlyUnique);
                        console.log('unic',unique)
                        for ( var i = 0 ; i < unique.length ; i++){
                            bot.deleteMessage(chatId,unique[i]);
                        };
                        //(part == '2') ? Object.assign(objt,{request:{},msgIdToDelete: []}) :
                         Object.assign(objt,{msgIdToDelete: []});

                        fs.writeFileSync(fileName, JSON.stringify(objt),(err)=>{console.log(err)});
                        return;
                    }
                });
                return ;
            };
            return ;
        });
        return ;
    },
    getPaid : async ( requestId , textRequest, msgErr , uName)=>{
        fs.exists('./admins.json',async function(exists) {
            if (exists) {
                fs.readFile('./admins.json',async function readFileCallback(err, data) {
                    if (err) {
                        return bot.sendMessage(chatId,msgErr);
                    } else {
                        var allData = JSON.parse(data);
                        var text = textRequest.replace("#заявка","#оплачено\r\nОплатил: t.me/"+uName);
                        var admins = allData.admin ; 
                        for (var o = 0 ; o < allData.all_request.length ; o++){
                            if (allData.all_request[o].name == requestId){
                                var request = allData.all_request[o] ;
                                for ( var i = 0 ; i < request.msgId.length ; i++){
                                    console.log(request.msgId[i].chatId,request.msgId[i].id);
                                    bot.deleteMessage(request.msgId[i].chatId,request.msgId[i].id);
                                };
                                Object.assign(request,{ msgId:[],status:'paid', text:text});
                                allData.all_request.push(request);
                                fs.writeFileSync('./admins.json', JSON.stringify(allData),(err)=>{console.log(err)});
                                bot.sendMessage(request.chatId,'user\r\n\r\n'+text);
                                for(var j = 0 ; j < admins.length ; j++){
                                    bot.sendMessage(admins[j].chatId,'admin\r\n\r\n'+text);
                                };
                                return ;
                            };
                        };
                        return;
                    };
                });
                return ;
            }
            return ;
        });
        return ;
    },
    sendRequest : async( fileName )=>{
        fs.exists(fileName, function(exists) {
            if (exists) {
                console.log("yes file exists");
                fs.readFile(fileName,async function readFileCallback(err, data) {
                    if (err) {
                        return console.log('error');
                    } else {
                        var obj = JSON.parse(data);
                        fetch('https://gapi.onlizer.com/api/webhook/danapryan.uaatgmail.com-381ec4e8b1d2460ebfdf8369a786667a/fe45154f7247458cbe2b843e351364ee/webhook', {
                            method: 'POST', // or 'PUT'
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(obj),
                        }).then((response) => response.json()).then((data) => {console.log('Success:', data);}).catch((error) => {console.error('Error:', error);
                        });
                        return ;
                    }
                });
                return ;
            };
            return ;
        });
    },
    paidRequest : async( id )=>{
        fetch('https://gapi.onlizer.com/api/webhook/danapryan.uaatgmail.com-381ec4e8b1d2460ebfdf8369a786667a/79451a87c46943fb8d038dcf2d39297b/webhook?id='+id, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body : Тело
        });
        return ;
    }


    
}
