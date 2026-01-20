// Enhanced Common Phrases with Context Tags
// Replace your existing commonPhrases object in index.html (around line 600)

const commonPhrases = {
  Italian: [
    // Greetings & Basic
    { language: "Italian", text: "Ciao!", english: "Hello / Bye!", context: "greeting" },
    { language: "Italian", text: "Buongiorno!", english: "Good morning!", context: "greeting" },
    { language: "Italian", text: "Buonasera!", english: "Good evening!", context: "greeting" },
    { language: "Italian", text: "Buonanotte!", english: "Good night!", context: "greeting" },
    { language: "Italian", text: "Come stai?", english: "How are you? (informal)", context: "greeting" },
    { language: "Italian", text: "Come sta?", english: "How are you? (formal)", context: "greeting" },
    { language: "Italian", text: "Sto bene, grazie.", english: "I am well, thank you.", context: "greeting" },
    { language: "Italian", text: "E tu?", english: "And you?", context: "greeting" },
    { language: "Italian", text: "Piacere di conoscerti.", english: "Nice to meet you.", context: "greeting" },
    { language: "Italian", text: "Come ti chiami?", english: "What is your name?", context: "greeting" },
    { language: "Italian", text: "Mi chiamo...", english: "My name is...", context: "greeting" },

    // Polite Expressions
    { language: "Italian", text: "Per favore", english: "Please", context: "small_talk" },
    { language: "Italian", text: "Grazie", english: "Thank you", context: "small_talk" },
    { language: "Italian", text: "Grazie mille!", english: "Thank you very much!", context: "small_talk" },
    { language: "Italian", text: "Prego", english: "You're welcome", context: "small_talk" },
    { language: "Italian", text: "Scusa", english: "Sorry / Excuse me (informal)", context: "small_talk" },
    { language: "Italian", text: "Mi dispiace", english: "I'm sorry", context: "small_talk" },
    { language: "Italian", text: "Permesso", english: "Excuse me (to pass)", context: "small_talk" },

    // Basic Communication
    { language: "Italian", text: "Sì", english: "Yes", context: "small_talk" },
    { language: "Italian", text: "No", english: "No", context: "small_talk" },
    { language: "Italian", text: "Non lo so", english: "I don't know", context: "small_talk" },
    { language: "Italian", text: "Capisco", english: "I understand", context: "small_talk" },
    { language: "Italian", text: "Non capisco", english: "I don't understand", context: "small_talk" },
    { language: "Italian", text: "Parli inglese?", english: "Do you speak English?", context: "small_talk" },
    { language: "Italian", text: "Non parlo italiano.", english: "I do not speak Italian.", context: "small_talk" },
    { language: "Italian", text: "Parla più lentamente", english: "Speak more slowly", context: "small_talk" },
    { language: "Italian", text: "Può ripetere?", english: "Can you repeat?", context: "small_talk" },
    { language: "Italian", text: "Come si dice...?", english: "How do you say...?", context: "small_talk" },
    { language: "Italian", text: "Cosa significa?", english: "What does it mean?", context: "small_talk" },

    // Questions
    { language: "Italian", text: "Dove?", english: "Where?", context: "directions" },
    { language: "Italian", text: "Quando?", english: "When?", context: "time" },
    { language: "Italian", text: "Perché?", english: "Why?", context: "small_talk" },
    { language: "Italian", text: "Come?", english: "How?", context: "small_talk" },
    { language: "Italian", text: "Quanto costa?", english: "How much does it cost?", context: "shopping" },
    { language: "Italian", text: "Che ore sono?", english: "What time is it?", context: "time" },
    { language: "Italian", text: "Dov'è il bagno?", english: "Where is the bathroom?", context: "emergency" },

    // Daily Life
    { language: "Italian", text: "Ho fame", english: "I am hungry", context: "restaurant" },
    { language: "Italian", text: "Ho sete", english: "I am thirsty", context: "cafe" },
    { language: "Italian", text: "Sono stanco", english: "I am tired", context: "hotel" },
    { language: "Italian", text: "Va bene", english: "It's okay / Alright", context: "small_talk" },
    { language: "Italian", text: "Perfetto!", english: "Perfect!", context: "small_talk" },
    { language: "Italian", text: "Ottimo!", english: "Excellent!", context: "restaurant" },
    { language: "Italian", text: "Bellissimo!", english: "Beautiful!", context: "small_talk" },
    { language: "Italian", text: "Che bella giornata!", english: "What a beautiful day!", context: "small_talk" },
    { language: "Italian", text: "A domani", english: "See you tomorrow", context: "greeting" },
    { language: "Italian", text: "A presto", english: "See you soon", context: "greeting" },
    { language: "Italian", text: "Ci vediamo", english: "See you", context: "greeting" },
    { language: "Italian", text: "Buon appetito!", english: "Enjoy your meal!", context: "restaurant" },
    { language: "Italian", text: "Salute!", english: "Cheers! / Bless you!", context: "cafe" },
    { language: "Italian", text: "In bocca al lupo!", english: "Good luck!", context: "small_talk" },
  ],

  Sicilian: [
    // Greetings & Basic
    { language: "Sicilian", text: "Ciau!", english: "Hello / Bye!", context: "greeting" },
    { language: "Sicilian", text: "Bon jornu!", english: "Good morning!", context: "greeting" },
    { language: "Sicilian", text: "Bona sira!", english: "Good evening!", context: "greeting" },
    { language: "Sicilian", text: "Bona notti!", english: "Good night!", context: "greeting" },
    { language: "Sicilian", text: "Comu stai?", english: "How are you? (informal)", context: "greeting" },
    { language: "Sicilian", text: "Comu sta?", english: "How are you? (formal)", context: "greeting" },
    { language: "Sicilian", text: "Staiu bonu, grazzi.", english: "I am well, thank you.", context: "greeting" },
    { language: "Sicilian", text: "E tu?", english: "And you?", context: "greeting" },
    { language: "Sicilian", text: "Piaciri di canùsciri.", english: "Nice to meet you.", context: "greeting" },
    { language: "Sicilian", text: "Comu ti chiami?", english: "What is your name?", context: "greeting" },
    { language: "Sicilian", text: "Mi chiamu...", english: "My name is...", context: "greeting" },

    // Polite Expressions
    { language: "Sicilian", text: "Pi favuri", english: "Please", context: "small_talk" },
    { language: "Sicilian", text: "Grazzi", english: "Thank you", context: "small_talk" },
    { language: "Sicilian", text: "Grazzi assai!", english: "Thank you very much!", context: "small_talk" },
    { language: "Sicilian", text: "Prego", english: "You're welcome", context: "small_talk" },
    { language: "Sicilian", text: "Scusa", english: "Sorry / Excuse me (informal)", context: "small_talk" },
    { language: "Sicilian", text: "Mi dispiaci", english: "I'm sorry", context: "small_talk" },
    { language: "Sicilian", text: "Pirmessu", english: "Excuse me (to pass)", context: "small_talk" },

    // Basic Communication
    { language: "Sicilian", text: "Sì", english: "Yes", context: "small_talk" },
    { language: "Sicilian", text: "No", english: "No", context: "small_talk" },
    { language: "Sicilian", text: "Nun sacciu", english: "I don't know", context: "small_talk" },
    { language: "Sicilian", text: "Capisciu", english: "I understand", context: "small_talk" },
    { language: "Sicilian", text: "Nun capisciu", english: "I don't understand", context: "small_talk" },
    { language: "Sicilian", text: "Parri ngrisi?", english: "Do you speak English?", context: "small_talk" },
    { language: "Sicilian", text: "Nun parru sicilianu.", english: "I do not speak Sicilian.", context: "small_talk" },
    { language: "Sicilian", text: "Parra cchiù chiano", english: "Speak more slowly", context: "small_talk" },
    { language: "Sicilian", text: "Poi ripìtiri?", english: "Can you repeat?", context: "small_talk" },
    { language: "Sicilian", text: "Comu si dici...?", english: "How do you say...?", context: "small_talk" },
    { language: "Sicilian", text: "Chi voli diri?", english: "What does it mean?", context: "small_talk" },

    // Questions
    { language: "Sicilian", text: "Unni?", english: "Where?", context: "directions" },
    { language: "Sicilian", text: "Quannu?", english: "When?", context: "time" },
    { language: "Sicilian", text: "Picchì?", english: "Why?", context: "small_talk" },
    { language: "Sicilian", text: "Comu?", english: "How?", context: "small_talk" },
    { language: "Sicilian", text: "Quantu costa?", english: "How much does it cost?", context: "shopping" },
    { language: "Sicilian", text: "Chi ura è?", english: "What time is it?", context: "time" },
    { language: "Sicilian", text: "Unni è lu bagnu?", english: "Where is the bathroom?", context: "emergency" },

    // Daily Life
    { language: "Sicilian", text: "Haiu fami", english: "I am hungry", context: "restaurant" },
    { language: "Sicilian", text: "Haiu siti", english: "I am thirsty", context: "cafe" },
    { language: "Sicilian", text: "Sugnu stancu", english: "I am tired", context: "hotel" },
    { language: "Sicilian", text: "Va beni", english: "It's okay / Alright", context: "small_talk" },
    { language: "Sicilian", text: "Perfettu!", english: "Perfect!", context: "small_talk" },
    { language: "Sicilian", text: "Ottimu!", english: "Excellent!", context: "restaurant" },
    { language: "Sicilian", text: "Beddu assai!", english: "Beautiful!", context: "small_talk" },
    { language: "Sicilian", text: "Chi bedda jurnata!", english: "What a beautiful day!", context: "small_talk" },
    { language: "Sicilian", text: "A dumani", english: "See you tomorrow", context: "greeting" },
    { language: "Sicilian", text: "A prestu", english: "See you soon", context: "greeting" },
    { language: "Sicilian", text: "Ci videmu", english: "See you", context: "greeting" },
    { language: "Sicilian", text: "Bonu appetitu!", english: "Enjoy your meal!", context: "restaurant" },
    { language: "Sicilian", text: "Saluti!", english: "Cheers! / Bless you!", context: "cafe" },
    { language: "Sicilian", text: "In bucca â lupu!", english: "Good luck!", context: "small_talk" },
  ],
};
