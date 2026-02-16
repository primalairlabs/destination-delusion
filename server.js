import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.static(join(__dirname, 'public')));

// In-memory state
let state = {
  submissions: [],
  maesiName: null, // Track by name instead of socket ID
  winner: null,
  selectionInProgress: false
};

// Insult pool - context-aware and brutal
const insults = {
  // City-specific roasts
  citySpecific: {
    'berlin': [
      "Berlin? Dude, you're gonna pull a hamstring just walking to the club. Those places don't even open until you're usually asleep.",
      "Berlin... the city where techno never stops and your knees gave up years ago. Good luck keeping up."
    ],
    'ibiza': [
      "😂 brother you can barely handle a beer after 9pm and you want to go where the party STARTS at midnight?",
      "Ibiza? My man, your idea of a wild night is staying up past 10:30. This ain't it."
    ],
    'barcelona': [
      "Yeah man, I'm sure those 22-year-olds at the beach are gonna be SUPER into your cargo shorts and New Balance sneakers.",
      "Barcelona... great choice if you want to feel ancient watching people half your age actually enjoy life."
    ],
    'miami': [
      "You know they're gonna charge you $40 for a drink and laugh at your dad bod, right?",
      "Miami 💀 where dreams go to die and dads go to embarrass themselves. Perfect fit."
    ],
    'amsterdam': [
      "lmao... you get winded walking up stairs, good luck with all those bikes and bridges bro",
      "Amsterdam? You complained about walking for 20 minutes last week. This city is ALL walking and bikes. Nice try."
    ],
    'prague': [
      "Sure, let's go somewhere everyone's 19 and backpacking. You'll fit right in with your orthopedic insoles",
      "Prague - the city of youth hostels and cheap beer. You bring neither the youth nor the tolerance anymore."
    ],
    'vegas': [
      "The only thing you're winning there is an early bedtime and heartburn from the buffet",
      "Vegas? Cool, we can watch you lose money AND your dignity. That's efficient."
    ],
    'tokyo': [
      "My man, you complained about your back for three days after sitting on a normal chair. Good luck with those floor tables.",
      "Tokyo... where everyone's polite and efficient and you're... well, you're you."
    ],
    'bangkok': [
      "Dude you can't even handle spicy ketchup, what are you gonna do there?",
      "Bangkok 😂 the street food will destroy you in ways you can't even imagine. RIP your stomach."
    ],
    'rio': [
      "my man, you brought sunscreen SPF 50 to a lake. You're not ready for Copacabana",
      "Rio? Sure let's go somewhere you'll need to take your shirt off. That'll go great."
    ],
    'mykonos': [
      "bro you literally complained about sand in your shoes for three weeks after the last beach trip",
      "Mykonos - because nothing says 'cool' like a sunburnt guy in cargo shorts at a beach club. That's you."
    ],
    'paris': [
      "Nothing says 'romance' like a guy who tucks his shirt into his jeans",
      "Paris... the city of love and you'll be loving that early bird dinner at 6pm like the tourist you are."
    ],
    'london': [
      "Great, an expensive city where it rains constantly. Your knees are gonna love those cobblestones.",
      "London? Cool, you can complain about the weather, the prices, AND your aching feet. Triple threat."
    ],
    'new york': [
      "NYC where everyone walks fast and you walk like you're worried about pulling something. This'll be fun.",
      "New York... you're gonna spend the whole time looking for a place to sit, aren't you?"
    ],
    'los angeles': [
      "LA where everyone's fit, young, and you're... visiting. The contrast will be brutal.",
      "Los Angeles 💀 land of perfect bodies and you brought your dad bod. Bold choice."
    ]
  },
  
  // Generic old guy reality checks
  generic: [
    "Cool choice man. Just remember they're gonna see you coming from a mile away - that white calf sock + sandal combo screams 'tourist with knee problems'",
    "Great, another city where we'll be the oldest guys at every bar. Can't wait to explain what a mortgage is to the bartender",
    "You know the clubs there don't even have chairs right? You ready to stand for 4 hours like you're 25 again? Because your knees aren't",
    "Bro... be honest. You're gonna spend the whole trip looking for a 'nice quiet place to sit' and complaining your feet hurt",
    "lol ok sure, because nothing attracts the ladies like a group of guys who travel with Ibuprofen and talk about their 401ks",
    "I love the optimism here but you literally grunted getting off the couch last week, maybe we aim for something more... achievable?",
    "Yeah this is gonna be great - five dads trying to look cool in a city full of people who still have hair and can touch their toes",
    "We're really doing this huh? Flying somewhere expensive just to realize we should've gone to a golf resort with an early bird special",
    "Another year, another city where we pretend we're not just gonna end up at an Irish pub by 8pm talking about work",
    "Alright boys, let's pick somewhere we can embarrass ourselves internationally this time 🍺",
    "Oh perfect, another destination where we'll be the weird middle-aged tourist group everyone avoids",
    "My guy, you get out of breath tying your shoes but sure, let's go somewhere that requires actual physical activity",
    "Cool cool cool. So we're gonna fly somewhere just to complain about being tired and wanting to go back to the hotel?",
    "I respect the ambition but your back hasn't respected you since 2015",
    "Yeah man nothing screams 'we've still got it' like a group of dads in polo shirts",
    "This is the year we finally accept we're those tourists that everyone makes fun of online",
    "Great choice if the goal is to remind ourselves we're not 25 anymore",
    "You know what? Sure. Let's go somewhere that'll make us feel ancient. Why not.",
    "So we're doing this? We're really gonna be THOSE guys? Okay then.",
    "Love that we keep pretending we're not gonna spend half the trip looking for coffee and complaining",
    "Another city, another chance to realize we should've just stayed home and grilled",
    "I'm here for it. Nothing like international humiliation to bring the boys together 🍺",
    "You're telling me we can't just go somewhere with golf and early dinners? No? Okay fine.",
    "Cool so whose knees are giving out first this time? Taking bets now.",
    "Perfect. Another place where 'cool' stopped being achievable for us about a decade ago.",
    "Yeah let's do it. What's the worst that could happen besides everything?",
    "The locals are gonna LOVE us. By which I mean they're gonna hate us. Obviously.",
    "Alright which one of you is bringing the Aspirin? We're gonna need it.",
    "So we're going somewhere we'll be uncomfortable and out of place? Sounds about right.",
    "Nothing says 'guys trip' like collectively realizing we're too old for this",
    "My man really out here suggesting places like we don't all need naps by 3pm",
    "I'm gonna be honest, I already know how this ends. Badly. Let's do it anyway 😂",
    "Every year we do this. Every year we're wrong. Never change boys.",
    "Can't wait to spend the whole trip saying 'remember when we could actually do this?'",
    "Yeah okay sure whatever you say chief. It's not like your judgment has ever failed us before. Oh wait.",
    "You know what, at this point we're just embracing the cringe. I respect it.",
    "Another destination that's perfect for people 20 years younger than us. Seems on brand.",
    "I love that we keep doing this to ourselves. Peak dad energy right here 🍺",
    "This is either gonna be legendary or a complete disaster. Probably both.",
    "Oh we're DOING this? Okay then. Don't say I didn't warn you when everything hurts.",
    "You picked somewhere even the name sounds exhausting. That tracks."
  ]
};

function generateInsult(city) {
  const cityLower = city.toLowerCase().trim();
  
  // Check for city-specific insult
  for (const [key, cityInsults] of Object.entries(insults.citySpecific)) {
    if (cityLower.includes(key)) {
      return cityInsults[Math.floor(Math.random() * cityInsults.length)];
    }
  }
  
  // Fall back to generic insult
  return insults.generic[Math.floor(Math.random() * insults.generic.length)];
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Send current state to new connection
  socket.emit('stateUpdate', state);
  
  socket.on('submit', (data) => {
    const { name, city } = data;
    
    // Validate
    if (!name || !city) {
      socket.emit('error', 'Name and city are required');
      return;
    }
    
    // Don't allow submissions after selection started
    if (state.winner) {
      socket.emit('error', 'Selection already completed');
      return;
    }
    
    // Check if this name already exists
    const existingIndex = state.submissions.findIndex(s => s.name.toLowerCase() === name.toLowerCase());
    
    // Check if this is Mäsi and no Mäsi exists yet
    if (name === 'Mäsi' && !state.maesiName) {
      state.maesiName = 'Mäsi';
    }
    
    // Generate insult (new one each time, even for edits)
    const insult = generateInsult(city);
    
    const submission = {
      name,
      city,
      insult,
      timestamp: Date.now(),
      socketId: socket.id
    };
    
    if (existingIndex !== -1) {
      // Update existing submission
      state.submissions[existingIndex] = submission;
      io.emit('stateUpdate', state);
      io.emit('submissionUpdated', submission);
    } else {
      // Add new submission
      state.submissions.push(submission);
      io.emit('stateUpdate', state);
      io.emit('newSubmission', submission);
    }
  });
  
  socket.on('startSelection', () => {
    // Find if this user is Mäsi by checking their submission
    const userSubmission = state.submissions.find(s => s.socketId === socket.id);
    const isMaesi = userSubmission && userSubmission.name === 'Mäsi';
    
    if (!isMaesi) {
      socket.emit('error', 'Only Mäsi can start the selection');
      return;
    }
    
    if (state.submissions.length === 0) {
      socket.emit('error', 'No submissions yet');
      return;
    }
    
    state.selectionInProgress = true;
    io.emit('selectionStarted');
    
    // Random selection after animation time
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * state.submissions.length);
      state.winner = state.submissions[randomIndex];
      state.selectionInProgress = false;
      io.emit('winnerSelected', state.winner);
      io.emit('stateUpdate', state);
    }, 7000); // 7 second animation
  });
  
  socket.on('reset', () => {
    // Find if this user is Mäsi by checking their submission
    const userSubmission = state.submissions.find(s => s.socketId === socket.id);
    const isMaesi = userSubmission && userSubmission.name === 'Mäsi';
    
    if (!isMaesi) {
      socket.emit('error', 'Only Mäsi can reset');
      return;
    }
    
    const keepMaesiName = state.maesiName;
    state = {
      submissions: [],
      maesiName: keepMaesiName, // Keep Mäsi privilege
      winner: null,
      selectionInProgress: false
    };
    
    io.emit('stateUpdate', state);
    io.emit('reset');
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Mäsi privilege persists even if they disconnect
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
