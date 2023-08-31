const poolConfig={
    connectionLimit : 2,
    host     : 'localhost',
    user     : 'root',    // каким пользователем подключаемся (на учебном сервере - "root")
    password : '',    // каким паролем подключаемся (на учебном сервере - "1234")
    database : 'learning_db'
};

module.exports={
    poolConfig
}