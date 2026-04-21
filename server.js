const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const ALL_BRAINROTS = [
    "Noobini Pizzanini","Lirili Larila","Tim Cheese","FluriFlura","Talpa Di Fero",
    "Svinina Bombardino","Pipi Kiwi","Racooni Jandelini","Pipi Corni","Noobini Santanini",
    "Trippi Troppi","Gangster Footera","Bandito Bobritto","Boneca Ambalabu",
    "Cacto Hipopotamo","Ta Ta Ta Ta Sahur","Tric Trac Baraboom","Pipi Avocado","Frogo Elfo",
    "Cappuccino Assassino","Brr Brr Patapim","Trulimero Trulicina","Bambini Crostini",
    "Bananita Dolphinita","Perochello Lemonchello","Brri Brri Bicus Dicus Bombicus",
    "Avocadini Guffo","Salamino Penguino","Ti Ti Ti Sahur","Penguin Tree","Penguino Cocosino",
    "Burbaloni Loliloli","Chimpazini Bananini","Ballerina Cappuccina","Chef Crabracadabra",
    "Lionel Cactuseli","Glorbo Fruttodrillo","Blueberrini Octopusini","Strawberelli Flamingelli",
    "Pandaccini Bananini","Cocosini Mama","Sigma Boy","Sigma Girl","Pi Pi Watermelon",
    "Chocco Bunny","Sealo Regalo","Frigo Camelo","Orangutini Ananassini","Rhino Toasterino",
    "Bombardiro Crocodilo","Bombombini Gusini","Cavallo Virtuso","Gorillo Watermelondrillo",
    "Avocadorilla","Tob Tobi Tobi","Ganganzelli Trulala","Cachorrito Melonito","Elefanto Frigo",
    "Toiletto Focaccino","Te Te Te Sahur","Tracoducotulu Delapeladustuz","Lerulerulerule",
    "Jingle Jingle Sahur","Tree Tree Tree Sahur","Carloo","Spioniro Golubiro","Zibra Zubra Zibralini",
    "Tigrilini Watermelini","Carrotini Brainini","Bananito Bandito","Coco Elefanto","Girafa Celestre",
    "Gattatino Nyanino","Chihuanini Taconini","Matteo","Tralalero Tralala","Espresso Signora",
    "Odin Din Din Dun","Statutino Libertino","Trenostruzzo Turbo 3000","Ballerino Lololo",
    "Los Orcalitos","Dug dug dug","Tralalita Tralala","Urubini Flamenguini","Los Bombinitos",
    "Trigoligre Frutonni","Orcalero Orcala","Bulbito Bandito Traktorito","Los Crocodillitos",
    "Piccione Macchina","Trippi Troppi Troppa Trippa","Los Tungtungtungcitos","Tukanno Bananno",
    "Alessio","Tipi Topi Taco","Extinct Ballerina","Capi Taco","Gattito Tacoto","Pakrahmatmamat",
    "Tractoro Dinosauro","Corn Corn Corn Sahur","Squalanana","Los Tipi Tacos","Bombardini Tortinii",
    "Pop pop Sahur","Ballerina Peppermintina","Yeti Claus","Ginger Globo","Frio Ninja",
    "Ginger Cisterna","Cacasito Satalito","Aquanaut","Tartaruga Cisterna","Las Sis",
    "La Vacca Staturno Saturnita","Chimpanzini Spiderini","Extinct Tralalero","Extinct Matteo",
    "Los Tralaleritos","La Karkerkar Kombinasin","Karker Sahur","Las Tralaleritas","Job Job Job Sahur",
    "Los Spyderrinis","Perrito Burrito","Graipuss Medussi","Los Jobcitos","La Grande Kombinasin",
    "Tacorita Bicicleta","Nuclearo Dinossauro","Los 67","Money Money Puggy","Chillin Chili",
    "La Extinct Grande","Los Tacoritas","Los Tortus","Tang Tang Kelentang","Garama and Madundung",
    "La Secret Kombinasin","Torrtuginni Dragonfruitini","Pot Hotspot","To to to Sahur",
    "Las Vaquitas Saturnitas","Chicleteira Bicicleteira","Agarrini la Palini","Mariachi Corazoni",
    "Dragon Cannelloni","Los Kombinasinas","La Cucaracha","Karkerkar Kurkur","Los Hotspotsitos",
    "La Sahur Kombinasin","Quesadilla Crocodila","Esok Sekolah","Los Matteos","Dul Dul Dul",
    "Blackhole Goat","Nooo My Hotspot","Sammyini Spyderini","Spaghetti Tualetti","67",
    "Los Noo My Hotspotsitos","Celularcini Viciosini","Tralaledon","Tictac Sahur","La Supreme Kombinasin",
    "Ketupat Kepat","Ketchuru and Musturu","Burguro and Fryuro","Please my Present","La Grande",
    "La Vacca Prese Presente","Ho Ho Ho Sahur","Chicleteira Noelteira","Cooki and Milki",
    "La Jolly Grande","Capitano Moby","Cerberus","Skibidi Toilet","Strawberry Elephant","Meowl"
];

const clients = new Set();

function generateServerData() {
    const randomBrainrot = ALL_BRAINROTS[Math.floor(Math.random() * ALL_BRAINROTS.length)];
    const randomMoney = Math.floor(Math.random() * 150000000);
    const randomPlayers = Math.floor(Math.random() * 20) + 1;
    const mutations = ["Normal", "Golden", "Rainbow", "Dark", "Normal", "Normal"];
    const randomMutation = mutations[Math.floor(Math.random() * mutations.length)];
    
    return {
        op: "brainrot/sighting",
        data: {
            jobId: "job_" + Date.now() + "_" + Math.random().toString(36).substr(2, 8),
            placeId: 109983668079237,
            players: randomPlayers,
            playerLimit: 20,
            brainrots: [{
                brainrotName: randomBrainrot,
                value: randomMoney,
                mutation: randomMutation
            }]
        }
    };
}

wss.on('connection', (ws) => {
    console.log('✅ Client connected');
    clients.add(ws);
    
    const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            const data = generateServerData();
            ws.send(JSON.stringify(data));
            console.log('📡 Sent:', data.data.brainrots[0].brainrotName);
        }
    }, Math.random() * 15000 + 5000);
    
    ws.on('close', () => {
        console.log('❌ Client disconnected');
        clients.delete(ws);
        clearInterval(interval);
    });
});

app.get('/', (req, res) => {
    res.json({
        status: 'online',
        clients: clients.size,
        message: 'GrimHub AJ WebSocket Server Running'
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
