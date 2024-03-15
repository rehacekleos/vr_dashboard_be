const inquirer = require('inquirer');
const execSync = require('child_process').execSync;

const generateCommand = (answers) => {
    const tags = answers.tags.split(',').map(function(tag) {
        return tag.trim();
    });

    if (answers.platform === 'all' && answers.push === false){
        console.error('Cannot save image with all platform to LOCAL docker hub!');
        return
    }

    let command = 'docker buildx build';

    for (let tag of tags){
        command += ' -t rehacekleos/vr-dashboard-server:' + tag
    }

    if (answers.platform === 'all'){
        answers.platform = 'linux/amd64,linux/arm64'
    }
    command += ' --platform='+ answers.platform

    if (answers.push === true){
        command += ' --push .'
    } else {
        command += ' --load .'
    }

    return command;
}

inquirer.prompt([
        {
            type: 'input',
            name: 'tags',
            message: "Write tags (more tags separate with ',' ):",
        },
        {
            type: 'list',
            name: 'platform',
            message: 'Select platform:',
            choices: ['all', 'linux/amd64', 'linux/arm64'],
        },
        {
            type: 'confirm',
            name: 'push',
            message: 'Push image to docker hub?'
        }
    ])
    .then((answers) => {
        execSync(generateCommand(answers), ({stdio: [0,1,2]}));
})