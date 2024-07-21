export const sections = [
    {
      name: "Orientation",
      questions: [
        { text: "What year is this?", time: 10, type: "voice" },
        { text: "What season is this?", time: 10, type: "voice" },
        { text: "What month is this?",time: 10, type: "voice" },
        { text: "What is today's date?", time: 10, type: "voice" },
        { text: "What day of the week is this?", time: 10, type: "voice" },
        { text: "What country are we in?", time: 10, type: "voice" },
        { text: "What province are we in?", time: 10, type: "voice" },
        { text: "What city/town are we in?", time: 10, type: "voice" },
        { text: "What is the name of this building?", time: 10, type: "voice" },
        { text: "What floor of the building are we on?", time: 10, type: "voice" },
      ]
    },
    {
      name: "Registration",
      questions: [
        { 
          text: "I am going to name three objects. When I am finished, I want you to repeat them. Remember what they are because I am going to ask you to name them again in a few minutes: Ball / Car / Man", 
          time: 20, 
          type: "voice" 
        },
      ]
    },
    {
      name: "Attention and Calculation",
      questions: [
        { 
          text: "Spell the word 'WORLD' backwards", 
          time: 30, 
          type: "voice" 
        },
      ]
    },
    {
      name: "Recall",
      questions: [
        { text: "Now what were the three objects I asked you to remember?", time: 10, type: "voice" },
      ]
    },
    {
      name: "Language",
      questions: [
        { 
          text: "What is this called?", 
          time: 10, 
          type: "voice",
          image: "/watch.png"
        },
        { 
          text: "What is this called?", 
          time: 10, 
          type: "voice",
          image: "/pencil.png"
        },
        { text: "Repeat the phrase: No ifs, ands or buts", time: 10, type: "voice" },
        { 
          text: "Read the words on this image and then do what it says", 
          time: 10, 
          type: "voice",
          image: "/api/placeholder/200/100"
        },
        { text: "Write any complete sentence on the paper", time: 30, type: "text" },
      ]
    },
    {
      name: "3-Stage Command",
      questions: [
        { 
          text: "Take the paper in your right hand, fold it in half, and put it on the floor", 
          time: 30, 
          type: "voice" 
        },
      ]
    }
  ];