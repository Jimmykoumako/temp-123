
// Mock hymns data for components that need it
export const hymns = [
  {
    id: 1,
    number: '1',
    title: 'Amazing Grace',
    artist: 'John Newton',
    author: 'John Newton',
    album: 'Classic Hymns',
    duration: '3:45',
    url: '/audio/amazing-grace.mp3',
    verses: [
      'Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see.',
      'T\'was grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed.',
      'Through many dangers, toils and snares,\nI have already come;\n\'Tis grace hath brought me safe thus far,\nAnd grace will lead me home.'
    ],
    chorus: 'Amazing grace! How sweet the sound\nThat saved a wretch like me!',
    key: 'G',
    tempo: 86
  },
  {
    id: 2,
    number: '2',
    title: 'How Great Thou Art',
    artist: 'Carl Boberg',
    author: 'Carl Boberg',
    album: 'Classic Hymns',
    duration: '4:15',
    url: '/audio/how-great-thou-art.mp3',
    verses: [
      'O Lord my God, when I in awesome wonder\nConsider all the worlds Thy hands have made;\nI see the stars, I hear the rolling thunder,\nThy power throughout the universe displayed.',
      'When through the woods, and forest glades I wander,\nAnd hear the birds sing sweetly in the trees.\nWhen I look down, from lofty mountain grandeur\nAnd see the brook, and feel the gentle breeze.',
      'And when I think, that God, His Son not sparing;\nSent Him to die, I scarce can take it in;\nThat on the Cross, my burden gladly bearing,\nHe bled and died to take away my sin.'
    ],
    chorus: 'Then sings my soul, My Saviour God, to Thee,\nHow great Thou art, How great Thou art.\nThen sings my soul, My Saviour God, to Thee,\nHow great Thou art, How great Thou art!',
    key: 'Ab',
    tempo: 76
  },
  {
    id: 3,
    number: '3',
    title: 'Holy, Holy, Holy',
    artist: 'Reginald Heber',
    author: 'Reginald Heber',
    album: 'Classic Hymns',
    duration: '3:30',
    url: '/audio/holy-holy-holy.mp3',
    verses: [
      'Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, holy, holy, merciful and mighty!\nGod in three Persons, blessèd Trinity!',
      'Holy, holy, holy! All the saints adore Thee,\nCasting down their golden crowns around the glassy sea;\nCherubim and seraphim falling down before Thee,\nWho wert, and art, and evermore shalt be.',
      'Holy, holy, holy! though the darkness hide Thee,\nThough the eye of sinful man Thy glory may not see;\nOnly Thou art holy; there is none beside Thee,\nPerfect in power, in love, and purity.'
    ],
    key: 'Eb',
    tempo: 96
  }
];

export default hymns;
