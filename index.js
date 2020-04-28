const core = require("@actions/core");
const { execSync } = require("child_process");

// Support Functions
const createCatFile = ({ email, api_key }) => `cat >~/.netrc <<EOF
machine api.heroku.com
    login ${email}
    password ${api_key}
machine git.heroku.com
    login ${email}
    password ${api_key}
EOF`;

// Input Variables
let heroku = {};
heroku.api_key = core.getInput("heroku_api_key");
heroku.email = core.getInput("heroku_email");
heroku.app_name = core.getInput("heroku_app_name");

// Program logic
try {
  execSync(createCatFile(heroku));
  console.log("Created and wrote to ~./netrc");

  execSync("heroku login");
  console.log("Successfully logged into heroku");
    
  execSync(`heroku pipelines:promote -a ${heroku.app_name}`

  core.setOutput(
    "status",
    "Successfully promoted heroku app " + heroku.app_name
  );
} catch (err) {
  core.setFailed(err.toString());
}
