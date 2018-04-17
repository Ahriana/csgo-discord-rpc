const DiscordRPC = require('discord-rpc');
const http = require('http');
const port = 9001;
const host = '127.0.0.1';
const ClientId = '413133032594079755';
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
rpc.on('ready', async () => { console.log('RPC connection ready!') });
rpc.login(ClientId).catch(console.error);

const server = http.createServer(async (req, res) => {
    if (req.method == 'POST') {
        res.writeHead(200, { 'Content-Type': 'text/html' });

        let body = '';
        req.on('data', (data) => { body += data; });
        req.on('end', () => {
            try {
                body = JSON.parse(body);
                res.end('');
                setRP(body);
            } catch (error) {
                console.error(error)
            }

        });
    } else {
        console.log('Not expecting other request types...');
        res.writeHead(401, { 'Content-Type': 'text/html' });
        res.end('');
    }
});

server.listen(port, host);
console.log(`Listening at http://${host}:${port}`);


function setRP(data) {
    if (!data.map) {
        // idle prob
        confirm({
            details: 'Not in game',
            state: data.player.activity,
            largeImageKey: 'icon',
            smallImageText: data.player.name,
        });
    } else {
        confirm({
            details: `${data.player.activity} ${data.map.mode} Round: ${data.map.round}`,
            state: `K:${data.player.match_stats.kills} D:${data.player.match_stats.deaths} A:${data.player.match_stats.assists}`,
            largeImageKey: getMap(data.map.name),
            smallImageKey: `side_${data.player.team.toLowerCase()}`,
            largeImageText: data.map.name,
            smallImageText: data.player.name,
        });
    }
}

function getMap(map) {
    if (map === '') { return 'map_na'; }
    if (map === 'de_cache') { return 'map_cache'; }
    if (map === 'de_cbble') { return 'map_cobblestone'; }
    if (map === 'de_dust2') { return 'map_dust2'; }
    if (map === 'de_inferno') { return 'map_inferno'; }
    if (map === 'de_mirage') { return 'map_mirage'; }
    if (map === 'de_nuke') { return 'map_nuke'; }
    if (map === 'de_overpass') { return 'map_overpass'; }
    if (map === 'de_train') { return 'map_train'; }
    return 'map_na';
}

function confirm(rp) {
    rpc.setActivity(rp).catch(console.error);
}
