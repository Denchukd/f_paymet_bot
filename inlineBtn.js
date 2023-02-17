module.exports ={
    payType : {
        reply_markup : JSON.stringify({
            inline_keyboard : [
                [
                    {text:'НАЛИЧНЫЕ💵' ,callback_data :'Наличные' },
                    {text:'ПЕРЕВОД💳' , callback_data : 'Перевод'}
                ]
            ],
        })
    },
    needCheck : {
        reply_markup : JSON.stringify({
            inline_keyboard : [
                [
                    {text:'ДА✅' ,callback_data :'Нужна' },
                    {text:'НЕТ❌' , callback_data : 'Без_чека'}
                ]
            ]
        })
    },

}