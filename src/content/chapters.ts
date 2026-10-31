// Where each story sits in its book: book id, first and last chapter (traditional chapter numbering).
export const STORY_CHAPTERS: Record<string, { book: string; from: number; to: number }> = {
  'bereshit-creation': { book: 'bereshit', from: 1, to: 2 },
  noah: { book: 'bereshit', from: 6, to: 9 },
  bavel: { book: 'bereshit', from: 11, to: 11 },
  'lech-lecha': { book: 'bereshit', from: 12, to: 12 },
  akedah: { book: 'bereshit', from: 22, to: 22 },
  yosef: { book: 'bereshit', from: 37, to: 37 },
  'yaakov-sulam': { book: 'bereshit', from: 28, to: 28 },
  'yaakov-peniel': { book: 'bereshit', from: 32, to: 32 },
  seneh: { book: 'shemot', from: 3, to: 3 },
  'moshe-tevah': { book: 'shemot', from: 2, to: 2 },
  makot: { book: 'shemot', from: 7, to: 12 },
  pesach: { book: 'shemot', from: 12, to: 12 },
  yetziat: { book: 'shemot', from: 14, to: 14 },
  'har-sinai': { book: 'shemot', from: 19, to: 19 },
  egel: { book: 'shemot', from: 32, to: 32 },
  eliyahu: { book: 'melachim', from: 19, to: 19 },
};

// Chapter counts for the 24 books as the Hebrew Bible groups them. Samuel and Kings are one book each,
// so their counts add both parts (1-2 Samuel: 31+24; 1-2 Kings: 22+25). The Twelve: 67 chapters in total.
export const CHAPTER_COUNT: Record<string, number> = {
  bereshit: 50, shemot: 40, vayikra: 27, bamidbar: 36, devarim: 34,
  yehoshua: 24, shoftim: 21, shmuel: 55, melachim: 47,
  yeshayahu: 66, yirmiyahu: 52, yechezkel: 48, 'trei-asar': 67,
  tehilim: 150, mishlei: 31, iyov: 42, 'shir-hashirim': 8, rut: 4, eicha: 5,
  kohelet: 12, ester: 10, daniel: 12, 'ezra-nechemia': 23, 'divrei-hayamim': 65,
};
