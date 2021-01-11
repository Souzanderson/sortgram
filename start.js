const InstagramClient = require('./instagramclient.js')
const fs = require('fs')

exports.start = async (urlpost) => {
    const client = new InstagramClient();
    await client.start();
    let comments = await client.getComments(urlpost);
    console.log("Número de comentários extraídos: "+comments.length);
    // fs.writeFileSync(`./comments/${urlpost}.json`, JSON.stringify(comments,null,'\t'));
    await client.stop();
    return comments;
}

exports.sort = (posts,qtd) =>{
    return (new InstagramClient()).sorter(posts,qtd)
}
