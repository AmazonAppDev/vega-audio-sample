/*
 * Copyright (c) 2023 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

/**
 * Music catalog with categorized album collections
 */
import { chain } from 'lodash';
import { AlbumCategory, AudioCategory } from '../types/AudioDataTypes';
import { ALBUM_1, ALBUM_2, ALBUM_3, ALBUM_4 } from './albums';

// Music category IDs
enum Category {
  MOST_WATCHED = 1,
  TOP_RATED = 2,
  ROCK_MUSIC = 3,
  FOLK_TREND = 4,
  HIP_HOP = 5,
  VIRAL_50 = 6,
}

// Complete album catalog with descriptions and artwork
export const Categories: AlbumCategory[] = [
  {
    categoryId: Category.MOST_WATCHED,
    albumId: 1,
    title: 'Echoes of albion',
    description:
      '"Echoes of Albion22" is a modern classic, blending the nostalgia of British rock with a fresh, contemporary indie twist. The album captures the essence of urban life in the UK, with jangly guitars, anthemic choruses, and introspective lyrics. Each track is a meticulously crafted narrative, exploring themes of love, rebellion, and self-discovery, all delivered with powerful, emotive vocals and lush, atmospheric soundscapes. This album stands out for its storytelling, delving into the complexities of modern life with a depth that resonates deeply. Balancing polished production with raw emotional intensity, "Echoes of Albion" is a must-listen for anyone who appreciates the craft of songwriting and the power of music to tell compelling stories. It honors the legacy of British rock while promising a bright future for the genre.',
    data: { ...ALBUM_1 },
    thumbnail: require('./../assets/images/covers/echoes-of-albion.webp'),
  },
  {
    categoryId: Category.TOP_RATED,
    albumId: 2,
    title: 'Echoes of the Street',
    description:
      '"Echoes of the Street" delves deep into the heart of urban life, weaving personal stories into a tapestry of raw, unfiltered sound. The album combines hard-hitting beats with evocative lyrics, creating a soundscape that mirrors the gritty reality of the streets. Each track tells a vivid narrative, from the struggles of daily survival to moments of fleeting triumph, all underpinned by themes of resilience and self-identity. The vocals on this album are particularly compelling, as they draw from personal experiences, adding a layer of authenticity and emotional depth. One standout track, "Midnight Reflections," recounts the artist\'s late-night walk through his childhood neighborhood, reflecting on past hardships and the path to self-discovery. The raw emotion in his voice conveys a journey marked by anger, frustration, and ultimately, hope and determination. "Echoes of the Street" is a must-listen for anyone who appreciates music that offers a powerful, personal insight into the urban experience.',
    data: { ...ALBUM_2 },
    thumbnail: require('./../assets/images/covers/echoes-of-the-street.webp'),
  },
  {
    categoryId: Category.TOP_RATED,
    albumId: 3,
    title: 'Eternal Harmonies',
    description:
      'Immerse yourself in "Eternal Harmonies," an album that epitomizes the grandeur of classical music. The rich textures and intricate compositions, performed by a masterful orchestra in a magnificent concert hall, resonate with timeless beauty. Subtly woven into the fabric of this top-rated collection is the brilliance of each musician, under the direction of an eminent conductor, creating a vivid auditory masterpiece. Allow yourself to be transported to a realm where every note and harmony paints an unforgettable sonic landscape.',
    data: { ...ALBUM_3 },
    thumbnail: require('./../assets/images/covers/eternal-harmonies.webp'),
  },
  {
    categoryId: Category.TOP_RATED,
    albumId: 4,
    title: 'Lunar Echoes',
    description:
      '"Lunar Echoes" is a dazzling showcase of K-pop brilliance that has quickly become a favorite among fans and critics alike. This top-rated album features an ensemble of talented idols whose electrifying performances and vibrant personalities shine through every track. The songs are a perfect blend of catchy hooks, dynamic beats, and stunning vocal harmonies, creating an irresistible auditory experience. The album\'s visual presentation is equally impressive, with bold, colorful aesthetics that perfectly capture the energy and style of contemporary K-pop. "Lunar Echoes" is a must-have for anyone looking to experience the cutting-edge of K-pop music and artistry.',
    data: { ...ALBUM_4 },
    thumbnail: require('./../assets/images/covers/lunar-echoes.webp'),
  },
  {
    categoryId: Category.ROCK_MUSIC,
    albumId: 5,
    title: 'Midnight Melodies',
    description:
      '"Midnight Melodies" by Ella Harmony is a mesmerizing journey through the soulful depths of R&B, set against the backdrop of an intimate jazz club. This album effortlessly blends the rich textures of jazz with the emotive power of rock, creating a unique and captivating sound. Ella\'s haunting vocals and the lush, atmospheric arrangements transport listeners to a world of late-night serenades and heartfelt ballads. Each track on this top-rated album is a testament to her artistry, delivering powerful performances that linger long after the music fades. "Midnight Melodies" is a must-listen for anyone who appreciates the fusion of rock and R&B with a touch of jazz elegance.',
    data: { ...ALBUM_2 },
    thumbnail: require('./../assets/images/covers/midnight-melodies.webp'),
    artist: 'Ella Harmony',
  },
  {
    categoryId: Category.ROCK_MUSIC,
    albumId: 6,
    title: 'Neon Dreams',
    description:
      '"Neon Dreams" by Eclipse is a standout in the rock music scene, seamlessly blending K-pop flair with rock intensity. The album\'s sleek and minimalist design, featuring monochrome aesthetics, highlights the band\'s sophisticated style. Each track on this top-rated album is a testament to Eclipse\'s versatility, delivering powerful rock elements intertwined with the polished sound characteristic of K-pop. "Neon Dreams" offers a rich auditory experience, capturing the attention of fans and critics alike, and stands as a prime example of innovative fusion in the rock music category.',
    data: { ...ALBUM_4 },
    thumbnail: require('./../assets/images/covers/neon-dreams.webp'),
    artist: 'Eclipse',
  },
  {
    categoryId: Category.ROCK_MUSIC,
    albumId: 7,
    title: 'Polka Fest Delight',
    description:
      '"Polka Fest Delight" by The Polka Kings is a lively celebration of traditional polka music, set to captivate rock music enthusiasts with its vibrant and festive energy. This redesigned album cover enhances the joyful atmosphere with a colorful village scene, perfectly capturing the essence of a polka festival. The Polka Kings deliver energetic performances that bring the spirited rhythms of polka to life, creating an irresistible urge to dance and revel in the music. "Polka Fest Delight" stands out in the rock music category, offering a refreshing and jubilant twist that appeals to both polka aficionados and rock fans looking for something unique and uplifting.',
    data: { ...ALBUM_3 },
    thumbnail: require('./../assets/images/covers/pola-fest-delight.webp'),
    artist: 'The Polka Kings',
  },
  {
    categoryId: Category.ROCK_MUSIC,
    albumId: 8,
    title: 'Spray of Sunshine',
    description:
      '"Spray of Sunshine" by Joyful Riot is a lively and colorful addition to the rock music category, bringing the energetic vibes of happy punk to life. The album cover features a vibrant urban scene, bursting with playful and eye-catching graffiti that perfectly encapsulates the album\'s upbeat and rebellious spirit. Each track on this top-rated album is filled with infectious melodies, driving rhythms, and an unyielding sense of fun. "Spray of Sunshine" stands out with its dynamic and cheerful sound, making it a must-listen for anyone looking to infuse their playlist with a dose of punk-infused positivity.',
    data: { ...ALBUM_1 },
    thumbnail: require('./../assets/images/covers/spray-of-sunshine.webp'),
    artist: 'Joyful Riot',
  },
  {
    categoryId: Category.ROCK_MUSIC,
    albumId: 9,
    title: 'Starlight Breakout',
    description:
      '"Starlight Breakout" by Luna Ray is a vibrant explosion of sound and color that brings the essence of 2000s female pop into the rock music category. This redesigned album cover maximizes the bold and glamorous design, filling the entire image with energetic and eye-catching elements. Luna Ray\'s powerful vocals and dynamic tracks shine through, creating an album that\'s both nostalgic and refreshingly modern. "Starlight Breakout" stands out with its unique blend of pop and rock, delivering an unforgettable auditory experience that captures the spirit of an era while pushing the boundaries of contemporary music.',
    data: { ...ALBUM_3 },
    thumbnail: require('./../assets/images/covers/starlight-breakout.webp'),
    artist: 'Luna Ray',
  },
  {
    categoryId: Category.ROCK_MUSIC,
    albumId: 10,
    title: 'Street Symphony',
    description:
      '"Street Symphony" by RM is a groundbreaking fusion that brings hip hop energy into the rock music category. The album cover art features a dynamic urban scene set in a graffiti-laden alley, perfectly capturing the raw and gritty essence of the music. Each track on this top-rated album is a testament to the group\'s innovative approach, blending hard-hitting beats with rock elements to create a unique and powerful sound. "Street Symphony" stands out as a bold and electrifying addition to the rock genre, offering a fresh take that appeals to fans of both hip hop and rock music.',
    data: { ...ALBUM_4 },
    thumbnail: require('./../assets/images/covers/street-symphony.webp'),
    artist: 'RM',
  },
  {
    categoryId: Category.ROCK_MUSIC,
    albumId: 11,
    title: 'Summer of Sounds',
    description:
      '"Summer of Sounds" by Groovy Echoes is a nostalgic trip back to the vibrant rock era of the 1960s. The album cover features a whimsical, psychedelic design that perfectly encapsulates the free-spirited and experimental vibe of the time. Each track on this top-rated album brings the essence of 60s rock to life, with groovy rhythms, infectious melodies, and a touch of nostalgia. "Summer of Sounds" stands out in the rock music category, offering listeners a rich auditory experience that captures the heart and soul of an unforgettable musical era. Whether you\'re a long-time fan or new to the genre, this album is a must-have for anyone looking to experience the magic of 1960s rock.',
    data: { ...ALBUM_1 },
    thumbnail: require('./../assets/images/covers/summer-of-sounds.webp'),
    artist: 'Groovy Echoes',
  },
  {
    categoryId: Category.ROCK_MUSIC,
    albumId: 12,
    title: 'Sunset Echoes',
    description:
      '"Sunset Echoes" is a vibrant addition to the rock music category, capturing the essence of 2000s indie rock. The redesigned album cover fills the entire image with a stunning sunset backdrop and a dynamic band performance, reflecting the album\'s energetic and evocative sound. Each track offers a rich auditory experience, blending melodic hooks with introspective lyrics that resonate deeply with listeners. "Sunset Echoes" stands out as a top-rated album, delivering a perfect blend of nostalgia and modern indie rock vibes, making it a must-listen for fans of the genre.',
    data: { ...ALBUM_3 },
    thumbnail: require('./../assets/images/covers/sunset-echoes.webp'),
    artist: 'Sunset Echoes',
  },
  {
    categoryId: Category.ROCK_MUSIC,
    albumId: 13,
    title: 'Echoes of albion',
    description:
      '"Echoes of Albion22" is a modern classic, blending the nostalgia of British rock with a fresh, contemporary indie twist. The album captures the essence of urban life in the UK, with jangly guitars, anthemic choruses, and introspective lyrics. Each track is a meticulously crafted narrative, exploring themes of love, rebellion, and self-discovery, all delivered with powerful, emotive vocals and lush, atmospheric soundscapes. This album stands out for its storytelling, delving into the complexities of modern life with a depth that resonates deeply. Balancing polished production with raw emotional intensity, "Echoes of Albion" is a must-listen for anyone who appreciates the craft of songwriting and the power of music to tell compelling stories. It honors the legacy of British rock while promising a bright future for the genre.',
    data: { ...ALBUM_1 },
    thumbnail: require('./../assets/images/covers/echoes-of-albion.webp'),
    artist: 'Albion',
  },
  {
    categoryId: Category.ROCK_MUSIC,
    albumId: 14,
    title: 'Spray of Sunshine',
    description:
      '"Spray of Sunshine" by Joyful Riot is a lively and colorful addition to the rock music category, bringing the energetic vibes of happy punk to life. The album cover features a vibrant urban scene, bursting with playful and eye-catching graffiti that perfectly encapsulates the album\'s upbeat and rebellious spirit. Each track on this top-rated album is filled with infectious melodies, driving rhythms, and an unyielding sense of fun. "Spray of Sunshine" stands out with its dynamic and cheerful sound, making it a must-listen for anyone looking to infuse their playlist with a dose of punk-infused positivity.',
    data: { ...ALBUM_2 },
    thumbnail: require('./../assets/images/covers/spray-of-sunshine.webp'),
    artist: 'Joyful Riot',
  },
  {
    categoryId: Category.FOLK_TREND,
    albumId: 15,
    title: 'Sunset Echoes',
    description:
      '"Sunset Echoes" is a vibrant addition to the rock music category, capturing the essence of 2000s indie rock. The redesigned album cover fills the entire image with a stunning sunset backdrop and a dynamic band performance, reflecting the album\'s energetic and evocative sound. Each track offers a rich auditory experience, blending melodic hooks with introspective lyrics that resonate deeply with listeners. "Sunset Echoes" stands out as a top-rated album, delivering a perfect blend of nostalgia and modern indie rock vibes, making it a must-listen for fans of the genre.',
    data: { ...ALBUM_3 },
    thumbnail: require('./../assets/images/covers/sunset-echoes.webp'),
    artist: 'Sunset Echoes',
  },
  {
    categoryId: Category.FOLK_TREND,
    albumId: 17,
    title: 'Summer of Sounds',
    description:
      '"Summer of Sounds" by Groovy Echoes is a nostalgic trip back to the vibrant rock era of the 1960s. The album cover features a whimsical, psychedelic design that perfectly encapsulates the free-spirited and experimental vibe of the time. Each track on this top-rated album brings the essence of 60s rock to life, with groovy rhythms, infectious melodies, and a touch of nostalgia. "Summer of Sounds" stands out in the rock music category, offering listeners a rich auditory experience that captures the heart and soul of an unforgettable musical era. Whether you\'re a long-time fan or new to the genre, this album is a must-have for anyone looking to experience the magic of 1960s rock.',
    data: { ...ALBUM_1 },
    thumbnail: require('./../assets/images/covers/summer-of-sounds.webp'),
    artist: 'Groovy Echoes',
  },
  {
    categoryId: Category.FOLK_TREND,
    albumId: 18,
    title: 'Midnight Melodies',
    description:
      '"Midnight Melodies" by Ella Harmony is a mesmerizing journey through the soulful depths of R&B, set against the backdrop of an intimate jazz club. This album effortlessly blends the rich textures of jazz with the emotive power of rock, creating a unique and captivating sound. Ella\'s haunting vocals and the lush, atmospheric arrangements transport listeners to a world of late-night serenades and heartfelt ballads. Each track on this top-rated album is a testament to her artistry, delivering powerful performances that linger long after the music fades. "Midnight Melodies" is a must-listen for anyone who appreciates the fusion of rock and R&B with a touch of jazz elegance.',
    data: { ...ALBUM_2 },
    thumbnail: require('./../assets/images/covers/midnight-melodies.webp'),
    artist: 'Ella Harmony',
  },
  {
    categoryId: Category.HIP_HOP,
    albumId: 19,
    title: 'Echoes of the Street',
    description: `"Echoes of the Street" delves deep into the heart of urban life, weaving personal stories into a tapestry of raw, unfiltered sound. The album combines hard-hitting beats with evocative lyrics, creating a soundscape that mirrors the gritty reality of the streets. Each track tells a vivid narrative, from the struggles of daily survival to moments of fleeting triumph, all underpinned by themes of resilience and self-identity. The vocals on this album are particularly compelling, as they draw from personal experiences, adding a layer of authenticity and emotional depth. One standout track, "Midnight Reflections," recounts the artist's late-night walk through his childhood neighborhood, reflecting on past hardships and the path to self-discovery. The raw emotion in his voice conveys a journey marked by anger, frustration, and ultimately, hope and determination. "Echoes of the Street" is a must-listen for anyone who appreciates music that offers a powerful, personal insight into the urban experience.',
    `,
    data: { ...ALBUM_4 },
    thumbnail: require('./../assets/images/covers/echoes-of-the-street.webp'),
    artist: 'Graffiti B',
  },
  {
    categoryId: Category.HIP_HOP,
    albumId: 20,
    title: 'Lunar Echoes',
    description: ` description:
      '"Lunar Echoes" is a dazzling showcase of K-pop brilliance that has quickly become a favorite among fans and critics alike. This top-rated album features an ensemble of talented idols whose electrifying performances and vibrant personalities shine through every track. The songs are a perfect blend of catchy hooks, dynamic beats, and stunning vocal harmonies, creating an irresistible auditory experience. The album's visual presentation is equally impressive, with bold, colorful aesthetics that perfectly capture the energy and style of contemporary K-pop. "Lunar Echoes" is a must-have for anyone looking to experience the cutting-edge of K-pop music and artistry.',
    `,
    data: { ...ALBUM_1 },
    thumbnail: require('./../assets/images/covers/lunar-echoes.webp'),
  },
  {
    categoryId: Category.VIRAL_50,
    albumId: 21,
    title: 'Eternal Harmonies',
    description:
      'Immerse yourself in "Eternal Harmonies," an album that epitomizes the grandeur of classical music. The rich textures and intricate compositions, performed by a masterful orchestra in a magnificent concert hall, resonate with timeless beauty. Subtly woven into the fabric of this top-rated collection is the brilliance of each musician, under the direction of an eminent conductor, creating a vivid auditory masterpiece. Allow yourself to be transported to a realm where every note and harmony paints an unforgettable sonic landscape.',
    data: { ...ALBUM_3 },
    thumbnail: require('./../assets/images/covers/eternal-harmonies.webp'),
  },
  {
    categoryId: Category.VIRAL_50,
    albumId: 22,
    title: 'Echoes of albion',
    description:
      '"Echoes of Albion22" is a modern classic, blending the nostalgia of British rock with a fresh, contemporary indie twist. The album captures the essence of urban life in the UK, with jangly guitars, anthemic choruses, and introspective lyrics. Each track is a meticulously crafted narrative, exploring themes of love, rebellion, and self-discovery, all delivered with powerful, emotive vocals and lush, atmospheric soundscapes. This album stands out for its storytelling, delving into the complexities of modern life with a depth that resonates deeply. Balancing polished production with raw emotional intensity, "Echoes of Albion" is a must-listen for anyone who appreciates the craft of songwriting and the power of music to tell compelling stories. It honors the legacy of British rock while promising a bright future for the genre.',
    data: { ...ALBUM_1 },
    thumbnail: require('./../assets/images/covers/echoes-of-albion.webp'),
  },
  {
    categoryId: Category.VIRAL_50,
    albumId: 23,
    title: 'Echoes of the Street',
    description: `"Echoes of the Street" delves deep into the heart of urban life, weaving personal stories into a tapestry of raw, unfiltered sound. The album combines hard-hitting beats with evocative lyrics, creating a soundscape that mirrors the gritty reality of the streets. Each track tells a vivid narrative, from the struggles of daily survival to moments of fleeting triumph, all underpinned by themes of resilience and self-identity. The vocals on this album are particularly compelling, as they draw from personal experiences, adding a layer of authenticity and emotional depth. One standout track, "Midnight Reflections," recounts the artist's late-night walk through his childhood neighborhood, reflecting on past hardships and the path to self-discovery. The raw emotion in his voice conveys a journey marked by anger, frustration, and ultimately, hope and determination. "Echoes of the Street" is a must-listen for anyone who appreciates music that offers a powerful, personal insight into the urban experience.',
    `,
    data: { ...ALBUM_4 },
    thumbnail: require('./../assets/images/covers/echoes-of-the-street.webp'),
  },
];

// Get album by ID
export const getAlbumDetail = (albumId: number) => {
  return Categories.filter(item => item.albumId === albumId)[0];
};

// Get albums by category
export const getCategoryAlbums = (categoryId: number): AlbumCategory[] => {
  return Categories.filter(item => item.categoryId === categoryId);
};

// Find track in album
export const getSingleTrack = (albumData: any[], trackId: string) => {
  return albumData.filter(item => item.data === trackId);
};

// Home screen category structure
export const audioCategories: AudioCategory[] = [
  {
    categoryId: Category.MOST_WATCHED,
    title: 'Most Watched',
    data: getCategoryAlbums(Category.MOST_WATCHED),
  },
  {
    categoryId: Category.TOP_RATED,
    title: 'Top Rated ',
    data: getCategoryAlbums(Category.TOP_RATED),
  },
  {
    categoryId: Category.ROCK_MUSIC,
    title: 'Rock Music',
    data: getCategoryAlbums(Category.ROCK_MUSIC),
  },
  {
    categoryId: Category.FOLK_TREND,
    title: 'Folk Trend',
    data: getCategoryAlbums(Category.FOLK_TREND),
  },
  {
    categoryId: Category.HIP_HOP,
    title: 'Hip Hop',
    data: getCategoryAlbums(Category.HIP_HOP),
  },
  {
    categoryId: Category.VIRAL_50,
    title: 'Viral 50',
    data: getCategoryAlbums(Category.VIRAL_50),
  },
];

// Flattened track collection from all albums
const flatMusic = chain(Categories)
  .flatMap(c => c.data.results) // Extract all tracks from all albums
  .unionBy(m => m.id); // Remove duplicates by track ID

// All unique tracks for search operations
export const AllAudio = flatMusic.value();

// Track lookup by ID
export const AudioDB = flatMusic.keyBy(m => m.id).value();
