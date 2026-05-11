const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

function countTags(html) {
    const tags = [];
    const re = /<(\/?[a-zA-Z0-9]+)/g;
    let match;
    while ((match = re.exec(html)) !== null) {
        const tag = match[1];
        if (tag.startsWith('/')) {
            const closing = tag.slice(1);
            if (tags.length > 0 && tags[tags.length - 1] === closing) {
                tags.pop();
            } else {
                console.log(`Mismatch: found </${closing}> but expected </${tags[tags.length - 1]}>`);
            }
        } else if (!['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tag.toLowerCase())) {
            tags.push(tag);
        }
    }
    console.log('Remaining open tags:', tags);
}

countTags(content);
