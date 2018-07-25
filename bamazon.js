const inq = require('inquirer');
const sql = require('mysql');
const Table = require('cli-table');
const md5 = require('md5')
const moment = require('moment')

var rpwd = new RegExp(/^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))/);

let connection = sql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    launchMenu();
});

function launchMenu() {
    inq.prompt([{
        message: ` 
        _______    ______   __       __   ______   ________   ______   __    __ 
        /       \  /      \ /  \     /  | /      \ /        | /      \ /  \  /  |
        $$$$$$$  |/$$$$$$  |$$  \    /$$ |/$$$$$$  |$$$$$$$$/ /$$$$$$  |$$  \  $$ |
        $$ |__$$ |$$ |__$$ |$$$  \  /$$$ |$$ |__$$ |    /$$/  $$ |  $$ |$$$  \ $$ |
        $$    $$< $$    $$ |$$$$  /$$$$ |$$    $$ |   /$$/   $$ |  $$ |$$$$  $$ |
        $$$$$$$  |$$$$$$$$ |$$ $$ $$/$$ |$$$$$$$$ |  /$$/    $$ |  $$ |$$ $$ $$ |
        $$ |__$$ |$$ |  $$ |$$ |$$$/ $$ |$$ |  $$ | /$$/____ $$ \ __$$ |$$ |$$$$ |
        $$    $$/ $$ |  $$ |$$ | $/  $$ |$$ |  $$ |/$$      |$$    $$/ $$ | $$$ |
        $$$$$$$/  $$/   $$/ $$/      $$/ $$/   $$/ $$$$$$$$/  $$$$$$/  $$/   $$/ 
                                                                                 
        
        ===========================================================================
        WELCOME TO BAMAZON!
        YOUR ONE STOP SHOP
        FOR ALL YOUR 
        SILLIEST NEEDS!
        ===========================================================================
        Select an option in the Menu below`,
        name: 'menu',
        type: 'list',
        choices: ['Login : Login to your Bamazon Account',
            'New User : Sign up for the Bamazon Experience',
            'Exit'
        ]
    }]).then(function (answers) {
        switch (answers.menu) {
            case 'Login : Login to your Bamazon Account':
                login()
                break;

            case 'New User : Sign up for the Bamazon Experience':
                //to do
                break;

            case 'Exit':
                console.log(`
        ===========================================================================================
        Thanks for using BAMAZON, ya nut!
        ===========================================================================================
         `)
                connection.end();
                break;
        };
    });
};

function login() {
    inq.prompt([{
        type: 'input',
        name: 'username',
        messsage: `
        ===========================================================================================
        What is your username?
        ===========================================================================================
        `,
        validate: function (username) {
            var done = this.async();
            setTimeout(function () {
                if (username.indexOf(' ') !== -1 || username.indexOf(',') !== -1) {
                    console.error(`
        ===========================================================================================
        That is not a valid username. Make sure there are no spaces or commas, ya nut!
        ===========================================================================================
        `);
                    return;
                }
                done(null, true);
            }, 500);
        }
    },
    {
        type: 'password',
        name: 'pwd',
        message: `
        ===========================================================================================
        What is your password?
        ===========================================================================================
        `,
        validate: function (pass) {
            var done = this.async();
            setTimeout(function () {
                if (!rpwd.test(pass) || pass.indexOf(' ') !== -1 || pass.indexOf(',') !== -1) {
                    console.error(`
        ===========================================================================================
        That is not a valid password. Must contain a Upper and lowercase letter as well as a number
        No Shenanigans Like SPACE or COMMA either!
        ===========================================================================================
        `);
                    return;
                }
                done(null, true);
            }, 500);
        }
    }]).then((logans) => {
        let user = logans.username;
        let pwd = logans.pwd;
        connection.query(`SELECT * FROM users WHERE username = ?`, [user], (err, res) => {
            if (err) throw err;
            if (res.length > 0) {
                if (err) throw err;
                if (res[0].pwd === md5(pwd)) {
                    if (res[0].isManager && !res[0].isSupervisor) {
                        inq.prompt([{
                            type: 'confirm',
                            message: `
        ===========================================================================================
        Are you logging in as a manager?
        ===========================================================================================
        `,
                            name: 'a'
                        }]).then(function (answer) {
                            if (answer.a) { manage(res[0]); }
                            else { shop(res[0]) };
                        });
                    }
                    else if (!res[0].isManager && res[0].isSupervisor) {
                        inq.prompt([{
                            type: 'confirm',
                            message: `
        ===========================================================================================
        Are you logging in as a supervisor?
        ===========================================================================================
            `,
                            name: 'a'
                        }]).then(function (answer) {
                            if (answer.a) supervise(res[0]);
                            shop(res[0])
                        });
                    }
                    else if (res[0].isManager && res[0].isSupervisor) {
                        inq.prompt([{
                            type: 'list',
                            message: `
        ===========================================================================================
        Are you logging in as a manager, a supervisor or just shopping?
        ===========================================================================================
            `,
                            choices: ['manager', 'supervisor', 'shopping'],
                            name: 'a'
                        }]).then(function (answer) {
                            switch (answer.a) {
                                case 'supervisor':
                                    supervise(res[0]);
                                    break;
                                case 'manager':
                                    manage(res[0]);
                                    break;
                                case 'shopping':
                                    shop(res[0]);
                                    break;
                            }
                        });
                    }
                    else { shop(res[0]) };
                    //shop(res[0]);
                }
                else {
                    console.log(`
        ===========================================================================================
        That is not a valid password, Redirecting you to the Main Menu in 5 Seconds
        ===========================================================================================
        `);
                    setTimeout(function () { launchMenu() }, 5000);
                };
            }
            else {
                console.log(`
        ===========================================================================================
        That is not an existing userName, Redirecting you to the Main Menu in 5 Seconds
        ===========================================================================================
        `);
                setTimeout(function () { launchMenu() }, 5000);
            }
        });

    });
};

function shop(user) {
    inq.prompt([{
        message: `
        ===========================================================================================
        Welcome, ${user.username}! What are you here to do?
        ===========================================================================================
        `,
        type: 'list',
        name: 'shop',
        choices: ['Search for a Product',
        'View all available Products',
        'Buy Item using a Product ID',
        'Logout']
    }]).then(function (answer) {
        switch (answer.shop) {
            case 'Search for a Product':
            search(user);
            break;
            
            case 'View all available Products':
            browse(user);
            break;
            
            case 'Buy Item using a Product ID':
            buy(user);
            break;
            case 'Logout':
            launchMenu();
            break;
        }
    });
};

function search(user) {
    inq.prompt([{
        message: `
    ===========================================================================================
    What is it you're looking for?
    ===========================================================================================
    `,
        name: 'search',
        validate: function (search) {
            var done = this.async();
            setTimeout(function () {
                if (search.indexOf(' ') !== -1 || search.indexOf(',') !== -1) {
                    console.error(`
    ===========================================================================================
    That is not a valid search. Make sure there are no spaces or commas, ya nut!
    ===========================================================================================
    `);
        return;
    }
                done(null, true);
            }, 500);
        }
    }]).then(answer => {
        let wants = answer.search
        connection.query(`SELECT * FROM products WHERE item LIKE '%${wants}%'`, (err, res) => {
            if (err) throw err;
            if (res.length === 0) {
                inq.prompt({
                    type: 'confirm',
                    message: `
    ===========================================================================================
    Looks like we don't have ${wants}. Would you like to search again?
    ===========================================================================================
    `,
                    name: 'again'
                }).then((answer) => {
                    if (answer.again) {
                        search(user);
                    }
                    else {
                        shop(user);
                    };
                });
            }
            else {
                let sTable = new Table({
                    chars: {
                        'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
                        , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
                        , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
                        , 'right': '║', 'right-mid': '╢', 'middle': '│'
                    }
                });
                sTable.push(['Product ID', 'Product Name', 'Department', 'Price', 'Stock'])
                for (i = 0; i < res.length; i++) {
                    let rowArr = []
                    let obj = res[i]
                    for (let key in obj) {
                        if (key !== 'seller') {
                            rowArr.push(obj[key]);
                        }
                    };
                    sTable.push(rowArr);
                }
                console.log(sTable.toString());
                inq.prompt({
                    type: 'list',
                    message: `
        ===========================================================================================
        What would you like to do?
        ===========================================================================================
        `,
                    choices: ['Buy one of these using its product ID', 'Search for another product', 'Return to the Main Shopping Menu'],
                    name: 'todo'
                }).then(answer => {
                    switch (answer.todo) {
                        case 'Buy one of these using its product ID':
                            buy(user);
                            break;

                            case 'Search for another product':
                            search(user);
                            break;

                            case 'Return to the Main Shopping Menu':
                            shop(user);
                            break;
                    }
                })
            }
        });
    })
};

function buy(user) {
    inq.prompt([{
        message: 'What is the ID of the product you would like to buy?',
        name: 'id'
    },
    {
        message: 'How many do you want to buy?',
        name: 'quant'
    }]).then(answers => {
        let productId = answers.id;
        connection.query(`SELECT * FROM products WHERE id = ?`, [productId], (err, res) => {
            if (err) throw err;
            product = res[0];
            let price = parseInt(product.price);
            let quantity = parseInt(product.stock);
            let quantitytobuy = parseInt(answers.quant);
            let totalprice = price * quantitytobuy;
            console.log(`
    ===========================================================================================
    Thank you, ${user.username}! Your total cost was $${totalprice}.
    ===========================================================================================
    `)
            updateTable('products', 'stock', (quantity - quantitytobuy), 'id', productId);
            setTimeout(function () { shop(user) }, 750);
            
        });
        
    });
};


function updateTable(table, column2fix, newvalue, wherecol, equals) {
    connection.query(`UPDATE ${table} SET ${column2fix} = ${newvalue} where ${wherecol} = ?`, [equals], (err, res) => {
        if (err) throw err;
    })
};

function browse(user) {
    connection.query(`SELECT * FROM products`, (err, res) => {
        if (err) throw err;
        let bTable = new Table({
            chars: {
                'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
                , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
                , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
                , 'right': '║', 'right-mid': '╢', 'middle': '│'
            }
        });
        bTable.push(['Product ID', 'Product Name', 'Department', 'Price', 'Stock'])
        for (i = 0; i < res.length; i++) {
            let rowArr = []
            let obj = res[i]
            for (let key in obj) {
                if (key !== 'seller') {
                    rowArr.push(obj[key]);
                }
            };
            bTable.push(rowArr);
        }
        console.log(bTable.toString());
        setTimeout(function () { shop(user) }, 3000);
        
    });
};

function manage(user) {
    //todo
    launchMenu();
};

function supervise(user) {
    //to do
    launchMenu();
};