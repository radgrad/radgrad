/**
 * Before running this script, ensure that Mozilla's geckodriver is present on
 * your system PATH: <https://github.com/mozilla/geckodriver/releases>
 *
 */

const { Builder, By, Key, until } = require('selenium-webdriver');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let username = '';
let pwd = '';

function hidden(query, callback) {
  const stdin = process.openStdin();
  let i = 0;
  process.stdin.on('data', function (char) {
    char = char + '';
    switch (char) {
      case '\n':
      case '\r':
      case '\u0004':
        stdin.pause();
        break;
      default:
//        process.stdout.write('\033[2K\033[200D' + query + Array(rl.line.length+1).join('*'));
        process.stdout.write("\033[2K\033[200D" + query + "[" + ((i % 2 == 1) ? "=-" : "-=") + "]");
        i++;
        break;
    }
  });

  rl.question(query, function (value) {
    rl.history = rl.history.slice(1);
    callback(value);
  });
}

function getUserInfo() {
  rl.question('Username :', function getUserName(user) {
    username = user;
  });
  hidden('password : ', function (password) {
    pwd = password;
  });
}

// rl.close();

const myArgs = process.argv.slice(2);

function checkStart() {
  const args = process.argv;
  console.log(args);
}

function checkArgs(myArgs) {
  if (myArgs.length < 3) {
    console.log('Usage: node star-bulk-download.js <Last Name> <First Name>');
    process.exit(-1);
  }
}

const driver = new Builder()
    .forBrowser('firefox')
    .build();

console.log(myArgs[0], myArgs[1], myArgs[2], pwd);

function login(driver) {
  driver.get('https://www.star.hawaii.edu:10011/admininterface/')
      .then(_ => {
        driver.findElement(By.name('uid')).sendKeys(username);
        driver.findElement(By.name('password')).sendKeys(pwd);
        driver.findElement(By.className('ui fluid blue button')).sendKeys(Key.RETURN);
      })
      .then(_ => driver.wait(until.titleIs('STAR: A University of Hawaii Venture'), 5000))
      .then(_ => driver.get('https://www.star.hawaii.edu:10011/admininterface/NewHome.jsp'))
}

function clickStudentSearch(driver) {
  driver.findElements(By.className('link'))
      .then(links => {
        console.log(links.length);
        links.forEach((link) => {
          link.getText()
              .then(text => {
                console.log(`Text of link is '${text}'`);
                if (text === 'Student Search') {
                  link.click();
                }
              });
        });
      });
}
function fillStudentSearch(driver) {
  driver.findElement(By.css('[ng-model^="lastName"]'))
      .then(lastName => lastName.sendKeys(myArgs[1]));

  driver.findElement(By.css('[ng-model^="firstName"]'))
      .then(lastName => lastName.sendKeys(myArgs[2]));

}

function done(driver) {
  driver.quit();
}

checkStart();