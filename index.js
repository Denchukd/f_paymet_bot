const TelegramApi = require('node-telegram-bot-api')
const fs = require('fs-js')
const token = '5393921454:AAHct78k9BH3wnQbwYCdsTxNMTKSLcTuqLs'
const {welcomeNew , welcomeOld , notUderstand ,errorMessage, newPrj , newProjectAdd , chossePrj ,writeDescription , writePaymentType , writeSum, writeCard , writeDeadLine, checkResult , chosseCheck, createReques, requestSend} = require('./text.js')
const {addJson , addProjectJson, createBtn , sendAppr , requestPaid , saveMsgId , deleteMsg , getPaid , sendRequest , paidRequest} = require('./func.js')
const {payType, needCheck} = require('./inlineBtn.js')
const { request } = require('https')



const bot = new TelegramApi(token,{polling:true})

const start = async ()=>{
    bot.setMyCommands([
        {command:'/create' , description:'Добавить новую заявку на оплату'},
        {command:'/new_project' , description:'Добавить новый проект'}
    ]);

    
    bot.on('text' , async msg=>{
        const text = msg.text ;
        const chatId = msg.chat.id ;
        const uName = msg.from.username;
        const fileName = './'+chatId+'_'+uName+'.json' ;
        const mId = msg.message_id ;
        console.log(msg);
        //saveMsgId(fileName,mId,'user');
        /*if(text == '/test'){
            //saveMsgId(fileName,mId,'user');
            //var m = await bot.sendMessage(chatId,'test qwe');
            //var t = Promise.all(m).then(result=>{console.log(result)});
            var m = await bot.getUpdates();
            console.log(m);
            //setTimeout(deleteMsg(fileName,chatId),3000);
           return ;
        } else*/
        if (text == '/start'){
            fs.exists(fileName, async function(exists) {
                console.log(exists);
                await saveMsgId(fileName,mId,'user');
                if (exists) {
                    console.log("yes file exists");
                    fs.readFile(fileName, async function readFileCallback(err,data) {
                        if (err) {
                            //return bot.sendMessage(chatId,errorMessage);
                            var rez = await bot.sendMessage(chatId,errorMessage);
                            await saveMsgId(fileName,rez,'bot');
                            return ;
                        } else {
                            var obj = await JSON.parse(data);
                            if (obj.msgIdToDelete.length >= 1){
                                await addJson(fileName,'no',errorMessage,[{request:{},msgIdToDelete:[]}],chatId , false ,false , false) ;
                            } else {
                                await addJson(fileName,'no',errorMessage,[{request:{}}],chatId , false ,false , false) ;
                            };
                            var rez = await bot.sendMessage(chatId,welcomeOld);
                            await saveMsgId(fileName, rez, 'bot');
                            return ;
                        };
                    });
                    return ;
                } else {
                    console.log("file not exists");
                    var obj = {};
                    Object.assign(obj,{chatId,uName,fileName , msgIdToDelete:[],request:{}});
                    fs.writeFileSync(fileName, JSON.stringify(obj),(err)=>{console.log(err)});
                    var rez = await bot.sendMessage(chatId,welcomeNew)
                    await saveMsgId(fileName,rez,'bot');
                    if (uName == 'piriatins' || uName == 'DIUSHAKOVA' || uName == 'ushakov_evgenyi' ){
                        fs.readFile('./admins.json', async function readFileCallback(err,data) {
                            if (err) {
                                console.log('error , admin file does not found');
                            } else {
                                var adm = JSON.parse(data);
                                var cn = false ;
                                for (var i = 0 ; i < adm.admin.length;i++){
                                    if(adm.admin[i].chatId == chatId){ 
                                        cn = true 
                                    }; 
                                };
                                if (cn == false){
                                    adm.admin.push({chatId,uName,fileName, request:{} });
                                    fs.writeFileSync('./admins.json', JSON.stringify(adm),(err)=>{console.log(err)});
                                    return ;
                                };
                                return ;
                            };
                            return ;
                        });
                        return ;
                    };
                    return ;    
                };
            });
            return ;
        } else if(text == '/new_project'){
            console.log('new project');
            addJson(fileName, newPrj, errorMessage, [{request:{project:'no'}},{ newProject: 'add' }], chatId, true, true, false) ;
            return ;
            //await saveMsgId(fileName,mId,'user');
            
        } else if(text == '/create'){
            //bot.deleteMessage(chatId,mId);
            addJson(fileName,'no',errorMessage,[{request:{project:'add'}}],chatId , false ,false , false) ;
            //await saveMsgId(fileName,mId,'user');
            createBtn(chatId,'./project_name.json',fileName,chossePrj,errorMessage);
            return ;
        } else {
            saveMsgId(fileName,mId,'user');
            fs.exists(fileName, async function(exists) {
                if (exists) {
                    fs.readFile(fileName, async function readFileCallback(err, data) {
                        if (err) {
                            await bot.sendMessage(chatId,errorMessage) ; 
                        } else {
                            var obj = JSON.parse(data);
                            if (obj.newProject == 'add'){
                                addProjectJson('./project_name.json',newProjectAdd,errorMessage,text,chatId ) ;
                                addJson(fileName,'no',errorMessage,[{newProject:"no"},{request:{project:'no'}}],chatId ,false , false , false ) ;  
                                return ;
                            } else if (obj.request.project == 'add'){
                                console.log('проект');
                                //await deleteMsg(fileName,chatId,'1') ;
                                addJson(fileName,writeDescription,errorMessage,[{project:text},{id:Date.now()},{description:'add'}],chatId ,false , true , true ) ;   
                                return ;
                            } else if (obj.request.description == 'add'){
                                console.log('описание');
                                if (obj.request.project != text){
                                addJson(fileName,'no',errorMessage,[{description:text},{paymentType:'add'}],chatId ,false , false, true ) ; 
                                var rez = await bot.sendMessage(chatId,writePaymentType,payType);
                                console.log(rez);
                                return saveMsgId(fileName,rez,'bot');
                                };
                            } else if (obj.request.sum == 'add'){
                                console.log('сумма');
                                await addJson(fileName,writeDeadLine,errorMessage,[{sum:text},{deadline:'add'}],chatId ,false , true , true ) ;     
                                return ;
                            } else if (obj.request.card == 'add'){
                                console.log('карта');
                                addJson(fileName,'no',errorMessage,[{card:text},{check:'add'}],chatId ,false , false , true ) ; 
                                var rez = await bot.sendMessage(chatId,chosseCheck,needCheck)
                                return saveMsgId(fileName,rez,'bot');
                            } else if (obj.request.deadline == 'add'){
                                console.log('дедлайн');
                                if (obj.request.sum != text){
                                    if (obj.request.paymentType == 'Наличные'){
                                        console.log('дедлайн нал');
                                        var rezult = 'Заявка №'+obj.request.id + '\r\nОт t.me/'+uName+'\r\nПроект: '+obj.request.project+'\r\n\r\nОписание: '+obj.request.description+'\r\n\r\nТип оплаты: '+obj.request.paymentType+'\r\n\r\nСумма: '+obj.request.sum + '\r\n\r\nДедлайн: '+text  ;
                                        addJson(fileName,'no',errorMessage,[{deadline:text},{aprove:'wait'},{textRequest:'\#заявка\r\n'+rezult}],chatId,false,false,true);
                                    } else if (obj.request.paymentType=='Перевод'){
                                        console.log('дедлайн карта');
                                        var rezult = 'Заявка №'+obj.request.id + '\r\nОт t.me/'+uName+'\r\nПроект: '+obj.request.project+'\r\n\r\nОписание: '+obj.request.description+'\r\n\r\nТип оплаты: '+obj.request.paymentType+'\r\n\r\nРеквизиты:'+obj.request.card+'\r\n\r\nНужна ли квитанция? - '+obj.request.check+'\r\n\r\nСумма: '+obj.request.sum + '\r\n\r\nДедлайн: '+text  ;
                                        addJson(fileName,'no',errorMessage,[{deadline:text},{aprove:'wait'},{textRequest:'\#заявка\r\n'+rezult}],chatId,false,false,true);
                                    }; 
                                var rez = await bot.sendMessage(chatId,checkResult);
                                saveMsgId(fileName,rez,'bot');
                                return sendAppr(chatId,fileName,obj.request.id,rezult);
                                
                                };
                            /*} else {
                                var rez = await bot.sendMessage(chatId,notUderstand);
                                saveMsgId(fileName,rez,'bot'); 
                                return deleteMsg(fileName,chatId);*/
                            };   
                        };
                    });
                };  
            });
        };
    });

    bot.on('callback_query' , async cb=>{
        console.log(cb);
        const cbData = cb.data ;
        const uName = cb.from.username ;
        const chatId = cb.from.id ;
        const fileName = './'+chatId+'_'+uName+'.json';
        const mId = cb.message.message_id ;
        //saveMsgId(fileName,mId,'user');
        fs.exists(fileName, async function(exists) {
            if (exists) {
                fs.readFile(fileName, async function readFileCallback(err, data) {
                    if (err) {
                        return bot.sendMessage(chatId,errorMessage) ; 
                    } else {
                        var obj = JSON.parse(data);
                        if (obj.request.paymentType == 'add'){
                            saveMsgId(fileName,mId,'user');
                            if(cbData == 'Наличные'){
                                console.log('наличніе');
                                addJson(fileName,writeSum,errorMessage,[{paymentType:cbData},{sum:'add'}],chatId ,false , true , true) ;  
                                return ; 
                            } else if (cbData == 'Перевод'){
                                console.log('перевод');
                                addJson(fileName,writeCard,errorMessage,[{paymentType:cbData},{card:'add'}],chatId ,false , true , true ) ;   
                                return ;
                            } else { 
                                console.log('непонятно');
                                var rez = await bot.sendMessage(chatId,errorMessage)
                                saveMsgId(fileName,rez,'bot');
                                return ;
                            };
                        } else if (obj.request.check == 'add'){
                            console.log('квитанция');
                            saveMsgId(fileName,mId,'user');
                            addJson(fileName,writeSum,errorMessage,[{check:cbData},{sum:'add'}],chatId ,false , true , true ) ;  
                            return ;
                        } else if (cbData.includes('true')){
                            console.log('подтверждение');
                            if(obj.request.aprove == 'wait'){
                                console.log('апрув');
                                //bot.deleteMessage(chatId,mId);
                                addJson(fileName,createReques,errorMessage,[{project:'no'},{aprove:'ok'}], chatId,false,false,true) ;
                                deleteMsg(fileName,chatId);
                                requestPaid(chatId, fileName , obj.request.id, requestSend , errorMessage , obj.request.textRequest);
                                sendRequest(fileName);
                                return ;
                            } else {
                                console.log('новая заявка');
                                bot.deleteMessage(chatId,mId);
                                await createBtn(chatId,'./project_name.json',fileName,chossePrj,errorMessage);
                                await addJson(fileName,'no',errorMessage,[{request:{project:"add"}}],chatId , false ,false , false) ;
                                return deleteMsg(fileName,chatId);
                            }
                        } else if (cbData.includes('paid_')){
                            console.log('оплачено');
                            var numberRequest = cbData.replace("paid_","");
                            await getPaid(numberRequest , cb.message.text , errorMessage , uName );
                            paidRequest(cbData.replace("paid_",""));
                            return ; 
                        };
                        return;
                    }
                });
                return ;
            };
            return ;   
        });
        return;
    });

};

start()