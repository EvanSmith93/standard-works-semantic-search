export const EXAMPLE_SEARCHES = [
  "Lehi partakes of the fruit of the tree of life",
  "How can I be more pure in heart?",
  "God creates the animals",
  "What are the signs of the Savior's coming?",
  "Captain Moroni makes the title of liberty",
  "Do not be afraid",
  "What tribe was Jesus from?",
  "Jesus heals the blind man",
  "What are the three degrees of glory?",
  "Joseph Smith sees two personages",
  "How old did Moses live to be?",
  "Faith without works is dead",
  "How does repentance work?",
  "Justification versus sanctification",
  "Christ's Atonement",
  "Faith is like a little seed",
  "What is charity?",
  "Moses parts the Red Sea",
  "When did Matthew become a disciple?",
  "Paul is commanded to go to Damascus",
  "Why does God call prophets?",
  "Sacrament prayers",
  "How can I find peace?",
  "What does it mean to be a disciple of Christ?",
  "Nephi agrees to do whatever the Lord asks of him",
  "Don't hide your light",
  "Which apostle walked on water?",
];

export const VOLUMES = [
  { volume_lds_url: "ot", volume_title: "Old Testament" },
  { volume_lds_url: "nt", volume_title: "New Testament" },
  { volume_lds_url: "bofm", volume_title: "Book of Mormon" },
  {
    volume_lds_url: "dc-testament",
    volume_title: "Doctrine and Covenants",
  },
  { volume_lds_url: "pgp", volume_title: "Pearl of Great Price" },
];

export function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}
